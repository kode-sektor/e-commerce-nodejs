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
        dataCat : catProduct.getCategProducts()
    });

});

app.get("/productListing", (req,res) => {
    
    res.render("productListing", {
        title : "Product Listing Page",
        data : product.getNProducts(0,9)
    });

});

let addParams = {}; // Object to hold parameters to be sent to existing pages 
                    // so user is not left hanging after submitting a form 
                    // because the form lives on every page
let route = '';
const checkNull = (key, field, errors, loginVals) => {
    (field == "") ? errors.null[`${key}`] = ' should not be empty' : loginVals[`${key}`] = field;
};

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
    if (Object.keys(errors).length > 0) {
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
    let formValid = false;
    
    let firstName = (req.body["first-name"]).trim().toLowerCase();
    let lastName = (req.body["last-name"]).trim().toLowerCase();
    let email = (req.body["email"]).trim();
    let accountPassword = (req.body["account-password"]).trim();

    const regexMail = new RegExp(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9-.]+/);
    const regexLettersNos = new RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/);


    // Stage 1: Check for nulls
    const checkLength = (key, field, msg) => {
        if (field.length < 6 || field.length > 12) {
            errors.regex[`${key}`] = msg;
        }
    }

    const checkRegexMail = (key, field, pattern, msg) => {
        if (!pattern.test(field)) {
            errors.regex[`${key}`] = msg;
        }
    }

    const checkRegexLettersNos = (key, field, pattern, msg) => {
        if (!pattern.test(field)) {
            errors.regex[`${key}`] = msg;
        }
    }

    checkNull ("firstName", firstName, errors, loginVals);
    checkNull ("lastName", lastName, errors, loginVals);
    checkNull ("email", email, errors, loginVals);
    checkNull ("accountPassword", accountPassword, errors, loginVals);

    // Consider referring page to send back to in case of errors
    let referer = req.headers.referer;  // http://localhost:3000/productListing
    referer = referer.substring(referer.lastIndexOf('/'));    // /productListing
    referer = referer.replace(/\//g, "");  // productListing

    // This is necessary because if the user submits the page once, the url becomes 
    // something like "http://localhost:3000/create-acct", meaning the next time user 
    // submits form, the referer would become 'create-acct', instead of the erstwhile 
    // url like "http://localhost:3000/productListing"
    if (referer != "login" && referer != "create-acct") {   // Combine both bcos url would retain one 
                                                              // of them if user switches both forms

        route = (referer) ? referer : "index"; 
    }
    // console.log ("referer2 : " + referer);
    // Consider additional parameters to pass to depending on what route user 
    // interacts with the form 

    // console.log ("route : " + route);

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

    // Check Object length to see if errors

    // If errors for invalid patterns exist, re-render route to referring page and export errors object
    if (Object.keys(errors.null).length > 0) {
        formValid = false;

        res.render(route, {
            errors : errors.null,
            loginVals,
            errorClass : {active : "active", slide : "active"},
            ...addParams
        });

    } else {

        // STAGE 2:

        // Check password length and pattern
        checkLength ("passwordLength", accountPassword, "Password should be between 6 and 12 characters");

        // Check for valid mail
        checkRegexMail ("mailRegex", email, regexMail, "Mail address is invalid");

        // Check for combination of uppercase, lowercase and required nos
        checkRegexLettersNos ("accountPasswordMix", accountPassword, regexLettersNos, "Mix of uppercase, lowercase and numbers required");

        // If errors for invalid patterns exist, re-render route to referring page and export errors object
        if (Object.keys(errors.regex).length > 0) {
            formValid = false;

            res.render(route, {
                errors : errors.regex,
                loginVals,
                errorClass : {active : "active", slide : "active"},
                ...addParams
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