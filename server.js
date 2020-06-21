const express = require("express");
const exphbs  = require('express-handlebars');

const product = require("./models/product");
const catProduct = require("./models/productCategory");
const bestSeller = require("./models/bestSeller");

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static("public"));

app.get("/",(req,res) => {

    res.render("index", {
        title : "Home Page",
        data : bestSeller.getFeaturedProducts(),
        dataCat : catProduct.getCategProducts()
    });

});

app.get("/productListing",(req,res) => {
    
    res.render("productListing", {
        title : "Product Listing Page",
        data : product.getNProducts(0,9)
    });

});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`The webserver is up and running`);
});