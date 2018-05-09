//////////////////////////////////
/// Defines the sections of the
/// app. They're used as argument
/// of goToSection().
//////////////////////////////////
const Sections =
{
	AddMember:  "add-member-section",
	Home:		"home-section",
	NewGoal:	"new-goal-section",
	NewTeam:	"new-team-section",
	Team:		"team-section",
	Teams: 		"teams-section"
};

//////////////////////////////////
/// Defines the subsections of the app.
/// They're used as argument of showSubsection()
//////////////////////////////////
const Subsections =
{
	Goals: "goals-subsection",
	Members: "members-subsection"
};

var currentSection = Sections.Home;		/// Holds app's current section
var currentSubsection = null;			/// Holds app's current subsection

var team =								/// Holds info of the team which is being visualization
{
	name: null,		/// Team's name
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
			document.getElementById("nav-item-home").classList.remove("selected-section-selector");
		break;

		case Sections.Team:
			team.name = null;
		break;

		case Sections.Teams:
			document.getElementById("nav-item-teams").classList.remove("selected-section-selector");
	}


	replaceElement(currentSection, section);
	currentSection = section;

	// Highlight current section in nav bar
	switch (currentSection)
	{
		case Sections.Home:
			document.getElementById("nav-item-home").classList.add("selected-section-selector");
		break;

		case Sections.NewGoal:
			var newGoalForm = document.forms ["new-goal-form"];
			newGoalForm.reset();
			newGoalForm ["new-goal-name"].focus();
		break;

		case Sections.Team:
			document.getElementById("team-section-team-name").innerHTML = team.name;
		break;

		case Sections.Teams:
			document.getElementById("nav-item-teams").classList.add("selected-section-selector");
			getTeams();
	}
}

//////////////////////////////////
/// Hides current subsection and
/// shows the given subsection
//////////////////////////////////
function showSubsection(subsection)
{
	if (currentSubsection)
	{
		document.getElementById(currentSubsection + "-selector").classList.remove("selected-section-selector");
		document.getElementById(currentSubsection).style.display = "none";
	}

	currentSubsection = subsection;
	document.getElementById(currentSubsection + "-selector").classList.add("selected-section-selector");
	document.getElementById(currentSubsection).style.display = "block";

	switch (currentSubsection)
	{
		case Subsections.Goals:		getTeamGoals(); break;
		case Subsections.Members:	getTeamMembers();
	}
}

//////////////////////////////////
/// Prepare team data to go to
/// team section.
/// Param teamName is displayed as
/// header in team section.
/// If teamId is specified, it's stored
/// in server.
//////////////////////////////////
function prepareTeamData(teamName, teamId = null)
{
	team.name = teamName;
	goToSection(Sections.Team);

	if (teamId == null)
	{
		showSubsection(Subsections.Goals);
		return;
	}

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
		if (this.readyState != 4 || this.status != 200)
			return;

		var serverResponse = JSON.parse(this.responseText);

		if (serverResponse.status == "ok")
			showSubsection(Subsections.Goals);
		else
			showToast("Sorry, something went wrong");
	}
	xhr.open("POST", "php/store-team-id.php");
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send("team_id=" + teamId);
}

//////////////////////////////////
/// Tries to create a goal in server
/// for current
//////////////////////////////////
function createGoal()
{
	var goalName = document.forms ["new-goal-form"] ["new-goal-name"].value;

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
		if (this.readyState != 4 || this.status != 200)
			return;

		var serverResponse = JSON.parse(this.responseText);
		if (serverResponse.status == "ok")
		{
			showToast("Goal was created", BlueToast);
		}
		else if (serverResponse.status == "already exist")
		{
			showToast("You already have a goal with that name");
		}
		else
		{
			showToast("Sorry, there was a problem creating your goal");
		}
	}
	xhr.open("POST", "php/create-goal.php");
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send("name=" + goalName);
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

		var serverResponse = JSON.parse(this.responseText);
		if (serverResponse.status == "ok") /// If the team was created
		{
			showToast("Team was created", BlueToast);
			prepareTeamData(teamNameField.value);
			goToSection(Sections.Team);
		}
		else if (serverResponse.status == "already exist") /// If there is another team with that name
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
			teamElement.setAttribute("onclick", "prepareTeamData('" + team.name + "', " + team.id + ")");

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
/// Get the goals of a selected
/// team and displays them in
/// goals-area
//////////////////////////////////
function getTeamGoals()
{
	var goalsArea = document.getElementById("goals-area");
	while (goalsArea.firstChild)
		goalsArea.removeChild(goalsArea.firstChild);

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
		if (this.readyState != 4 || this.status != 200)
			return;

		if (! this.responseText.length)
			return;

		var goals = JSON.parse(this.responseText);
		for (var i = 0; i < goals.length; i++)
		{
			var goal = goals [i];
			var goalElement = document.createElement("div");
			goalElement.className = "scroll-area-row text-button";
			goalElement.innerHTML = goal.name;
			goalsArea.appendChild(goalElement);
		}
	}
	xhr.open("GET", "php/get-team-goals.php");
	xhr.send();
}

//////////////////////////////////
/// Gets team members and displays them
/// in members area
//////////////////////////////////
function getTeamMembers()
{
	var membersArea = document.getElementById("members-area");
	while (membersArea.firstChild)
		membersArea.removeChild(membersArea.firstChild);

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
		if (this.readyState != 4 || this.status != 200)
			return;

		var members = JSON.parse(this.responseText);
		for (var i = 0; i < members.length; i++)
		{
			var member = members [i];
			var memberElement = document.createElement("div");
			memberElement.className = "scroll-area-row text-button";
			memberElement.innerHTML = member.name + " ";

			var removeMemberIcon = document.createElement("span");
			removeMemberIcon.className = "fa fa-times";

			memberElement.appendChild(removeMemberIcon);
			membersArea.appendChild(memberElement);
		}
	}
	xhr.open("GET", "php/get-team-members.php");
	xhr.send();
}

//////////////////////////////////
/// Search all the users which nick
/// seems like the value of search-user-nick
/// field. Displays them in a list
//////////////////////////////////
function searchUsers()
{
	var keyword = document.forms ["search-user-form"] ["search-user-nick"].value;

	var foundUsersArea = document.getElementById("found-users-area");
	while (foundUsersArea.firstChild)
		foundUsersArea.removeChild(foundUsersArea.firstChild);

	if (! keyword.length)
		return;

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
		if (this.readyState != 4 || this.status != 200)
			return;

		var foundUsers = JSON.parse(this.responseText);
		for (var i = 0; i < foundUsers.length; i++)
		{
			var foundUser = foundUsers [i];
			var userElement = document.createElement("div");
			userElement.className = "scroll-area-row text-button";
			userElement.innerHTML = foundUser.nick;
			foundUsersArea.appendChild(userElement);
		}
	}
	xhr.open("POST", "php/search-users.php");
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send("keyword=" + keyword);
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

		var serverResponse = JSON.parse(this.responseText);
		if (serverResponse.status == "false")
			document.location.href = "homepage.html";
	}
	xhr.open("GET", "php/has-logged-in.php");
	xhr.send();
}
