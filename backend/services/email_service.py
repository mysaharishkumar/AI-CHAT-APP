import os
import smtplib

import requests

from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()


def _build_body(otp: str) -> str:

    return f"""
Hello,

Welcome to AI Chat App.

Your One-Time Password (OTP) is:

{otp}

This OTP will expire in 5 minutes.

If you did not request this OTP, please ignore this email.

Regards,
AI Chat App Team
"""


def _send_via_nodemailer(email: str, otp: str) -> None:
    """
    Calls the standalone Node/Nodemailer email microservice
    (see /email-service) over HTTP.
    """

    url = os.getenv("EMAIL_SERVICE_URL", "").rstrip("/")
    api_key = os.getenv("EMAIL_SERVICE_API_KEY", "")

    response = requests.post(
        f"{url}/send-otp",
        headers={
            "Content-Type": "application/json",
            "x-api-key": api_key,
        },
        json={
            "email": email,
            "otp": otp,
        },
        timeout=10,
    )

    if response.status_code >= 300:
        raise RuntimeError(
            f"Email service error ({response.status_code}): {response.text}"
        )


def _send_via_brevo(email: str, otp: str) -> None:
    """
    Sends via Brevo's HTTPS API instead of raw SMTP.
    This avoids SMTP ports (587/465) that many networks and
    hosts block or throttle — the same reliability problem
    Node/Nodemailer setups usually route around by using an
    API-based provider instead of talking SMTP directly.
    """

    api_key = os.getenv("BREVO_API_KEY")
    sender = (
        os.getenv("BREVO_SENDER_EMAIL")
        or os.getenv("EMAIL_ADDRESS")
    )

    response = requests.post(
        "https://api.brevo.com/v3/smtp/email",
        headers={
            "api-key": api_key,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        json={
            "sender": {
                "name": "AI Chat App",
                "email": sender,
            },
            "to": [{"email": email}],
            "subject": "AI Chat App - Login Verification",
            "textContent": _build_body(otp),
        },
        timeout=10,
    )

    if response.status_code >= 300:
        raise RuntimeError(
            f"Brevo API error ({response.status_code}): {response.text}"
        )


def _send_via_smtp(email: str, otp: str) -> None:

    sender = os.getenv("EMAIL_ADDRESS")
    password = os.getenv("EMAIL_PASSWORD")

    if not sender or not password:
        raise RuntimeError(
            "EMAIL_ADDRESS or EMAIL_PASSWORD is not set in the environment"
        )

    msg = MIMEText(_build_body(otp))

    msg["Subject"] = "AI Chat App - Login Verification"
    msg["From"] = f"AI Chat App <{sender}>"
    msg["To"] = email

    # 10s timeout so a blocked/unreachable SMTP port fails fast
    # instead of hanging the request indefinitely.
    with smtplib.SMTP(
        "smtp.gmail.com",
        587,
        timeout=10
    ) as server:

        server.starttls()
        server.login(sender, password)
        server.send_message(msg)


def send_otp_email(email: str, otp: str):

    # Priority: Nodemailer microservice > Brevo (HTTPS API) > raw Gmail SMTP.
    # Each one is opt-in via its env var(s) — set exactly the one you want,
    # and the others are simply skipped.
    if os.getenv("EMAIL_SERVICE_URL"):
        _send_via_nodemailer(email, otp)
    elif os.getenv("BREVO_API_KEY"):
        _send_via_brevo(email, otp)
    else:
        _send_via_smtp(email, otp)
