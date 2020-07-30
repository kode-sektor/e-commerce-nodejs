const express = require("express");
const exphbs  = require('express-handlebars');

const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

// Add body parser to process form data 
const bodyParser = require('body-parser');
const session = require('express-session');


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
const generalRoutes = require("./controllers/Generals");


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

app.get("/productListing", (req, res) => {
    
    res.render("productListing", {
        title : "Product Listing Page",
        data : product.getNProducts(0,9)
    });

});

/*app.get("/dashboard", (req, res) => {    
    res.render("User/dashboard", {
        title : "Dashboard"
    });
});
*/


app.use(fileUpload());

// Session middleware
app.use(session({
    name : 'sid',
    secret: `${process.env.SECRET_KEY}`,
    resave: false,
    saveUninitialized: true,
}));

app.use((req, res, next)=>{

    // user object made to be available in .handlebars 
    // With this instead of always using .render (in the controller) just to pass in extra
    // details, you could use .redirect instead. 'user' object here will hold any extra 
    // details you pass. You could create more res.locals if you want
    res.locals.user = req.session.userDetails;

    next();
});

app.use("/", generalRoutes);
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