from django.db import models
import uuid
from customers.models import Customer

# Create your models here.
class Payment(models.Model):
    PROVIDER_CHOICES={
        ("VISA", "Visa"),
        ("MASTERCARD", "Mastercard"),
    }
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="payments")
    provider = models.CharField(choices=PROVIDER_CHOICES, max_length=12)
    account_number = models.CharField()
    expiry_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_default = models.BooleanField(default=False)