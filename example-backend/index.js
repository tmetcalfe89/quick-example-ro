// Require in your required libraries.
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Let's set up our MongoDB collections.
// First, we need a schema, describing what kind of info is stored in this collection.
const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  brand: String,
});

// Then, we'll make the model, providing a connection between our program and that collection on the database.
const ProductModel = mongoose.model("Product", productSchema);

// Finally, we'll connect to the database itself.
// mongodb://localhost:27017/ is the "host" of the database, i.e. where it lives on the internet (in this case, on our local network).
// ourdb is the name of the database to open on that host. Feel free to use whatever name you'd like to.
mongoose.connect("mongodb://localhost:27017/ourdb");

// Let's set up the Express server.
// Create the instance of an express HTTP server "app".
const app = express();

// Middlewares
// Funny characters are turned into other funny characters. This reverses that so we can see the original message.
app.use(express.urlencoded({}));
// We frequently send JSON on the body of our requests. This parses it and puts it in request.body.
app.use(express.json());
// The browser tries to be respectful when making requests. This says any browser can send a request here.
app.use(cors());

// Get a list of all products.
// Requires no incoming information, as the list is the list.
// We still need "request" in the first slot of the parameters, so we can get to "response" which is always in the second slot.
// I've given a heads-up to anybody else reading the code that request isn't use with the _ in front of request.
app.get("/products", async function (_request, response) {
  const productList = await ProductModel.find({});
  response.json(productList);
});

// Create a new product.
// Requires the body of the request, where the client gave us the information the user submitted.
app.post("/products", async function (request, response) {
  // Create the new product from the body of the request.
  const newProduct = await ProductModel.create(request.body);
  // Send the newly created product - including the ID - back.
  response.json(newProduct);
});

// Update an existing product.
app.patch("/products/:productId", async function (request, response) {
  const productId = request.params.productId;

  const updatedProduct = await ProductModel.findByIdAndUpdate(
    productId,
    request.body,
    { new: true }
  );

  response.json(updatedProduct);
});

// Delete an existing product.
app.delete("/products/:productId", async function (request, response) {
  const productId = request.params.productId;
  await ProductModel.findByIdAndDelete(productId);
  response.sendStatus(200);
});

// To cap everything off, let's fire up our server!
// We're using a static port of 3000 here, but feel free to use whatever you need to.
// Yep, easy as that! We've already done the heavy lifting for the server above.
app.listen(3000);
