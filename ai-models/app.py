import torch

from transformers import AutoTokenizer, AutoModelForTokenClassification
from transformers import pipeline

from dotenv import load_dotenv
load_dotenv()
import os
os.environ['HUGGINGFACE_TOKEN']=os.getenv('HF_TOKEN')

# Load the MedBERT model and tokenizer
model_name = "blaze999/Medical-NER" 
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)

# Create a NER pipeline 
nlp = pipeline("ner", model=model, tokenizer=tokenizer, grouped_entities=False)

#Define function for parsing user input for medical entities
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
                entities.append(" ".join(current_entity))#, current_label))
            current_entity = [word]
            current_label = label.split("-")[-1]
        elif label.startswith("I-") and current_label == label.split("-")[-1]:  # Continuation of the current entity
            current_entity.append(word)
        else:  # Handle other labels or cases
            if current_entity:
                entities.append(" ".join(current_entity))#, current_label))
            current_entity = [word]
            current_label = label.split("-")[-1]

    # Add the last entity
    if current_entity:
        entities.append(" ".join(current_entity))#, current_label))

    return entities

user_input = input("Enter your condition:")
parsed_entities = parse_medical_entities(user_input)
print("Parsed Medical Entities:", parsed_entities)
