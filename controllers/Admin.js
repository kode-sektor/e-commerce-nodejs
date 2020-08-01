/*********************USER ROUTES***************************/
const express = require('express')
const router = express.Router();

// Import schema
const productModel = require("../models/Products");
const categoryModel = require("../models/Categories");

const session = require('express-session');

const authHome = require("../auth/authHome");
const dashBoardLoader = require("../auth/authorisation");

// Import functions
const functions = require("../public/js/functions.js");


// Object to hold parameters to be sent to existing pages 
// so user is not left hanging after submitting a form 
// because the form lives on every page


// This is the route of the next page after filling the form. 
router.get("/admin-dashboard", /*authHome, dashBoardLoader,*/ (req, res) => {

	// Fetch the products from the products database

	productModel.find().then((products) => {

		const loadedProducts = products.map( product => {
			return {
				id : product._id,
				title : product.title, 
				description : product.description,
				price : product.price,
				featured  : product.featured,
				imgPath : product.imgPath,
				category : product.category,
				quantity : product.quantity
			}
		});

		console.log ("LOADED PRODUCTS: ", loadedProducts);

		// And also fetch the categories to be inputted in the dropdown 

		categoryModel.find().then((categories) => {
			const loadedCategories = categories.map(category => {
				return { title : functions.capitalise(category.title) };
			});

			res.render("Admin/dashboard", {
				title : "Admin-Dashboard",
				data : loadedProducts,
				categories : loadedCategories
			});

		});
	});
});

module.exports=router;