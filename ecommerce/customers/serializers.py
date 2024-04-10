from rest_framework import serializers
from .models import Customer
from users.serializers import UserSerializer
from users.models import CustomUser

class CustomerSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Customer
        fields = ("user", "address", "city", "phone_number")
        
    def create(self, validated_data) -> Customer:
        user_data = validated_data.pop("user")
        user = CustomUser.objects.create_user(**user_data)
        customer = Customer.objects.create(user=user, **validated_data)
        return customer
        