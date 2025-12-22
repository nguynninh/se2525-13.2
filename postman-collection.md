# Hiki API - Postman Collection

Base URL: `https://api.hiki.io.vn`

## Authentication Headers
For protected endpoints, include:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## 1. AUTHENTICATION ENDPOINTS

### 1.1 Register Start
**Method:** POST  
**URL:** `/v1/auth/register/start`

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "confirm_password": "password123"
}
```

### 1.2 Register Resend OTP
**Method:** POST  
**URL:** `/v1/auth/register/resend`

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

### 1.3 Register Finalize
**Method:** POST  
**URL:** `/v1/auth/register/finalize`

**Request Body:**
```json
{
  "code": "1234"
}
```

### 1.4 Login
**Method:** POST  
**URL:** `/v1/auth/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "role": "customer",
    "phone": null,
    "profile_url": null
  },
  "access_token": "jwt_token",
  "refresh_token": "refresh_token"
}
```

### 1.5 Social Login
**Method:** POST  
**URL:** `/v1/auth/login/social/{provider}`

**Path Parameters:**
- `provider`: `google` or `facebook`

**Request Body:**
```json
{
  "provider": "google",
  "credential": "oauth_credential"
}
```

### 1.6 Refresh Token
**Method:** POST  
**URL:** `/v1/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

### 1.7 Logout
**Method:** POST  
**URL:** `/v1/auth/logout`

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

### 1.8 Password Reset Request
**Method:** POST  
**URL:** `/v1/auth/reset/request`

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

### 1.9 Password Reset Resend
**Method:** POST  
**URL:** `/v1/auth/reset/resend`

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

### 1.10 Password Reset Verify
**Method:** POST  
**URL:** `/v1/auth/reset/verify`

**Request Body:**
```json
{
  "code": "1234"
}
```

### 1.11 Password Reset Finalize
**Method:** POST  
**URL:** `/v1/auth/reset/finalize`

**Request Body:**
```json
{
  "code": "1234",
  "new_password": "newpassword123",
  "confirm_password": "newpassword123"
}
```

---

## 2. USER ENDPOINTS

### 2.1 Get Current User Profile
**Method:** GET  
**URL:** `/v1/users/me`  
**Auth:** Required

### 2.2 Update Current User Profile
**Method:** PATCH  
**URL:** `/v1/users/me`  
**Auth:** Required

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "phone": "+1234567890",
  "profile_url": "https://example.com/avatar.jpg"
}
```

### 2.3 Change Password
**Method:** PATCH  
**URL:** `/v1/users/me/password`  
**Auth:** Required

**Request Body:**
```json
{
  "current_password": "oldpassword123",
  "new_password": "newpassword123",
  "confirm_password": "newpassword123"
}
```

### 2.4 Update Avatar
**Method:** PATCH  
**URL:** `/v1/users/me/avatar`  
**Auth:** Required

**Content-Type:** `multipart/form-data`

**Form Data:**
- `avatar`: (file) Image file (max 5MB)

### 2.5 Delete Current User
**Method:** DELETE  
**URL:** `/v1/users/me`  
**Auth:** Required

### 2.6 Get Seller Profile
**Method:** GET  
**URL:** `/v1/users/seller/me`  
**Auth:** Required

### 2.7 Admin - List Users
**Method:** GET  
**URL:** `/v1/users/admin/users`  
**Auth:** Required (Admin only)

**Query Parameters:**
- `role`: `customer` | `seller` | `admin` (optional)
- `search`: Search term (optional)

### 2.8 Admin - Get User Details
**Method:** GET  
**URL:** `/v1/users/admin/users/{id}`  
**Auth:** Required (Admin only)

### 2.9 Admin - Update Seller Status
**Method:** PATCH  
**URL:** `/v1/users/admin/sellers/{id}/status`  
**Auth:** Required (Admin only)

**Request Body:**
```json
{
  "status": "active"
}
```

**Status options:** `active`, `suspended`, `closed`

### 2.10 Admin - Delete Seller
**Method:** DELETE  
**URL:** `/v1/users/admin/sellers/{id}`  
**Auth:** Required (Admin only)

### 2.11 Admin - Delete User
**Method:** DELETE  
**URL:** `/v1/users/admin/users/{id}`  
**Auth:** Required (Admin only)

---

## 3. PRODUCT ENDPOINTS

### 3.1 Get Categories
**Method:** GET  
**URL:** `/v1/categories`

### 3.2 Get Categories (Alternative)
**Method:** GET  
**URL:** `/v1/products/categories`

### 3.3 Create Category
**Method:** POST  
**URL:** `/v1/categories`  
**Auth:** Required (Admin only)

**Request Body:**
```json
{
  "name": "Electronics",
  "parent_id": null,
  "icon_url": "https://example.com/icon.png"
}
```

### 3.4 Update Category
**Method:** PATCH  
**URL:** `/v1/categories/{id}`  
**Auth:** Required (Admin only)

**Request Body:**
```json
{
  "name": "Smartphones",
  "parent_id": "category_uuid"
}
```

### 3.5 Get Products
**Method:** GET  
**URL:** `/v1/products`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (1-100, default: 10)
- `sort`: `price_asc` | `price_desc` | `sold_desc` | `newest` | `rating_desc`
- `min_price`: Minimum price
- `max_price`: Maximum price
- `category_id`: Category UUID
- `shop_id`: Shop UUID
- `keyword`: Search keyword
- `status`: `draft` | `active` | `hidden` | `banned`

**Example URL:** `https://api.hiki.io.vn/v1/products?page=1&limit=10&sort=price_desc`

### 3.6 Create Product
**Method:** POST  
**URL:** `/v1/products`  
**Auth:** Required (Seller/Admin only)

**Request Body:**
```json
{
  "category_id": "category_uuid",
  "name": "Product Name (min 10 chars)",
  "slug": "product-slug",
  "sku": "PROD-001",
  "description": "Product description",
  "status": "draft",
  "price": 10000,
  "quantity": 100
}
```

### 3.7 Add Product Image
**Method:** POST  
**URL:** `/v1/products/images`  
**Auth:** Required (Seller/Admin only)

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: Image file (max 5MB)
- `product_id`: Product UUID
- `image_url`: Image URL (if not uploading file)
- `is_main`: `true` or `false` (default: false)

### 3.8 Create Product Variant
**Method:** POST  
**URL:** `/v1/products/variants`  
**Auth:** Required (Seller/Admin only)

**Request Body:**
```json
{
  "product_id": "product_uuid",
  "name": "Color"
}
```

### 3.9 Create Product Variant Option
**Method:** POST  
**URL:** `/v1/products/variants/options`  
**Auth:** Required (Seller/Admin only)

**Request Body:**
```json
{
  "variant_id": "variant_uuid",
  "value": "Red"
}
```

### 3.10 Create Product Stock
**Method:** POST  
**URL:** `/v1/products/stocks`  
**Auth:** Required (Seller/Admin only)

**Request Body:**
```json
{
  "product_id": "product_uuid",
  "option_ids": "option1_uuid,option2_uuid",
  "sku": "PROD-RED-L",
  "price": 12000,
  "quantity": 50
}
```

### 3.11 Update Product Stock
**Method:** PATCH  
**URL:** `/v1/products/stocks/{id}`  
**Auth:** Required (Seller/Admin only)

**Request Body:**
```json
{
  "sku": "PROD-RED-L-UPDATED",
  "price": 13000,
  "quantity": 60
}
```

### 3.12 Create Product Review
**Method:** POST  
**URL:** `/v1/products/reviews`  
**Auth:** Required (Customer only)

**Request Body:**
```json
{
  "product_id": "product_uuid",
  "rating": 5,
  "comment": "Great product!",
  "images": "image_url1,image_url2"
}
```

### 3.13 Create Product Question
**Method:** POST  
**URL:** `/v1/products/questions`  
**Auth:** Required (Customer only)

**Request Body:**
```json
{
  "product_id": "product_uuid",
  "question": "Is this product available in different colors?"
}
```

### 3.14 Answer Product Question
**Method:** PATCH  
**URL:** `/v1/products/questions/{id}/answer`  
**Auth:** Required (Seller/Admin only)

**Request Body:**
```json
{
  "answer": "Yes, this product is available in multiple colors."
}
```

### 3.15 Get Product Reviews
**Method:** GET  
**URL:** `/v1/products/{id}/reviews`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (1-100, default: 10)

### 3.16 Get Product Questions
**Method:** GET  
**URL:** `/v1/products/{id}/questions`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (1-100, default: 10)

### 3.17 Get Product by ID
**Method:** GET  
**URL:** `/v1/products/{id}`

### 3.18 Update Product
**Method:** PATCH  
**URL:** `/v1/products/{id}`  
**Auth:** Required (Seller/Admin only)

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "price": 15000,
  "quantity": 75,
  "status": "active"
}
```

### 3.19 Delete Product
**Method:** DELETE  
**URL:** `/v1/products/{id}`  
**Auth:** Required (Seller/Admin only)

---

## 4. SELLER APPLICATION ENDPOINTS

### 4.1 Create Seller Application
**Method:** POST  
**URL:** `/v1/seller-applications`  
**Auth:** Required

**Request Body:**
```json
{
  "accepted_terms": true
}
```

### 4.2 Get My Latest Seller Application
**Method:** GET  
**URL:** `/v1/seller-applications/me/latest`  
**Auth:** Required

### 4.3 Admin - List Pending Applications
**Method:** GET  
**URL:** `/v1/seller-applications/admin/pending`  
**Auth:** Required (Admin only)

### 4.4 Admin - List Application History
**Method:** GET  
**URL:** `/v1/seller-applications/admin/history`  
**Auth:** Required (Admin only)

**Query Parameters:**
- `status`: `approved` | `rejected`

### 4.5 Admin - Review Seller Application
**Method:** PATCH  
**URL:** `/v1/seller-applications/admin/{id}/review`  
**Auth:** Required (Admin only)

**Approve Request Body:**
```json
{
  "status": "approved"
}
```

**Reject Request Body:**
```json
{
  "status": "rejected",
  "rejection_reason": "Insufficient business documentation"
}
```

---

## 5. LOCATION ENDPOINTS

### 5.1 Get Provinces
**Method:** GET  
**URL:** `/v1/location/provinces`

### 5.2 Get Wards by Province
**Method:** GET  
**URL:** `/v1/location/provinces/{code}/wards`

### 5.3 Get My Shipping Addresses
**Method:** GET  
**URL:** `/v1/user/me/shipping-addresses`  
**Auth:** Required

### 5.4 Create Shipping Address
**Method:** POST  
**URL:** `/v1/user/me/shipping-addresses`  
**Auth:** Required

**Request Body:**
```json
{
  "receiver_name": "John Doe",
  "receiver_phone": "+1234567890",
  "address": {
    "address_line": "123 Main Street, Apt 4B",
    "ward_id": "ward_uuid"
  },
  "is_default": true
}
```

### 5.5 Update Shipping Address
**Method:** PATCH  
**URL:** `/v1/user/me/shipping-addresses/{id}`  
**Auth:** Required

**Request Body:**
```json
{
  "receiver_name": "Jane Smith",
  "receiver_phone": "+0987654321",
  "address": {
    "address_line": "456 Oak Avenue"
  },
  "is_default": false
}
```

### 5.6 Delete Shipping Address
**Method:** DELETE  
**URL:** `/v1/user/me/shipping-addresses/{id}`  
**Auth:** Required

### 5.7 Set Default Shipping Address
**Method:** PATCH  
**URL:** `/v1/user/me/shipping-addresses/{id}/default`  
**Auth:** Required

---

## 6. SHOP ENDPOINTS

### 6.1 Public - Get Shops
**Method:** GET  
**URL:** `/v1/shop/public`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (1-100, default: 10)
- `search`: Search term (optional)

### 6.2 Public - Get Shop by Slug
**Method:** GET  
**URL:** `/v1/shop/public/{slug}`

### 6.3 Seller - Get My Shop
**Method:** GET  
**URL:** `/v1/shop/me`  
**Auth:** Required (Seller only)

### 6.4 Seller - Create Shop
**Method:** POST  
**URL:** `/v1/shop/me`  
**Auth:** Required (Seller only)

**Content-Type:** `multipart/form-data`

**Form Data:**
- `logo`: (file) Logo image (max 5MB)
- `banner`: (file) Banner image (max 5MB)
- `name`: Shop name
- `description`: Shop description
- `address`: Shop address JSON

**Request Body (JSON part):**
```json
{
  "name": "My Shop",
  "description": "Shop description",
  "address": {
    "address_line": "123 Shop Street",
    "ward_id": "ward_uuid"
  }
}
```

### 6.5 Seller - Update Shop
**Method:** PATCH  
**URL:** `/v1/shop/me`  
**Auth:** Required (Seller only)

**Content-Type:** `multipart/form-data`

**Form Data:**
- `logo`: (file) Logo image (max 5MB, optional)
- `banner`: (file) Banner image (max 5MB, optional)
- `name`: Shop name (optional)
- `description`: Shop description (optional)
- `address`: Shop address JSON (optional)

### 6.6 Seller - Update Shop Status
**Method:** PATCH  
**URL:** `/v1/shop/me/status`  
**Auth:** Required (Seller only)

**Request Body:**
```json
{
  "status": "active"
}
```

### 6.7 Get Favorite Shops
**Method:** GET  
**URL:** `/v1/shop/favorites`  
**Auth:** Required (Customer/Seller)

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (1-100, default: 10)

### 6.8 Add Favorite Shop
**Method:** POST  
**URL:** `/v1/shop/favorites`  
**Auth:** Required (Customer/Seller)

**Request Body:**
```json
{
  "shop_id": "shop_uuid"
}
```

### 6.9 Remove Favorite Shop
**Method:** DELETE  
**URL:** `/v1/shop/favorites/{shopId}`  
**Auth:** Required (Customer/Seller)

### 6.10 Admin - Get Shops
**Method:** GET  
**URL:** `/v1/shop/admin`  
**Auth:** Required (Admin only)

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (1-100, default: 10)
- `search`: Search term (optional)
- `status`: Shop status filter (optional)

### 6.11 Admin - Get Featured Shops
**Method:** GET  
**URL:** `/v1/shop/admin/featured`  
**Auth:** Required (Admin only)

### 6.12 Admin - Get Shop Details
**Method:** GET  
**URL:** `/v1/shop/admin/{id}`  
**Auth:** Required (Admin only)

### 6.13 Admin - Update Shop Status
**Method:** PATCH  
**URL:** `/v1/shop/admin/{id}/status`  
**Auth:** Required (Admin only)

**Request Body:**
```json
{
  "status": "active"
}
```

### 6.14 Admin - Update Shop Feature Status
**Method:** PATCH  
**URL:** `/v1/shop/admin/{id}/feature`  
**Auth:** Required (Admin only)

**Request Body:**
```json
{
  "is_featured": true
}
```

### 6.15 Admin - Delete Shop
**Method:** DELETE  
**URL:** `/v1/shop/admin/{id}`  
**Auth:** Required (Admin only)

---

## 7. CART ENDPOINTS

### 7.1 Add Item to Cart
**Method:** POST  
**URL:** `/v1/cart`  
**Auth:** Required

**Request Body:**
```json
{
  "product_stock_id": "stock_uuid",
  "quantity": 2
}
```

### 7.2 Update Cart Item Quantity
**Method:** PUT  
**URL:** `/v1/cart/{id}`  
**Auth:** Required

**Request Body:**
```json
{
  "quantity": 3
}
```

### 7.3 Increase Cart Item Quantity
**Method:** PATCH  
**URL:** `/v1/cart/{id}/increase`  
**Auth:** Required

### 7.4 Decrease Cart Item Quantity
**Method:** PATCH  
**URL:** `/v1/cart/{id}/decrease`  
**Auth:** Required

### 7.5 Remove Item from Cart
**Method:** DELETE  
**URL:** `/v1/cart/{id}`  
**Auth:** Required

### 7.6 Clear Cart
**Method:** DELETE  
**URL:** `/v1/cart`  
**Auth:** Required

### 7.7 Get Cart
**Method:** GET  
**URL:** `/v1/cart`  
**Auth:** Required

### 7.8 Get Cart Summary
**Method:** GET  
**URL:** `/v1/cart/summary`  
**Auth:** Required

---

## 8. ORDER ENDPOINTS

### 8.1 Customer - Create Order
**Method:** POST  
**URL:** `/v1/orders`  
**Auth:** Required (Customer only)

**Request Body:**
```json
{
  "items": [
    {
      "product_stock_id": "stock_uuid",
      "quantity": 2
    }
  ],
  "shipping_address_id": "shipping_address_uuid"
}
```

### 8.2 Customer - Get My Orders
**Method:** GET  
**URL:** `/v1/user/me/orders`  
**Auth:** Required (Customer only)

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (1-100, default: 10)
- `status`: Order status filter (optional)

### 8.3 Customer - Get My Order Details
**Method:** GET  
**URL:** `/v1/user/me/orders/{id}`  
**Auth:** Required (Customer only)

### 8.4 Customer - Cancel Order
**Method:** PATCH  
**URL:** `/v1/user/me/orders/{id}/cancel`  
**Auth:** Required (Customer only)

### 8.5 Customer - Confirm Order Received
**Method:** PATCH  
**URL:** `/v1/user/me/orders/{id}/confirm-received`  
**Auth:** Required (Customer only)

### 8.6 Customer - Get Order Status History
**Method:** GET  
**URL:** `/v1/user/me/orders/{id}/status-history`  
**Auth:** Required (Customer only)

### 8.7 Seller - Get Orders
**Method:** GET  
**URL:** `/v1/user/seller/me/orders`  
**Auth:** Required (Seller only)

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (1-100, default: 10)
- `status`: Order status filter (optional)

### 8.8 Seller - Get Order Details
**Method:** GET  
**URL:** `/v1/user/seller/me/orders/{id}`  
**Auth:** Required (Seller only)

### 8.9 Seller - Confirm Order
**Method:** PATCH  
**URL:** `/v1/user/seller/me/orders/{id}/confirm`  
**Auth:** Required (Seller only)

### 8.10 Seller - Reject Order
**Method:** PATCH  
**URL:** `/v1/user/seller/me/orders/{id}/reject`  
**Auth:** Required (Seller only)

**Request Body:**
```json
{
  "rejection_reason": "Out of stock"
}
```

### 8.11 Seller - Update Delivery Status
**Method:** PATCH  
**URL:** `/v1/user/seller/me/orders/{id}/status`  
**Auth:** Required (Seller only)

**Request Body:**
```json
{
  "delivery_status": "shipped"
}
```

### 8.12 Admin - Get Orders
**Method:** GET  
**URL:** `/v1/user/admin/orders`  
**Auth:** Required (Admin only)

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (1-100, default: 10)
- `status`: Order status filter (optional)
- `customer_id`: Customer UUID filter (optional)
- `seller_id`: Seller UUID filter (optional)

### 8.13 Admin - Get Order Details
**Method:** GET  
**URL:** `/v1/user/admin/orders/{id}`  
**Auth:** Required (Admin only)

### 8.14 Admin - Update Order Status
**Method:** PATCH  
**URL:** `/v1/user/admin/orders/{id}/status`  
**Auth:** Required (Admin only)

**Request Body:**
```json
{
  "status": "processing"
}
```

### 8.15 Admin - Get Order Status History
**Method:** GET  
**URL:** `/v1/user/admin/orders/{id}/status-history`  
**Auth:** Required (Admin only)

### 8.16 Admin - Get Order Statistics
**Method:** GET  
**URL:** `/v1/user/admin/orders/stats`  
**Auth:** Required (Admin only)

### 8.17 Admin - Refund Order
**Method:** POST  
**URL:** `/v1/user/admin/orders/{id}/refund`  
**Auth:** Required (Admin only)

---

## 9. SHIPMENT ENDPOINTS

### 9.1 Admin - Create Shipment
**Method:** POST  
**URL:** `/v1/shipments`  
**Auth:** Required (Admin only)

**Request Body:**
```json
{
  "order_id": "order_uuid",
  "tracking_number": "TRACK123456",
  "carrier": "GHN",
  "estimated_delivery": "2024-01-15T10:00:00Z"
}
```

### 9.2 Admin - Get Shipment Details
**Method:** GET  
**URL:** `/v1/shipments/{id}`  
**Auth:** Required (Admin only)

### 9.3 Admin - Get Shipments by Order
**Method:** GET  
**URL:** `/v1/orders/{id}/shipments`  
**Auth:** Required (Admin only)

### 9.4 Admin - Update Shipment Status
**Method:** PATCH  
**URL:** `/v1/shipments/{id}/status`  
**Auth:** Required (Admin only)

**Request Body:**
```json
{
  "status": "in_transit"
}
```

### 9.5 Admin - Get Shipping Rates
**Method:** GET  
**URL:** `/v1/shipping-rates`  
**Auth:** Required (Admin only)

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (1-100, default: 10)

### 9.6 Admin - Get Shipping Rate Details
**Method:** GET  
**URL:** `/v1/shipping-rates/{id}`  
**Auth:** Required (Admin only)

### 9.7 Admin - Update Shipping Rate
**Method:** PATCH  
**URL:** `/v1/shipping-rates/{id}`  
**Auth:** Required (Admin only)

**Request Body:**
```json
{
  "base_rate": 25000,
  "rate_per_kg": 5000,
  "estimated_days": 3
}
```

---

## 10. SYSTEM ENDPOINTS

### 8.1 Welcome Message
**Method:** GET  
**URL:** `/`

### 8.2 Test Success Response
**Method:** GET  
**URL:** `/test/success`

### 8.3 Test Created Response
**Method:** GET  
**URL:** `/test/created`

### 8.4 Test Error Response
**Method:** GET  
**URL:** `/test/error`

### 8.5 Test PostgreSQL Connection
**Method:** GET  
**URL:** `/test/postgres`

### 8.6 Test Redis Connection
**Method:** GET  
**URL:** `/test/redis`

---

## Common Response Format

### Success Response
```json
{
  "code": 200,
  "message": "Success",
  "data": {...},
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "total_pages": 10
  }
}
```

### Error Response
```json
{
  "code": 422,
  "message": "validation:failed",
  "errors": [
    {
      "field": "email",
      "message": "required"
    }
  ]
}
```

## Notes

1. **Base URL:** `https://api.hiki.io.vn` (Production)
2. All datetime fields are returned in ISO 8601 format
3. UUIDs are used for most entity identifiers
4. File uploads have a 5MB limit unless specified otherwise
5. Pagination starts from page 1
6. Use the access token for authenticated requests
7. Refresh tokens can be used to get new access tokens
8. Password minimum length is 6 characters
9. Product names must be at least 10 characters long
10. Product prices must be at least 1000 (currency units)
11. All authenticated endpoints require a valid JWT token in the Authorization header
12. Product endpoint example: `https://api.hiki.io.vn/v1/products?page=1&limit=10&sort=price_desc`
13. Shop endpoints support logo and banner image uploads
14. Cart endpoints require authentication and manage user shopping carts
15. Redis caching is applied to public shop endpoints (300s cache)
