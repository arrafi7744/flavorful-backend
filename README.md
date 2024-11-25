# API Documentation

## Modules Overview

This documentation outlines the API endpoints for user, shop, and product management.

---

### Module: User

#### Method: Sign Up

- **Module Code**: 1.1
- **Method Code**: 1.1.1
- **Description**: This API allows users to sign up.
- **Host server**: `http://localhost:8800`
- **Authentication**: None
- **Method**: POST
- **Path**: `/api/v1/users/crt`
- **Payload**:

  ```json
  {
     "userType":101,
     "userName":"arif",
     "userFullName":"arif",
     "userEmail":"arif@gmail.com",
     "userPass":"123456",
     "userImg":"blob",
     "phoneNumber":"132435455",
     "gender":"Male"
  }

  Use Case: User sign-up.
  Notes:
  101 = Farmer/Vendor/Shop Owner
  103 = Buyer
  109 = Admin
  Method: Sign In
  Module Code: 1.1
  Method Code: 1.1.2
  Description: This API allows users to sign in.
  Host server: http://localhost:8800
  Authentication: None
  Method: POST
  Path: /api/v1/users/login
  Payload:
  json
  Copy code
  {
   "email":"arif@gmail.com",
   "password":"123456"
  }
  Use Case: User sign-in.
  Method: Get All Users (Admin)
  Module Code: 1.1
  Method Code: 1.1.3
  Description: This API shows a list of all users for the admin panel.
  Host server: http://localhost:8800
  Authentication: None
  Method: GET
  Path: /api/v1/users/src
  Payload:
  json
  Copy code
  {}
  Use Case: Get a list of all users.
  Method: User Accept
  Module Code: 1.1
  Method Code: 1.1.4
  Description: This API accepts a user login request.
  Host server: http://localhost:8800
  Authentication: None
  Method: POST
  Path: /api/v1/users/usr/accept
  Payload:
  json
  Copy code
  {
   "userId":"6716032be8eda09d311ecf40",
   "approvalId":"6715ebf5044e50df4ce92098"
  }
  Use Case: Accept user login request.
  Method: User Reject
  Module Code: 1.1
  Method Code: 1.1.5
  Description: This API rejects a user login request.
  Host server: http://localhost:8800
  Authentication: None
  Method: POST
  Path: /api/v1/users/usr/reject
  Payload:
  json
  Copy code
  {
   "userId":"6716032be8eda09d311ecf40",
   "approvalId":"6715ebf5044e50df4ce92098"
  }
  Use Case: Reject user login request.
  Notes: approvalId is the userId of the user who processes the approval or rejection.
  Module: Shop
  Method: Create Shop
  Module Code: 1.1
  Method Code: 1.1.6
  Description: This API allows users to create shop information.
  Host server: http://localhost:8800
  Authentication: None
  Method: POST
  Path: /api/v1/shop/crt
  Payload:
  json
  Copy code
  {
   "userId":"6716032be8eda09d311ecf40",
   "shopName":"Amar Shop",
   "shopDescription":"test",
   "shopCategory":"test",
   "products":[],
   "location":{
      "address":"Test address",
      "state": "",
      "city": "",
      "country": "",
      "postalCode": ""
   }
  }
  Use Case: Create shop information.
  Method: Get All Shops
  Module Code: 1.1
  Method Code: 1.1.7
  Description: This API shows a list of all shops.
  Host server: http://localhost:8800
  Authentication: None
  Method: GET
  Path: /api/v1/shop/src/all
  Payload:
  json
  Copy code
  {}
  Use Case: Get a list of all shops.
  Method: Get Products by Shop ID
  Module Code: 1.1
  Method Code: 1.1.8
  Description: This API shows all products based on a given shop ID.
  Host server: http://localhost:8800
  Authentication: None
  Method: POST
  Path: /api/v1/shop/src/al/pdbysid
  Payload:
  json
  Copy code
  {
   "shopId":"671742a071ebadfce93dd51d"
  }
  Use Case: Get all products by shop ID.
  Module: Product
  Method: Create Product
  Module Code: 1.1
  Method Code: 1.1.9
  Description: This API allows users to create product information for a shop.
  Host server: http://localhost:8800
  Authentication: None
  Method: POST
  Path: /api/v1/shop/crt
  Payload:
  json
  Copy code
  {
   "userId":"6716032be8eda09d311ecf40",
   "shopId":"671742a071ebadfce93dd51d",
   "productName":"test",
   "productDescription":"test",
   "buyingPrice":"",
   "sellingPrice":"",
   "categoryId":"",
   "sellerId":"",
   "stockQuantity":"",
   "productThumb":"",
   "productsImg":[]
  }
  ```
