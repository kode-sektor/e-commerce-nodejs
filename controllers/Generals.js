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

	let filteredCategory = '';

	categoryModel.find().then((categories) => {

		// First fetch categories
		const filteredCategories = new Promise(function(resolve, reject) {

			filteredCategory = categories.map( (category, indx) => {

				if (indx === categories.length - 1) resolve();

				return {
					category : category.title,
				}
			});

		})

		filteredCategories.then(() => {

			// console.log ("CATEGORIES : " , filteredCategory);

			let products = [];	// will hold product fetched

			// Now run through all records and only fetch one record for each of the categories fetched prior
			const filterCategory = new Promise(function(resolve, reject) { 

	         	filteredCategory.forEach((elm, indx, array) => {	// the loop

	         		let category = elm.category;	// 'shoe', 'phone' etc.
	         		// console.log ("CATEGORY : ", category);

	         		productModel.findOne({category}, function(err, product) {
	         			// console.log ("PRODUCTSFOREACH CATEGORY FETCHED : ", product);

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

				// Time to fetch best sellers 
				productModel.find({featured : "feature"}).limit(12).then((bestSellers) => {

					const filteredBestSellers = bestSellers.map( bestSeller => {
						return {
							id : bestSeller._id,
							title : bestSeller.title, 
							description : bestSeller.description,
							price : bestSeller.price,
							featured  : bestSeller.featured,
							imgPath : bestSeller.imgPath,
							category : bestSeller.category,
							quantity : bestSeller.quantity
						}
					});

					// Save categories and bestSellers in session: 

					// console.log ("BEST SELLERS FOR EACH CATEGORY FETCHED : ", filteredBestSellers);
					req.session.bestSellers = filteredBestSellers;

					req.session.categories = filteredCategory;
					// console.log ("CATEGORIES FETCHED : ", filteredCategory);

					console.log("SESSION'S STATE AT GET.PRODUCTLISTING : ", (req.session));

					res.render("User/index", {
					    title : "Home Page",
					    dataCat : products,
					    /*filteredBestSellers*/
					});

				}).catch((err) => {
					console.log(`Error happened when pulling from the database : ${err}`);
				});
			});
		});
 
	}).catch((err) => {
		console.log(`Error happened when pulling from the database : ${err}`);
	});

});


// On shop page, list all products
router.get('/productListing', (req, res) => {

	// First fetch categories used to populate the search filter
	console.log("SESSION'S STATE AT GET.PRODUCTLISTING : ", (req.session));

	let filteredCategory = '';

	const filteredCategories = new Promise(function(resolve, reject) {

		categoryModel.find().then((categories) => {

			// Fetch categories
			filteredCategory = categories.map( (category, indx) => {
				if (indx === categories.length - 1) resolve();
				return { category : category.title }
			});
		})
	});

	filteredCategories.then(() => {

		// Then fetch products for the page
		productModel.find().then((products) => {

			const listing = products.map( product => {
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

			// console.log ("LISTING : ", listing);

			// console.log("SESSION'S STATE AT GET.PRODUCTLISTING : ", console.log(req.session));

		    res.render("User/productListing", {
		    	title : "Product Listing",
		    	bodyClass : "product-listing",
		    	listing,
		    	categories : filteredCategory	/*Although this has been passed in sessions but the session may 
		    									expire and the user may still continue browsing this site
		    									and since this is a crucial element, let it be called on every
		    									page refresh for now*/
		    });

		}).catch((err) => {
			console.log(`Error happened when pulling from the database : ${err}`);
		});
	})
});


// On details page, fetch details of particular item that was clicked

router.get('/details', (req, res) => {

	const id = req.query.id;

	// console.log("'GET' ID : ", id);

	productModel.findById(id).then((product) => {

		// You're fetching only 1 record which is why you can destructure
		const { _id, title, description, price, featured, imgPath, category, quantity } = product;

		// console.log ("LISTING : ", listing);

	    res.render("User/details", {
	    	title : "Product Details",
	    	bodyClass : "product-details",
	    	_id, title, description, price, featured, imgPath, category, quantity
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

router.post("/user/product-filter", (req, res) => {

	const filterSearch = req.body["filter-search"];

	console.log("FILTER SEARCH CRITERION : ", filterSearch);	// shoe

	productModel.find({category : filterSearch}).then((products) => {	// Fetch filtered products

		const filteredProducts = products.map( (product) => {

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

		console.log ("PRODUCTS FILTERED ", filteredProducts);

		categoryModel.find().then((categories) => {		// Then fetch categories
			// Fetch categories
			const filteredCategory = categories.map( (category) => {
				return { category : category.title }
			});

			res.render("User/productListing", {
				title : "Product Listing",
				bodyClass : "product-listing",
				listing : filteredProducts/*,
				categories : filteredCategory*/
			});	
		})
	}).catch((err) => {
		console.log(`Error happened when pulling from Product database : ${err}`);
	});
});


module.exports=router;
