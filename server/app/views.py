import math
from datetime import datetime
from django.core import serializers
from django.contrib.auth.hashers import make_password
from app.models import UserModel, generate_token, get_user_from_token, Reimbursement
from app.serializers.adminSerializer import UserSerializer
from app.serializers.userSerializer import RegisterSerializer, LoginSerializer
from rest_framework import status, generics
from rest_framework.response import Response
import json

class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user_account = serializer.save()
            user = serializers.serialize('python', [user_account])[0]['fields']
            return Response({
                "success": True,
                "message": "Successfully registered",
                "user": user
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                "success": False,
                "message": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            checked_user = serializer.check_user()
            token = generate_token(checked_user, "puzzle", 3600)
            user = serializers.serialize('python', [checked_user])[0]['fields']
            return Response({
                "success": True,
                "message": "Welcome back!",
                "user": user,
                "token": token
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "success": False,
                "message": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        

class TokenView(generics.GenericAPIView):
    serializer_class = UserSerializer

    def get(self, request):
        header = request.META.get("HTTP_AUTHORIZATION")
        token = header.split()[1] if header else None
        decoded_user = get_user_from_token(token, "puzzle")

        if decoded_user == None:
            return Response({
                "success": False,
                "message": "The token has expired."
            }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            user = UserModel.objects.filter(email=decoded_user.email)
            user_data = serializers.serialize('python', [decoded_user])[0]['fields']
            if user.exists() == True:
                return Response({
                    "success": True,
                    "message": "Token is valid.",
                    "user": {
                        "name": user_data["name"],
                        "email": user_data["email"],
                        "createdAt": user_data["createdAt"]
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "success": False,
                    "message": "The token has expired."
                }, status=status.HTTP_401_UNAUTHORIZED)
        

class AdView(generics.GenericAPIView):
    reimbursement = Reimbursement()
    def get(self, request):
        ads_data = self.reimbursement.ads_data
        ads_data_json = json.dumps({'ads_data': ads_data})
        return Response({
            "success": True,
            'ads_data': ads_data_json
        })

    def put(self, request):
        ad_type = request.GET.get('id')
        adData = request.data
        price = adData.get('price')
        if self.reimbursement.add_ad(ad_type, price):
            return Response({
                "success": True,
                "message": "Successfully updated.",
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "success": False,
                "message": "Invalid Range of Price"
            }, status=status.HTTP_200_OK)