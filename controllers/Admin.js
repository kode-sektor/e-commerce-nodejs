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

		// console.log ("LOADED PRODUCTS: ", loadedProducts);

		// And also fetch the categories to be inputted in the dropdown 

		categoryModel.find().then((categories) => {
			const loadedCategories = categories.map(category => {
				return { title : functions.capitalise(category.title) };
			});

			// console.log ("LOADED CATEGORIES: ", loadedCategories);

			res.render("Admin/dashboard", {
				title : "Admin-Dashboard",
				data : loadedProducts,
				categories : loadedCategories
			});

		});
	});
});


let loadedProducts = ''; 
let loadedCategories = '';

// When user clicks on 'Edit', fetch details then send to admin file to populate 
// and show form

router.get("/edit/:id", (req, res) => {
	
	// params.id catches the id passed from the click of 'Edit'
	// which is the last part of the URL (http://localhost:3003/task/edit/5f083f597f2810924c9d0985)

	// But since the plan is to re-render the same page that holds the form, then the products
	// must be fetched from the database just like the 'admin-dashboard' route

	productModel.find().then((products) => {

		loadedProducts = products.map( product => {
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

		// console.log ("LOADED PRODUCTS: ", loadedProducts);

		// And also fetch the categories to be inputted in the dropdown 

		categoryModel.find().then((categories) => {
			loadedCategories = categories.map(category => {
				return { title : functions.capitalise(category.title) };
			});
			// console.log ("LOADED CATEGORIES: ", loadedCategories);
		});
	});

	// THIS IS FOR 'EDIT' BUTTON CLICKED. The ID of the particular record clicked 
	// is used to fetch the record and passed to populate the values of the form

	productModel.findById(req.params.id).then((product) => {

		// You're fetching only 1 record which is why you can destructure
		const {
			_id : product_id,
			title : product_title,
			description : product_description,
			price : product_price,
			featured : product_featured, 
			imgPath : product_imgPath, 
			category : product_category,
			quantity : product_quantity 
		} = product;

		console.log ("LOADED CATEGORIES: ", loadedCategories);

		res.render("Admin/dashboard", {
			title : "Admin-Dashboard",
			data : loadedProducts,
			categories : loadedCategories,
			product_id, product_title, product_description, product_price,
			product_featured, product_imgPath, product_category, product_quantity
		});

	});

});

module.exports=router;