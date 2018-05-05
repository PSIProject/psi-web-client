/////////////////////////////////////
/// Displays a message in a toast.
/////////////////////////////////////
function showToast(message, scheme = DarkToast)
{
	var toast = document.getElementById("toast");

	toast.style.backgroundColor = scheme.background;
	toast.style.color = scheme.color;
	toast.innerHTML = message;
	toast.className += " show-toast";

	setTimeout (function() {  toast.className = toast.className.replace("show-toast", "");  }, 3000);
}

/// Predefined color schemes for toasts ;)
const DarkToast  = {background: "#333",    color: "white"};
const BlueToast  = {background: "#2195f3", color: "white"};
