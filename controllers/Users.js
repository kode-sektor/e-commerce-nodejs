/*********************USER ROUTES***************************/
const express = require('express');
const router = express.Router();

const path = require("path");	// For easy filename dismembering

const bcrypt = require("bcryptjs");
const session = require('express-session');

// Import schema
const userModel = require("../models/Users");
const productModel = require("../models/Products");
const categoryModel = require("../models/Categories");
const cartModel = require("../models/Cart");

const authHome = require("../auth/authHome");
const isAuth = require("../auth/auth");	// Fetch auth

// Import functions
const functions = require("../public/js/functions.js");

// Object to hold parameters to be sent to existing pages 
// so user is not left hanging after submitting a form 
// because the form lives on every page

const app = express();


let addParams = {}; 
let route = '';
const senderMail = 'kayodeibiyemi92@gmail.com';

// Create object to hold errors
/*
What errors object will eventually look like: 
errors = {
    null : {firstName : true, lastName : true}
    regex : {accountPassword : 'Should be between 6 and 12 characters long'}
}
*/
let errors = {
    null : {},
    regex : {}
};
let loginVals = {};
let formValid = true;


// This is the route of the next page after filling the form. 
/*router.get("/profile", isAuth, dashBoardLoader);
*/
// This is the route of the next page after filling the form. 
router.get("/profile", isAuth, (req, res) => {
	res.render("User/profile", {
		title : "Dashboard",
	})
});

// COVER FOR TRAILING URL WHEN POST IS SUBMITTED. 
// After rendering, the URL sometimes becomes http://localhost:3000/user/login, 
// but thats not a problem but sometimes user may refresh page with that URL, that is 
// when the page breaks
router.get("/login", (req,res) => {
	res.redirect("/");
});

// This is the route of the next page after filling the form. 
router.get("/create-acct", (req, res) => {
	res.redirect("/");
});


router.post("/create-acct", (req, res) => {

	// First clear existing failed registration attempt
	errors.null = {};
	errors.regex = {};
	loginVals = {};
    
    let firstName = (req.body["first-name"]).trim().toLowerCase();
    let lastName = (req.body["last-name"]).trim().toLowerCase();
    let email = (req.body["email"]).trim();
    let accountPassword = (req.body["account-password"]).trim();

    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1); // K + ad
    lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1)

    console.log("CREDENTIALS AT REGISTRATION: ", firstName, lastName, email, accountPassword);

    const regexMail = new RegExp(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9-.]+/);  // kodesektor@rocketmail.com
    const regexLettersNos = new RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/);

    // Stage 1: Check for nulls
    const checkLength = (key, field, msg) => {
        if (field.length < 6 || field.length > 12) {
            errors.regex[`${key}`] = msg;
        }
    }  

    const checkRegexMail = (key, field, pattern, msg) => {
        if (!pattern.test(field)) {
            errors.regex[`${key}`] = msg;
        }
        // console.log (pattern.test(field));
    }

    const checkRegexLettersNos = (key, field, pattern, msg) => {
        if (!pattern.test(field)) {
            errors.regex[`${key}`] = msg;
        }
    }

    functions.checkNull ("firstName", firstName, errors, loginVals);
    functions.checkNull ("lastName", lastName, errors, loginVals);
    functions.checkNull ("email", email, errors, loginVals);
    functions.checkNull ("accountPassword", accountPassword, errors, loginVals);

    // Consider referring page to send back to in case of errors
    let referer = req.headers.referer;  // http://localhost:3000/productListing
    referer = referer.substring(referer.lastIndexOf('/'));    // /productListing
    referer = referer.replace(/\//g, "");  // productListing

    // This is necessary because if the user submits the page once, the url becomes 
    // something like "http://localhost:3000/create-acct", meaning the next time user 
    // submits form, the referer would become 'create-acct', instead of the erstwhile 
    // url like "http://localhost:3000/productListing"

    // If there's /login or /create-acct or simply nothing after localhost/3000, then its the homepage
    if (referer != "login" && referer != "create-acct" & referer !="") {   // Combine both bcos url would retain one 
                                                              // of them if user switches both forms
        route = (referer); 
    } else {
    	route = "User/index";
    }
    // console.log ("referer : " + referer);
    // Consider additional parameters to pass to depending on what route user 
    // interacts with the form 

    // console.log ("route : " + route);

    if (route == "index") {
        addParams = {
            title : "Home Page"
        }  
    } else if (route == "productListing") {
       addParams = {
           title : "Product Listing Page"
       }   
    }

    // Check Object length to see if errors

    // If errors for empty values exist, re-render route to referring page and export errors object
    if (Object.keys(errors.null).length > 0) {
        formValid = false;

        console.log("THE ERRORS : ", errors);

        res.render(route, {
            errors : errors.null,
            loginVals,
            errorClass : {active : "active", slide : "active"},
            ...addParams
        });

    } else {

    	console.log("No null values yet");

        // STAGE 2:

        // Check password length and pattern
        checkLength ("passwordLength", accountPassword, "Password should be between 6 and 12 characters");

        // Check for valid mail
        checkRegexMail ("mailRegex", email, regexMail, "Mail address is invalid");

        // Check for combination of uppercase, lowercase and required nos
        checkRegexLettersNos ("accountPasswordMix", accountPassword, regexLettersNos, "Mix of uppercase, lowercase and numbers required");

        // If errors for invalid patterns exist, re-render route to referring page and export errors object
        if (Object.keys(errors.regex).length > 0) {
            formValid = false;

            res.render(route, {
                errors : errors.regex,
                loginVals,
                errorClass : {active : "active", slide : "active"},
                ...addParams
            });
        } 
    }

    if (formValid) {

        const sgMail = require('@sendgrid/mail');
        console.log("SENDGRID KEY : ", process.env.SENDGRID_API_KEY);
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const mail = {
            to: email,
            from: senderMail,
            subject: 'Thank you for registering with Humber-Zon',
            html: `<h1 style="border: rgba(0, 0, 51, 1); color: #000033; font-family: sans-serif; margin-bottom: 14px;">HUMBER-ZON TRULY CARES</h1>

                <section class="body" style="border: rgba(0, 0, 51, 1); color: #000033; font-family: Calibri; font-size: 18px; padding: 20px; border: 1px solid rgba(222, 180, 6, 0.4)">
                        <p>
                            Hello <b>${firstName}</b>, thank you once again for registering with us. At Humber-Zon, rest assured 
                            you will always get the best deals at competitive prices. Please let us serve you. 
                        </p>
                    </section>`
        };

        (async () => {
            try {
	            await sgMail.send(mail);
	            console.log ('Mail sent');

	            /*ARRANGE SCHEMA TO SAVE TO DATABASE*/

	            const newUser = {
	            	firstName,
	            	lastName,
	            	email,
	            	password : accountPassword
	            }

	            const user = new userModel(newUser);

	            // BEFORE SAVING TO DATABASE , ENSURE PASSWORD DOESNT EXIST IN DATABASE

	        	userModel.findOne({email}, function(err, emailExists) {

	        		console.log ("EMAIL EXISTS: ", emailExists);
	                if (err) {
	                	return res(err);
	                }
	                if (emailExists) { 
	                	errors.passwordExists = true;

	                	res.render(route, {
	                	    errors,
	                	    loginVals,
	                	    errorClass : {active : "active", slide : "active"},
	                	    ...addParams
	                	});	 

	                } else {

	                	// Image needs to be saved first because there MongoDB generates a unique ID 
	                	// for each record and it is needed for the unique naming of the image
	                	user.save().then((user) => {	

	                		console.log("FILE IMAGE : ", req.files);

	                		// DO NOT BOTHER UPDATING IMAGE IF ITS NULL (BECAUSE IT'S NOT REQUIRED)

	                		if (req.files) {	// First check if images is uploaded, 

	                			if (req.files["profile-pic"]) {	// Then check for this particular image. Breaking it down
	                												// this way avoids throwing error

	                				console.log("DO NOT RUN IF IMAGE IS NULL : ", req.files);

	                				// Rename image to prevent overriding image in DB. So user does not meet a different image to what he uploaded
	                				req.files["profile-pic"].name = `pro_pic_${user._id}${path.parse(req.files["profile-pic"].name).ext}`

	                				req.files["profile-pic"].mv(`public/uploads/${req.files["profile-pic"].name}`)
	                					.then(()=> {
	                						userModel.updateOne({_id : user._id}, {
	                							profilePic : req.files["profile-pic"].name 	// pro-pic-3453454344343.png
	                						}).then(()=> {

												// Cache user object in session
						            			req.session.userDetails = user;

						            			if (user.admin) {
						            				req.session.adminDetails = user;	// save this one to hide some elements from admin like cart	
						            			}
						            			console.log("SESSION AFTER SUCCESSFUL LOGIN: ", req.session);
						            			res.redirect("/user/dashboard");

	                							// Redirect to dashboard after updating record with image
	                							res.redirect("/user/dashboard");
	                						});
	                					});
	                			}
	                		} else {	// Redirect to dashboard after saving

	                			// Cache user object in session
								// Cache user object in session
		            			req.session.userDetails = user;

		            			if (user.admin) {
		            				req.session.adminDetails = user;	// save this one to hide some elements from admin like cart	
		            			}
		            			console.log("SESSION AFTER SUCCESSFUL LOGIN: ", req.session);
		            			res.redirect("/user/dashboard");
	                		}

	                	}).catch(err => console.log(`Error while inserting into the data ${err}`));	
	                }
	            });           

	        } catch (error) {	            
	            console.error(error);
	         
	            if (error.response) {
	              console.error(error.response.body)
	            }
	        }
        })();
    }
});


// LOGIN ROUTE
//Route to direct user to the login form
router.post("/login", (req, res) => {	

	// Create object to hold errors
	/*
	What errors object will eventually look like: 
	errors = {
	    null : {firstName : true, lastName : true}
	    regex : {accountPassword : 'Should be between 6 and 12 characters long'}
	}
	*/

	// Fetch login values from form
	let loginMail = (req.body["login-mail"]).trim();
	let password = req.body["password"];

	// Create object to hold errors
	let errors = {
	    null : {},
	    regex : {}
	};
	let loginVals = {};
	let formValid = false;

	// Check if user enters nothing
	functions.checkNull ("loginMail", loginMail, errors, loginVals);
	functions.checkNull ("password", password, errors, loginVals);

	// Check Object length to see if errors

	// Consider referring page to send back to in case of errors
	let referer = req.headers.referer;  // http://localhost:3000/productListing
	referer = referer.substring(referer.lastIndexOf('/'));    // /productListing
	referer = referer.replace(/\//g, "");  // productListing

	// This is necessary because if the user submits the page once, the url becomes 
	// something like "http://localhost:3000/create-acct", meaning the next time user 
	// submits form, the referer would become 'create-acct', instead of the erstwhile 
	// url like "http://localhost:3000/productListing"

	// If there's /login or /create-acct or simply nothing after localhost/3000, then its the homepage
	if (referer != "login" && referer != "create-acct" & referer !="") {   // Combine both bcos url would retain one 
	                                                          // of them if user switches both forms
	    route = (referer); 
	} else {
		route = "User/index";
	}
	console.log ("referer : " + referer);
	// Consider additional parameters to pass to depending on what route user 
	// interacts with the form 

	// console.log ("route : " + route);

	if (route == "index") {
	    addParams = {
	        title : "Home Page",
	       // data :   // bestSeller.getFeaturedProducts(), Fetch from MongoDB instead
	        //dataCat : // catProduct.getCategProducts(),  Fetch from MongoDB instead
	    }  
	} else if (route == "productListing") {
	   addParams = {
	       title : "Product Listing Page",
	       // data : // product.getNProducts(0,9)  Fetch from MongoDB instead
	   }   
	}

	// If errors for invalid patterns exist, re-render route to referring page and export errors object
	if (Object.keys(errors.null).length > 0) {
	    formValid = false;

       res.render(route, {
           errors : errors.null,
           loginVals,
           errorClass : {active: "active"},
           ...addParams
       });
	}   

	// Otherwise redirect (and reload) Home page
	 else {

	 	// But first check email exists in DB
	 	userModel.findOne({email : loginMail}).then(user => {

	 		// console.log("CONFIRMING IF USER'S LOGIN DETAILS EXIST IN DB: ", user);

 			if (user) {
 				// OK email is found but it can only be compared when decrypted
 				bcrypt.compare(password, user.password).then(isMatched => {
 					if (isMatched) {	// password and email matches
						// Cache user object in session
            			req.session.userDetails = user;

            			if (user.admin) {
            				req.session.adminDetails = user;	// save this one to hide some elements from admin like cart	
            			}
            			console.log("SESSION AFTER SUCCESSFUL LOGIN: ", req.session);
            			res.redirect("/user/dashboard");
					} else { 							
						errors.matchFail = true;

						res.render(route, {	// else redirect to homepage
						    errors,
						    loginVals,
						    errorClass : {active: "active"},
						    ...addParams
						});
					}
				}).catch(err => console.log(`Error: ${err}`));

 			} else {
 				errors.matchFail = true;

 				res.render(route, {
 				    errors,
 				    loginVals,
 				    errorClass : {active: "active"},
 				    ...addParams
 				});
 			}
 		})
	}	    
});


router.get("/dashboard", isAuth, (req, res) => {
	console.log("SESSION AT INDEX: ", req.session);

	res.render("User/dashboard.handlebars", {
		title : "Dashboard", 
		bodyClass : "user-dashboard-page"
	});
});

// On shop page, list all products
router.get('/productListing', (req, res) => {

	// First fetch categories used to populate the search filter
	// console.log("SESSION'S STATE AT GET.PRODUCTLISTING : ", (req.session));

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
					quantity : product.quantity,
					inCart : product.inCart 
				}
			});

			// console.log ("LISTING : ", listing);

			// console.log("SESSION'S STATE AT GET.PRODUCTLISTING : ", console.log(req.session));

		    res.render("User/productListing", {
		    	title : "Product Listing",
		    	bodyClass : "product-listing-page",
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
		const { _id, title, description, price, featured, imgPath, category, quantity, inCart } = product;
		req.session.productDetails = product;

		// console.log ("LISTING : ", listing);

	    res.render("User/details", {
	    	title : "Product Details",
	    	bodyClass : "product-details-page",
	    	_id, title, description, price, featured, imgPath, category, quantity, inCart
	    });

	}).catch((err) => {
		console.log(`Error happened when pulling from the database : ${err}`);
	});

});

// That means url is sth like /user/product/2424585431345dc

// If url was sth like /user/product?id=343536467546af, then the route would be
// .get("/cart") and will use "req.query.id" instead of "req.params.id"
router.get("/cart/:id", authHome,  (req, res) => {

	const cartID = req.params.id;

	// console.log ("CART ID: ", cartID);

	// 3 things will be done here : 
	// 1st : Find the record of the product clicked 
	// 2nd : Fetch details of the record and populate cart collection
	// 3rd : Modify the original records "inCart" field (to prevent user from re-clicking and re-adding
	// 			to the cart on client-side)
	productModel.findById(cartID).then((cartItem) => {	// First find id in list of all products

		// console.log ("CART ITEM: ", cartItem);

		// Destructure its parts
		let { _id, title, description, price, featured, imgPath, category, quantity } = cartItem;

		// Let quantity be 1 for now and not the 'quantity' of the total stock as that does not 
		// make sense (user will likely not want to buy total qty of products). Another route will 
		// be created to handle updating the cart

		let origQty = quantity;	// Keep original quantity 

		if (quantity > 0) {	// Are there any products left? Do not add to cart if qty of product is 0

			quantity = 1;

			// Then save this product in new collection called "Cart"
			const cart = new cartModel({_id, title, description, price, featured, imgPath, category, quantity, origQty});

			cart.save().then(() => {

				productModel.updateOne({_id}, {	// Make update of "inCart"
					inCart : "true" 
				}).then(()=> {
					// Redirect to dashboard after updating record with image
					res.redirect("/");
				});
			}).catch((err) => {
				console.log(`Error happened when inserting in the database : ${err}`);
			});
		} else {
			req.session.noProduct == "true";	// If no product, tell user on client side but will likely not 
												// happen because as it will not show up on the index page.
												// Reason: General.js controller cotnains a  filtered loop 
												// holding only products in stock 
												
			res.redirect("/");
		}
		
	});
});


// SHOPPING CART PAGE

router.get("/shopping-cart", authHome, (req, res) => {

	cartModel.find().then((cartProducts) => {	// Fetch filtered products

		const cart = cartProducts.map( (cartProduct) => {

			return {
				id : cartProduct._id,
				title : cartProduct.title, 
				description : cartProduct.description,
				price : cartProduct.price,
				featured  : cartProduct.featured,
				imgPath : cartProduct.imgPath,
				category : cartProduct.category,
				quantity : cartProduct.quantity,
				origQty : cartProduct.origQty
			}			
		});

		// console.log ("CART FILTERED ", cart);

		req.session.cart = cart;	

		res.render("User/shopping-cart", {
			title : "Shopping Cart",
			bodyClass : "shopping-cart-page",
			dataCart : cart/*,
			categories : filteredCategory*/
		});	

	}).catch((err) => {
		console.log(`Error happened when pulling from Product database : ${err}`);
	});
});


// SHOPPING CART DELETE ITEM
/*
	Do 2 things: 
	1. Delete from cart
	2. Update "inCart" to false
*/
router.get("/cart-del/:id", authHome, (req, res) => {

	cartModel.deleteOne({_id : req.params.id}).then(() => {	// First delete item from cart

		// Then ensure to update "inCart" to false
		const inCart = {
			inCart : "false"
		}
		
		productModel.updateOne({_id : req.params.id}, inCart).then(() => {
			res.redirect("/user/shopping-cart");
		}).catch(err => console.log(`Error happened when updating data from the database : ${err}`));

	}).catch(err => console.log(`Error happened when deleting data from the database : ${err}`));

});


// PLACE ORDER

/*
	Do 2 things:
	1. Clear the entire cart collection
	2. Find all "inCart" fields and update them to false
*/

router.post("/place-order",  (req, res) => {

	const user = req.session.userDetails;
	const products = req.body["hdn-products"];
	const totalItems = req.body["hdn-total-items"];
	const totalCost = req.body["hdn-total-cost"];
	const grandTotal = req.body["hdn-grand-total-cost"];
	const shipping = req.body["select-shipping"]

	// console.log ("USER DETAILS RETURNSSSSSSSSSSSSSSSSSSSSSSSSSSSS : ", req.session);

	console.log(req.session);

	let update = {
	    $set : {
		    inCart : "false"
	    }
    };

	cartModel.remove({}).then(() => {	//	clear cart collection

		productModel.updateMany({inCart : "true"}, update, (err, doc) => {	// Update all "inCart" to "false"

	        const sgMail = require('@sendgrid/mail');
	        console.log("SENDGRID KEY : ", process.env.SENDGRID_API_KEY);
	        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
	        const mail = {
	            to: user.email,
	            from: senderMail,
	            subject: 'Thank you for registering with Humber-Zon',
	            html: `<h1 style="padding: 20px">Hello ${user.firstName}</h1>,

						<p>Thank you for shopping with us. We thought you'd like to know that your item has shipped, and that this completes your order. Your order is on its way, and can no longer be changed. If you need to return an item from this shipment or manage other orders, please visit Your Orders on Humber-Zon.ca.</p>

						<ul>
							<li>Total Items : ${totalItems}</li>
							<li>Item Subtotal:	${totalCost} $CAD</li>
							<li>Shipping and Handling:	${shipping} $CAD</li>
							<li>Total: ${grandTotal} $CAD</li>
							<li>Paid by Visa: ${grandTotal} $CAD</li>
						</ul>`
	        };

	        console.log ("MAIL BODY: ", mail);

	        (async () => {
	            try {
		            await sgMail.send(mail);
		            console.log ('Mail sent');         
		            res.redirect("/user/shopping-cart");
		        } catch (error) {	            
		            console.error(error);
		         
		            if (error.response) {
		              console.error(error.response.body)
		            }
		        }
	        })();
			
		}).catch(err => console.log(`Error happened when updating data from the database : ${err}`));;

	}).catch(err => console.log(`Error happened when deleting data from the database : ${err}`));

});


// CATEGORY FILTER

router.post("/product-filter", (req, res) => {

	const filterSearch = req.body["filter-search"];

	// console.log("FILTER SEARCH CRITERION : ", filterSearch);	// shoe

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
				bodyClass : "product-listing-page",
				listing : filteredProducts/*,
				categories : filteredCategory*/
			});	
		})
	}).catch((err) => {
		console.log(`Error happened when pulling from Product database : ${err}`);
	});
});



module.exports=router;


