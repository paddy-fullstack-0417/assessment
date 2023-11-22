from rest_framework import serializers
from app.models import UserModel
from django.contrib.auth.hashers import make_password, check_password


class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = UserModel
        fields = ["name", "email", "password", "password2"]
        extra_kwargs = {"password": {"write_only": True}}

    def email_checker(self):
        if UserModel.objects.filter(email=self.validated_data["email"]).exists():
            raise serializers.ValidationError({
                "success": False,
                "message": "Email already exists."
            })
        
    def password_checker(self):
        password = self.validated_data["password"]
        password2 = self.validated_data["password2"]

        if password != password2:
            raise serializers.ValidationError({
                "success": False,
                "message": "Passwords don't match."
            })
        elif len(password) < 6:
            raise serializers.ValidationError({
                "success": False,
                "message": "Password should be at least 6 characters."
            })
        
    def prepare_account(self):
        self.user_account = UserModel(
            name=self.validated_data["name"],
            email=self.validated_data["email"],
            password=make_password(self.validated_data["password"])
        )

    def save(self):
        self.email_checker()
        self.password_checker()
        self.prepare_account()
        self.user_account.save()
        return self.user_account
    

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ["email", "password"]

    def check_user(self):
        if UserModel.objects.filter(email=self.validated_data["email"]).exists():
            user = UserModel.objects.get(email=self.validated_data["email"])
            if check_password(self.validated_data["password"], user.password):
                return user
            else:
                raise serializers.ValidationError({
                    "success": False,
                    "message": "Passwords is incorrect."
                })
        else:
            raise serializers.ValidationError({
                "success": False,
                "message": "The user does not exist."
            })