
// If not logged in, redirect to homepage

const isLoggedIn = (req, res, next) => {
	
	console.log ("STATE OF SESSION IN AUTH.JS: ", req.session);
    if (req.session.userDetails) {
        next();	// this checks authorisation.js auth next
    } else {
        res.redirect("/user/login")
    }
}

module.exports = isLoggedIn;