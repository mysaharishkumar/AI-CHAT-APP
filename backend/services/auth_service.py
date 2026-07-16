import firebase_admin
from firebase_admin import credentials, auth

cred = credentials.Certificate(
    "../firebase/serviceAccount.json"
)

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

def verify_token(token):
    return auth.verify_id_token(token)