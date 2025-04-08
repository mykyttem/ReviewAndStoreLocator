import os
import firebase_admin
from firebase_admin import credentials, firestore

# Get the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))

# Path to the certificate
cert_path = os.path.join(current_dir, "crf.json")

# Check if the file exists
if not os.path.exists(cert_path):
    print(f"file '{cert_path}' not found!")
    exit(1)

try:
    # Initializing Firebase
    cred = credentials.Certificate(cert_path)
    firebase_admin.initialize_app(cred)

    db = firestore.client()

    print("Firebase has been successfully initialized.")
except Exception as e:
    print(f"Error during Firebase initialization: {e}")
    exit(1)
