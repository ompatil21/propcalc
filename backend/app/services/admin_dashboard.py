# app/services/admin_dashboard.py

from app import mongo
from datetime import datetime


def get_summary_data():
    properties = list(mongo.db.properties.find())

    total_properties = len(properties)
    total_price = sum(p.get("purchase_price", 0) or 0 for p in properties)

    average_price = (
        round(total_price / total_properties, 2) if total_properties > 0 else None
    )

    return {
        "total_properties": total_properties,
        "average_purchase_price": average_price,
    }


def get_property_type_distribution():
    pipeline = [
        {"$group": {"_id": "$type", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}},
    ]
    return [
        {"type": r["_id"], "count": r["count"]}
        for r in mongo.db.properties.aggregate(pipeline)
    ]


def get_owner_distribution():
    pipeline = [
        {"$unwind": "$owners"},
        {"$group": {"_id": "$owners.name", "count": {"$sum": 1}}},
    ]
    result = list(mongo.db.properties.aggregate(pipeline))
    return [
        {"owner": r["_id"], "property_count": r["count"]} for r in result if r["_id"]
    ]


def get_monthly_addition_stats():
    pipeline = [
        {
            "$group": {
                "_id": {
                    "year": {"$year": "$createdAt"},
                    "month": {"$month": "$createdAt"},
                },
                "count": {"$sum": 1},
            }
        },
        {"$sort": {"_id.year": 1, "_id.month": 1}},
    ]

    result = list(mongo.db.properties.aggregate(pipeline))

    return [
        {"month": f"{r['_id']['year']}-{r['_id']['month']:02d}", "count": r["count"]}
        for r in result
    ]
