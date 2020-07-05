
const html = document.documentElement; 

const loginClose = document.getElementById('login-close');
const accountClose = document.getElementById('account-close');
const userAvatar = document.getElementById('login-create-account');
const createAcctBtn = document.getElementById('create-account-btn');
const createAcctModal = document.getElementById('create-account-modal');
const loginForm = document.getElementById('user-details-login');

const toggleBtn = document.getElementById('toggle-btn-nav');
const nav = document.getElementById('navigation');

// Listen to click on userAvatar icon and add a class of active to :root
// which is responsible for sliding in the login form by virtue 
// of contextual selection and transform property

userAvatar.addEventListener('click', (e) => {
	e.preventDefault();
  	html.classList.add('active');
  	loginForm.querySelector('input[type="text"]:first-of-type').focus();
});

// On (re-)load event that arises from the user submitting login form, the same class
// 'active' used to slide out the form on click is the same class passed in through
// when loading. Thus when form slides in onload, the 'Create an Account' button 
// responsible for toggling it should have it's text correspond to the panel's visibility

let open = false;
window.addEventListener('DOMContentLoaded', (event) => {
	if (createAcctModal.classList.contains('active')) {
		if (createAcctBtn.textContent.toLowerCase() != "back to login") {
			open = true; // first-time click (true)
			createAcctBtn.textContent = "Back to Login";			
		}
	} else {
		createAcctBtn.textContent = "Create an Account";
	}  
});

// Listen to click of 'X' icon and remove the helper class responsible
// for sliding in the login form

loginClose.addEventListener('click', (e) => {
	e.preventDefault();
  	html.classList.remove('active');
});

// Listen to click of 'Create Account' button and slide in Account Form
createAcctBtn.addEventListener('click', (e) => {
	e.preventDefault();
	open = !open;
  	createAcctModal.classList.toggle('active');

  	if (open) {	// first-time click (true) made true by 3 lines up
  		(e.target).textContent = "Back to Login";
  	} else {	// second-time click (false)
  		(e.target).textContent = "Create an Account";
  	}

});

// Listen to click of 'fa-close' button on account form and slide out Account Form
accountClose.addEventListener('click', (e) => {
	e.preventDefault();
  	createAcctModal.classList.remove('active');

	open = false; // should be set to false so that first-time click would set it to true
	createAcctBtn.textContent = "Create an Account";			
});

// Listen to click of 'toggle' button and add class that toggles nav opacity
toggleBtn.addEventListener('click', (e) => {
	nav.classList.toggle('reveal');
});



