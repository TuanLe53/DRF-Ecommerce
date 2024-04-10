import pytest
from django.urls import reverse

payload = {
  "user":{
    "email": "email@gmail.com",
    "password": "password",
    "first_name": "first",
    "last_name": "last",
    "user_type": "CUSTOMER"
  },
  "address": "123 Street",
  "city": "Vancouver",
  "phone_number": "0909090909"
}

@pytest.mark.django_db
def test_register_customer(client):
    res = client.post(reverse("customer_register"), data=payload, format="json")
    
    assert res.status_code == 201