// Pal Grocery AI Assistant & Forecasting Engine

class KiranaAIEngine {
  constructor() {
    this.botWelcomeMessage = "Namaste! I am your smart Kirana Assistant. You can ask me questions about products or type actions like adding items to basket.";
  }

  // Parse customer query on storefront and perform actions
  processCustomerQuery(query) {
    const q = query.toLowerCase().trim();
    let responseText = "";
    let actionTriggered = null; // { type: 'add_to_cart'/'filter_catalog'/'search', data: ... }

    // 1. Check for Add to Basket intent
    // e.g. "add 2 Shimla apples" or "add milk"
    if (q.includes("add") || q.includes("put") || q.includes("buy")) {
      // Extract number if any
      const numMatch = q.match(/\b\d+\b/);
      const quantity = numMatch ? parseInt(numMatch[0]) : 1;
      
      // Try to find matching product
      let matchedProduct = null;
      for (const prod of window.PRODUCTS) {
        // Splitting words and matching
        const prodWords = prod.name.toLowerCase().split(" ");
        const matchedWordCount = prodWords.filter(word => q.includes(word)).length;
        if (matchedWordCount >= 2 || (q.includes("milk") && prod.id === "prod-4") || (q.includes("apple") && prod.id === "prod-1") || (q.includes("butter") && prod.id === "prod-3") || (q.includes("banana") && prod.id === "prod-2")) {
          matchedProduct = prod;
          break;
        }
      }

      if (matchedProduct) {
        actionTriggered = {
          type: "add_to_cart",
          productId: matchedProduct.id,
          qty: quantity
        };
        responseText = `Added ${quantity}x **${matchedProduct.name}** to your basket. Let me know if you need anything else!`;
      } else {
        responseText = "I couldn't find that specific item in our database. Can you try specifying the product name more clearly? (e.g., 'Shimla apples' or 'Amul butter')";
      }
    }
    // 2. Check for Filter categories intent
    else if (q.includes("fruit") || q.includes("banana") || q.includes("apple")) {
      actionTriggered = { type: "filter_catalog", category: "fruits" };
      responseText = "Showing our fresh Fruits catalog. Everything is direct from local farms!";
    }
    else if (q.includes("dairy") || q.includes("milk") || q.includes("butter") || q.includes("egg") || q.includes("cheese")) {
      actionTriggered = { type: "filter_catalog", category: "dairy" };
      responseText = "Showing our Dairy & Eggs collection. Fresh milk, premium butter, and country eggs.";
    }
    else if (q.includes("snack") || q.includes("chips") || q.includes("chocolates") || q.includes("biscuit") || q.includes("bhujia")) {
      actionTriggered = { type: "filter_catalog", category: "snacks" };
      responseText = "Here are our crispy snacks and chocolates. Perfect for tea time!";
    }
    else if (q.includes("grocery") || q.includes("rice") || q.includes("atta") || q.includes("oil") || q.includes("salt")) {
      actionTriggered = { type: "filter_catalog", category: "groceries" };
      responseText = "Showing essential kitchen groceries like premium Basmati rice, chakki atta, and pure mustard oil.";
    }
    else if (q.includes("beverage") || q.includes("drink") || q.includes("cola") || q.includes("coffee") || q.includes("juice")) {
      actionTriggered = { type: "filter_catalog", category: "beverages" };
      responseText = "Filtered catalog to refreshing Beverages. Chilled soft drinks, instant Nescafe, and fruit juices.";
    }
    // 3. Search catalog search queries
    else if (q.includes("search") || q.includes("find") || q.includes("show me")) {
      const searchTerms = q.replace(/search|find|show me/g, "").trim();
      if (searchTerms.length > 1) {
        actionTriggered = { type: "search", term: searchTerms };
        responseText = `Filtering product list for "${searchTerms}". Let's see what we have!`;
      } else {
        responseText = "What would you like me to search for? Try typing 'search Nescafe'.";
      }
    }
    // 4. Deals and Offers
    else if (q.includes("offer") || q.includes("discount") || q.includes("coupon") || q.includes("sale")) {
      responseText = "At Pal Grocery, all items are directly priced at original, transparent, and fair prices without any hidden markups or complicated coupon codes!";
    }
    // 5. Loyalty Points check
    else if (q.includes("loyalty") || q.includes("point") || q.includes("reward") || q.includes("member")) {
      if (window.state && window.state.user) {
        const points = window.state.user.loyaltyPoints;
        const tier = window.state.user.loyaltyTier;
        responseText = `You are a valued **${tier} Member**! You currently have **${points} reward points** which can be redeemed at checkout (1 point = ₹1).`;
      } else {
        responseText = "You are currently browsing as a guest. Please sign in to check your loyalty points and member status!";
      }
    }
    // 6. Default pleasant responses
    else if (q.includes("hello") || q.includes("hi") || q.includes("namaste") || q.includes("hey")) {
      responseText = "Namaste! How can I assist you with your grocery shopping today? Feel free to ask about products, deals, or add items directly to your cart.";
    }
    else if (q.includes("thank")) {
      responseText = "You're welcome! Happy shopping at Pal Grocery. Let me know if you need anything else!";
    }
    else {
      responseText = "I'm still learning! I can help you search for items, filter categories, apply discounts, or add products directly to your cart. Try typing: *'Add 2 full cream milk'* or *'show me fruits'*";
    }

    return { responseText, actionTriggered };
  }

  // AI restocking prediction logic for Admin Dashboard
  generateRestockPredictions(products) {
    const insights = [];
    
    products.forEach(p => {
      // Calculate risk thresholds
      const isLowStock = p.stock <= 10;
      const isNearExpiry = this.checkDaysRemaining(p.expiryDate) <= 5 && this.checkDaysRemaining(p.expiryDate) >= 0;
      const isExpired = this.checkDaysRemaining(p.expiryDate) < 0;

      if (isExpired) {
        insights.push({
          productId: p.id,
          name: p.name,
          type: "danger",
          title: "EXPIRED ITEM",
          message: `Discard immediate. Expired on ${p.expiryDate}. Current stock: ${p.stock} units.`,
          action: "Write off Stock"
        });
      } else if (isNearExpiry) {
        insights.push({
          productId: p.id,
          name: p.name,
          type: "warning",
          title: "EXPIRY DANGER",
          message: `Expires in ${this.checkDaysRemaining(p.expiryDate)} days (${p.expiryDate}). Run flash sale discount!`,
          action: "Apply Flash Discount"
        });
      }

      if (isLowStock && !isExpired) {
        // Simulating run rates
        const estimatedDaysLeft = Math.max(1, Math.round(p.stock / 2.5));
        const suggestedRestock = Math.max(20, (50 - p.stock));
        insights.push({
          productId: p.id,
          name: p.name,
          type: isLowStock && p.stock < 5 ? "danger" : "warning",
          title: "RESTOCK PREDICTION",
          message: `Stock level (${p.stock} units) critically low. Depletion expected in ${estimatedDaysLeft} days.`,
          action: `Order +${suggestedRestock} from ${p.supplier}`
        });
      }
    });

    // Add generic sales predictive trend based on current day
    const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    insights.push({
      productId: "system-insight",
      name: "Weekend Rush Forecast",
      type: "info",
      title: "PREDICTIVE ANOMALY",
      message: `System forecasts a 25% increase in Dairy and Snack categories for this upcoming weekend. Ready stock recommendations generated.`,
      action: "Pre-approve Orders"
    });

    return insights;
  }

  checkDaysRemaining(dateStr) {
    const expiry = new Date(dateStr);
    const today = new Date();
    // Normalize to dates
    expiry.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}

// Global Export
window.aiEngine = new KiranaAIEngine();
