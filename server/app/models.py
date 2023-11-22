import json
import uuid
import jwt
import datetime
from django.db import models
from typing import Dict, Any


class UserModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=128)
    email = models.EmailField()
    password = models.CharField(max_length=255)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'users'
        ordering = ['createdAt']
        
        def __str__(self) -> str:
            return self.email

def generate_token(user: UserModel, secret_key: str, duration: int) -> str:
    payload: Dict[str, Any] = {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=duration)
    }

    token = jwt.encode(payload, secret_key, algorithm="HS256")
    return token

def get_user_from_token(token: str, secret_key: str):
    try:
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        user_id = payload.get("id")
        return UserModel.objects.get(id=user_id)
    except (jwt.InvalidTokenError, UserModel.DoesNotExist):
        return None


class Reimbursement:
    def __init__(self):
        self.ads_data = {
            '0011': {'Cost_Share_Rate': 0.50, 'Allowed_Spend_per_Ad': 200, 'count': 0, 'spend': {}},
            '1011': {'Cost_Share_Rate': 1.00, 'Allowed_Spend_per_Ad': (1000, 2000), 'count': 0, 'spend': {}},
            '1111': {'Cost_Share_Rate': 0.75, 'Allowed_Spend_per_Ad': 500, 'count': 0, 'spend': {}},
            '1010': {'Cost_Share_Rate': 0.90, 'Allowed_Spend_per_Ad': (750, 5000), 'count': 0, 'spend': {}}
        }
        self.ad_id_counter = 1

    def add_ad(self, ad_type, spend_amount):
        if ad_type in self.ads_data:
            allowed_spend = self.ads_data[ad_type]['Allowed_Spend_per_Ad']
            if isinstance(allowed_spend, tuple) and not allowed_spend[0] <= spend_amount <= allowed_spend[1]:
                print(f"Invalid spend amount for Ad type {ad_type}. Must be within the allowed range.")
                return False
            elif isinstance(allowed_spend, tuple) == False and allowed_spend != spend_amount:
                print(f"Invalid spend amount for Ad type {ad_type}. Must be within the allowed range.")
                return False
            
            ad_id = str(self.ad_id_counter)
            self.ad_id_counter += 1

            self.ads_data[ad_type]['count'] += 1
            self.ads_data[ad_type]['spend'][ad_id] = spend_amount
            print(f"Added an Ad of type {ad_type} with ID {ad_id} and spend amount ${spend_amount}")
            return True
        else:
            print(f"Invalid Ad type: {ad_type}")
            return False

    def remove_ad(self, ad_type, ad_id):
        if ad_type not in self.ads_data:
            print(f"Invalid Ad type: {ad_type}")
            return

        ad_info = self.ads_data[ad_type]

        if ad_info['count'] == 0:
            print(f"No Ad of type {ad_type} to remove")
            return

        spend_dict = ad_info['spend']

        if ad_id not in spend_dict:
            print(f"No Ad with ID {ad_id} for Ad type {ad_type} to remove")
            return

        removed_amount = spend_dict.pop(ad_id)
        print(f"Removed an Ad of type {ad_type} with ID {ad_id} and spend amount ${removed_amount}")
        ad_info['count'] -= 1

    def print_ads(self):
        print("Ads Object Content:")
        for ad_type, ad_info in self.ads_data.items():
            spend_str = ', '.join([f"ID: {ad_id}, Amount: {amount}" for ad_id, amount in ad_info['spend'].items()])
            print(f"Ad Type: {ad_type}, Count: {ad_info['count']}, Spend Amounts: {spend_str}")

    def total_reimbursement(self):
        total_reimbursement = 0
        for ad_type, ad_info in self.ads_data.items():
            count = ad_info['count']
            cost_share_rate = ad_info['Cost_Share_Rate']
            spend_dict = ad_info['spend']

            total_reimbursement += count * cost_share_rate * sum(spend_dict.values())

        return total_reimbursement