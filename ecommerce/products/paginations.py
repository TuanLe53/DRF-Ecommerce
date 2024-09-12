from rest_framework.pagination import PageNumberPagination

class ProductsPagination(PageNumberPagination):
    # PAGE_SIZE = 1 only for testing purpose
    page_size = 1
    page_query_param='page'