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

	+ For the login form, only nulls would be checked for (i.e, check to see if the user entered a value in the respective text fields). However, for the registration form, nulls would be checked for. Also there would be an implementation of at least 2 complex validation criteria using regular expressions on two separate fields(For example, enforcing that the user must enter a password that is 6 to 12 characters and the password must have letters and numbers only)  . 

	+ Form would not clear the data entered in the form if there are validation errors.

	+ All error messages would be rendered on their respective pages or areas and must be styled properly.

* User Registration Form (Sending Emails)

	+ When a user fills out the registration form and then hits the submit button, provided that all the validation criteria were not violated, your website must then send a welcome email message to the user’s email address and then redirect the user to a dashboard page. For now, the dashboard page should contain information welcoming the user and should be properly styled.

