from pymongo import MongoClient

# Connect to your local MongoDB instance
client = MongoClient("mongodb://localhost:27017")
db = client["investment_property_db"]
users_collection = db["users"]

# Optional: Clear existing users (be careful in production!)
users_collection.delete_many({})

# Sample users
sample_users = [
    {"email": "admin@example.com", "role": "admin", "active": True},
    {"email": "user1@example.com", "role": "user", "active": True},
    {"email": "user2@example.com", "role": "user", "active": False},
    {"email": "user3@example.com", "role": "user", "active": True},
    {"email": "disabled@example.com", "role": "user", "active": False},
]

# Insert users (MongoDB will auto-generate ObjectId _id)
result = users_collection.insert_many(sample_users)
print(f"✅ Inserted {len(result.inserted_ids)} users successfully.")
