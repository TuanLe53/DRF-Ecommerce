import pytest
from django.urls import reverse

# from log import logger

payload = {
    "name": "Perfume",
    "slug": "perfume-perfume-perfume",
    "description": "This is a description"
}

@pytest.mark.django_db
def test_category(client):
    res = client.post(reverse("category"), data=payload, format="json")
    assert res.status_code == 201
    
    get = client.get(reverse("category"))
    assert get.status_code == 200