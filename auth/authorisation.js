

const dashBoardLoader = (req, res) => {

	/*If loggedin and admin, redirect to adminDashboard*/

	/*Note 'loggedin' comes from another auth file*/

    if (req.session.userDetails.admin=="true") {

        //res.render("User/adminDashBoard");
        res.redirect("/user/admin-dashboard");

    } else  /*If loggedin but not regular user redirect to userDashboard*/ {
        //res.render("User/userDashboard");
        res.redirect("/");
    }

}

module.exports = dashBoardLoader;