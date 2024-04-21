from rest_framework import serializers
from .models import Vendor
from users.serializers import UserSerializer
from users.models import CustomUser

class VendorSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta: 
        model = Vendor
        fields = ("user", "address", "city", "phone_number", "shop_name", "description", "avatar")
        
    def create(self, validated_data) -> Vendor:
        user_data = validated_data.pop("user")
        user = CustomUser.objects.create_user(**user_data)
        
        vendor = Vendor.objects.create(user=user, **validated_data)
        return vendor