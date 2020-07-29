const express = require("express");
const exphbs  = require('express-handlebars');

const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

// Add body parser to process form data 
const bodyParser = require('body-parser');

// Object to hold parameters to be sent to existing pages 
// so user is not left hanging after submitting a form 
// because the form lives on every page

const app = express();


/*let addParams = {}; 
let route = '';
const senderMail = 'kayodeibiyemi92@gmail.com';

const checkNull = (key, field, errors, loginVals) => {
    (field == "") ? errors.null[`${key}`] = ' should not be empty' : loginVals[`${key}`] = field;
};*/



const product = require("./models/product");
const catProduct = require("./models/productCategory");
const bestSeller = require("./models/bestSeller");


//This loads all our environment variables from the key.env
require("dotenv").config({path:'./config/key.env'});

//import your router objects
const userRoutes = require("./controllers/Users");
const productRoutes = require("./controllers/Products");

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
    res.render("User/index", {
        title : "Home Page",
        data : bestSeller.getFeaturedProducts(),
        dataCat : catProduct.getCategProducts()
    });

});

app.get("/productListing", (req, res) => {
    
    res.render("productListing", {
        title : "Product Listing Page",
        data : product.getNProducts(0,9)
    });

});

app.get("/dashboard", (req, res) => {
    
    res.render("User/dashboard", {
        title : "Dashboard"
    });

});


app.post("/login", (req, res) => {

    // Create object to hold errors
    /*
    What errors object will eventually look like: 
    errors = {
        null : {firstName : true, lastName : true}
        regex : {accountPassword : 'Should be between 6 and 12 characters long'}
    }
    */

    // Fetch login values from form
    let name = (req.body["login-name"]).trim();
    let password = req.body["password"];

    // Create object to hold errors
    let errors = {
        null : {},
        regex : {}
    };
    let loginVals = {};
    let formValid = false;

    // Check if user enters nothing
    checkNull ("name", name, errors, loginVals);
    checkNull ("password", password, errors, loginVals);

    // Check Object length to see if errors

    // If errors for invalid patterns exist, re-render route to referring page and export errors object
    if (Object.keys(errors.null).length > 0) {
        formValid = false;

        // Consider referring page to send back to in case of errors
        let referer = req.headers.referer;  // http://localhost:3000/productListing
        // console.log ("referer : " + referer);

        referer = referer.substring(referer.lastIndexOf('/'));    // /productListing
        referer = referer.replace(/\//g, "");  // productListing

        // This is necessary because if the user submits the page once, the url becomes 
        // something like "http://localhost:3000/create-acct", meaning the next time user 
        // submits form, the referer would become 'create-acct', instead of the erstwhile 
        // url like "http://localhost:3000/productListing"
        if (referer != "login" && referer != "create-acct") { // Combine both bcos url would retain one 
                                                              // of them if user switches both forms
            route = (referer) ? referer : "index"; 
        }
        // console.log ("route : " + route);

        // Consider additional parameters to pass to depending on what route user 
        // interacts with the form 
        if (route == "index") {
            addParams = {
                title : "Home Page",
                data : bestSeller.getFeaturedProducts(),
                dataCat : catProduct.getCategProducts() 
            }  
        } else if (route == "productListing") {
           addParams = {
               title : "Product Listing Page",
               data : product.getNProducts(0,9) 
           }   
        }

        res.render(route, {
            errors : errors.null,
            loginVals,
            errorClass : {active: "active"},
            ...addParams
        });
    }   

    // Otherwise redirect (and reload) Home page
     else {
        console.log ('Login successful');
        res.redirect("dashboard");
    }

});

app.use(fileUpload());

app.use("/user", userRoutes);   // The meaning of this is, in the URL, '/user' must come first /user/register, /user/login etc.

// Pass in the connection string variable from the env variable as 1st argument
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true}
                    ).then(()=> {
                        console.log(`Connected to MongoDB Database`);
                    }).catch(()=> {
                        console.log (`Error occured when connecting to the database ${err}`);
                    });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`The webserver is up and running`);
});