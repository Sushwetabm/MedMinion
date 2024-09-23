from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime, timedelta
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from bson import ObjectId

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}) 

# Load environment variables from the .env file
load_dotenv()

# Get the MongoDB connection string from the environment variables
mongo_uri = os.getenv('mongo_uri')

client = MongoClient(mongo_uri)
db = client["MedMinion"]

# Collections
doctor_availability_collection = db['Doctors Availability Collection']
delhi_ncr_doctors_collection = db['Delhi_ncr_doctors']
appointments_collection = db['Appointments_Collection']

# Helper function to get the day of the week as a string (Monday, Tuesday, etc.)
def get_day_of_week(date):
    return date.strftime('%A')

@app.route('/fetch_departments', methods=['GET'])
def fetch_departments():
    departments = delhi_ncr_doctors_collection.distinct('Speciality/Domain')
    return jsonify(departments)

@app.route('/fetch_locations', methods=['GET'])
def fetch_locations():
    department = request.args.get('department')
    locations = delhi_ncr_doctors_collection.distinct('Clinic Address', {"Speciality/Domain": department})
    return jsonify(locations)

@app.route('/fetch_doctors', methods=['GET'])
def fetch_doctors():
    department = request.args.get('department')  # Get department from query params
    doctors = delhi_ncr_doctors_collection.find(
        {"Speciality/Domain": department}, 
        {" Doctors Name": 1, "Contact": 1, "_id": 0}  # Return both name and contact
    )
    return jsonify(list(doctors))

@app.route('/fetch_doctor_availability', methods=['GET'])
def fetch_doctor_availability():
    doctor_name = request.args.get('doctor_name')
    today = datetime.today()
    availability = []

    # Fetch the doctor's availability record
    doctor_schedule = doctor_availability_collection.find_one({"doctor_name": {"$regex": doctor_name.strip(), "$options": "i"}})

    if not doctor_schedule or "availability" not in doctor_schedule:
        return jsonify({"error": "Doctor schedule not found or no availability field"}), 404

    doctor_availability = doctor_schedule["availability"]

    # Loop through the next 7 days
    for i in range(7):
        day = today + timedelta(days=i)
        day_name = get_day_of_week(day)
        date = day.strftime('%Y-%m-%d')

        # If the day is in the availability dictionary, check for available time slots
        if day_name in doctor_availability:
            time_slots = doctor_availability[day_name]

            for time_slot, slots in time_slots.items():
                if isinstance(slots, list) and any(slot == 0 for slot in slots):  # Check if at least one slot is available (0)
                    # If there's an available slot, append the time and date to availability
                    availability.append({
                        "date": date,
                        "day_name": day_name,
                        "time": time_slot  # Return the available time slot
                    })

    return jsonify(availability)


@app.route('/fetch_appointments', methods=['GET'])
def fetch_appointments():
    patient_email = request.args.get('patient_email')
    
    if not patient_email:
        return jsonify({"error": "Patient email is required"}), 400
    
    try:
        appointments = list(appointments_collection.find(
            {"patient_email": patient_email}, {"_id": 0, "status": 1,"doctor_name":1,"appointment_date":1,"appointment_time":1}
        ))
        return jsonify(appointments)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/book_appointment', methods=['POST'])
def book_appointment():
    data = request.json
    patient_email= data.get('patient_email')
    doctor_name = data.get('doctor_name')
    appointment_date = data.get('appointment_date')
    appointment_time = data.get('appointment_time')
    clinic_location = data.get('clinic_location')
    doctor_contact = data.get('doctor_contact')

    try:
        # Insert the appointment details
        appointment = {
            "patient_email": patient_email,
            "doctor_name": doctor_name,
            "appointment_date": appointment_date,
            "appointment_time": appointment_time,
            "status": "Scheduled",
            "clinic_location": clinic_location,
            "doctor_contact": doctor_contact
        }
        appointments_collection.insert_one(appointment)

        # Update doctor's availability
        day_name = get_day_of_week(datetime.strptime(appointment_date, '%Y-%m-%d'))
        doctor_schedule = doctor_availability_collection.find_one({"doctor_name": {"$regex": doctor_name.strip(), "$options": "i"}})
        if doctor_schedule and "availability" in doctor_schedule and day_name in doctor_schedule["availability"]:
            time_slots = doctor_schedule["availability"][day_name]
            if appointment_time in time_slots and isinstance(time_slots[appointment_time], list):
                if 0 in time_slots[appointment_time]:
                    for i in range(len(time_slots[appointment_time])):
                        if time_slots[appointment_time][i] == 0:
                            time_slots[appointment_time][i] = 1
                            break
                    doctor_availability_collection.update_one(
                        {"doctor_name": {"$regex": doctor_name.strip(), "$options": "i"}},
                        {"$set": {f"availability.{day_name}.{appointment_time}": time_slots[appointment_time]}}
                    )
                    return jsonify({"message": "Your appointment is successfully booked!"})
                else:
                    return jsonify({"error": "The selected time slot is already full."}), 400
            else:
                return jsonify({"error": "The selected time slot is not available."}), 400
        else:
            return jsonify({"error": "Doctor schedule not found or the day is not available."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/reschedule_appointment_flow', methods=['POST'])
def reschedule_appointment_flow():
    data = request.json
    patient_email = data.get('patient_email')
    old_appointment_date=data.get('old_appointment_date')
    print(old_appointment_date)
    old_appointment_time=data.get('old_appointment_time')
    new_appointment_date = data.get('new_appointment_date')
    new_appointment_time = data.get('new_appointment_time')
    doctor_name = data.get('doctor_name')  # Get the doctor's name from the request

    # Step 1: Cancel the previous appointment
    cancel_result = cancel_previous_appointment(patient_email, old_appointment_date,old_appointment_time)
    
    if not cancel_result:
        return jsonify({'error': 'Failed to cancel previous appointment.'}), 400

    # Step 2: Book the new appointment
    create_result = create_new_appointment(patient_email, doctor_name, new_appointment_date, new_appointment_time)
    
    if create_result:
        return jsonify({'message': 'Appointment rescheduled successfully.'})
    else:
        return jsonify({'error': 'Failed to reschedule appointment.'}), 400

def cancel_previous_appointment(patient_email, old_appointment_date,old_appointment_time):
    result = appointments_collection.delete_one({
        'patient_email': patient_email,
        'appointment_date':old_appointment_date,
        'appointment_time':old_appointment_time
    })
    return result.deleted_count > 0  # Return True if the appointment was deleted

def create_new_appointment(patient_email, doctor_name, new_appointment_date, new_appointment_time):
    # Logic to create a new appointment using the provided details
    new_appointment = {
        'patient_email': patient_email,
        'doctor_name': doctor_name,
        'appointment_date': new_appointment_date,
        'appointment_time': new_appointment_time
    }
    result = appointments_collection.insert_one(new_appointment)
    return result.inserted_id is not None  # Return True if the appointment was created

@app.route('/cancel_appointment_flow', methods=['POST'])
def cancel_appointment_flow():
    data = request.json
    patient_email = data.get('patient_email')
    appointment_date = data.get('appointment_date')
    appointment_time=data.get('appointment_time')
    

    if not patient_email or not appointment_date or not appointment_time:
        return jsonify({"error": "Patient email and appointment ID are required."}), 400

    if cancel_previous_appointment(patient_email, appointment_date,appointment_time):
        return jsonify({"message": "Appointment canceled successfully."})
    else:
        return jsonify({"error": "No scheduled appointment found or failed to cancel."}), 404



@app.route('/check_availability_for_bookings', methods=['GET'])
def check_availability_for_bookings():
    doctor_name = request.args.get('doctor_name')
    appointment_date = request.args.get('appointment_date')
    appointment_time = request.args.get('appointment_time')
    

    doctor_schedule = doctor_availability_collection.find_one({"doctor_name": {"$regex": doctor_name.strip(), "$options": "i"}})
    day_name = get_day_of_week(datetime.strptime(appointment_date, '%Y-%m-%d'))

    if doctor_schedule and "availability" in doctor_schedule and day_name in doctor_schedule["availability"]:
        time_slots = doctor_schedule["availability"][day_name]

        if appointment_time in time_slots and isinstance(time_slots[appointment_time], list):
            available = 0 in time_slots[appointment_time]
            return jsonify({"available": available})

    return jsonify({"available": False})

if __name__ == '__main__':
    app.run(debug=True,port=5001)
