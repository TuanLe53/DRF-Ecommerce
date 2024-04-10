from django.db import models
from users.models import CustomUser
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