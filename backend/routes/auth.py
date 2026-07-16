from fastapi import APIRouter, HTTPException
from random import randint

from database.otp import otp_codes
from database.users import users

from models.otp import (
    SendOTPRequest,
    VerifyOTPRequest
)

from services.email_service import send_otp_email

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post("/send-otp")
async def send_otp(
    data: SendOTPRequest
):

    print(f"[send-otp] request received for {data.email}")

    otp = str(
        randint(100000, 999999)
    )

    try:
        await otp_codes.delete_many({
            "email": data.email
        })

        await otp_codes.insert_one({
            "email": data.email,
            "otp": otp
        })

        print(f"[send-otp] OTP stored in MongoDB for {data.email}")

    except Exception as e:
        print(f"[send-otp] MongoDB write failed for {data.email}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {e}"
        )

    try:
        send_otp_email(
            data.email,
            otp
        )
        print(f"[send-otp] email sent successfully to {data.email}")
    except Exception as e:
        print(f"[send-otp] failed to send email to {data.email}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send OTP email: {e}"
        )

    return {
        "message": "OTP Sent"
    }


@router.post("/verify-otp")
async def verify_otp(
    data: VerifyOTPRequest
):

    record = await otp_codes.find_one({
        "email": data.email,
        "otp": data.otp
    })

    if not record:
        raise HTTPException(
            status_code=401,
            detail="Invalid OTP"
        )

    user = await users.find_one({
        "email": data.email
    })

    if not user:

        result = await users.insert_one({
            "email": data.email,
            "login_type": "email_otp"
        })

        user_id = str(
            result.inserted_id
        )

    else:

        user_id = str(
            user["_id"]
        )

    await otp_codes.delete_many({
        "email": data.email
    })

    return {
        "message": "Login Successful",
        "user_id": user_id,
        "email": data.email
    }