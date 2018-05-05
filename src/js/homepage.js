//////////////////////////////////
/// Hides the login section and
/// displays the sign-up section
//////////////////////////////////
function showSignUpSection()
{
	document.getElementById("login-section").style.display = "none";
	document.getElementById("sign-up-section").style.display = "block";
}
//////////////////////////////////
/// Hides the sign-up section and
/// displays the login section
//////////////////////////////////
function showLogInSection()
{
	document.getElementById("sign-up-section").style.display = "none";
	document.getElementById("login-section").style.display = "block";
}
