
// If not logged in, redirect to homepage

const redirHome = (req, res, next) => {
	
	console.log ("STATE OF SESSION IN AUTH.JS: ", req.session);
    if (req.session.userDetails) {
        next();	// this checks authorisation.js auth next
    } else {
        res.redirect("/")
    }
}

module.exports = redirHome;