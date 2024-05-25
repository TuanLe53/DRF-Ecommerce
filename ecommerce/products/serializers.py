from rest_framework import serializers
from .models import Product, ProductImages, Category, Inventory, Discount
from django.utils.text import slugify

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("name", "description", "slug")
        read_only_fields = ("slug", )
        
    def create(self, validated_data) -> Category:
        slug = slugify(validated_data["name"])

        category = Category.objects.create(slug=slug, **validated_data)
        return category

class CategoryNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("name", )
        
    def to_representation(self, value):
        return value.name

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ("quantity", )

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImages
        fields = ("image", )

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    categories = CategoryNameSerializer(many=True, read_only=True, source="category")
    quantity = serializers.CharField(source="inventory.quantity", read_only=True)
    slug = serializers.SlugField(read_only=True)

    class Meta: 
        model = Product
        fields = ("id", "name", "slug", "price", "description", "categories", "quantity", "images")
        lookup_field = 'slug'
        extra_kwargs = {
            "id": {"read_only": True}
            }
        
class ProductBasicInfoSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField("get_image")
    price = serializers.SerializerMethodField("get_final_price")
    
    class Meta:
        model = Product
        fields = ("id", "name", "price", "image", "slug")
        
    def get_image(self, obj):
        image = obj.images.first()
        return "http://127.0.0.1:8000/media/" + str(image.image)
    
    def get_final_price(self, obj):
        try:
            discount = obj.discount
            percentage = discount.percentage
            return obj.price - (obj.price * percentage//100)
        except Discount.DoesNotExist:
            return obj.price