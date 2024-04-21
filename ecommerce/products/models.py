from django.db import models
import uuid
from vendors.models import Vendor

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    slug = models.SlugField(max_length=200, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ('name',)
        verbose_name = 'category'
        verbose_name_plural = 'categories'
    
    def __str__(self):
        return self.name
    
class Product(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4, unique=True)
    name = models.CharField(max_length=200,null=True)
    slug = models.SlugField(max_length=200,db_index=True)
    price = models.FloatField()
    description = models.TextField(blank=True, null=True)
    
    category = models.ManyToManyField(Category, related_name="products")
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='products')
    
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.name
    
class ProductImages(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="product")
    
    def __str__(self):
        return f"{self.image.url}"
    
class Inventory(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name="inventory")
    quantity = models.PositiveIntegerField(default=0)
    last_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product}: {self.quantity}"