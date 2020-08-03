/*********************USER ROUTES***************************/
const express = require('express')
const router = express.Router();

// Import schema
const userModel = require("../models/Users");
const categoryModel = require("../models/Categories");
const productModel = require("../models/Products");

const path = require("path");	// For easy filename dismembering

const bcrypt = require("bcryptjs");
const session = require('express-session');

const authHome = require("../auth/authHome");
const isAuth = require("../auth/auth");	// Fetch auth
const dashBoardLoader = require("../auth/authorisation");


router.get('/', (req, res) => {

	// Show of products by Category

	categoryModel.find().then((categories) => {

		// First fetch categories
		const filteredCategory = categories.map( category => {
			return {
				category : category.title,
			}
		});

		// console.log ("CATEGORIES : " , filteredCategory);

		let products = [];	// will hold product fetched

		// Now run through all records and only fetch one record for each of the categories fetched prior
		const filterCategory = new Promise(function(resolve, reject) { 

         	filteredCategory.forEach((elm, indx, array) => {	// the loop

         		let category = elm.category;	// 'shoe', 'phone' etc.

         		console.log ("CATEGORY : ", category);

         		productModel.findOne({category}, function(err, product) {

         			console.log ("PRODUCTSFOREACH CATEGORY FETCHED : ", product);

         			const {_id, title, description, price, featured, imgPath, category, quantity} = product;

         	        if (err) {
         	        	console.log("Error connecting to database : ", err);
         	        	return res(err);
         	        }
         	        if (product) { 
         	        	products.push({_id, title, description, price, featured, imgPath, category, quantity});	// Keep pushing single product item into products array

         	        	if (indx === array.length - 1) resolve();	// wait till last record (must be inside .findOne) to work
         	        }
         	    });
         	});
     	
		});

		filterCategory.then(() => {
		    console.log ("PRODUCTS FOR EACH CATEGORY FETCHED : ", products);
		    req.session.productCateg = products;

		    res.render("User/index", {
		        title : "Home Page",
		        dataCat : products,
		        /*data : catProduct.getCategProducts()*/
		    });
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
