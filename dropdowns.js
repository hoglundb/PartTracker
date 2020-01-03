//Builds the dropdown for the list of users. Takes the data returned by the GetUsers ajax request.
async function _BuildUsersDropdown(dataFromServer){

  var dropdownDOMObj = document.getElementById("UsersDropdown");
  dropdownDOMObj.style.display = "inline"
   dropdownDOMObj.innerHTML = '';
  var headerOption = document.createElement("option");
  headerOption.disabled = true;
  headerOption.text = "--Users--";
  headerOption.id = "none";
	  dropdownDOMObj.add(headerOption);
	var allOption = document.createElement("option");
	allOption.text = "All";
	allOption.id = -1;
	dropdownDOMObj.add(allOption)


    //build the dropdown where the id of each option is the user id
    dataFromServer.data.forEach(function(d){
    var firstName = d.attributes.first_name;
    var lastName = d.attributes.last_name;
    var option = document.createElement("option");
    option.id = d.attributes.id;
    option.text = lastName + ", " + firstName;
    dropdownDOMObj.add(option);
  });

  dropdownDOMObj.value = "--Users--"
}


//Builds the dropdown list for the locations using the data from the getlocations ajax post .
async function _BuildLocationsDropdown(dataFromServer){
  var dropdownDOMObj = document.getElementById("locationsDropdown");
  dropdownDOMObj.style.display = "inline"
   dropdownDOMObj.innerHTML = '';
  var headerOption = document.createElement("option");
  headerOption.disabled = true;
  headerOption.text = "--Locations--";
  headerOption.id = "none";
	dropdownDOMObj.add(headerOption)
	var allOption = document.createElement("option");
	allOption.text = "All";
	allOption.id = -1;

  //build the dropdown and set the id of each option to be the location id
  dropdownDOMObj.add(allOption)
  dataFromServer.data.forEach(function(d){
     var building = d.attributes.building;
     var id = d.attributes.id;
     var shelf = d.attributes.shelf;
     var optionText = "building: " + building + " shelf: " + shelf;
     var option = document.createElement("option");
     option.text = optionText;
     option.id = d.attributes.id;
     dropdownDOMObj.add(option);
  });

	//set the default value of the dropdown.
  dropdownDOMObj.value = "--Locations--"
}


//Builds the partNumbers dropdown from the data in the ajax request.
async function _BuildPartNumberDropdown(dataFromServer){
  var dropdownDOMObj = document.getElementById("partNumberDropdown");
   dropdownDOMObj.innerHTML = '';
  var headerOption = document.createElement("option");
  headerOption.disabled = true;
  headerOption.text = "--Part Number--";
  headerOption.id = "none"
  dropdownDOMObj.add(headerOption);
  var allOption = document.createElement("option");
	allOption.text = "All";
	allOption.id = -1
	dropdownDOMObj.add(allOption);
  var data = dataFromServer.data;
  data.forEach(function(d){
    var option = document.createElement("option");
    option.text = d.attributes.part_number + "  (" + d.attributes.qty.toString() + ")";
    option.id = d.attributes.component_id
    dropdownDOMObj.add(option);
  })
  dropdownDOMObj.value = "--Part Number--"
}


//Builds the search type dropdown list
function BuildSearchTypeDropdown(){
   var e = document.getElementById("partsSearchTypeDropdown");
   e.style.display = "inline"
}


//Builds the assemlies dropdown from the data in the GetAssemblies ajax request.
function _BuildAssembliesDropdown(data){
  var dropdownDOMObj = document.getElementById("assembliesDropdown");
   dropdownDOMObj.innerHTML = '';
  var headerOption = document.createElement("option");
  headerOption.disabled = true;
  headerOption.text = "--Assemblies--";
  dropdownDOMObj.add(headerOption);

  data.data.forEach(function(d){
    var option = document.createElement("option");
    option.text = d.attributes.part_number;
		option.id = d.attributes.id;
    dropdownDOMObj.add(option);
  })
  dropdownDOMObj.value = "--Assemblies--"
}



//Hides all the dropdowns. We generically do this before showing just the dropdowns that we need to.
function HideAllDropdowns(){
  document.getElementById("partsSearchTypeDropdown").style.display = "none";
  document.getElementById("partNumberDropdown").style.display = "none";
  document.getElementById("UsersDropdown").style.display = "none";
  document.getElementById("locationsDropdown").style.display = "none";
  document.getElementById("assembliesDropdown").style.display = "none";
}
