require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors'); // <-- Import the cors package
const app = express();


app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running smoothly' });
});
// Serve the frontend locally (Vercel serves public/ automatically in production)
//if (process.env.NODE_ENV !== 'production') {
  app.use(express.static(path.join(__dirname, '..', 'public')));
//}

// Hardcoded product data
const products = [
    {
      id: 1,
      name: "Laptop",
      price: 35000
    },
    {
      id: 2,
      name: "Keyboard",
      price: 1500
    },
    {
      id: 3,
      name: "Mouse",
      price: 750
    }
  ];




// 1. 
app.get('/api/products', async (req, res) => {

    try {
        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/products
app.post("/api/products", (req, res) => {
  try {
    const { name, price } = req.body || {};

    if (
      typeof name !== "string" ||
      !name.trim() ||
      price === undefined ||
      price === null ||
      price === ""
    ) {
      return res.status(400).json({
        error: "Name and price are required"
      });
    }
  
    const createdProduct = {
      id: products.length
        ? Math.max(...products.map(product => product.id)) + 1
        : 1,
      name: name.trim(),
      price
    };
  
    products.push(createdProduct);
  
    return res.status(201).json(createdProduct);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Locally you need to listen; on Vercel this is ignored
if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => console.log('Local server on http://localhost:3000'));
}
module.exports = app;