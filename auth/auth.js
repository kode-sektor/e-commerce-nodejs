
// If not logged in, redirect to homepage

const isLoggedIn = (req, res, next) => {
	
	console.log ("STATE OF SESSION IN AUTH.JS: ", req.session);
    if (req.session.userDetails.admin == "true") {
        res.redirect("/admin/admin-dashboard");
    } else if (!req.session.userDetails) {
        res.redirect("/user/login")
    } else {
    	next();
    }
}

module.exports = isLoggedIn;