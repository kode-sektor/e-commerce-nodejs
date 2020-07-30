

const dashBoardLoader = (req, res) => {

	/*If loggedin and admin, redirect to adminDashboard*/

	/*Note 'loggedin' comes from another auth file*/

	console.log("STATE OF SESSION IN AUTHORISATION.JS", req.session);

    if (req.session.userDetails.admin=="true") {
        res.redirect("/admin/admin-dashboard");
    } else  /*If loggedin but not regular user redirect to userDashboard*/ {
        res.redirect("/user/profile");
    }
}

module.exports = dashBoardLoader;