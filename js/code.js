const urlBase = 'http://pair-a-dice.online/LAMPAPI';
const extension = '.php';

let userId = 0;
let firstName = "";
let lastName = "";

let currName = "";

//Function to LOG IN a user
function doLogin(givenUserName, givenPassword)
{
    //Declare variables
    userId = 0;
    firstName = "";
    lastName = "";
    let login;
    let password;

    //If doLogin is NOT called after registration
    if(givenUserName == "" || givenPassword == "")
    {
        login = document.getElementById("userName").value;
	    password = document.getElementById("password").value;
    }
    //If doLogin IS called after registration
    else
    {
        login = givenUserName;
        password = givenPassword;
    }
    

	
	let hash = md5( password );

    //Tmp JSON stuff
	//let tmp = {login:login,password:password}; //key value pairs as js object
	let tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify(tmp);

    //XHR Request stuff
	let url = urlBase + '/Login' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{

			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;

				if( userId < 1 )
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
                saveCookie();
				window.location.href = "contact.html";
        
			}
            console.log("username is " + login + " and password is " + password);

		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}


//Function to SIGN UP a user
function doSignup()
{
    //Variable initialization
    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;
    let username = document.getElementById("userName2").value;
    let password = document.getElementById("password2").value;

    

	let hash = md5( password );


    let tmp = {firstName: firstName,lastName:lastName,login: username,password: hash};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Register'+ extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {

        xhr.send(jsonPayload);

        xhr.onreadystatechange = function () {
            if (this.readyState != 4) {
                return;
            }

            if (this.status == 409) {


                document.getElementById("SignUpResult").innerHTML = "User already exists";
                return;
            }

            if(this.status == 404)
            {
                alert(url + ' replied 404');
            }

            if (this.status == 200) {

                let jsonObject = JSON.parse(xhr.responseText);


                userId = jsonObject.id;


                document.getElementById("SignUpResult").innerHTML = "User added";


                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;
                saveCookie();

                //Call doLogin with newly registered username and password
                doLogin(username, password);

            }

        };



        xhr.send(jsonPayload);



    } catch (err) {


        document.getElementById("SignUpResult").innerHTML = err.message;
    }
}




function saveCookie()
{
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));

    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}


function validLoginForm(logName, logPass) {

    var logNameErr = logPassErr = true;

    if (logName == "") {
        console.log("USERNAME IS BLANK");
    }
    else {
        var regex = /(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,18}$/;

        if (regex.test(logName) == false) {
            console.log("USERNAME IS NOT VALID");
        }

        else {

            console.log("USERNAME IS VALID");
            logNameErr = false;
        }
    }

    if (logPass == "") {
        console.log("PASSWORD IS BLANK");
        logPassErr = true;
    }
    else {
        var regex = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}/;

        if (regex.test(logPass) == false) {
            console.log("PASSWORD IS NOT VALID");
        }

        else {

            console.log("PASSWORD IS VALID");
            logPassErr = false;
        }
    }

    if ((logNameErr || logPassErr) == true) {
        return false;
    }
    return true;

}

function validSignUpForm(fName, lName, user, pass)
{

    var fNameErr = lNameErr = userErr = passErr = true;

    if (fName == "") {
        console.log("FIRST NAME IS BLANK");
    }
    else {
        console.log("first name IS VALID");
        fNameErr = false;
    }

    if (lName == "") {
        console.log("LAST NAME IS BLANK");
    }
    else {
        console.log("LAST name IS VALID");
        lNameErr = false;
    }

    if (user == "") {
        console.log("USERNAME IS BLANK");
    }
    else {
        var regex = /(?=.*[a-zA-Z])([a-zA-Z0-9-_]).{3,18}$/;

        if (regex.test(user) == false) {
            console.log("USERNAME IS NOT VALID");
        }

        else {

            console.log("USERNAME IS VALID");
            userErr = false;
        }
    }

    if (pass == "") {
        console.log("PASSWORD IS BLANK");
    }
    else {
        var regex = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}/;

        if (regex.test(pass) == false) {
            console.log("PASSWORD IS NOT VALID");
        }

        else {

            console.log("PASSWORD IS VALID");
            passErr = false;
        }
    }

    if ((fNameErr || lNameErr || userErr || passErr) == true) {
        return false;

    }

    return true;
}

async function addContact()
{
    //Get the fields for the new Contact
    let newContactFirstName = document.getElementById("newContactFirst").value;
    let newContactLastName = document.getElementById("newContactLast").value;
    let newContactName = newContactFirstName + " " + newContactLastName;
    let newContactEmail = document.getElementById("newContactEmail").value;
    let newContactPhone = document.getElementById("newContactPhone").value;

    let errorText = "";

    //Check to see if there are any form validation errors
    if(validateName(newContactFirstName) == false)
    {
        errorText += "<br>First Name must be non-empty and contain no spaces";
    }
    if(validateName(newContactLastName) == false)
    {
        errorText += "<br>Last Name must be non-empty and contain no spaces";
    }
    if(validateEmail(newContactEmail) == false)
    {
        errorText += "<br>Please enter a valid email";
    }
    if(validatePhone(newContactPhone) == false)
    {
        errorText += "<br>Please enter a valid phone number";
    }

    //Boot out of the function early if there were errors
    if(errorText != "")
    {
        document.getElementById("actionStatus").innerHTML = `<br><br><br>${errorText}`;
        return;
    }

    //Format phone number
    newContactPhone = formatPhone(newContactPhone);


    //Temporary JSON string - field on left, variable on right
    let tmp = {name:newContactName,phone:newContactPhone,email:newContactEmail,userID:userId};
    let jsonPayload = JSON.stringify(tmp);

    //Get the proper PHP url
    let url = urlBase + '/AddContact' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                document.getElementById("actionStatus").innerHTML = "";
            }
            else
            {
                document.getElementById("actionStatus").innerHTML = "Contact not added. ReadyState is " + this.readyState + " and status is " + this.status;
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("actionStatus").innerHTML = err.message;
    }

    //Set fields back to nothing
    document.getElementById("newContactFirst").value = "";
    document.getElementById("newContactLast").value = "";
    document.getElementById("newContactEmail").value = "";
    document.getElementById("newContactPhone").value = "";

    //At the very end of adding a contact, refresh the table of contacts (after waiting 1/4 of a second)
    await new Promise(resolve => setTimeout(resolve, 250));
    
    ///Also delete any search text in case the user was searching
    document.getElementById("search_bar").value = "";
    
    //Then grab the contacts
    grabContacts();
}

function searchContact()
{
    //Initialize vars & create initially empty search result list
    let srch = document.getElementById("search_bar").value;
    document.getElementById("contact-table-body").innerHTML = "";

    //Refresh actionStatus in case
    document.getElementById("actionStatus").innerHTML = "";

    //JSON stuff
    let tmp = {search:srch,userId:userId};
    let jsonPayload = JSON.stringify(tmp);

    //Link to correct PHP file
    let url = urlBase + '/SearchContact' + extension;

    //XHR stuff
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);

                //Var initialization
                let counter = 0;
                let firstName;
                let lastName;
                let phone;
                let email;
                let contactCount = 1;

                //alert(jsonObject.stringify + " " + jsonObject.results);

                for(let i = 0; i < jsonObject.results.length; i++)
                {

                    //If we're taking in NAME
                    if(counter == 0)
                    {
                        //Split the name by space into first and last - store in vars
                        let nameArr = jsonObject.results[i].split(" ");
                        firstName = nameArr[0];
                        lastName = nameArr[1];
                    }

                    //If we're taking in PHONE
                    if(counter == 1)
                    {

                        //Store phone # in var
                        phone = jsonObject.results[i];
                    }

                    //If we're taking in EMAIL
                    if(counter == 2)
                    {

                        //Get email and store it in its var
                        email = jsonObject.results[i];

                        //Add everything to the table
                        document.getElementById("contact-table-body").innerHTML += "<tr id='row" + contactCount + "'><td class='contact" + contactCount + "'>" + firstName + "</td><td class='contact" + contactCount + "'>" + lastName + "</td><td class='contact" + contactCount + "'>" + email + "</td><td class='contact" + contactCount + "'>" + phone + "</td><td><button id='btn' class='contact" + contactCount + "' onclick='editContactSetup(this.className)'>Edit</button></td><td><button id='btn' class='contact" + contactCount + "' onclick='deleteContact(this.className)'>Delete</button></td></tr>";

                        //Reset vars
                        firstName = "";
                        lastName = "";
                        phone = "";
                        email = "";

                        //Set counter back to -1 (it will be incremented to 0 right after)
                        counter = -1;

                        contactCount++;

                    }

                    //Increment Counter
                    counter++;
                }
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("actionStatus").innerHTML = err.message;
    }
}

function grabContacts()
{

    //Initialize vars & create initially empty table
    let srch = "";
    document.getElementById("contact-table-body").innerHTML = "";
    let contactCount = 1;

    //JSON stuff
    let tmp = {search:srch,userId:userId};
    let jsonPayload = JSON.stringify(tmp);

    //Link to correct PHP file
    let url = urlBase + '/SearchContact' + extension;

    //XHR stuff
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);

                //Var initialization
                let counter = 0;
                let firstName;
                let lastName;
                let phone;
                let email;

                //alert(jsonObject.stringify + " " + jsonObject.results);

                for(let i = 0; i < jsonObject.results.length; i++)
                {

                    //If we're taking in NAME
                    if(counter == 0)
                    {
                        //Split the name by space into first and last - store in vars
                        let nameArr = jsonObject.results[i].split(" ");
                        firstName = nameArr[0];
                        lastName = nameArr[1];
                    }

                    //If we're taking in PHONE
                    if(counter == 1)
                    {

                        //Store phone # in var
                        phone = jsonObject.results[i];
                    }

                    //If we're taking in EMAIL
                    if(counter == 2)
                    {

                        //Get email and store it in its var
                        email = jsonObject.results[i];

                        //Add everything to the table
                        document.getElementById("contact-table-body").innerHTML += "<tr id='row" + contactCount + "'><td class='contact" + contactCount + "'>" + firstName + "</td><td class='contact" + contactCount + "'>" + lastName + "</td><td class='contact" + contactCount + "'>" + email + "</td><td class='contact" + contactCount + "'>" + phone + "</td><td><button id='btn' class='contact" + contactCount + "' onclick='editContactSetup(this.className)'>Edit</button></td><td><button id='btn' class='contact" + contactCount + "' onclick='deleteContact(this.className)'>Delete</button></td></tr>";

                        //Reset vars
                        firstName = "";
                        lastName = "";
                        phone = "";
                        email = "";

                        //Set counter back to -1 (it will be incremented to 0 right after)
                        counter = -1;

                        //Increment contactCount
                        contactCount++;


                    }

                    //Increment Counter and contactCount
                    counter++;
                }
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("actionStatus").innerHTML = err.message;
    }

    //console.log(document.getElementById("contact-table-body").innerHTML);

    currName = "";
}

function editContactSetup(className)
{


    let necessaryArr = document.getElementsByClassName(className);

    let currentFirstName = necessaryArr[0].innerText;
    let currentLastName = necessaryArr[1].innerText;
    let currentEmail = necessaryArr[2].innerText;
    let currentPhone = necessaryArr[3].innerText;

    if(currName != "")
    {
        document.getElementById("actionStatus").innerHTML = "<br/><br/><br/><br/>Please only edit one contact at a time";
    }
    else
    {
        currName = necessaryArr[0].innerText + " " + necessaryArr[1].innerText;

        //Get the correct Table Row to change into an Editing Field
        let rowNum = className.charAt(className.length - 1);
        let rowClass = "row" + rowNum;

        //Save a copy of the OLD row HTML in case the user cancels the Edit operation
        let oldHTML = document.getElementById(rowClass).innerHTML;

        //Morph the row into an Editing field
        document.getElementById(rowClass).innerHTML = `<tr><td><input type='text' value='${currentFirstName}' placeholder='${currentFirstName}' id='newFirst${rowNum}'></td><td><input type='text' value='${currentLastName}' placeholder='${currentLastName}' id='newLast${rowNum}'></td><td><input type='text' value='${currentEmail}' placeholder='${currentEmail}' id='newEmail${rowNum}'></td><td><input type='text' value='${currentPhone}' placeholder='${currentPhone}' id='newPhone${rowNum}'></td><td><button id='save_btn' class=${rowNum} onclick='editContactExecute(this.className)'>Save</button></td><td><button id='cancel_btn' onclick='grabContacts()'>Cancel</button></td></tr>`;


        document.getElementById("actionStatus").innerHTML = "";    
    }



    

    

    

    
}

async function editContactExecute(rowName)
{ 
    let editContactFirstName = document.getElementById(`newFirst${rowName}`).value;
    let editContactLastName = document.getElementById(`newLast${rowName}`).value;
    let editContactName = editContactFirstName + " " + editContactLastName;
    let editContactEmail = document.getElementById(`newEmail${rowName}`).value;
    let editContactPhone = document.getElementById(`newPhone${rowName}`).value;

    let errorText = "";


    //Check to see if there are any form validation errors
    if(validateName(editContactFirstName) == false)
    {
        errorText += "<br>First Name must be non-empty and contain no spaces";
    }
    if(validateName(editContactLastName) == false)
    {
        errorText += "<br>Last Name must be non-empty and contain no spaces";
    }
    if(validateEmail(editContactEmail) == false)
    {
        errorText += "<br>Please enter a valid email";
    }
    if(validatePhone(editContactPhone) == false)
    {
        errorText += "<br>Please enter a valid phone number";
    }

    //Boot out of the function early if there were errors
    if(errorText != "")
    {
        document.getElementById("actionStatus").innerHTML = `<br><br><br>${errorText}`;

        return;
    }

    //Format phone number
    editContactPhone = formatPhone(editContactPhone);



    //Temporary JSON string - field on left, variable on right
    let tmp = {
        currName:currName,
        name:editContactName,
        phone:editContactPhone,
        email:editContactEmail,
        userID:userId
    };
        
    let jsonPayload = JSON.stringify(tmp);
  
    //Get the proper PHP url
    let url = urlBase + '/EditContact' + extension;
  
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  
    try
    {
        xhr.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                //alert("success");
                document.getElementById("actionStatus").innerHTML = "";
            }
            else
            {
                document.getElementById("actionStatus").innerHTML = "Contact not edited. ReadyState is " + this.readyState + " and status is " + this.status;
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("actionStatus").innerHTML = err.message;
    }

    //At the very end of adding a contact, refresh the table of contacts (after waiting 1/4 of a second)
    await new Promise(resolve => setTimeout(resolve, 250));

    ///Also delete any search text in case the user was searching
    document.getElementById("search_bar").value = "";
    
    //Then grab the contacts
    grabContacts();
    
    
    currName = "";
      
}

async function deleteContact(className)
{

    //Get the correct field of the contact to delete

    let delElements = document.getElementsByClassName(className); 

    let delContactName = delElements[0].innerText + " " + delElements[1].innerText;
    let delContactEmail = delElements[2].innerText;
    let delContactPhone = delElements[3].innerText;



    document.getElementById("actionStatus").innerHTML = "";

    //Temporary JSON string - field on left, variable on right
    let tmp = {
      name:delContactName,
      phone:delContactPhone,
      email:delContactEmail,
      userID:userId
    };
      
    let jsonPayload = JSON.stringify(tmp);

    //alert(jsonPayload);

    //Get the proper PHP url
    let url = urlBase + '/DeleteContact' + extension;

    if(confirm("Are you sure you want to Delete this contact?") == false)
    {
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {

        xhr.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                document.getElementById("actionStatus").innerHTML = "";
            }
            else
            {
                document.getElementById("actionStatus").innerHTML = "Contact not deleted. ReadyState is " + this.readyState + " and status is " + this.status;
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        //alert(err.message);
        document.getElementById("actionStatus").innerHTML = err.message;
    }

    //At the very end of adding a contact, refresh the table of contacts (after waiting 1/4 of a second)
    await new Promise(resolve => setTimeout(resolve, 250));

    ///Also delete any search text in case the user was searching
    document.getElementById("search_bar").value = "";
    
    //Then grab the contacts
    grabContacts();
}


//Given function from W3 Resource to validate an email
function validateEmail(inputText)
{
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(inputText.match(mailformat))
    {
        return true;
    }
    else
    {
        document.getElementById("actionStatus").innerHTML = "<br><br><br><br>Please enter a valid email";   
        return false;
    }
}

//Given function from W3 Resource to validate a phone number
function validatePhone(inputText)
{
    let phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if(inputText.match(phoneno))
    {
        return true;      
    }
    else
    {
        return false;        
    }
}

//Function to validate first or last name
function validateName(inputText)
{
    if(inputText == "" || inputText.includes(" "))
    {
        return false;
    }
    else
    {
        return true;
    }
}

function formatPhone(inputPhone)
{
    inputPhone = (inputPhone);


    //First remove any parentheses & dashes
    inputPhone = inputPhone.replaceAll('-', '');
    inputPhone = inputPhone.replaceAll('(', '');
    inputPhone = inputPhone.replaceAll(')', '');

    //Put parentheses & dashes in the correct spot
    let formattedPhone = `(${inputPhone[0]}${inputPhone[1]}${inputPhone[2]})-${inputPhone[3]}${inputPhone[4]}${inputPhone[5]}-${inputPhone[6]}${inputPhone[7]}${inputPhone[8]}${inputPhone[9]}`;



    return (formattedPhone);
}

function aboutUsLoggedIn()
{
	document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
}

