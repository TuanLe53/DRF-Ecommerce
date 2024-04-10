from django.db import models
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField
from users.models import CustomUser

# Create your models here.
class Vendor(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    shop_name = models.CharField(_("shop name"), max_length=250, blank=False, null=False)
    description = models.TextField(_("description"))
    city = models.CharField(_("city"), blank=False, null=False, max_length=20)
    address = models.CharField(_("address"), blank=True, null=True, max_length=250)
    phone_number = PhoneNumberField()
    avatar = models.ImageField(upload_to="shop_avatar", null=True, blank=True)
    cover_photo = models.ImageField(upload_to="shop_cover", null=True, blank=True)
    closed = models.BooleanField(default=False)
    
    def __str__(self) -> str:
        return self.shop_name