let cartService;

class ShoppingCartService {

  cart = {
    items: [],
    total: 0
  };
// FIXED: added auth headers so the backend accepts the request
  addToCart(productId) {
    const url = `${config.baseUrl}/cart/products/${productId}`;
    const headers = userService.getHeaders();// sends logged-in user token

    axios.post(url, {}, { headers })
      .then(response => {
        this.setCart(response.data);
        this.updateCartDisplay();
        this.loadCartPage(); // optional, but helps refresh page immediately
      })
      .catch(() => {
        templateBuilder.append("error", { error: "Add to cart failed." }, "errors");
      });
  }

  setCart(data) {
    this.cart = { items: [], total: 0 };

    this.cart.total = data.total;

    for (const [key, value] of Object.entries(data.items)) {
      this.cart.items.push(value);
    }
  }
// FIXED: added auth headers so cart can be loaded securely
  loadCart() {
    const url = `${config.baseUrl}/cart`;
    const headers = userService.getHeaders();// required for protected endpoint

    axios.get(url, { headers })
      .then(response => {
        this.setCart(response.data);
        this.updateCartDisplay();
      })
      .catch(() => {
        templateBuilder.append("error", { error: "Load cart failed." }, "errors");
      });
  }

   //  FIXED: handles DELETE /cart returning 204 No Content
    // 204 means the request succeeded, but there is NO response body
  clearCart() {
    const url = `${config.baseUrl}/cart`;
    const headers = userService.getHeaders();// authenticate delete request

    axios.delete(url, { headers })
      .then(() => {
        // Since 204 has no response data, we manually reset the cart
        this.cart = { items: [], total: 0 };
        // Update the cart icon count
        this.updateCartDisplay();
        this.loadCartPage(); // refresh cart UI to show empty
      })
      .catch(() => {
        templateBuilder.append("error", { error: "Empty cart failed." }, "errors");
      });
  }

  loadCartPage() {
    const main = document.getElementById("main");
    main.innerHTML = "";

    let div = document.createElement("div");
    div.classList = "filter-box";
    main.appendChild(div);

    const contentDiv = document.createElement("div");
    contentDiv.id = "content";
    contentDiv.classList.add("content-form");

    const cartHeader = document.createElement("div");
    cartHeader.classList.add("cart-header");

    const h1 = document.createElement("h1");
    h1.innerText = "Cart";
    cartHeader.appendChild(h1);

    // FIXED: button now correctly calls this.clearCart()
    const button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-danger");
    button.innerText = "Clear";
    button.addEventListener("click", () => this.clearCart());
    cartHeader.appendChild(button);

    contentDiv.appendChild(cartHeader);
    main.appendChild(contentDiv);

    this.cart.items.forEach(item => {
      this.buildItem(item, contentDiv);
    });
  }

  buildItem(item, parent) {
    let outerDiv = document.createElement("div");
    outerDiv.classList.add("cart-item");

    let div = document.createElement("div");
    outerDiv.appendChild(div);

    let h4 = document.createElement("h4");
    h4.innerText = item.product.name;
    div.appendChild(h4);

    let photoDiv = document.createElement("div");
    photoDiv.classList.add("photo");

    let img = document.createElement("img");
    img.src = `/images/products/${item.product.imageUrl}`;
    img.addEventListener("click", () => {
      showImageDetailForm(item.product.name, img.src);
    });
    photoDiv.appendChild(img);

    let priceH4 = document.createElement("h4");
    priceH4.classList.add("price");
    priceH4.innerText = `$${item.product.price}`;
    photoDiv.appendChild(priceH4);

    outerDiv.appendChild(photoDiv);

    let descriptionDiv = document.createElement("div");
    descriptionDiv.innerText = item.product.description;
    outerDiv.appendChild(descriptionDiv);

    let quantityDiv = document.createElement("div");
    quantityDiv.innerText = `Quantity: ${item.quantity}`;
    outerDiv.appendChild(quantityDiv);

    parent.appendChild(outerDiv);
  }

  updateCartDisplay() {
    try {
      const itemCount = this.cart.items.length;
      const cartControl = document.getElementById("cart-items");
      cartControl.innerText = itemCount;
    } catch (e) {
      // ignore if element not on page
    }
  }
}
// FIXED: create ONE global cartService instance when the page loads
document.addEventListener("DOMContentLoaded", () => {
  cartService = new ShoppingCartService();

// Only load cart if user is logged in
  if (userService.isLoggedIn()) {
    cartService.loadCart();
  }
});
