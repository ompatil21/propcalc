# app/services/admin_user.py

from bson import ObjectId
from app import mongo
from datetime import datetime


def get_all_users():
    users = list(mongo.db.users.find({}, {"password": 0}))  # exclude sensitive info
    return [
        {
            "id": str(u["_id"]),
            "email": u.get("email", ""),
            "name": u.get("name", ""),
            "role": u.get("role", "user"),
            "createdAt": u.get("createdAt"),
        }
        for u in users
    ]


def create_user(data):
    # Check for existing user with same email
    existing = mongo.db.users.find_one({"email": data["email"]})
    if existing:
        raise ValueError("User with this email already exists.")

    user = {
        "email": data["email"],
        "name": data.get("name", ""),
        "role": data.get("role", "user"),
        "createdAt": datetime.utcnow(),
    }
    result = mongo.db.users.insert_one(user)
    return str(result.inserted_id)


def update_user(user_id, data):
    update_fields = {}
    if "name" in data:
        update_fields["name"] = data["name"]
    if "role" in data:
        update_fields["role"] = data["role"]

    result = mongo.db.users.update_one(
        {"_id": ObjectId(user_id)}, {"$set": update_fields}
    )
    return result.modified_count > 0


def delete_user(user_id):
    result = mongo.db.users.delete_one({"_id": ObjectId(user_id)})
    return result.deleted_count > 0
