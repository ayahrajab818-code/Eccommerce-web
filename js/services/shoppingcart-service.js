// Global reference so other files (like application.js) can call cartService
let cartService;

// Service class responsible for:
// - Loading the cart from the backend
// - Adding/removing/updating cart items
// - Rendering the cart page UI
// - Performing checkout (POST /orders)
class ShoppingCartService {

  // Holds cart state in memory on the front end
  cart = {
    items: [],   // array of ShoppingCartItem objects
    total: 0     // numeric total cost of all items
  };

  // Add a product to cart (or increase quantity by 1)
  // Backend capstone behavior: POST increments quantity by 1
  addToCart(productId) {
    // Build the endpoint URL using baseUrl + productId
    const url = `${config.baseUrl}/cart/products/${productId}`;

    // Get auth headers (Bearer token) so protected endpoint accepts request
    const headers = userService.getHeaders();

    // POST with empty body, include headers
    axios.post(url, {}, { headers })
      .then(response => {
        // Update local cart state from backend response
        this.setCart(response.data);

        // Update cart icon count in header
        this.updateCartDisplay();

        // Re-render cart page to show changes immediately
        this.loadCartPage();
      })
      .catch(() => {
        // Show error message in UI
        templateBuilder.append("error", { error: "Add to cart failed." }, "errors");
      });
  }

  // Takes backend cart response and converts it into the front-end cart format
  setCart(data) {
    // Reset cart state
    this.cart = { items: [], total: 0 };

    // Save total from backend response
    this.cart.total = data.total;

    // Backend returns items as an object keyed by productId
    // Convert that object into an array of items for easier rendering
    for (const [key, value] of Object.entries(data.items)) {
      this.cart.items.push(value);
    }
  }

  // Load cart data for the currently logged-in user
  loadCart() {
    // GET /cart endpoint
    const url = `${config.baseUrl}/cart`;

    // Authorization header required
    const headers = userService.getHeaders();

    // Send request
    axios.get(url, { headers })
      .then(response => {
        // Save cart response into memory
        this.setCart(response.data);

        // Update cart count in header
        this.updateCartDisplay();
      })
      .catch(() => {
        // Show error message
        templateBuilder.append("error", { error: "Load cart failed." }, "errors");
      });
  }

  // Clear entire cart for the user
  // Backend returns 204 No Content, so we cannot rely on response.data
  clearCart() {
    // DELETE /cart endpoint
    const url = `${config.baseUrl}/cart`;

    // Authorization header required
    const headers = userService.getHeaders();

    // Send request
    axios.delete(url, { headers })
      .then(() => {
        // Since 204 has no response body, reset cart manually
        this.cart = { items: [], total: 0 };

        // Update cart icon count
        this.updateCartDisplay();

        // Re-render cart page to show empty cart
        this.loadCartPage();
      })
      .catch(() => {
        // Show error message
        templateBuilder.append("error", { error: "Empty cart failed." }, "errors");
      });
  }

  // Checkout the cart: POST /orders (no body required)
  // Backend creates order + clears cart
  checkout() {
    // POST /orders endpoint
    const url = `${config.baseUrl}/orders`;

    // Authorization header required
    const headers = userService.getHeaders();

    // Send request (empty body)
    axios.post(url, {}, { headers })
      .then(() => {
        // Simple user feedback
        alert("Order placed successfully!");

        // Backend should clear cart after checkout, so reload cart from server
        this.loadCart();

        // Re-render cart page to show empty cart
        this.loadCartPage();
      })
      .catch(() => {
        // Show error message
        templateBuilder.append("error", { error: "Checkout failed." }, "errors");
      });
  }

  // Find a cart item in memory by productId
  getCartItem(productId) {
    // Each item has item.product.productId, so find match
    return this.cart.items.find(i => i.product?.productId === productId);
  }

  // Set the quantity of a product using PUT
  // Body format: { "quantity": X }
  setQty(productId, newQty) {
    // PUT /cart/products/{productId}
    const url = `${config.baseUrl}/cart/products/${productId}`;

    // Authorization header required
    const headers = userService.getHeaders();

    // Send request to update quantity
    return axios.put(url, { quantity: newQty }, { headers })
      .then(response => {
        // Update cart state from backend
        this.setCart(response.data);

        // Update cart icon count
        this.updateCartDisplay();

        // Re-render cart page to show changes
        this.loadCartPage();
      })
      .catch(() => {
        // Show error message
        templateBuilder.append("error", { error: "Update quantity failed." }, "errors");
      });
  }

  // Increase quantity by 1
  increaseQty(productId) {
    // Reuse POST behavior (increments by 1)
    this.addToCart(productId);
  }

  // Decrease quantity by 1
  // If quantity becomes 0, remove the item
  decreaseQty(productId) {
    // Find the item in local cart state
    const item = this.getCartItem(productId);

    // If item not found, do nothing
    if (!item) return;

    // Compute the new quantity
    const newQty = item.quantity - 1;

    // If 0 or less, remove item from cart
    if (newQty <= 0) {
      return this.removeItem(productId);
    }

    // Otherwise update quantity to the new value
    return this.setQty(productId, newQty);
  }

  // Remove a product from cart
  // This implementation uses setQty(productId, 0)
  removeItem(productId) {
    return this.setQty(productId, 0);
  }

  // Build and render the cart page UI
  loadCartPage() {
    // Main content container
    const main = document.getElementById("main");

    // Clear whatever was previously displayed
    main.innerHTML = "";

    // Filter box placeholder (matches existing page layout)
    let div = document.createElement("div");
    div.classList = "filter-box";
    main.appendChild(div);

    // Container where cart items will be shown
    const contentDiv = document.createElement("div");
    contentDiv.id = "content";
    contentDiv.classList.add("content-form");

    // Header row for cart title + buttons
    const cartHeader = document.createElement("div");
    cartHeader.classList.add("cart-header");

    // Cart title
    const h1 = document.createElement("h1");
    h1.innerText = "Cart";
    cartHeader.appendChild(h1);

    // Clear button to empty cart
    const button = document.createElement("button");
    button.classList.add("btn", "btn-danger");
    button.innerText = "Clear";

    // Use arrow function so "this" still refers to ShoppingCartService
    button.addEventListener("click", () => this.clearCart());
    cartHeader.appendChild(button);

    // Checkout button to place order
    const checkoutBtn = document.createElement("button");
    checkoutBtn.classList.add("btn", "btn-primary");
    checkoutBtn.innerText = "Checkout";

    // Call checkout() when clicked
    checkoutBtn.addEventListener("click", () => this.checkout());
    cartHeader.appendChild(checkoutBtn);

    // Add header into content
    contentDiv.appendChild(cartHeader);

    // Add content container into main page
    main.appendChild(contentDiv);

    // Render each cart item
    this.cart.items.forEach(item => {
      this.buildItem(item, contentDiv);
    });

    // Display the cart total at bottom
    const totalDiv = document.createElement("div");
    totalDiv.classList.add("cart-total");

    // Show total with 2 decimals
    totalDiv.innerText = `Total: $${this.cart.total.toFixed(2)}`;
    contentDiv.appendChild(totalDiv);
  }

  // Build UI for a single cart item row/card
  buildItem(item, parent) {
    // Outer container for item
    let outerDiv = document.createElement("div");
    outerDiv.classList.add("cart-item");

    // Container for name text
    let div = document.createElement("div");
    outerDiv.appendChild(div);

    // Product name
    let h4 = document.createElement("h4");
    h4.innerText = item.product.name;
    div.appendChild(h4);

    // Container for photo + price
    let photoDiv = document.createElement("div");
    photoDiv.classList.add("photo");

    // Product image
    let img = document.createElement("img");

    // Image path based on backend imageUrl field
    img.src = `/images/products/${item.product.imageUrl}`;

    // Clicking image opens the image detail form
    img.addEventListener("click", () => {
      showImageDetailForm(item.product.name, img.src);
    });

    photoDiv.appendChild(img);

    // Product price label
    let priceH4 = document.createElement("h4");
    priceH4.classList.add("price");
    priceH4.innerText = `$${item.product.price}`;
    photoDiv.appendChild(priceH4);

    // Add photo section into item
    outerDiv.appendChild(photoDiv);

    // Product description
    let descriptionDiv = document.createElement("div");
    descriptionDiv.innerText = item.product.description;
    outerDiv.appendChild(descriptionDiv);

    // Quantity controls container
    let qtyDiv = document.createElement("div");
    qtyDiv.classList.add("qty-controls");

    // Minus button decreases quantity
    let minusBtn = document.createElement("button");
    minusBtn.innerText = "-";
    minusBtn.addEventListener("click", () =>
      this.decreaseQty(item.product.productId)
    );
    qtyDiv.appendChild(minusBtn);

    // Quantity display text
    let qtyText = document.createElement("span");
    qtyText.innerText = ` ${item.quantity} `;
    qtyDiv.appendChild(qtyText);

    // Plus button increases quantity
    let plusBtn = document.createElement("button");
    plusBtn.innerText = "+";
    plusBtn.addEventListener("click", () =>
      this.increaseQty(item.product.productId)
    );
    qtyDiv.appendChild(plusBtn);

    // Remove button removes item from cart
    let removeBtn = document.createElement("button");
    removeBtn.innerText = "Remove";
    removeBtn.classList.add("btn", "btn-danger");
    removeBtn.addEventListener("click", () =>
      this.removeItem(item.product.productId)
    );
    qtyDiv.appendChild(removeBtn);

    // Add qty controls to outer item container
    outerDiv.appendChild(qtyDiv);

    // Append item to parent container
    parent.appendChild(outerDiv);
  }

  // Updates cart item count in header (the cart icon bubble)
  updateCartDisplay() {
    try {
      // Count items by how many distinct products are in the cart
      const itemCount = this.cart.items.length;

      // Header element that shows cart count
      const cartControl = document.getElementById("cart-items");

      // Update UI
      cartControl.innerText = itemCount;
    } catch (e) {
      // Ignore errors if the element isn't on the current page
    }
  }
}

// Create ONE instance when the page finishes loading
document.addEventListener("DOMContentLoaded", () => {
  // Assign the global variable to a new service instance
  cartService = new ShoppingCartService();

  // Only load cart if user is logged in (protected endpoint)
  if (userService.isLoggedIn()) {
    cartService.loadCart();
  }
});
