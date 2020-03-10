var attempt = 3; //Variable to count number of attempts

//Below function Executes on click of login button
function validate(){
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;

	if ( username == "Marina" && password == "frog"){
		alert ("Login successfully");
		window.location = "closet.html"; //redirecting to other page
		return false;
	}
	if ( username == "Aine" && password == "kitty"){
		alert ("Login successfully");
		window.location = "closet.html"; //redirecting to other page
		return false;
	}
	if ( username == "Emma" && password == "shop"){
		alert ("Login successfully");
		window.location = "closet.html"; //redirecting to other page
		return false;
	}
	if ( username == "Mya" && password == "tattooonheart"){
		alert ("Login successfully");
		window.location = "closet.html"; //redirecting to other page
		return false;
	}
	else{
		attempt --;//Decrementing by one
		alert("You have left "+attempt+" attempt;");
		
		//Disabling fields after 3 attempts
		if( attempt == 0){
			document.getElementById("username").disabled = true;
			document.getElementById("password").disabled = true;
			document.getElementById("submit").disabled = true;
			window.location = "home.html";
			return false;
		}
	}
}