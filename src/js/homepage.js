//////////////////////////////////
/// Verifies that the nick is available.
/// If it's not, displays a message,
/// clears the input and sets focused
//////////////////////////////////
function verifyNickAvailability(input)
{
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
		if (this.readyState != 4 || this.status != 200)
			return;

		if (this.responseText == "false")
		{
			input.value = "";
			document.getElementById("unavailable-nick-message").style.display = "block";
		}
		else
		{
			document.getElementById("unavailable-nick-message").style.display = "none";
		}
	}
	xhr.open("POST", "php/is-not-registered.php");
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send("nick=" + input.value);
}

//////////////////////////////////
/// Verifies that the email is available.
/// If it's not, displays a message,
/// clears the input and sets focused
//////////////////////////////////
function verifyEmailAvailability(input)
{
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
		if (this.readyState != 4 || this.status != 200)
			return;

		if (this.responseText == "false")
		{
			input.value = "";
			input.focus();
			document.getElementById("unavailable-email-message").style.display = "block";
		}
		else
		{
			document.getElementById("unavailable-email-message").style.display = "none";
		}
	}
	xhr.open("POST", "php/is-not-registered.php");
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send("email=" + input.value);
}

//////////////////////////////////
/// Verifies that both password
/// match. If they don't match,
/// clear both fields and gives
/// focus to the first one.
//////////////////////////////////
function verifyPasswordsMatch()
{
	var form = document.forms ["sign-up-form"];
	var passwordField = form ["sign-up-password"];
	var confirmPasswordField = form ["sign-up-confirm-password"];

	if (passwordField.value != confirmPasswordField.value)
	{
		passwordField.value = confirmPasswordField.value = "";
		passwordField.focus();
		showToast("Passwords don't match");
	}
}

//////////////////////////////////
/// Sends sign up request to the server
/// using sign-up form's data
//////////////////////////////////
function signUp()
{
	var signUpForm = document.forms ["sign-up-form"];
	var collaboratorData = new Object();
	collaboratorData.name     = signUpForm ["sign-up-name"].value;
	collaboratorData.lastName = signUpForm ["sign-up-last-name"].value;
	collaboratorData.nick     = signUpForm ["sign-up-nick"].value;
	collaboratorData.email    = signUpForm ["sign-up-email"].value;
	collaboratorData.password = signUpForm ["sign-up-password"].value;

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
		if (this.readyState != 4 || this.status != 200)
			return;

		signUpForm.reset();

		if (this.responseText == "ok")
		{
			showToast("Everything went ok", BlueToast);
			replaceElement('sign-up-section', 'login-section');
		}
		else
		{
			showToast("Ups, something went wrong");
		}
	}
	xhr.open("POST", "php/sign-up.php");
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send("collaborator_data=" + JSON.stringify(collaboratorData));
}
