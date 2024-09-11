# !pip install transformers torch pymongo fuzzywuzzy[speedup]
import os
from dotenv import load_dotenv
import torch
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
from pymongo import MongoClient
from fuzzywuzzy import fuzz, process

# Load environment variables from the .env file
load_dotenv()

# Get the MongoDB connection string from the environment variables
mongo_uri = os.getenv('mongo_uri')


# Load the MedBERT model and tokenizer
model_name = "blaze999/Medical-NER"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)

# Create a NER pipeline
nlp = pipeline("ner", model=model, tokenizer=tokenizer, grouped_entities=False)

# Define function for parsing user input for medical entities
def parse_medical_entities(user_input):
    ner_results = nlp(user_input)
    entities = []
    current_entity = []
    current_label = None

    for entity in ner_results:
        word = entity['word'].replace("▁", "")  # Remove the subword indicator
        label = entity['entity']

        # Handle 'B-' (Beginning) and 'I-' (Inside) tags
        if label.startswith("B-"):  # Start of a new entity
            if current_entity:
                entities.append(" ".join(current_entity))  # Append the current entity
            current_entity = [word]
            current_label = label.split("-")[-1]
        elif label.startswith("I-") and current_label == label.split("-")[-1]:  # Continuation of the current entity
            current_entity.append(word)
        else:  # Handle other labels or cases
            if current_entity:
                entities.append(" ".join(current_entity))  # Append the current entity
            current_entity = [word]
            current_label = label.split("-")[-1]

    # Add the last entity
    if current_entity:
        entities.append(" ".join(current_entity))

    return entities

# Connect to MongoDB
client = MongoClient(mongo_uri)  # Update with your MongoDB connection string if needed
db = client["MedMinion"]  # Replace with your database name
collection = db["disease_symptoms_modified"]  # Replace with your collection name

# Function to fetch data from MongoDB
def fetch_disease_data():
    data = collection.find({}, {"_id": 0})  # Fetch all documents, exclude the '_id' field
    diseases_data = []
    for document in data:
        diseases_data.append(document)
    return diseases_data

# Function to match user input with dataset symptoms
def match_symptoms(parsed_symptoms, diseases_data, top_n=3):
    all_symptoms = []
    for disease_entry in diseases_data:
        symptoms = [v for k, v in disease_entry.items() if k.startswith("Symptom") and v]
        all_symptoms.extend(symptoms)

    # For each parsed symptom, find the closest matching symptom in the dataset using fuzzy matching
    matched_symptoms = []
    for symptom in parsed_symptoms:
        match = process.extractOne(symptom, all_symptoms, scorer=fuzz.token_sort_ratio)
        if match:
            matched_symptoms.append(match[0])  # Append the best match symptom

    # Now, calculate the matching score for each disease based on matched symptoms
    disease_scores = {}
    for disease_entry in diseases_data:
        disease = disease_entry['Disease']
        disease_symptoms = [v for k, v in disease_entry.items() if k.startswith("Symptom") and v]

        # Calculate the similarity score between matched symptoms and the disease symptoms
        similarity_score = 0
        for matched_symptom in matched_symptoms:
            if matched_symptom in disease_symptoms:  # If the matched symptom is in the disease's symptoms, add to the score
                similarity_score += 1  # You can add weights here if necessary

        # Store the score for the disease
        disease_scores[disease] = similarity_score

    # Sort diseases by their scores and return the top N diseases
    sorted_diseases = sorted(disease_scores.items(), key=lambda x: x[1], reverse=True)
    top_diseases = sorted_diseases[:top_n]

    return top_diseases

# User input for symptoms
user_input = input("Enter your condition: ")
parsed_entities = parse_medical_entities(user_input)
print("Parsed Medical Entities:", parsed_entities)

# Fetch the disease data from MongoDB
disease_data = fetch_disease_data()

# Match parsed symptoms with the dataset and get top 3 probable diseases
top_diseases = match_symptoms(parsed_entities, disease_data)
print("Top 3 Probable Diseases:", top_diseases)
