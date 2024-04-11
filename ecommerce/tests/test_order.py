import pytest
from django.urls import reverse

from .prep_phase import prep_products, prep_customer, prep_user

@pytest.mark.django_db
def test_order(client):
    prep_user(client)
    prep_products(client, k=5)
    
    prep_customer(client)
    payment_payload ={
        "provider": "VISA",
        "account_number": "090909090",
        "expiry_date": "2020-12-24"
    }
    
    #CREATE payment
    create_payment = client.post(reverse("payments"), data=payment_payload, format="json")
    assert create_payment.status_code == 201
    
    get_products = client.get(reverse("products"))
    pd_1 = get_products.data[0]
    pd_2 = get_products.data[1]
    
    body = {
        "products":[
            {
                "product_id": pd_1["id"],
                "quantity": 3,
            },
            {
                "product_id": pd_2["id"],
                "quantity": 2,
            },
        ],
        "payment": create_payment.data["id"],
        "payment_type": "CREDIT_CARD"
    }

    create_order = client.post(reverse("orders"), data=body, format="json")
    assert create_order.status_code == 201
    assert create_order.data["status"] == "PROCESSING"

    get_order = client.get(reverse("orders"))
    assert get_order.status_code == 200
    assert len(get_order.data) == 1