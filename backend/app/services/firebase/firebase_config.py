import os
import firebase_admin
from firebase_admin import credentials, firestore
from pathlib import Path

"""
Depending on whether it is production or development, 
it will automatically search for the file in the right place
"""

CERT_PATHS = [
    # for prod
    '/etc/secrets/crf.json',  
    '/run/secrets/firebase_cert',  
    
    # for dev
    str(Path(__file__).parent.parent / 'firebase' / 'crf.json'),
    'crf.json',
]


def init_firebase():
    cert_path = None
    for path in CERT_PATHS:
        if os.path.exists(path):
            cert_path = path
            break

    if not cert_path:
        raise FileNotFoundError("Firebase certificate not found in any of: " + ", ".join(CERT_PATHS))

    cred = credentials.Certificate(cert_path)
    firebase_admin.initialize_app(cred)
    return firestore.client()


db = init_firebase()