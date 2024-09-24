MedMinion

Problem Statement:
The management of small clinics in India remains largely manual, leading to inefficiencies for both doctors and patients. Manual processes hinder timely access to healthcare services and compromise the accuracy of medical records. To address these challenges, there is a critical need for a modernised approach to clinic management.


Key Features:
1) Automated Appointment Scheduling
-> Patients can easily book, cancel, or reschedule appointments online.
-> Optimized scheduling based on doctor availability and patient preferences, reducing conflicts and no-shows.
-> User-friendly form with dropdowns for department, location, doctor, and available time slots.
-> Auto-filled doctor contact information and email input for patients.
-> Booking is finalized via a POST request, with confirmation and redirection to the main page.
2) Preliminary Disease Detection
-> Uses a MedBERT-based NER model to extract symptoms from user input.
-> Symptoms are matched against a MongoDB collection of diseases.
-> Assigns weight to symptoms based on rarity to improve diagnostic accuracy.
-> Fuzzy matching returns the top three potential diseases, providing ranked diagnoses.
-> Ideal for preliminary diagnosis, symptom analysis, and patient self-assessment.
3) Prescription Management
-> Compares parsed symptoms with diseases in MongoDB and retrieves associated medications.
-> Supports automated prescription generation and healthcare app integration for medication recommendations.
-> Helps streamline prescription workflows for healthcare providers.
4) Patient Records & Test Management
-> Doctors can upload and patients can download test results (PDF) through a portal.
-> Patients can view upcoming and past appointments, while doctors have a calendar view of their daily schedule.
-> Centralized EHR system stores all records for easy reference.


Uses:
1) Streamlined test result handling and appointment management for improved patient experience.
2) Efficient doctor scheduling and time management via a real-time calendar interface.
3) Centralized health data management eliminates the need for paper records.
