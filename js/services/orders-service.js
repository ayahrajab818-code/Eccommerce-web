// Global reference so other files (like application.js) can call it
let ordersService;

// Service class responsible for:
// - Showing the order history page
// - Loading orders from the backend
// - Rendering orders and order details in the UI
class OrdersService {

  // Loads the main Order History page
  loadOrdersPage() {
    // Get the main content area
    const main = document.getElementById("main");

    // Clear anything currently displayed
    main.innerHTML = "";

    // Wrapper div for the page content
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("content-form");

    // Page title
    const h1 = document.createElement("h1");
    h1.innerText = "Order History";
    contentDiv.appendChild(h1);

    // Container where individual orders will be rendered
    const listDiv = document.createElement("div");
    listDiv.id = "order-list";
    contentDiv.appendChild(listDiv);

    // Add everything to the main page
    main.appendChild(contentDiv);

    // Load orders from the backend
    this.loadOrders();
  }

  // Calls the backend to get all orders for the logged-in user
  loadOrders() {
    // Orders endpoint
    const url = `${config.baseUrl}/orders`;

    // Authorization headers (JWT token)
    const headers = userService.getHeaders();

    // Make GET request to backend
    axios.get(url, { headers })
      // On success, render the orders
      .then(res => this.renderOrders(res.data))
      // On failure, show an error message
      .catch(() => {
        templateBuilder.append(
          "error",
          { error: "Failed to load orders." },
          "errors"
        );
      });
  }

  // -----------------------------
  // Helper: format date safely
  // -----------------------------
  formatDate(dateString) {
    // If no date is provided, show N/A
    if (!dateString) return "N/A";

    // Convert string to Date object
    const d = new Date(dateString);

    // If invalid date, return N/A
    return isNaN(d.getTime()) ? "N/A" : d.toLocaleString();
  }

  // -----------------------------
  // Helper: format money values
  // -----------------------------
  formatMoney(value) {
    // Convert value to a number
    const num = Number(value ?? 0);

    // If invalid number, return 0.00
    return isNaN(num) ? "0.00" : num.toFixed(2);
  }

  // -----------------------------
  // Render list of orders
  // -----------------------------
  renderOrders(orders) {
    // Get the order list container
    const listDiv = document.getElementById("order-list");

    // Clear previous content
    listDiv.innerHTML = "";

    // If no orders exist
    if (!orders || orders.length === 0) {
      listDiv.innerText = "No orders yet.";
      return;
    }

    // Loop through each order
    orders.forEach(order => {
      // Card container for one order
      const card = document.createElement("div");
      card.classList.add("order-card");

      // Order number
      const title = document.createElement("h3");
      title.innerText = `Order #${order.orderId}`;
      card.appendChild(title);

      // Order date (backend sends createdAt)
      const date = document.createElement("div");
      date.innerText = `Date: ${this.formatDate(order.createdAt)}`;
      card.appendChild(date);

      // Shipping cost
      const shipping = document.createElement("div");
      shipping.innerText = `Shipping: $${this.formatMoney(order.shippingAmount)}`;
      card.appendChild(shipping);

      // Total order amount
      const total = document.createElement("div");
      total.innerText = `Total: $${this.formatMoney(order.total)}`;
      card.appendChild(total);

      // Button to view order details
      const btn = document.createElement("button");
      btn.classList.add("btn", "btn-secondary");
      btn.innerText = "View Details";

      // Load details for this specific order
      btn.addEventListener("click", () =>
        this.loadOrderDetails(order.orderId)
      );

      card.appendChild(btn);

      // Add order card to the list
      listDiv.appendChild(card);
    });
  }

  // -----------------------------
  // Load order details by ID
  // -----------------------------
  loadOrderDetails(orderId) {
    // Endpoint for a single order
    const url = `${config.baseUrl}/orders/${orderId}`;

    // Authorization headers
    const headers = userService.getHeaders();

    // Request order details
    axios.get(url, { headers })
      .then(res => this.renderOrderDetails(res.data))
      .catch(() => {
        templateBuilder.append(
          "error",
          { error: "Failed to load order details." },
          "errors"
        );
      });
  }

  // -----------------------------
  // Render order details page
  // -----------------------------
  renderOrderDetails(order) {
    // Clear main page
    const main = document.getElementById("main");
    main.innerHTML = "";

    // Wrapper div
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("content-form");

    // Page title
    const h1 = document.createElement("h1");
    h1.innerText = `Order Details (#${order.orderId})`;
    contentDiv.appendChild(h1);

    // Back button
    const backBtn = document.createElement("button");
    backBtn.classList.add("btn", "btn-secondary");
    backBtn.innerText = "Back to Orders";
    backBtn.addEventListener("click", () => this.loadOrdersPage());
    contentDiv.appendChild(backBtn);

    // Summary section
    const summary = document.createElement("div");
    summary.style.marginTop = "15px";
    summary.innerHTML = `
      <div><strong>Date:</strong> ${this.formatDate(order.createdAt)}</div>
      <div><strong>Shipping:</strong> $${this.formatMoney(order.shippingAmount)}</div>
      <div><strong>Total:</strong> $${this.formatMoney(order.total)}</div>
    `;
    contentDiv.appendChild(summary);

    // Container for order items
    const itemsDiv = document.createElement("div");
    itemsDiv.style.marginTop = "15px";

    // If order has no items
    if (!order.items || order.items.length === 0) {
      itemsDiv.innerText = "No items found for this order.";
    } else {
      // Loop through each line item
      order.items.forEach(item => {
        const row = document.createElement("div");
        row.classList.add("order-item-row");

        // Display item details
        row.innerText =
          `Product ID: ${item.productId} | Qty: ${item.quantity} | Price: $${this.formatMoney(item.salesPrice)} | Discount: $${this.formatMoney(item.discount)}`;

        itemsDiv.appendChild(row);
      });
    }

    // Add items to page
    contentDiv.appendChild(itemsDiv);

    // Add everything to main page
    main.appendChild(contentDiv);
  }
}

// Create the OrdersService once the page loads
document.addEventListener("DOMContentLoaded", () => {
  ordersService = new OrdersService();
});
