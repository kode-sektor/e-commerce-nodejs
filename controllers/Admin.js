/*********************USER ROUTES***************************/
const express = require('express')
const router = express.Router();

// Import schema
const productModel = require("../models/Products");
const path = require("path");	// For easy filename dismembering

const bcrypt = require("bcryptjs");
const session = require('express-session');

const authHome = require("../auth/authHome");
const isAuth = require("../auth/auth");	// Fetch auth
const dashBoardLoader = require("../auth/authorisation");


// Object to hold parameters to be sent to existing pages 
// so user is not left hanging after submitting a form 
// because the form lives on every page

const app = express();
//This loads all our environment variables from the key.env
//require("dotenv").config({path:'./config/key.env'});



// This is the route of the next page after filling the form. 
router.get("/admin-dashboard", isAuth, (req, res) => {

	productModel.find().then((products) => {

		const loadedProducts = products.map( product => {
			return {
				id : task._id,
				title : task.title, 
				description : task.description,
				dueDate : task.price,
				status  : task.featured,
				priority : task.imgPath,
				priority : task.category,
				priority : task.quantity,
			}
		});

		console.log (loadedProducts);

		res.render("Admin/dashboard", {
			title : "Dashboard"
		});
	});
});

module.exports=router;