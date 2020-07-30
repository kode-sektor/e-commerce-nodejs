/*********************USER ROUTES***************************/
const express = require('express')
const router = express.Router();

// Import schema
const userModel = require("../models/Users");
const path = require("path");	// For easy filename dismembering

const bcrypt = require("bcryptjs");
const session = require('express-session');

const authHome = require("../auth/authHome");
const isAuth = require("../auth/auth");	// Fetch auth
const dashBoardLoader = require("../auth/authorisation");


router.get('/', (req, res) => {
    res.render("User/index", {
        title : "Home Page",
        /*data : bestSeller.getFeaturedProducts(),
        dataCat : catProduct.getCategProducts()*/
    });
});

// LOGOUT ROUTE
router.get("/logout", (req, res) => {
	req.session.destroy();
	res.redirect("/user/login");
});


module.exports=router;
