const express = require("express");
const exphbs  = require('express-handlebars');

const proudct = require("./models/product");
const product = require("./models/product");

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static("public"));

app.get("/",(req,res) => {

    res.render("index", {
        title : "Home Page",
        desc : "Description",
        data : product.getNProducts()
    });

});

app.get("/productListing",(req,res) => {
    
    res.render("productListing", {
        title : "Product Listing Page",
        data : product.getFeaturedProducts()
    });

});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`The webserver is up and running`);
});