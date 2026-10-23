const API_URL = "/api/products";

    const form = document.getElementById("productForm");
    const table = document.getElementById("productTable");
    const message = document.getElementById("message");
    const submitButton = document.getElementById("submitButton");

    function showMessage(text, type) {
      message.textContent = text;
      message.className = type;
    }

    function formatPrice(price) {
      return Number(price).toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP"
      });
    }

    async function loadProducts() {
      table.replaceChildren();

      try {
        const response = await fetch(API_URL);
      
        
        if (!response.ok) {
          throw new Error("Failed to load products.");
        }
    

        //const products = await response.json();
        /**
        if (!products.length) {
          const row = table.insertRow();
          const cell = row.insertCell();
          cell.colSpan = 3;
          cell.textContent = "No products found.";
          return;
        }

        products.forEach(product => {
          const row = table.insertRow();

          // textContent prevents product names from being
          // interpreted as HTML.
          [product.id, product.name, formatPrice(product.price)]
            .forEach(value => {
              const cell = row.insertCell();
              cell.textContent = value;
            });
        });
        */
      } catch (error) {
        const row = table.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 3;
        cell.textContent = error.message;
      }
    }

    form.addEventListener("submit", async event => {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const price = document.getElementById("price").value;

      if (!name || price === "" ||
          !Number.isFinite(Number(price)) ||
          Number(price) < 0) {
        showMessage("Enter a valid name and price.", "error");
        return;
      }

      submitButton.disabled = true;

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            price: Number(price)
          })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Could not add product.");
        }

        form.reset();
        showMessage("Product added successfully!", "success");
        await loadProducts();
      } catch (error) {
        showMessage(error.message, "error");
      } finally {
        submitButton.disabled = false;
      }
    });

    loadProducts();