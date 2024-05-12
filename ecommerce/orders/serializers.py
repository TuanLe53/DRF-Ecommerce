from rest_framework import serializers
from .models import Order, OrderItem

from products.serializers import ProductBasicInfoSerializer

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"
        extra_kwargs = {
            "address": {"read_only": True}
        }
        
class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductBasicInfoSerializer()
    
    class Meta:
        model = OrderItem
        fields = "__all__"