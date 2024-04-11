from django.db import models
import uuid

from customers.models import Customer
from payments.models import Payment
from products.models import Product
# Create your models here.
class Order(models.Model):
    STATUS_CHOICES = (
        ("PROCESSING","Processing"),
        ("DELIVERING", "Delivering"),
        ("RECEIVED", "Received"),
    )
    
    PAYMENT_TYPE={
        ("COD", "COD"),
        ("CREDIT_CARD", "Credit card")
    }
    
    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    customer = models.ForeignKey(Customer, related_name="orders", on_delete=models.CASCADE)
    address = models.CharField(null=False, blank=False)
    payment_type = models.CharField(choices=PAYMENT_TYPE, max_length=12)
    payment = models.ForeignKey(Payment, on_delete=models.PROTECT)
    status  = models.CharField(choices=STATUS_CHOICES, max_length=10)
    total_price = models.DecimalField(max_digits=15, decimal_places=3)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class OrderItem(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    quantity = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=15, decimal_places=3)
    created_at = models.DateTimeField(auto_now_add=True)