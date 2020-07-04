const express = require("express");
const exphbs  = require('express-handlebars');

// Add body parser to process form data 
const bodyParser = require('body-parser');

const product = require("./models/product");
const catProduct = require("./models/productCategory");
const bestSeller = require("./models/bestSeller");

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static("public"));


app.use((req, res, next) => {
    
    // req holds data about a request (akin to a form's data on submission)
    // res loads a template file like from a template engine to send back
    // an HTML page etc.

    next(); // next() move on to the next middleware function
    // you dont use next() if you send back a response to the client

    // HENCE, THE ORDER IN WHICH YOU WRITE YOUR MIDDLEWARE MATTERS

    // app.use() is the priority

    // if you don't call next(), the subsequent app.get() routes will not run.

    // Just call next() to be safe
})

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.render("index", {
        title : "Home Page",
        data : bestSeller.getFeaturedProducts(),
        dataCat : catProduct.getCategProducts(),
    });

});

app.get("/productListing", (req,res) => {
    
    res.render("productListing", {
        title : "Product Listing Page",
        data : product.getNProducts(0,9)
    });

});

app.post("/login", (req, res) => {

    // Fetch login values from form
    const name = req.body["login-name"];
    const password = req.body["password"];

    // Create object to hold errors
    const errors = {};
    const loginVals = {};

    // Check if user enters nothing

    (name == "") ? errors.name = true : loginVals.name = name;

    (password == "") ? errors.password = true : loginVals.password = password;

    console.log(loginVals);
    console.log (errors);

    // Check Object length to see if errors

    // If errors exist, re-render "/" route (which is where form exists)
    // and export errors object
    if (Object.keys(errors).length > 0) {
        res.render("index", {
            errors,
            loginVals,
            errorClass : "active error"
        });
    }   

    // Otherwise redirect (and reload) Home page
     else {
       // res.redirect("/");  // redirect to homepage
                            // Place this in the .then() container from Twilo's API
    }
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`The webserver is up and running`);
});