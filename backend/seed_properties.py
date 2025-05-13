from pymongo import MongoClient

# Connect to your local MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["investment_property_db"]
users_collection = db["users"]

# Define sample users
sample_users = [
    {"email": "admin@example.com", "role": "admin", "active": True},
    {"email": "user1@example.com", "role": "user", "active": True},
    {"email": "user2@example.com", "role": "user", "active": False},
    {"email": "user3@example.com", "role": "user", "active": True},
    {"email": "disabled@example.com", "role": "user", "active": False},
]

# Optional: clear users collection first
# users_collection.delete_many({})

# Insert sample users
result = users_collection.insert_many(sample_users)

print(f"✅ Inserted {len(result.inserted_ids)} users into the database.")
