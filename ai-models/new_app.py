import os
from dotenv import load_dotenv
import torch
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
from pymongo import MongoClient
from fuzzywuzzy import fuzz, process
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}) 

# Load environment variables from the .env file
load_dotenv()

# Get the MongoDB connection string from the environment variables
mongo_uri = os.getenv('mongo_uri')

client = MongoClient(mongo_uri)
db = client["MedMinion"]

disease_collection = db["disease_symptoms_modified"]
medicine_collection = db["Disease-Medecine"]  

# Load the MedBERT model and tokenizer
model_name = "blaze999/Medical-NER"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)

# Create a NER pipeline
nlp = pipeline("ner", model=model, tokenizer=tokenizer, grouped_entities=False)

# Parse user input for medical entities
def parse_medical_entities(user_input):
    ner_results = nlp(user_input)
    entities = []
    current_entity = []
    current_label = None

    for entity in ner_results:
        word = entity['word'].replace("▁", "") 
        label = entity['entity']

        if label.startswith("B-"):  
            if current_entity:
                entities.append(" ".join(current_entity)) 
            current_entity = [word]
            current_label = label.split("-")[-1]
        elif label.startswith("I-") and current_label == label.split("-")[-1]:  
            current_entity.append(word)
        else: 
            if current_entity:
                entities.append(" ".join(current_entity))  
            current_entity = [word]
            current_label = label.split("-")[-1]

    if current_entity:
        entities.append(" ".join(current_entity))

    return entities

# Fetch data from MongoDB
def fetch_disease_data():
    data = disease_collection.find({}, {"_id": 0}) 
    return list(data)

def fetch_medicine_data():
    data = medicine_collection.find({}, {"_id": 0}) 
    return list(data)

# Check if parsed entities match any disease in the medicine-disease table
def check_medicine_disease(parsed_entities, medicine_data):
    medicines_list = [] 
    for entity in parsed_entities:
        for entry in medicine_data:
            if entity.lower() == entry["Disease_ID"].lower():
                if "Medicine_Name" in entry:
                    medicines_list.append(entry["Medicine_Name"])  # Append all medicines for the matched disease

    return medicines_list if medicines_list else None

# Match user input with dataset symptoms and return top 3 diseases
def match_symptoms(parsed_symptoms, diseases_data):
    all_symptoms = []
    for disease_entry in diseases_data:
        symptoms = [v for k, v in disease_entry.items() if k.startswith("Symptom") and v]
        all_symptoms.extend(symptoms)

    matched_symptoms = []
    for symptom in parsed_symptoms:
        match = process.extractOne(symptom, all_symptoms, scorer=fuzz.token_sort_ratio)
        if match:
            matched_symptoms.append(match[0]) 

    disease_scores = {}
    for disease_entry in diseases_data:
        disease = disease_entry['Disease']
        disease_symptoms = [v for k, v in disease_entry.items() if k.startswith("Symptom") and v]

        similarity_score = 0
        for matched_symptom in matched_symptoms:
            if matched_symptom in disease_symptoms:  
                similarity_score += 1 

        disease_scores[disease] = similarity_score

    # Sort diseases by their similarity score in descending order
    sorted_diseases = sorted(disease_scores.items(), key=lambda x: x[1], reverse=True)

    # Return the top 3 diseases
    top_diseases = sorted_diseases[:3] if sorted_diseases else None
    return top_diseases

### Route 1: Detect top 3 diseases based on symptoms
@app.route('/get_disease', methods=['POST'])
def get_disease():
    user_input = request.json.get('input')

    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    # Parse symptoms from the user input
    parsed_symptoms = parse_medical_entities(user_input)

    # Fetch disease data
    disease_data = fetch_disease_data()

    # Match symptoms with top 3 diseases
    top_diseases = match_symptoms(parsed_symptoms, disease_data)
    print(top_diseases)
    if top_diseases:
        # Extract the top 3 disease names and their scores
        disease_names = [disease[0] for disease in top_diseases]
        return jsonify({"diseases": disease_names,"symptoms":parsed_symptoms})
    
    return jsonify({"error": "No matching diseases found."}), 404

### Route 2: Get medicines for a disease
@app.route('/get_medicine', methods=['POST'])
def get_medicine():
    user_input = request.json.get('input')
    
    if not user_input:
        return jsonify({"error": "No disease provided"}), 400

    # Parse disease from the user input
    parsed_entities = parse_medical_entities(user_input)

    # Fetch medicine data
    medicine_data = fetch_medicine_data()
    # print(medicine_data)

    # Check for medicines matching the disease
    medicines = check_medicine_disease(parsed_entities, medicine_data)

    if medicines:
        return jsonify({"medicines": medicines,"disease":parsed_entities})
    
    return jsonify({"error": "No medicines found for the given disease."}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5002)
