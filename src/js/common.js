//////////////////////////////////
/// Replaces an element by another.
/// The params could be the elements themselves
/// or their id
//////////////////////////////////
function replaceElement(replaced, replacement)
{
	if (typeof(replaced) == "string")
		replaced = document.getElementById(replaced);

	if (typeof(replacement) == "string")
		replacement = document.getElementById(replacement);

	replaced.style.display = "none";
	replacement.style.display = "block";
}
