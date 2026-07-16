from services.email_service import send_otp_email

send_otp_email(
    "noreplay2108@gmail.com",
    "123456"
)

print("Email Sent")