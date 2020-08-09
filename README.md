Hosted Site: https://e-commerce-node-js-wddm-120.herokuapp.com/

# An E-Commerce Store Using JavaScript, Node Server, Express and Express-Handlebars

***

## This project is broken into 4 milestones, detailing some of the processes involved in building a modern electronic store, relying on some of the major squad technologies: HTML, CSS, JavaScript (Node, Express, Express-Handlebars), Mongoose and MongoDB. The deployment of this project is the link above and supported by Heroku.

***

### As mentioned earlier, this project is split into 4 major stages:

1. The first part involves creating the basic setup. Here's a list this first stage would accomplish:

* Express Web Server Setup
	+ Create an Express web server that listens to incoming HTTP requests.

* Route Handlers Implementation
	+ Home 

		1. Header - The header would contain the logo of the store and could contain the navigation bar.

		2. A Navigation bar - The navigation bar nested within the header. It would have links that navigate visitors to  a sign up page and the login page. The Signup and Login pages would be rendered as modal pop-ups right on the home page. 

		3. Promotional Section - This section would present banner images of 3 products depicting a currently run promo.

		4. Product Category Section - This section would display at least four (4) product categories. In the first milesone, the data for this section would be static, i.e, it will not be pulled from a database; however, would be defined in a separate module (Javascript file).

		5. This section would display a list of “best seller” products. The data for this section would also be static. 
		However, the data shall be defined in a separate module (Javascript file).

		6. Footer  - This section would include footer menu items, social media links, and any other information deemed necessary.

	+ Products Page

		1. The Product Listing page would list at least 6 sample products in a  grid with 3 columns. Every product would have an image, title, price, category and a boolean attribute indicating if it is a best seller or not. This view must also have a header, navigation and footer like the home page. 

	+ Customer Registration

		1. A well designed user registration form would be built implemented as a pop-up modal. 

	+ Login

		1. A well-designed login form would be built implemented as a pop-up modal. 
 

2. This is the second of 4 parts that involve sending emails and applying server side form validation to this web application. Here's a list this second stage would accomplish:


* Server-Side Validation
	+ This stage would implement server-side validation for both the login and registration form. It will involve no client-side validation.

	+ For the login form, only nulls would be checked for (i.e, check to see if the user entered a value in the respective text fields). However, for the registration form, nulls would be checked for. Also there would be an implementation of at least 2 complex validation criteria using regular expressions on two separate fields(For example, enforcing that the user must enter a password that is 6 to 12 characters and the password must have letters and numbers only). 

	+ Form would not clear the data entered in the form if there are validation errors.

	+ All error messages would be rendered on their respective pages or areas and must be styled properly.

* User Registration Form (Sending Emails)

	+ When a user fills out the registration form and then hits the submit button, provided that all the validation criteria were not violated, the website must then send a welcome email message to the user’s email address and then redirect the user to a dashboard page. For now, the dashboard page should contain information welcoming the user and should be properly styled.
	
3. This is the 3rd milestone of the project. This phase majorly revolves around the use of MongoDB and the MVC application architecure. No surprise it involves the most work. Here's a list of what this third state would accomplish:

* MVC
	+ The application would be fully structured according to the MVC design pattern. 
	+ All sensitive credential information would be stored in environment variables.  
	
* User Registration Module (MongoDB) 
	+ When a user fills out the registration form and then hits the submit button, provided that all the validation criteria were not violated, the application must then create a user account in the database. 
	+ Setup and configure MongoDB cloud service using MongDB Atlas.
	+ Connect the web application to mongoDB database using  an ODM called Mongoose.
	+ Name the database and collections appropriately.
	+ Ensure that the email field in registration form is unique, thus the application must prohibit different users from having the same email in the database.
	+ Passwords would not be stored in plain text in the database, thus the application must store passwords in an encrypted format.
	
* Authentication Module (Sessions)
	+ Application must allow an Inventory Clerk and  regular users, i.e, customers who want to purchase products, to log-in via the login form.
	+ Upon a successful authentication(entering an email and password pair that exists in the database) a session must be created to maintain the user state until they have logged out of the application. 
	+ Upon an unsuccessful authentication, the application must display an appropriate message.
	+ Also after successfully authenticating,the application must determine if the person logging in is an inventory clerk or a regular user and will be redirected to their respective dashboard
	+ A regular user will be directed to a user dashboard and an inventory clerk will be directed to an inventory clerk dashboard.
	+ Both dashboards, must show the user’s name(first name and lastname) and a logout link.
	+ The logout link must destroy the session created when the user initially authenticated.
	+ Specific routes can only be accessed when users are logged-in, thus those routes must be protected.
	
* Inventory Clerk Module
	+ The Inventory Clerk must be able to add products to the database.
	+ Ensure that all created products that were entered into the database are populated on the front-end of the web application, specifically on the product listing page
	+ Ensure that a user can only upload an image, i.e jpgs,gifs,pngs, for the product photo.
	+ View a list of  all created products.
	+ Edit and change product details for a selected product. Example, product quantity, price, etc.
	
* Search Module 
	+ Visitors to the web application should be able to search for products via a category. 
	
4. This is the 4th milestone of the project. This can be regarded as the very core of the project. In this phase, a detail page for each product will be created. The shopping cart implementation is also found at this stage.

* Product Description Page
	+ Only logged in users should be able to “purchase”  products by adding selected products to their shopping cart.
	+ From the product listing page and from the Best Seller section on the home page, when a user clicks on a particular product, they should be navigated to the Product Description page of the clicked product and from that page they can add the product to their shopping cart.
	+ When the user clicks the “Add to Cart” button, the given product will be added to the user's shopping Cart.
	
* Shopping Cart Module 
	+ "Place Order" button should clear cart.
	+ Send an email to the logged in user’s email, indicating all the products purchased and the quantity amount for each product purchased as well as the user’s order total.  
	+ Subtract the quantity purchased from inventory (for each product).
	+ Note, a user should not be able to add a product to their shopping cart if the quantity for the given product is 0


 

