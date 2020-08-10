
const capitalise = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
}


const html = document.documentElement; 

const adminDashboard = document.querySelector(".admin-dashboard-page");
const productListing = document.querySelector(".product-listing-page");
const shoppingCart = document.querySelector(".shopping-cart-page");
const productDetails = document.querySelector(".details-page");
const userDashboard = document.querySelector(".user-dashboard-page");

const loginClose = document.getElementById('login-close');
const accountClose = document.getElementById('account-close');
const userAvatar = document.getElementById('login-create-account');
const createAcctBtn = document.getElementById('create-account-btn');
const createAcctModal = document.getElementById('create-account-modal');
const loginForm = document.getElementById('user-details-login');

const toggleBtn = document.getElementById('toggle-btn-nav');
const nav = document.getElementById('navigation');

const signUp = document.getElementById('signup');
const backToLogin = document.getElementById('backToLogin');

// Hide all modals once with 'Esc'. 
document.addEventListener('keydown', function(event) {
    let escKey = event.key; // Or const {key} = event; in ES6+
    if (escKey === "Escape") {
    	html.classList.remove('active');	// toggle the first panel 
    	createAcctModal.classList.remove('active');
    }
});

// Listen to click on userAvatar icon and add a class of active to :root
// which is responsible for sliding in the login form by virtue 
// of contextual selection and transform property

if (userAvatar) {
    userAvatar.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.querySelector('input:first-of-type').focus();

        html.classList.toggle('active');  // toggle the first panel 

        // Toggling the second panel (Create Account form) will be out of sync if 
        // its currently hidden while the Login form is on display. You should only
        // toggle it when it's on display while the Login form is on display or if 
        // both are hidden 

        // And at the same time, it should not be toggled right from page load 
        // because user is to first interact with login form. Hence only determine to 
        // toggle it when the user as interacted with it by clicking the 'Create Account'
        // button

        if ((createAcctBtn.textContent).toLowerCase() == "back to login") {
          createAcctModal.classList.toggle('active');
        } 
    });
}

// On (re-)load event that arises from the user submitting login form, the same class
// 'active' used to slide out the form on click is the same class passed in through
// when loading. Thus when form slides in onload, the 'Create an Account' button 
// responsible for toggling it should have it's text correspond to the panel's visibility

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
// for sliding in the LOGIN form

loginClose.addEventListener('click', (e) => {
	  e.preventDefault();
  	html.classList.remove('active');
});

let open = false;

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

// Listen to click event on 'signUp' button and toggle 'Create an Account'
// button's text as well as the 'Create Account' form

// Just simply make it act like the 'Create Account' button so there's no 
// conflict in all the modal relationships at any screen width
signUp.addEventListener('click', (e) => {
	  e.preventDefault();
	  open = !open;
  	createAcctModal.classList.toggle('active');

  	if (open) {	// first-time click (true) made true by 3 lines up
  		(createAcctBtn).textContent = "Back to Login";
  	} else {	// second-time click (false)
  		(createAcctBtn).textContent = "Create an Account";
  	}
});

backToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    open = !open;
  	createAcctModal.classList.toggle('active');

  	if (open) {	// first-time click (true) made true by 3 lines up
  		  (createAcctBtn).textContent = "Back to Login";
  	} else {	// second-time click (false)
  		  (createAcctBtn).textContent = "Create an Account";
  	}
});

// Listen to click of 'fa-close' button on ACCOUNT form and slide out Account Form
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



// ADDRESS ADMIN DASHBOARD PAGE (OBTAINED FROM CLASS ON BODY)

if (adminDashboard) {

    const closeBtn = document.getElementById("close-product-form");
    const formBg = document.getElementById("product-upload");
    const confirmDelete = document.getElementById("confirm-delete");
    const trashForm = document.getElementById("deleteRec");
    const form = document.getElementById("form-product");
    const productAddBtn = document.getElementById("product-add");

    const deleteCancel = document.querySelector(".deleteCancel");
    const closeForm = document.querySelector("#close-confirm-delete");

    const trashBtns = document.querySelectorAll(".trash-ctrl");

    const productCat = document.getElementById("product-category");
    const delProdTitle = document.getElementById("deleteProdTitle");

    // On click of 'Add Product' button, slide form down
    productAddBtn.addEventListener('click', (e) => {
        e.preventDefault();

        formBg.classList.add("open"); 

        // Clear form fields
        form.querySelectorAll("input:not(input[type=radio]):not(input[type=checkbox]").forEach((elm) => {
            elm.value = "";
        });

        // Change text on submit button
        form.querySelector('.login-btn').textContent = "Add Product";

        // Change form's action
        form.action = "/admin/add-product";

    });

    // On 'close button' click, slide form up
    document.addEventListener('keydown', function(event) {
        const key = event.key; // Or const {key} = event; in ES6+
        if (key === "Escape") {
            formBg.classList.remove("open");
            confirmDelete.classList.remove("open");
        }
    });

    closeBtn.addEventListener('click', (e) => {
        formBg.classList.remove("open");
    });

    // Handle 'Confirm' modal
    [deleteCancel, closeForm].forEach((item)=> {
        item.addEventListener('click', e => {
            e.preventDefault();
            confirmDelete.classList.remove("open");
        });
    });

    // Handle click on 'Trash' icon
    // On click of 'Trash', get id of record and insert into Form's method
    trashBtns.forEach((trash) => {
        trash.addEventListener('click', (e) => {
            confirmDelete.classList.add("open");    // Show form

            const dataId = (e.target).getAttribute("data-id");
            const dataTitle = (e.target).getAttribute("data-title");

            const imgPath = (e.target).getAttribute("data-imgPath")

            trashForm.querySelector("#deleteImg").value = imgPath;

            delProdTitle.textContent = dataTitle;   // Insert name of product in modal
            trashForm.setAttribute('action', `/admin/del/${dataId}?method=DELETE`); // Prepare form for particular record to delete
        });
    });


    // This handles the preselection of the select options when user clicks edit. 
    // (When user clicks the 'Edit' button, data is fetched from the DB and loaded into both
    // the table/list of all product records and then the form that will hold the details of 
    // that particular record.) But preloading for select is difficult because the option 
    // elements are built with a loop. 

    // Hence the idea is to still pass in the category for the individual record clicked in a 
    // data-id on the select container, and then use JavaScript here to find the matching 
    // option and preselect it

    let dataCategProductCat = productCat.getAttribute("data-category");

    dataCategProductCat = capitalise(dataCategProductCat);
    productCat.querySelector(`option[value=${dataCategProductCat}]`).setAttribute("selected", "selected");

}

// USER DASHBOARD PAGE 

if (userDashboard) {

    const tabLink = document.querySelectorAll(".tab-link"); // listen to click on tab link
    let href = "";

    tabLink.forEach((tablink) => {
        tablink.addEventListener("click", (e) => {
            e.preventDefault();
            href = (e.target).href; // fetch its href
            href = href.slice(href.lastIndexOf("#") + 1);   // strip of "#" from #orders

            document.querySelector(".tab-content.is-active").classList.remove("is-active"); // remove any "is-active"
            document.querySelector(".tab-link.is-active").classList.remove("is-active"); // remove any "is-active"

            const tabPanel = document.getElementById(href); // select corresponding panel
            tabPanel.classList.add("is-active");    // make visible
            (e.target).classList.add("is-active");
        }); 
    });

}

// PRODUCT LISTING PAGE

if (productListing) {
    // Listen to change event on dropdown and fire submit event

    const form = document.getElementById("product-filter");
    const slctFilter = document.getElementById("filter-search");
    const filterSearchOption = document.querySelectorAll("#filter-search option");

    slctFilter.addEventListener("change", (e) => {
        form.submit();
    });
}

// PRODUCT DETAILS PAGE

if (productDetails) {

    // Dynamically generate old price
    const $price = document.querySelector(".product-details-container .price");
    const $oldPrice = document.querySelector(".product-details-container .old-price");

    const price = Number($price.innerText);

    let oldPrice = (price * 1.25);  // Multiply new price by 1.25
    $oldPrice.textContent = oldPrice + " $CAD";

}


// SHOPPING CART 

if (shoppingCart) {

    let totalCost = TotalCost = totalQty = greatGrandTotal = 0;

    const $transaction = document.getElementById("transaction");

    const $cartRow = document.querySelectorAll(".cart-record");
    const $grandTotalContainer = document.getElementById("cart-grand-total");
    const $grandTotal = document.querySelector("#cart-grand-total b");   // total
    const $transactionCost = document.getElementById("transaction-cost");

    const $totalItems = document.querySelector(".cart-title .total");
    const $qtyOutput = document.querySelector(".cart-title .total output");

    const $transactionQtyOutput = document.querySelector("#transaction-total strong");

    const $transactionApplyBtn = document.querySelector("#transaction-btn-apply");

    const $cartShipping = document.querySelector("#select-shipping");
    const $greatGrandTotal = document.querySelector("#transaction-cost-grand");

    const $noProduct = document.getElementById("no-product");

    const $hdnProducts = document.getElementById("hdn-products");
    const $hdnTotalItems = document.getElementById("hdn-total-items");
    const $hdnTotalCost = document.getElementById("hdn-total-cost");
    const $hdnGrandTotalCost = document.getElementById("hdn-grand-total-cost");


    // This will store the user's cart details and will be passed to a hidden input in stringified format
    // When the user clicks "Place Order", the details will be sent to the server where it will be 
    // broken down and sent as the user's order details via mail

    let orderProduct = [];       // Will be in the form of "{productName : price}"


    const calcTotal = (qty, price) => {
        return (qty * price).toFixed(2);
    }

    const reset = () => {
        totalCost = TotalCost = totalQty = greatGrandTotal = 0;
    }

    const computeCart = () => {

        if ($cartRow) {

            $cartRow.forEach((cart, indx) => {

                let origQty = (cart).getAttribute("data-quantity");
                let qty = Number((cart).querySelector(".quantity-form").value); // quantity in value (not HTML element)
                let price = Number((cart).querySelector(".cart-price span").innerText); // price in value
                let total = (cart).querySelector(".cart-total span");   // total

                // Product name required for passing back to form to be sent as Order details in the form of mail
                let product = ((cart).querySelector(".product-title")).innerText;   

                totalCost = calcTotal (qty, price);    // calculate the cost (quantity * price)
                total.textContent = totalCost;      // input cost into HTML

                 // fetch newly calculated cost
                TotalCost += Number(totalCost);   // add to it on every loop (does not work without Number?...)

                totalQty += qty;    // also add up all cart item quantity



                // Insert grandtotal on last laop
                if (indx == $cartRow.length - 1) {
                    $grandTotal.textContent = (TotalCost.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));
                    $hdnTotalCost.value = (TotalCost.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')); // for Order details

                    // take cost to transaction section
                    $transactionCost.textContent = (TotalCost.toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');    

                    $qtyOutput.textContent = (totalQty);   // insert quantity
                    $transactionQtyOutput.textContent = (totalQty);  // take quantity transaction section
                    $hdnTotalItems.value = (totalQty);  // Total Quantity for Order details


                    // Calculate the great grand total by adding grand total with shipping costs
                    let cartShippingVal = Number($cartShipping.value);
                    greatGrandTotal = (TotalCost + cartShippingVal).toFixed(2);

                    $greatGrandTotal.textContent = greatGrandTotal;
                    $hdnGrandTotalCost.value = greatGrandTotal; // Great grand total for the Order details


                    // For the order, if this is the last loop, then send the stringified Order details to the
                    // hidden inputs and reset the Order object to 0

                    $hdnProducts.value = JSON.stringify(orderProduct);;

                }

                // Populate the orderProduct Array

                let orderProductQty = `${product} (${qty})`;
                let orderPrice = price;

               // console.log(orderProductQty, orderPrice);
                orderProduct.push({[orderProductQty] : orderPrice});

            });

        }

    }

    computeCart();  // calculate cart on load event

    const $qty = document.querySelectorAll(".quantity-form");   // On change of product quantity, reset and recalculate cart
    $qty.forEach((qty) => {
        qty.addEventListener("change", (e) => {

            // Fetch original Quantity of products left which is a data-attr on each row. Find it by 
            // clawing way up and compare it to value user inserts

            // If greater, alert error but if less move on to recalculate costs

            let productRow = (qty).parentElement.parentElement; 
            let origQty = productRow.getAttribute("data-quantity");
            let quantity = (qty).value;

            //console.log (origQty, quantity);

            if (Number(quantity) > Number(origQty)) {
                (qty).value = 1;    // reset
                alert ("There are only " + origQty + " left in stock. Please buy less");
            } else {
                reset();    // First reset by setting all quantities and costs to 0
                computeCart();  // Then move on to recalculate price
            }
        });
    });

    // If no cart products, hide some details on the page like grand total, items etc. 
    // as it does not make sense

    if ($noProduct)  {
        [$totalItems, $grandTotalContainer, $transaction].forEach( item => {
            item.classList.add("hide");
        });
    } else {
        [$qtyOutput, $grandTotalContainer, $transaction].forEach( item => {
            item.classList.remove("hide");
        });
    }
}

