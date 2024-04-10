from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.tokens import Token
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CustomUser
        fields = ("email", "password", "first_name", "last_name", "user_type")
        extra_kwargs = {"password": {"write_only": True}}
        read_only_fields = ("id", "created_at")

    def create(self, validated_data) -> CustomUser:
        user = CustomUser.objects.create_user(**validated_data)
        return user
    
class UserLoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user: CustomUser) -> Token:
        token = super().get_token(user)
        
        token["id"] = str(user.id)
        token["name"] = f"{user.first_name} {user.last_name}"
        token["user_type"] = user.user_type
        
        return token