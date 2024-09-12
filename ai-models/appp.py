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
client = MongoClient(mongo_uri) 
db = client["MedMinion"] 

# Function to fetch data from MongoDB
def fetch_disease_data():
    disease_collection = db["disease_symptoms_modified"]
    data = disease_collection.find({}, {"_id": 0}) 
    diseases_data = []
    for document in data:
        diseases_data.append(document)
    return diseases_data

# Function to fetch data from the medicine-disease table in MongoDB
def fetch_medicine_data():
    medicine_collection = db["Disease-Medecine"]  
    data = medicine_collection.find({}, {"_id": 0}) 
    medicine_data = []
    for document in data:
        # print(document)
        medicine_data.append(document)
    return medicine_data

# Function to check if parsed entities match any disease in the medicine-disease table
def check_medicine_disease(parsed_entities, medicine_data):
    medicines_list = []  # Initialize an empty list to collect medicines
    print(f"Disease: {parsed_entities}")
    for entity in parsed_entities:
        for entry in medicine_data:
            # Check if the entity matches the Disease_ID
            if entity.lower() == entry["Disease_ID"].lower():
                print(f"Disease: {entity}")
                # medicines_list.append(entry["Medicine_Name"])  # Append all medicines for the matched disease
                if "Medicine_Name" in entry:
                    medicines_list.append(entry["Medicine_Name"])  # Append all medicines for the matched disease
                else:
                    print(f"Warning: Medicine_Name not found in document for {entity}")
    
    
    # Return the list of medicines or None if the list is empty
    return medicines_list if medicines_list else None

# Function to match user input with dataset symptoms
def match_symptoms(parsed_symptoms, diseases_data):
    all_symptoms = []
    for disease_entry in diseases_data:
        symptoms = [v for k, v in disease_entry.items() if k.startswith("Symptom") and v]
        all_symptoms.extend(symptoms)

    # For each parsed symptom, find the closest matching symptom in the dataset using fuzzy matching
    matched_symptoms = []
    for symptom in parsed_symptoms:
        match = process.extractOne(symptom, all_symptoms, scorer=fuzz.token_sort_ratio)
        if match:
            matched_symptoms.append(match[0]) 

    disease_scores = {}
    for disease_entry in diseases_data:
        disease = disease_entry['Disease']
        disease_symptoms = [v for k, v in disease_entry.items() if k.startswith("Symptom") and v]

        # Calculate the similarity score between matched symptoms and the disease symptoms
        similarity_score = 0
        for matched_symptom in matched_symptoms:
            if matched_symptom in disease_symptoms:  
                similarity_score += 1 

        # Store the score for the disease
        disease_scores[disease] = similarity_score

    sorted_diseases = sorted(disease_scores.items(), key=lambda x: x[1], reverse=True)
    #top_diseases = sorted_diseases[:top_n]
    top_disease = sorted_diseases[0] if sorted_diseases else None
    return top_disease

# Main execution flow
user_input = input("Enter your condition: ")
parsed_entities = parse_medical_entities(user_input)
print("Parsed Medical Entities:", parsed_entities)

# Fetch medicine and disease data from MongoDB
medicine_data = fetch_medicine_data()
disease_data = fetch_disease_data()

# Check condition 1: If the parsed entity exists in the medicine-disease table
medicines = check_medicine_disease(parsed_entities, medicine_data)

if medicines:
    # Print all medicines for the matched diseases
    print(f"Medicines for the diseases: {', '.join(medicines)}")
else:
    # Condition 2: If no direct disease match, find the most probable disease from symptoms and return medicines
    top_disease = match_symptoms(parsed_entities, disease_data)
    if top_disease:
        top_disease_name=[]
        top_disease_name.append(top_disease[0])
        matched_medicines = check_medicine_disease(top_disease_name, medicine_data)

        if matched_medicines:
            # Print all medicines for the top probable disease
            print(f"Top Probable Disease: {top_disease_name}")
            print(f"Medicines: {', '.join(matched_medicines)}")
        else:
            print(f"Top Probable Disease: {top_disease_name}")
            print("No matching medicines found.")
    else:
        print("No matching disease found.")
