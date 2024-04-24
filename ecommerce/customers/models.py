import uuid
from django.db import models
from users.models import CustomUser
from products.models import Product
from phonenumber_field.modelfields import PhoneNumberField
from django.utils.translation import gettext_lazy as _

# Create your models here.
class Customer(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    city = models.CharField(_("city"), blank=False, null=False, max_length=20)
    address = models.CharField(_("address"), blank=False, null=False, max_length=250)
    phone_number = PhoneNumberField()
    avatar = models.ImageField(upload_to="customer_avatar", null=True, blank=True)

    def __str__(self) -> str:
        return self.user.email
    
class Cart(models.Model):
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    customer = models.OneToOneField(Customer, on_delete=models.CASCADE, related_name="cart")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return f"CartID: {self.id}"
    
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return f"{self.product.name}: {self.quantity}"