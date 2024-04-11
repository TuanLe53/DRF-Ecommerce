from django.urls import reverse
from users.models import CustomUser
from products.models import Category
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
from io import BytesIO

customer_payload = {
	"user":{
		"email": "customer@gmail.com",
		"password": "password",
		"first_name": "first",
		"last_name": "last",
		"user_type": "CUSTOMER"
	},
	"address": "123 Street",
	"city": "Vancouver",
	"phone_number": "0909090909"
}
customer_login={
    "email": "customer@gmail.com",
    "password": "password"
}

vendor_register = {
	"user":{
		"email": "vendor@gmail.com",
		"password": "password",
		"first_name": "first",
		"last_name": "last",
		"user_type": "VENDOR"
	},
	"shop_name": "Fake Store",
	"description": "This is a description",
	"address": "123 Street",
	"city": "Vancouver",
	"phone_number": "0909090909"
	}
vendor_login = {
		"email": "vendor@gmail.com",
		"password": "password",
    }
def prep_user(client) -> None:
    client.post(reverse("vendor_register"), data=vendor_register, format="json")
    login = client.post(reverse("login"), data=vendor_login, format="json")
    access_token = login.data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
    
def prep_customer(client) -> None:
    client.post(reverse("customer_register"), data=customer_payload, format="json")
    login = client.post(reverse("login"), data=customer_login, format="json")
    access_token = login.data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
    
def prep_products(client, k:int):
    Category.objects.create(
        name="shirt",
        description="This is a t-shirt category",
        slug="shirt"
        )
    size = (400, 400)
    storage = BytesIO()
    img = Image.new("RGB", size)
    img.save(storage, "JPEG")
    storage.seek(0)
    file = SimpleUploadedFile(
        name="test_img.jpg",
        content=storage.getvalue(),
        content_type="image/jpeg"
    )
    
    for i in range(k):
        product = {
            "name": f"test product {i}",
            "sku": "WW2906AS",
            "description": "description",
            "price": 199000 + i,
            "quantity": 10 + i,
            "categories": "shirt",
            "slug": "shirt",
            "images": file,
        }
        client.post(reverse("products"), data = product, format="multipart")

    Category.objects.create(
        name="food",
        description="this is a food category",
        slug="food"
        )
    for _ in range(5):
        product = {
            "name": f"Food {_}",
            "sku": "WW2906AS",
            "description": "description",
            "price": 199000 + i,
            "quantity": 10 + i,
            "categories": "food",
            "slug": "food",
            "images": file,
        }
        client.post(reverse("products"), data = product, format="multipart")