/*********************USER ROUTES***************************/
const express = require('express');
const router = express.Router();

const session = require('express-session');


// Import schema
const productModel = require("../models/Products");
const categoryModel = require("../models/Categories");

const authHome = require("../auth/authHome");
const dashBoardLoader = require("../auth/authorisation");

const path = require("path");

// Import functions
const functions = require("../public/js/functions.js");

const fs = require('fs');


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

			// console.log ("LOADED CATEGORIES: ", loadedCategories);

			res.render("Admin/dashboard", {
				title : "Admin Dashboard",
				bodyClass : "admin-dashboard",
				data : loadedProducts,
				categories : loadedCategories
			});

		});
	});
});


let loadedProducts = ''; 
let loadedCategories = '';

// When user clicks on 'Edit', first fetch original details that list all products;
// then fetch details of particular record clicked and send back to same referring page
// to populate the Edit form

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

		console.log ("LOADED PRODUCTS: ", loadedProducts);

		// And also fetch the categories to be inputted in the dropdown 

		categoryModel.find().then((categories) => {
			loadedCategories = categories.map(category => {
				return { title : functions.capitalise(category.title) };
			});
			// console.log ("LOADED CATEGORIES: ", loadedCategories);
		});
	});

	// THIS IS FOR 'EDIT' BUTTON CLICKED. It The ID of the particular record clicked 
	// is used to fetch the record and passed to populate the values of the form

	 productModel.findById(req.params.id).then((product) => {

		// You're fetching only 1 record which is why you can destructure directly
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

		// Note that you simply can't pass in 'product' into render. It won't work. 
		// There's always need to destructure into variables 

		res.render("Admin/dashboard", {
			title : "Admin Dashboard",
			bodyClass : "admin-dashboard",
			data : loadedProducts,
			categories : loadedCategories,
			product_id, product_title, product_description, product_price,
			product_featured, product_imgPath, product_category, product_quantity
		});

	});

});


const imgExt = [".png", ".jpg", ".jfif", ".jpeg", ".gif"];

// INSERT INTO DB
router.post("/add-product", (req, res) => {

	const newProduct = {
		title : ((req.body["product-title"]).trim()).toLowerCase(),
		description : ((req.body["product-description"]).trim()).toLowerCase(),
		price : ((req.body["product-cost"]).trim()).toLowerCase(),
		featured : ((req.body["featured"]).trim()).toLowerCase(),
		category : ((req.body["product-category"]).trim()).toLowerCase(),
		quantity : ((req.body["product-qty"]).trim()).toLowerCase()
	}

	//console.log (newProduct.imgPath);

	// console.log ("FROM FORM : " , req.body);

	const product = new productModel(newProduct);

	// Image needs to be saved first because there MongoDB generates a unique ID 
	// for each record and it is needed for the unique naming of the image

	product.save().then((product) => {

		console.log("FILE IMAGE : ", req.files);

		if (req.files) {	// First check if images is uploaded, 

			if (req.files["product-pic"]) {	// Then check for this particular image. Breaking it down
												// this way avoids throwing error

				console.log ("PRODUCT PICTURE : ", req.files["product-pic"]);

				/*	fileOrig will contain the complete details of the image 

					{ name: 'shoe-caitin.png',
					 data:
					  <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 01 25 00 00 00 b3 08 06 00 00 00 cf 2f 0a 9d 00 00 20 00 49 44 41 54 78 9c ec bd 09 b4 24 67 71 ... >,
					 size: 62634,
					 encoding: '7bit',
					 tempFilePath: '',
					 truncated: false,
					 mimetype: 'image/png',
					 md5: '5ddfb5d9c6705d4c9ab0e27d8c2d9d39',
				*/
				let fileOrig = req.files["product-pic"];

				let ext = (path.parse(fileOrig.name).ext).toLowerCase();	// .png, .jpg, .jfif

				console.log ("EXT: " , ext);

				if (imgExt.indexOf(ext) !== -1) {	// Check for allowable file ext type

					// Rename image to prevent overriding image in DB. So user does not meet a different image to what he uploaded
					let file = `product-img-${product._id}${ext}`;

					fileOrig.mv(`public/uploads/products/${file}`)
						.then(()=> {
							productModel.updateOne({_id : product._id}, {
								imgPath : file
							}).then(()=> {
								// Cache user object in session
								req.session.productDetails = product;

								// Redirect to dashboard after updating record with image
								res.redirect("/admin/admin-dashboard");
							});
						});
				} else {
					console.log(ext + " is not an allowable file type");
				}
			}

		} else {	// Redirect to dashboard after saving

			// Cache user object in session
			req.session.productDetails = product;
			res.redirect("/admin/admin-dashboard");
		}

	}).catch(err => console.log(`Error while inserting into the data ${err}`));	

});


//Route to update user data after they submit the form 
router.put("/edit-product/:id", (req, res) => {

	// First pluck out all the data 
	const newProduct = {
		title : ((req.body["product-title"]).trim()).toLowerCase(),
		description : ((req.body["product-description"]).trim()).toLowerCase(),
		price : ((req.body["product-cost"]).trim()).toLowerCase(),
		featured : ((req.body["featured"]).trim()).toLowerCase(),
		category : ((req.body["product-category"]).trim()).toLowerCase(),
		quantity : ((req.body["product-qty"]).trim()).toLowerCase()
	}


	productModel.updateOne({_id : req.params.id}, newProduct).then((product) => {

		if (req.files) {	// First check if images is uploaded, 

			if (req.files["product-pic"]) {	// Then check for this particular image. Breaking it down
												// this way avoids throwing error

				console.log ("PRODUCT PICTURE : ", req.files["product-pic"]);

				/*	fileOrig will contain the complete details of the image 

					{ name: 'shoe-caitin.png',
					 data:
					  <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 01 25 00 00 00 b3 08 06 00 00 00 cf 2f 0a 9d 00 00 20 00 49 44 41 54 78 9c ec bd 09 b4 24 67 71 ... >,
					 size: 62634,
					 encoding: '7bit',
					 tempFilePath: '',
					 truncated: false,
					 mimetype: 'image/png',
					 md5: '5ddfb5d9c6705d4c9ab0e27d8c2d9d39',
				*/
				let fileOrig = req.files["product-pic"];

				let ext = (path.parse(fileOrig.name).ext).toLowerCase();	// .png, .jpg, .jfif

				console.log ("EXT: " , ext);

				if (imgExt.indexOf(ext) !== -1) {	// Check for allowable file ext type

					// Rename image to prevent overriding image in DB. So user does not meet a different image to what he uploaded
					let file = `product-img-${product._id}.${ext}`;

					fileOrig.mv(`public/uploads/products/${file}`)
						.then(()=> {
							productModel.updateOne({_id : product._id}, {
								imgPath : file
							}).then(()=> {
								// Cache user object in session
								req.session.productDetails = product;

								// Redirect to dashboard after updating record with image
								res.redirect("/admin/admin-dashboard");
							});
						});
				} else {
					console.log(ext + " is not an allowable file type");
				}

			}

		} else {	// Redirect to dashboard after saving

			// Cache user object in session
			req.session.productDetails = product;
			res.redirect("/admin/admin-dashboard");
		}

	}).catch(err => console.log(`Error happened when updating data from the database : ${err}`));

});


//router to delete user


router.delete("/del/:id", (req, res) => {

	productModel.deleteOne({_id : req.params.id}).then((product) => {	// Delete image path from DB first

		const imageDel = req.body.deleteImg;

		// console.log("REQ : ", req.body);
		
		fs.unlink(`public/uploads/products/${imageDel}`, (err) => {	// Then unlink locally
	        if (err) {
	            console.log("failed to delete local image: " + err);
	        } else {
	            console.log('successfully deleted local image');                                
	        }
	        res.redirect("/admin/admin-dashboard");
		});
	}).catch(err => console.log(`Error happened when deleting data from the database : ${err}`));

});


module.exports=router;