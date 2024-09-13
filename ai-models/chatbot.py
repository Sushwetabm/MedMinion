from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime, timedelta
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory
from langchain_community.llms import HuggingFaceHub

from langchain_huggingface import HuggingFaceEndpoint
import os
# Load environment variables from the .env file
load_dotenv()

# Get the MongoDB connection string from the environment variables
mongo_uri = os.getenv('mongo_uri')

# Define the template for the chatbot's responses
template = """You are a friendly chatbot engaging in a conversation with a human.

Previous conversation:
{chat_history}

New human question: {question}
Response:"""

prompt = PromptTemplate.from_template(template)

repo_id = "google/flan-t5-xxl" 
llm = HuggingFaceEndpoint(
    repo_id=repo_id,
    temperature=0.1,  
    max_length=64       
)

client = MongoClient(mongo_uri) 
db = client["MedMinion"] 

# Collections
doctor_availability_collection = db['Doctors Availability Collection']
delhi_ncr_doctors_collection = db['Delhi_ncr_doctors']
appointments_collection = db['Appointments_Collection']

def fetch_departments():
    # Fetch distinct departments (Speciality/Domain) from the collection
    departments = delhi_ncr_doctors_collection.distinct('Speciality/Domain')
    return departments

def fetch_locations(department):
    # Fetch distinct locations for the selected department
    locations = delhi_ncr_doctors_collection.distinct('Clinic Address', {"Speciality/Domain": department})
    return locations

def fetch_doctors(department, location):
    # Fetch doctors based on department and location
    doctors = delhi_ncr_doctors_collection.find({"Speciality/Domain": department, "Clinic Address": location}, {"Doctors Name": 1, "Contact": 1, "_id": 0})
    return list(doctors)

# Helper function to get the day of the week as a string (Monday, Tuesday, etc.)
def get_day_of_week(date):
    return date.strftime('%A')

# Helper function to fetch availability of a doctor for the next 7 days
def fetch_doctor_availability(doctor_name):
    today = datetime.today()
    availability = []

    # Fetch the doctor's availability record
    doctor_schedule = doctor_availability_collection.find_one({"doctor_name": {"$regex": doctor_name.strip(), "$options": "i"}})

    if not doctor_schedule:
        print("Doctor schedule not found")
        return []

    if "availability" not in doctor_schedule:
        print("No availability field found")
        return []

    doctor_availability = doctor_schedule["availability"]

    # Loop through the next 7 days
    for i in range(7):
        day = today + timedelta(days=i)
        day_name = get_day_of_week(day)
        date = day.strftime('%Y-%m-%d')

        available_times = []

        # If the day is in the availability dictionary, check for available time slots
        if day_name in doctor_availability:
            time_slots = doctor_availability[day_name]

            for time_slot, slots in time_slots.items():
                if isinstance(slots, list) and any(slot == 0 for slot in slots):  # Check if at least one slot is available (0)
                    available_times.append(time_slot)

        # Append availability if there are available time slots
        if available_times:
            availability.append({
                "date": date,
                "day_name": day_name,
                "available_times": available_times
            })

    print(f"Availability found: {availability}")
    return availability

def book_appointment(patient_id, doctor_name, appointment_date, appointment_time, clinic_location, doctor_contact):
    # Insert the appointment details into the appointment collection
    appointment = {
        "patient_id": patient_id,
        "doctor_name": doctor_name,
        "appointment_date": appointment_date,
        "appointment_time": appointment_time,
        "status": "Scheduled",
        "clinic_location": clinic_location,
        "doctor_contact": doctor_contact
    }
    appointments_collection.insert_one(appointment)

    # Update the doctor's availability by marking the chosen time slot as taken
    doctor_schedule = doctor_availability_collection.find_one({"doctor_name": {"$regex": doctor_name.strip(), "$options": "i"}})
    day_name = get_day_of_week(datetime.strptime(appointment_date, '%Y-%m-%d'))

    if doctor_schedule and "availability" in doctor_schedule and day_name in doctor_schedule["availability"]:
        # Get the specific time slot for the day
        time_slots = doctor_schedule["availability"][day_name]

        # Check if the selected time slot is available
        if appointment_time in time_slots and isinstance(time_slots[appointment_time], list):
            if 0 in time_slots[appointment_time]:  # Check if any slot is free (0 represents free)
                # Book a slot by changing one '0' to '1' (marking as booked)
                for i in range(len(time_slots[appointment_time])):
                    if time_slots[appointment_time][i] == 0:
                        time_slots[appointment_time][i] = 1
                        break

                # Update the database with the new availability status
                doctor_availability_collection.update_one(
                    {"doctor_name": {"$regex": doctor_name.strip(), "$options": "i"}},
                    {"$set": {f"availability.{day_name}.{appointment_time}": time_slots[appointment_time]}}
                )
                return "Your appointment is successfully booked!"
            else:
                return "The selected time slot is already full."
        else:
            return "The selected time slot is not available."
    else:
        return "Doctor schedule not found or the day is not available."


def book_appointment_flow():
    # 1. Display departments
    departments = fetch_departments()
    print("Select a department:")
    for idx, department in enumerate(departments):
        print(f"{idx + 1}. {department}")

    dept_choice = int(input("Enter your choice: ")) - 1
    selected_department = departments[dept_choice]

    # 2. Display locations based on selected department
    locations = fetch_locations(selected_department)
    print("Select a location:")
    for idx, location in enumerate(locations):
        print(f"{idx + 1}. {location}")

    loc_choice = int(input("Enter your choice: ")) - 1
    selected_location = locations[loc_choice]

    # 3. Display doctors based on selected location and department
    doctors = fetch_doctors(selected_department, selected_location)
    for idx, doctor in enumerate(doctors):
        print(f"{idx + 1}. {doctor['Doctors Name']}")  # Correct field name

    doc_choice = int(input("Enter your choice: ")) - 1
    selected_doctor = doctors[doc_choice]['Doctors Name']
    doctor_contact = doctors[doc_choice]["Contact"]

    # 4. Fetch availability of the selected doctor for the next 7 days
    availability = fetch_doctor_availability(selected_doctor)

    if not availability:
        print("No availability for this doctor in the next 7 days.")
        return

    # 5. Display available dates
    print("Select a date:")
    for idx, day in enumerate(availability):
        print(f"{idx + 1}. {day['day_name']}, {day['date']}")

    date_choice = int(input("Select a date: ")) - 1
    selected_date = availability[date_choice]['date']

    # 6. Display available time slots for the selected date
    print("Available time slots for", availability[date_choice]['day_name'], selected_date)
    available_times = availability[date_choice]['available_times']
    print(", ".join(available_times))

    # 7. Select time slot and book the appointment
    time_choice = input("Enter the time from available slots: ")

    # 8. Ask for patient ID and book the appointment
    patient_id = input("Enter your patient ID: ")
    confirmation = book_appointment(patient_id, selected_doctor, selected_date, time_choice, selected_location, doctor_contact)

    print(confirmation)

def reschedule_appointment_flow():
    patient_id = input("Enter your patient ID: ")

    # 1. Fetch all appointments for the patient
    appointments = list(appointments_collection.find({"patient_id": patient_id, "status": "Scheduled"}))
    
    if not appointments:
        print("No scheduled appointments found.")
        return

    # 2. Display the patient's appointments
    print("Your scheduled appointments:")
    for idx, appointment in enumerate(appointments):
        print(f"{idx + 1}. Doctor: {appointment['doctor_name']}, Date: {appointment['appointment_date']}, Time: {appointment['appointment_time']}, Location: {appointment['clinic_location']}")

    # 3. Select the appointment to reschedule
    appointment_choice = int(input("Select the appointment to reschedule: ")) - 1
    selected_appointment = appointments[appointment_choice]

    doctor_name = selected_appointment['doctor_name']
    old_appointment_date = selected_appointment['appointment_date']
    old_appointment_time = selected_appointment['appointment_time']

    # 4. Fetch availability of the doctor for the next 7 days
    availability = fetch_doctor_availability(doctor_name)

    if not availability:
        print("No availability for this doctor in the next 7 days.")
        return

    # 5. Display available dates
    print("Select a new date:")
    for idx, day in enumerate(availability):
        print(f"{idx + 1}. {day['day_name']}, {day['date']}")

    date_choice = int(input("Select a date: ")) - 1
    new_appointment_date = availability[date_choice]['date']

    # 6. Display available time slots for the selected date
    available_times = availability[date_choice]['available_times']
    print(f"Available time slots on {new_appointment_date}: {', '.join(available_times)}")

    new_appointment_time = input("Enter the time from available slots: ")

    # 7. Book the new appointment
    doctor_contact = selected_appointment['doctor_contact']
    clinic_location = selected_appointment['clinic_location']
    
    confirmation = book_appointment(patient_id, doctor_name, new_appointment_date, new_appointment_time, clinic_location, doctor_contact)

    if "successfully booked" in confirmation:
        # 8. Delete the old appointment from the collection
        appointments_collection.delete_one({"_id": selected_appointment['_id']})

        # 9. Make the old time slot available again in the doctor's schedule
        doctor_schedule = doctor_availability_collection.find_one({"doctor_name": {"$regex": doctor_name.strip(), "$options": "i"}})
        old_day_name = get_day_of_week(datetime.strptime(old_appointment_date, '%Y-%m-%d'))

        if doctor_schedule and "availability" in doctor_schedule and old_day_name in doctor_schedule["availability"]:
            time_slots = doctor_schedule["availability"][old_day_name]

            if old_appointment_time in time_slots and isinstance(time_slots[old_appointment_time], list):
                for i in range(len(time_slots[old_appointment_time])):
                    if time_slots[old_appointment_time][i] == 1:  # Find the booked slot
                        time_slots[old_appointment_time][i] = 0  # Mark as available
                        break

                # Update the doctor's availability in the collection
                doctor_availability_collection.update_one(
                    {"doctor_name": {"$regex": doctor_name.strip(), "$options": "i"}},
                    {"$set": {f"availability.{old_day_name}.{old_appointment_time}": time_slots[old_appointment_time]}}
                )
        print("Your appointment has been successfully rescheduled, and the old appointment has been deleted.")
    else:
        print(confirmation)

# Cancel an appointment flow (placeholder)
def cancel_appointment_flow():
    patient_id = input("Enter your patient ID: ")

    # 1. Fetch all scheduled appointments for the patient
    appointments = list(appointments_collection.find({"patient_id": patient_id, "status": "Scheduled"}))
    
    if not appointments:
        print("No scheduled appointments found.")
        return

    # 2. Display the patient's scheduled appointments
    print("Your scheduled appointments:")
    for idx, appointment in enumerate(appointments):
        print(f"{idx + 1}. Doctor: {appointment['doctor_name']}, Date: {appointment['appointment_date']}, Time: {appointment['appointment_time']}, Location: {appointment['clinic_location']}")

    # 3. Select the appointment to cancel
    appointment_choice = int(input("Select the appointment to cancel: ")) - 1
    selected_appointment = appointments[appointment_choice]

    doctor_name = selected_appointment['doctor_name']
    appointment_date = selected_appointment['appointment_date']
    appointment_time = selected_appointment['appointment_time']

    # 4. Update the appointment status to "Canceled" in Appointments_Collection
    appointments_collection.update_one(
        {"_id": selected_appointment['_id']},
        {"$set": {"status": "Canceled"}}
    )

    # 5. Free up the doctor's availability for the canceled time slot
    doctor_schedule = doctor_availability_collection.find_one({"doctor_name": {"$regex": doctor_name.strip(), "$options": "i"}})
    day_name = get_day_of_week(datetime.strptime(appointment_date, '%Y-%m-%d'))

    if doctor_schedule and "availability" in doctor_schedule and day_name in doctor_schedule["availability"]:
        time_slots = doctor_schedule["availability"][day_name]

        if appointment_time in time_slots and isinstance(time_slots[appointment_time], list):
            # Find the booked slot (1) and mark it as available (0)
            for i in range(len(time_slots[appointment_time])):
                if time_slots[appointment_time][i] == 1:  # Find the booked slot
                    time_slots[appointment_time][i] = 0  # Mark as available
                    break

            # Update the doctor's availability in the collection
            doctor_availability_collection.update_one(
                {"doctor_name": {"$regex": doctor_name.strip(), "$options": "i"}},
                {"$set": {f"availability.{day_name}.{appointment_time}": time_slots[appointment_time]}}
            )

    print("Your appointment has been successfully canceled and the time slot has been made available.")

# Query doctor availability flow (placeholder)
def query_doctor_availability_flow():

    print("Query doctor availability flow")

# Main menu flow
def main_menu():
    print("Welcome! What would you like to do?")
    print("1. Book an appointment")
    print("2. Reschedule an appointment")
    print("3. Cancel an appointment")
    print("4. Query doctor availability")

    choice = int(input("Enter your choice: "))

    if choice == 1:
        book_appointment_flow()
    elif choice == 2:
        reschedule_appointment_flow()
    elif choice == 3:
        cancel_appointment_flow()
    elif choice == 4:
        query_doctor_availability_flow()
    else:
        print("Invalid choice. Please try again.")
        main_menu()

# Call the main menu
main_menu()