/*********************USER ROUTES***************************/
const express = require('express')
const router = express.Router();

// Import schema
const userModel = require("../models/Users");
const categoryModel = require("../models/Categories");

const path = require("path");	// For easy filename dismembering

const bcrypt = require("bcryptjs");
const session = require('express-session');

const authHome = require("../auth/authHome");
const isAuth = require("../auth/auth");	// Fetch auth
const dashBoardLoader = require("../auth/authorisation");


router.get('/', (req, res) => {

	categoryModel.find().then((categories) => {

		// Fetch categories
		const filteredCategory = categories.map( category => {
			return {
				category : category.title,
			}
		});

		console.log ("CATEGORIES : " , filteredCategory);

		res.render("User/index", {
		    title : "Home Page",
		    /*data : bestSeller.getFeaturedProducts(),
		    dataCat : catProduct.getCategProducts()*/
		});

	}).catch((err) => {
		console.log(`Error happened when pulling from the database : ${err}`);
	});

});

// LOGOUT ROUTE
router.get("/logout", (req, res) => {
	req.session.destroy();
/*	res.redirect("/user/login");
*/	res.redirect("/user/login");
});


module.exports=router;
