from django.urls import reverse
from users.models import CustomUser

register_payload = {
	"user":{
		"email": "email@gmail.com",
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
login_payload = {
		"email": "email@gmail.com",
		"password": "password",
    }
def prep_user(client) -> None:
    register = client.post(reverse("vendor_register"), data=register_payload, format="json")
    login = client.post(reverse("login"), data=login_payload, format="json")
    access_token = login.data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")