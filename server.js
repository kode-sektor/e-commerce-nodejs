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
    let name = (req.body["login-name"]).trim();
    let password = req.body["password"];

    // Create object to hold errors
    let errors = {};
    let loginVals = {};

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
            errorClass : {active: "active"}
        });
    }   

    // Otherwise redirect (and reload) Home page
     else {
       // res.redirect("/");  // redirect to homepage
                            // Place this in the .then() container from Twilo's API
    }

});

app.post("/create-acct", (req, res) => {

    // Create object to hold errors
    /*
    What errors object will eventually look like: 
    errors = {
        null : {firstName : true, lastName : true}
        regex : {accountPassword : 'Should be between 6 and 12 characters long'}
    }
    */
    let errors = {
        null : {},
        regex : {}
    };
    let loginVals = {};
    
    console.log(req.body["first-name"]);

    let firstName = (req.body["first-name"]).trim().toLowerCase();
    let lastName = (req.body["last-name"]).trim().toLowerCase();
    let email = (req.body["email"]).trim();
    let accountPassword = (req.body["account-password"]).trim();

    const regexMail = new RegExp(/^[\w-]+(\.[\w-]+)@([\w-]+\.)+[a-zA-Z]+$/);
    const regexLettersNos = new RegExp(/[A-za-z0–9_]/);

    console.log(firstName);

    // Stage 1: Check for nulls

    (firstName == "") ? errors.null.firstName = true : loginVals.firstName = firstName;
    (lastName == "") ? errors.null.lastName = true : loginVals.lastName = lastName;
    (email == "") ? errors.null.email = true : loginVals.email = email;
    (accountPassword == "") ? errors.null.accountPassword = true : loginVals.accountPassword = accountPassword;

    console.log(loginVals);
    console.log (errors);

    // Check Object length to see if errors

    // If errors for null values exist, re-render "index" route (which is where form exists)
    // and export errors object
    if (Object.keys(errors.null).length > 0) {
        res.render("index", {
            errors : errors.null,
            loginVals,
            errorClass : {active : "active", slide : "active"}
        });

    } else {
        // Check password length and pattern

        if (accountPassword.length < 6 || accountPassword.length > 12) {
            errors.regex.passwordLength = "Password should be between 6 and 12 characters";
        }
        if (!regexMail.test(accountPassword)) {
            errors.regex.mailRegex = "Mail address is invalid";
        }
        if (!regexLettersNos.test(accountPassword)) {
            errors.regex.accountPasswordMix = "Mix of uppercase, lowercase and nos required";
        }

        // If errors for invalid patterns exist, re-render "index" route (which is where form exists)
        // and export errors object
        if (Object.keys(errors.regex).length > 0) {
            res.render("index", {
                errors : errors.regex,
                loginVals,
                errorClass : {active : "active", slide : "active"}
            });
        } 

    }


    // Otherwise redirect (and reload) Home page
     /*else { run in console: npm i twilio
       // res.redirect("/");  // redirect to homepage
                            // Place this in the .then() container from Twilo's API
    }
*/
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`The webserver is up and running`);
});