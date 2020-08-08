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

// This loads all our environment variables from the key.env
require("dotenv").config({path:'./config/key.env'});

// Handlebars middlware
app.engine("handlebars", exphbs({
    extname : '.handlebars',
    helpers : require('./config/handlebars-helpers')
}));

app.use(bodyParser.urlencoded({extended: false}));

// Import your router objects
const userRoutes = require("./controllers/Users");
const generalRoutes = require("./controllers/Generals");
const adminRoutes = require("./controllers/Admin");


app.set('view engine', 'handlebars');

// Handle  UPDATE and DEL requests
app.use((req, res, next) => {
    if (req.query.method == "PUT") {
        req.method = "PUT";
    } else if (req.query.method == "DELETE") {
        req.method = "DELETE";
    }
    next();
});

//express static middleware
app.use(express.static("public"));


app.use(fileUpload());

// Session middleware
app.use(session({
    path : '/',
    name : 'sid',
    secret: `${process.env.SECRET_KEY}`,
    resave: false,
    saveUninitialized: true/*,
    cookie : {
        maxAge : 1000 * 60 * 60 * 10,
        sameSite : true,
        secure : false
    }*/
}));

app.use((req, res, next) => {

    // user object made to be available in .handlebars 
    // With this instead of always using .render (in the controller) just to pass in extra
    // details, you could use .redirect instead. 'user' object here will hold any extra 
    // details you pass. You could create more res.locals if you want
    res.locals.session = req.session;
    res.locals.user = req.session.userDetails;
    res.locals.product = req.session.productDetails;    // Details for a particular product clicked
    res.locals.categories = req.session.categories;
    res.locals.bestSellers = req.session.bestSellers;
    res.locals.cartData = req.session.cart;
    res.locals.admin = req.session.adminDetails

    next();
});

app.use("/", generalRoutes);
app.use("/user", userRoutes);   // The meaning of this is, in the URL, '/user' must come first /user/register, /user/login etc.
app.use("/admin", adminRoutes);

// Pass in the connection string variable from the env variable as 1st argument
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true}
                    ).then(()=> {
                        console.log(`Connected to MongoDB Database`);
                    }).catch(()=> {
                        console.log (`Error occured when connecting to the database`);
                    });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`The webserver is up and running`);
});