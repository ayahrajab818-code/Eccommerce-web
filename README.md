<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/f51220fe-7c80-45c5-9aed-66f26bf08e00" />





<h1 align="center">🛒 Easy Shop – E-Commerce API Capstone</h1>

<p align="center">
  <strong>Java • Spring Boot • MySQL • REST APIs</strong><br/>
  Final Capstone Project – Java Development
</p>

<hr/>

<h2>📌 Project Overview</h2>
<p>
Easy Shop is a full-featured e-commerce backend API built with Spring Boot and MySQL.
It simulates a real-world setup where the front end already exists, and the main focus is building, debugging, and extending the backend that powers an online store.

Users can browse and search products, register and log in securely, and manage a persistent shopping cart by adding items, updating quantities, and removing products. 
After checkout, the cart is converted into an order, saved in the database, and cleared automatically. Users can then view their order history and open order details to see the items purchased, quantities, pricing, discounts, and totals.
Admin users have additional access to manage categories and products. All endpoints were tested using Insomnia and verified through the provided web interface.
</p>


<hr/>

<h2>🧩 Features Implemented</h2>

<ul>
  <li>✅ User registration and login with JWT authentication</li>
  <li>✅ Role-based access control (ADMIN vs USER)</li>
  <li>✅ Category management (CRUD – Admin only)</li>
  <li>✅ Product browsing, searching, and filtering</li>
  <li>✅ Bug fixes for product search and duplication issues</li>
  <li>✅ Persistent shopping cart tied to logged-in users</li>
  <li>✅ Quantity updates and cart item removal</li>
  <li>✅ Cart persistence across sessions</li>
</ul>

<hr/>

<h2>🛠️ Technologies Used</h2>

<ul>
  <li><strong>Java</strong></li>
  <li><strong>Spring Boot</strong></li>
  <li><strong>MySQL</strong></li>
  <li><strong>JDBC</strong></li>
  <li><strong>JWT Authentication</strong></li>
  <li><strong>Insomnia</strong></li>
  <li><strong>HTML / JavaScript</strong> (provided front-end)</li>
</ul>

<hr/>

<h2>🗄️ Database Setup</h2>

<p>
The project uses a MySQL database called <code>easyshop</code>.  
The provided SQL script (<code>create_database.sql</code>) initializes:
</p>

<ul>
  <li>Users</li>
  <li>Products</li>
  <li>Categories</li>
  <li>Shopping Cart</li>
  <li>Orders and Order Line Items</li>
</ul>

<p>
Three demo users are included:
</p>

<ul>
  <li><strong>admin</strong> (ADMIN role)</li>
  <li><strong>user</strong> (USER role)</li>
  <li><strong>george</strong> (USER role)</li>
</ul>

<p><strong>Password for all demo users:</strong> <code>password</code></p>

<hr/>

<h2>🔐 Authentication</h2>
<img width="1118" height="463" alt="image" src="https://github.com/user-attachments/assets/d63f9a7c-7c67-4e88-8644-79db33c12882" />
<img width="1029" height="422" alt="image" src="https://github.com/user-attachments/assets/edd9788c-a655-4feb-a8a4-9a5a2d779b55" />
<img width="998" height="305" alt="image" src="https://github.com/user-attachments/assets/69cd28f3-0512-415b-9e03-7e93d962a169" />
<p>
Successful login returns a <strong>JWT token</strong> that must be included
as a Bearer Token for protected endpoints.
</p>

<hr/>

<h2>📂 Categories API (Phase 1)</h2>

<p>
The CategoriesController was fully implemented with role-based access control.
Only administrators are allowed to create, update, or delete categories.
</p>

<ul>
  <li>GET /categories</li>
  <li>GET /categories/{id}</li>
  <li>POST /categories (ADMIN)</li>
  <li>PUT /categories/{id} (ADMIN)</li>
  <li>DELETE /categories/{id} (ADMIN)</li>
</ul>

<hr/>

<h2>🐞 Bug Fixes (Phase 2)</h2>

<h3>✔️ Product Search Bug</h3>
<p>
Fixed incorrect filtering logic when combining category, price range,
and subcategory queries.
</p>

<h3>✔️ Product Duplication Bug</h3>
<p>
Resolved an issue where updating a product created duplicate records
instead of modifying the existing one.
</p>

<hr/>

<h2>🛒 Shopping Cart (Phase 3)</h2>

<p>
A fully functional shopping cart was implemented for logged-in users.
Cart data is persisted in the database and restored on login.
</p>

<h3>Endpoints</h3>

<ul>
  <li>GET /cart</li>
  <li>POST /cart/products/{productId}</li>
  <li>PUT /cart/products/{productId}</li>
  <li>DELETE /cart</li>
</ul>

<p>
Users can add items, update quantities, remove individual products,
or clear their entire cart.
</p>

<hr/>

<hr/>

<h2>🧾 Orders, Checkout &amp; Order History (Phase 4)</h2>

<p>
Easy Shop supports a complete checkout flow that allows authenticated users
to place orders and review their purchase history.
</p>

<p>
When a user checks out, the system:
</p>

<ul>
  <li>Creates a new order associated with the logged-in user</li>
  <li>Saves each cart item as an order line item in the database</li>
  <li>Calculates order totals from stored line items</li>
  <li>Clears the shopping cart after a successful checkout</li>
</ul>

<h3>Checkout</h3>

<p>
The checkout process converts the user’s shopping cart into a permanent order.
Each checkout creates a new order record in the database, ensuring accurate
purchase history tracking.
</p>
<img width="1899" height="470" alt="image" src="https://github.com/user-attachments/assets/0c39dc2c-e100-404d-8621-87a54b223006" />

<h3>Order History</h3>

<p>
Users can view all previous orders from the <strong>Orders</strong> page.
Each order displays:
</p>

<ul>
  <li>Order number</li>
  <li>Order date</li>
  <li>Shipping amount</li>
  <li>Total cost</li>
</ul>

<p>
Orders are sorted from newest to oldest for easy navigation.
</p>
<img width="1066" height="922" alt="image" src="https://github.com/user-attachments/assets/f84e8a9c-ef14-47d3-8e05-7f6416ea3f6c" />

<h3>Order Details</h3>

<p>
Clicking <strong>View Details</strong> on an order displays a full breakdown of
that purchase, including:
</p>

<ul>
  <li>Products included in the order</li>
  <li>Quantity per product</li>
  <li>Item pricing and discounts</li>
  <li>Final order total and shipping information</li>
</ul>

<p>
This feature mirrors real-world e-commerce platforms by allowing users
to review their purchase history at any time.
</p>
<img width="804" height="475" alt="image" src="https://github.com/user-attachments/assets/3ac5903d-e60f-4008-99dd-609d3c93a668" />


<h2>⭐ Interesting Code</h2>
<img width="1366" height="574" alt="image" src="https://github.com/user-attachments/assets/f7f9ef7e-4bc4-4a3e-b3a3-b8e1316aace8" />

<p>
This method handles deleting a category by its ID and is restricted to administrators only.
It maps to the DELETE /categories/{id} endpoint and follows REST best practices by returning a 204 No Content response when the deletion is successful.
Before deleting, the code checks whether the category exists. If the category is not found,
it returns a 404 Not Found error instead of failing silently. This ensures safe data handling, proper authorization, and clear, predictable API responses.
</p>

<hr/>

<h2>👩‍💻 Author</h2>

<p>
<strong>Ayah Rajab</strong><br/>
Java Development Capstone Project
</p>

<p>
This project demonstrates backend API design, debugging,
database interaction, and real-world application architecture.
</p>
