/*********************USER ROUTES***************************/
const express = require('express');
const router = express.Router();

const path = require("path");	// For easy filename dismembering

const bcrypt = require("bcryptjs");
const session = require('express-session');

// Import schema
const userModel = require("../models/Users");


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
router.get("/profile",/* isAuth,*/ (req, res) => {
	res.render("User/profile", {
		title : "Dashboard"
	})
});

// COVER FOR TRAILING URL WHEN POST IS SUBMITTED. 
// After rendering, the URL sometimes becomes http://localhost:3000/user/login, 
// but thats not a problem but sometimes user may refresh page with that URL, that is 
// when the page breaks
router.get("/login", (req,res) => {
	res.render("User/index");
});

// This is the route of the next page after filling the form. 
router.get("/create-acct", (req,res) => {
	res.render("User/index");
});


router.post("/create-acct", (req, res) => {
    
    let firstName = (req.body["first-name"]).trim().toLowerCase();
    let lastName = (req.body["last-name"]).trim().toLowerCase();
    let email = (req.body["email"]).trim();
    let accountPassword = (req.body["account-password"]).trim();

    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1); // K + ad
    lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1)

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
        console.log (pattern.test(field));
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

    // Check Object length to see if errors

    // If errors for empty values exist, re-render route to referring page and export errors object
    if (Object.keys(errors.null).length > 0) {
        formValid = false;

        res.render(route, {
            errors : errors.null,
            loginVals,
            errorClass : {active : "active", slide : "active"},
            ...addParams
        });

    } else {

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

	                							// Redirect to dashboard after updating record with image
	                							res.redirect("/user/profile");
	                						});
	                					});
	                			}
	                		} else {	// Redirect to dashboard after saving

	                			// Cache user object in session
	                			req.session.userDetails = user;
	                			res.redirect("/user/profile");
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

	 		console.log("CONFIRMING IF USER'S LOGIN DETAILS EXIST IN DB: ", user);
 			if (user) {
 				// OK email is found but it can only be compared when decrypted
 				bcrypt.compare(password, user.password).then(isMatched => {
 						if (isMatched) {	// password and email matches
 							// Cache user object in session
                			req.session.userDetails = user;
                			console.log("SESSION AFTER SUCCESSFUL LOGIN: ", req.session);
                			res.redirect("/user/profile");
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
 					.catch(err => console.log(`Error: ${err}`))
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


module.exports=router;


