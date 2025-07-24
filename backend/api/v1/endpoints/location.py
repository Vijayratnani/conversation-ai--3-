# # backend/routes/location.py
# from fastapi import APIRouter
# import requests

# router = APIRouter()

# @router.get("/api/location")
# def get_location():
#     try:
#         response = requests.get("https://ipapi.co/json/")
#         response.raise_for_status()
#         return response.json()
#     except requests.RequestException as e:
#         return {"error": str(e)}
