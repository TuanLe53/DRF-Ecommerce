from rest_framework import serializers

from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Payment
        exclude = ('customer', )
        extra_kwargs = {
            "id": {"read_only": True}
        }