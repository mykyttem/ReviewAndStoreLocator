import os
import firebase_admin
from firebase_admin import credentials, firestore

cert_path = '/etc/secrets/crf.json'

if not os.path.exists(cert_path):
    print(f"file '{cert_path}' not found!")
    exit(1)

try:
    cred = credentials.Certificate(cert_path)
    firebase_admin.initialize_app(cred)

    db = firestore.client()

    print("Firebase has been successfully initialized.")
except Exception as e:
    print(f"Error during Firebase initialization: {e}")
    exit(1)
