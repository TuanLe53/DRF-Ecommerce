import pytest
from django.urls import reverse

payload = {
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

@pytest.mark.django_db
def test_register_vendor(client):
	res = client.post(reverse("vendor_register"), data=payload, format="json")
	assert res.status_code == 201

@pytest.mark.django_db  
def test_login_vendor(client):
	res = client.post(reverse("vendor_register"), data=payload, format="json")
	assert res.status_code == 201
 
	login = client.post(reverse("login"), data=login_payload, format="json")
	assert login.status_code == 200
	assert login.data["access"] is not None
	assert login.data["refresh"] is not None
 
	#Get refresh token
	token = {
        "refresh": login.data["refresh"]
    }
	get_access_token = client.post(reverse("refresh"), data=token, format="json")
	assert get_access_token.status_code == 200
	assert get_access_token.data["access"] is not None
 
	#User not found
     #User not found
	data = {
        "email": "someemail@gmail.com",
        "password": "thisIsAPW"
    }
	res = client.post(reverse("login"), data=data, format="json")
	assert res.status_code == 401
    
    #Wrong password
	login_payload["password"] = "wrongPW"
	res = client.post(reverse("login"), data=login_payload, format="json")
	assert res.status_code == 401