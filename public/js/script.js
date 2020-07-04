
const html = document.documentElement; 

const loginClose = document.getElementById('login-close');
const accountClose = document.getElementById('account-close');
const userAvatar = document.getElementById('login-create-account');
const createAcctBtn = document.getElementById('create-account-btn');
const createAcctModal = document.getElementById('create-account-modal');
const loginForm = document.getElementById('user-details-login');

const toggleBtn = document.getElementById('toggle-btn-nav');
const nav = document.getElementById('navigation');


userAvatar.addEventListener('click', (e) => {
	e.preventDefault();
  	html.classList.add('active');
  	loginForm.querySelector('input[type="text"]:first-of-type').focus();
});

loginClose.addEventListener('click', (e) => {
	e.preventDefault();
  	html.classList.remove('active');
});

// Listen to click of 'Create Account' button and slide in Account Form
let open = false;
createAcctBtn.addEventListener('click', (e) => {
	e.preventDefault();
	open = !open;
  	createAcctModal.classList.toggle('active');

  	if (open) {
  		(e.target).textContent = "Back to Login";
  	} else {
  		(e.target).textContent = "Create an Account";
  	}

});

// Listen to click of 'fa-close' button on account form and slide out Account Form
accountClose.addEventListener('click', (e) => {
	e.preventDefault();
  	createAcctModal.classList.remove('active');
});

// Listen to click of 'toggle' button and add class that toggles nav opacity
toggleBtn.addEventListener('click', (e) => {
	nav.classList.toggle('reveal');
});