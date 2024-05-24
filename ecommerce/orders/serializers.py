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

class OrderFieldSerializer(serializers.ModelSerializer):
    class  Meta:
        model = Order
        fields = ("id", "status", "created_at", "payment_type", "total_price", )

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductBasicInfoSerializer()
    order_status = serializers.SerializerMethodField("get_order_status")
    
    class Meta:
        model = OrderItem
        fields = "__all__"
        
    def get_order_status(self, obj):
        return obj.order.status
    
class OrderItemBasicInfoSerializer(serializers.ModelSerializer):
    product = ProductBasicInfoSerializer()
    
    class Meta:
        model = OrderItem
        fields = ("quantity", "total_price", "product", )
    
class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemBasicInfoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = "__all__"