from rest_framework import serializers
from django.shortcuts import get_object_or_404

from .models import Customer, Cart, CartItem
from users.serializers import UserSerializer
from users.models import CustomUser
from products.models import Product
from products.serializers import ProductSerializer

class CustomerSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Customer
        fields = ("user", "address", "city", "phone_number")
        
    def create(self, validated_data) -> Customer:
        user_data = validated_data.pop("user")
        user = CustomUser.objects.create_user(**user_data)
        customer = Customer.objects.create(user=user, **validated_data)
        Cart.objects.create(customer=customer)
        return customer

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ("id", "created_at", "updated_at")

        
class CreateCartItemSerializer(serializers.ModelSerializer):
    cart = serializers.CharField(required=False)
    product = serializers.CharField()
    
    class Meta:
        model = CartItem
        fields = "__all__"
        
    def create(self, validated_data) -> CartItem:
        customer = get_object_or_404(Customer, user=self.context.get("request").user)
        cart = get_object_or_404(Cart, customer=customer)
        product = get_object_or_404(Product, id=validated_data["product"])
        
        if validated_data["quantity"] <= 0:
            raise serializers.ValidationError({"error": "Quantity must be greater than 0."})
        
        cart_item = CartItem.objects.create(
            cart=cart,
            product=product,
            quantity=validated_data["quantity"]
        )
        
        return cart_item
    
class GetCartItemSerializer(serializers.ModelSerializer):
    cart = serializers.CharField()
    product = ProductSerializer()
    
    class Meta:
        model = CartItem
        fields = "__all__"