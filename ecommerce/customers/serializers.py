from rest_framework import serializers
from django.shortcuts import get_object_or_404

from .models import Customer, Cart, CartItem
from users.serializers import UserSerializer
from users.models import CustomUser
from products.models import Product

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

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ("id", "status", "created_at", "updated_at")
        extra_kwargs = {
            "status": {"required": False}
            }
        
class CartItemSerializer(serializers.ModelSerializer):
    cart = serializers.CharField()
    product = serializers.CharField()
    
    class Meta:
        model = CartItem
        fields = "__all__"
        
    def create(self, validated_data) -> CartItem:
        cart = get_object_or_404(Cart, id=validated_data["cart"])
        product = get_object_or_404(Product, id=validated_data["product"])
        
        cart_item = CartItem.objects.create(
            cart=cart,
            product=product,
            quantity=validated_data["quantity"]
        )
        
        return cart_item