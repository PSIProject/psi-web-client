//////////////////////////////////
/// Defines the sections of the
/// app. They're used as argument
/// of goToSection().
//////////////////////////////////
const Sections =
{
	Home:		"home-section",
	NewTeam:	"new-team-section",
	Team:		"team-section",
	Teams: 		"teams-section"
};

var currentSection = Sections.Home;		/// Holds app's current section
var team =								/// Holds info of the team which is being visualization
{
	name: null,		/// Team's name
	members: null	/// Team's number of members
};

//////////////////////////////////
/// Replace currentSection by the
/// given section.
//////////////////////////////////
function goToSection(section)
{
	if (currentSection == section)
		return;

	// Unhighlight current section in nav bar
	switch (currentSection)
	{
		case Sections.Home:
			document.getElementsByClassName("selected-nav-item") [0].classList.remove("selected-nav-item");
		break;

		case Sections.Team:
			team.name = team.members = null;
		break;

		case Sections.Teams:
			document.getElementsByClassName("selected-nav-item") [0].classList.remove("selected-nav-item");
	}


	replaceElement(currentSection, section);
	currentSection = section;

	// Highlight current section in nav bar
	switch (currentSection)
	{
		case Sections.Home:
			document.getElementById("nav-item-home").classList.add("selected-nav-item");
		break;

		case Sections.Team:
			document.getElementById("team-section-team-name").innerHTML = team.name;
		break;

		case Sections.Teams:
			document.getElementById("nav-item-teams").classList.add("selected-nav-item");
			getTeams();
	}
}

//////////////////////////////////
/// Tries to create a new team
/// for the current user. If everything
/// was ok, moves to Sections.Team,
/// else clears the form and launches
/// an error in a toast.
//////////////////////////////////
function createTeam()
{
	var newTeamForm = document.forms ["new-team-form"];
	var teamNameField = newTeamForm ["new-team-name"];

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
		if (this.readyState != 4 || this.status != 200)
			return;

		if (this.responseText == "true") /// If the team was created
		{
			showToast("Team was created", BlueToast);
			teamName = teamNameField.value;
			goToSection(Sections.Team);
		}
		else if (this.responseText == "already exist") /// If there is another team with that name
		{
			showToast("You already have a team with that name");
		}
		else // Any other error
		{
			showToast("Sorry, there was a problem creating your team");
		}

		newTeamForm.reset();
	}
	xhr.open("POST", "php/create-team.php");
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send("name=" + teamNameField.value);
}

//////////////////////////////////
/// Gets the list of teams of the user
/// an display them in teams-area div
//////////////////////////////////
function getTeams()
{
	var teamsArea = document.getElementById("teams-area");

	/// Remove child nodes
	while (teamsArea.firstChild)
		teamsArea.removeChild(teamsArea.firstChild);

	/// Get teams
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
		if (this.readyState != 4 || this.status != 200)
			return;

		var teams = JSON.parse(this.responseText);
		for (var i = 0; i < teams.length; i++)
		{
			var team = teams [i];
			var teamElement = document.createElement("div");
			teamElement.className = "scroll-area-row text-button";
			teamElement.innerHTML = team.name + " - ";
			teamElement.setAttribute("onclick", "team.name = '" + team.name + "'; team.members = " + team.members + "; goToSection(Sections.Team)");

			var membersElement = document.createElement("span");
			var membersIcon = document.createElement("span");
			membersIcon.className = "fa fa-users";

			membersElement.appendChild(membersIcon);
			membersElement.innerHTML += " " + team.members;

			teamElement.appendChild(membersElement);
			teamsArea.appendChild(teamElement);
		}
	}
	xhr.open("GET", "php/get-user-teams.php");
	xhr.send();
}

//////////////////////////////////
/// Logs out. Redirects to homepage
//////////////////////////////////
function logOut()
{
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
		if (this.readyState != 4 || this.status != 200)
			return;

		document.location.href = "homepage.html";
	}
	xhr.open("GET", "php/log-out.php");
	xhr.send();
}

//////////////////////////////////
/// Verifies that the user has logged in.
/// If it hasn't, redirects to homepage
//////////////////////////////////
window.onload = function()
{
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
		if (this.readyState != 4 || this.status != 200)
			return;

		if (this.responseText == "false")
			document.location.href = "homepage.html";
	}
	xhr.open("GET", "php/has-logged-in.php");
	xhr.send();
}
