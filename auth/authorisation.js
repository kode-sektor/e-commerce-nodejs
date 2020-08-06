

const dashBoardLoader = (req, res, next) => {

	/*If loggedin and admin, redirect to adminDashboard*/

	/*Note 'loggedin' comes from another auth file*/

	console.log("STATE OF SESSION IN AUTHORISATION.JS", req.session);

    if (req.session.userDetails.admin!=="true") {
        res.redirect("/user/dashboard");
    } else {
    	next();
    }
}

module.exports = dashBoardLoader;