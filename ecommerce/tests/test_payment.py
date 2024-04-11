import pytest
from django.urls import reverse
from .prep_phase import prep_customer

@pytest.mark.django_db
def test_payment(client):
    prep_customer(client)
    
    payment_payload ={
        "provider": "VISA",
        "account_number": "090909090",
        "expiry_date": "2020-12-24"
    }
    
    #CREATE payment
    create_payment = client.post(reverse("payments"), data=payment_payload, format="json")

    assert create_payment.status_code == 201
    payment = create_payment.data
    
    #GET payments
    get_payments = client.get(reverse("payments"))
    assert get_payments.status_code == 200
    assert get_payments.data[0]["id"] == payment["id"]