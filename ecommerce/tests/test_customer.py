import pytest
from django.urls import reverse
from .prep_phase import prep_user, prep_products, prep_customer
from log import logger
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
    
@pytest.mark.django_db
def test_cart(client):
	prep_user(client)
	prep_products(client, k=5)
    
	prep_customer(client)

	get_pds = client.get(reverse("products"))
	pd_1 = get_pds.data[0]
	pd_2 = get_pds.data[2]

	item_1 ={
		"product": pd_1["id"],
        "quantity": 2,
	}
	item_2 ={
		"product": pd_2["id"],
        "quantity": 3,
	}

	add_item_1 = client.post(reverse("cart_items"), data=item_1, format="json")
	assert add_item_1.status_code == 201
	
	add_item_2 = client.post(reverse("cart_items"), data=item_2, format="json")
	assert add_item_2.status_code == 201

	get_cart_items = client.get(reverse("cart_items"))
	assert get_cart_items.status_code == 200
	assert len(get_cart_items.data) != 0
	assert len(get_cart_items.data) == 2
 
	rm_item = get_cart_items.data[0]["id"]
	rm_from_cart = client.delete(reverse("remove_item", kwargs={"pk": rm_item}))
	assert rm_from_cart.status_code == 204
	assert rm_from_cart.data is None