//Globals to track the page state
var SearchModes = {
	MY_PARTS: 1,
	PART_FINDER: 2,
	ASSEMBLY_REPORT: 3
}
var SearchMode = null;

const BASE_URL = "http://10.100.0.49:3000/api/";

window.onload = function(){

  SearchMode = SearchModes.MY_PARTS
  ToggleSearchButton(true);
	//click action for the tabs on the nav bar
  document.getElementById("navbarOptionMyparts").addEventListener("click", (e) =>{
     navBarClick(e.target.id)
  });
  document.getElementById("navbarOptionPartFinder").addEventListener("click", (e) =>{
      navBarClick(e.target.id)
  });
  document.getElementById("navbarOptionAssemblyReport").addEventListener("click", (e) =>{
    navBarClick(e.target.id)
  });

  //click action for the parts search. Displays the Users and Locations dropdown
  document.getElementById("partsSearchTypeDropdown").addEventListener("change", (e) => {
		if(e.target.value == "All"){
			document.getElementById("UsersDropdown").style.display = "none";
				document.getElementById("UsersDropdown").value = "--Users--"
			document.getElementById("locationsDropdown").style.display = "none"
				document.getElementById("locationsDropdown").value = "--Locations--"
		}
    PartsSearchTypeActionResult(e);
		PartFinderToggleSearchButton();
  });

  //clicking on the search button action to search for parts/assenblies
  document.getElementById("searchButton").addEventListener("click", (e) => {
    SubmitFormAjax();
  });

 //changeing the assemblies dropdown will enable the search button
	document.getElementById("assembliesDropdown").addEventListener("change", (e) =>{
		  ToggleSearchButton(true)
	});

  //If an item is selected from the part finder dropdown, check to see if the search button should be enabled.
	document.getElementById("partNumberDropdown").addEventListener("change", (e) =>{
		 PartFinderToggleSearchButton();
	});

  //when an item from the locations dropdown is selected, check to see if the search button should be enabled.
	document.getElementById("locationsDropdown").addEventListener("change", (e) =>{
		 PartFinderToggleSearchButton();
	});

	//when an item from the users dropdown is selected, check to see if the search button should be enabled.
	document.getElementById("UsersDropdown").addEventListener("change", (e) =>{
		 PartFinderToggleSearchButton();
	});

  //use the jquery plugin to print the Assembly finder page.
	document.getElementById("printButton").addEventListener("click", (e) => {
		  PrintAssemblyReport();
	});
}


//determins if the submit button should be enabled or disable when using the PartFinder search dropdown options.
function PartFinderToggleSearchButton(){

  //all the dropdowns for parts search
   var partFinderDropdown = document.getElementById("partNumberDropdown");
	 var partFinderSelected = partFinderDropdown.options[partFinderDropdown.selectedIndex]

	 var searchTypeDropdown = document.getElementById("partsSearchTypeDropdown");
	 var searchTypeSelected = searchTypeDropdown.options[searchTypeDropdown.selectedIndex]

	 var usersDropdown = document.getElementById("UsersDropdown");
 	 var usersDropdownSelected = usersDropdown.options[usersDropdown.selectedIndex]

	 var locationsDropdown = document.getElementById("locationsDropdown");
   var locationsDropdownSelected = locationsDropdown.options[locationsDropdown.selectedIndex]


  //all the conditions for which the button will be disabled
   if(partFinderSelected.id == "none"){
		 ToggleSearchButton(false)
		  return;
	 }
   if(searchTypeSelected.id == "none"){
         ToggleSearchButton(false)
				  return;
	 }

   if( searchTypeSelected.id == "user" && usersDropdownSelected.id == "none" ) {
		 ToggleSearchButton(false)
		  return;
	 }

	 if(searchTypeSelected.id == "location" && locationsDropdownSelected.id == "none"){
		  ToggleSearchButton(false)
		  return;
	 }

   //enagle the search button
	 ToggleSearchButton(true);
}


//Calls the appropriate AJAX submit function for whichever search mode is being used.
async function SubmitFormAjax(){
   if(SearchMode == SearchModes.MY_PARTS){
     data =   await SubmitMyPartsAjax();
		 BuildMyPartsTable(data)
   }
   else if(SearchMode == SearchModes.PART_FINDER){
     SubmitPartFinderAjax();
   }
   else if(SearchMode == SearchModes.ASSEMBLY_REPORT){
     SubmitAssemblyReportAjax();
   }
}



//Builds the table for the myParts serach.
function BuildMyPartsTable(data){
	ClearTables();
  HideAllTables();
  ShowTable("myPartsTable")
  var table = document.getElementById("myPartsTableBody");
  data.data.forEach(function(d){
    var rowData = [d.attributes.part_number, d.attributes.description, d.attributes.qty];
    var row = table.insertRow(-1);
    for(var i = 0; i < 3; i++){
      var cell = row.insertCell(i);
      cell.innerHTML = rowData[i]
    }

		//button to move a part to either a shelf or another person. Clicking the button opens a boostrap modal that handles this.
		var cell = row.insertCell(3);
		cell.innerHTML = "<button class='btn btn-info'" +  'data-toggle="modal" data-target="#exampleModal"' +   "     >" +"Move"+ "</button>"
		cell.partNumber = rowData[0];
		cell.partDescription = rowData[1];
		cell.quantity = rowData[2];
		cell.addEventListener("click", function(e){
			DoMySearchModal(cell.partNumber, cell.partDescription, cell.quantity)
		});
  });
}



//Makes an ajax get request to query for the data for the PartFinder. In the callback we build the partFinder table.
function SubmitPartFinderAjax(){

	//get the dropdown item parameters for the ajax get request
   var partDropdown = document.getElementById("partNumberDropdown")
   var item = partDropdown.options[partDropdown.selectedIndex].id;
   var partsSearchDropdown = document.getElementById("partsSearchTypeDropdown");
   var partsSearchType = partsSearchDropdown.options[partsSearchDropdown.selectedIndex].id
   var id = -1;
   if(partsSearchType == "user"){
     var usersDropdown = document.getElementById("UsersDropdown");
     id = usersDropdown.options[usersDropdown.selectedIndex].id;
   }
   else if(partsSearchType == "location"){
     var locationDropdown = document.getElementById("locationsDropdown");
     id = locationDropdown.options[locationDropdown.selectedIndex].id;
   }

   var url = BASE_URL + "parts/search?part_id=" +  item.toString() +  "&type=" + partsSearchType + "&id=" + id.toString();
   $.ajax({
     type: 'GET',
     xhrFields: {
        withCredentials: true
     },
     url: url,
     dataType: 'JSON',
     async: true,
     success: async function(data) {BuildPartFinderTable(data)},
     error: function(data) {  new Error("Part Finder Ajax request failed")},
   });

}


//makes and ajax post to get assemby report data from the dropdown selection parameter. In the callback we generate the assembly report table.
function SubmitAssemblyReportAjax(){
  var assembliesDropdown = document.getElementById("assembliesDropdown")
  var item = assembliesDropdown.options[assembliesDropdown.selectedIndex].id;

	var url = BASE_URL + 'component/' + item.toString() + '/report';
	console.log(url)
  $.ajax({
    type: 'GET',
    xhrFields: {
       withCredentials: true
    },
    url: url,
    dataType: 'JSON',
    async: true,
    success: async function(data) { BuildAssemblyReportTable(data)},
    error: function() {new Error("AssemblyReport AJAX request failed")},
  });
}


//returns the current date in a nice format.
function GetCurrentDate(){
	var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!

var yyyy = today.getFullYear();
if (dd < 10) {
  dd = '0' + dd;
}
if (mm < 10) {
  mm = '0' + mm;
}
var today = dd + '/' + mm + '/' + yyyy;
 return today;
}


//Calls the jquery pluggin to print the page
function PrintAssemblyReport(){
	document.getElementById("printButton").style.display = "none";
	$("#assemblyReport").print({
	    addGlobalStyles : true,
	    stylesheet : null,
	    rejectWindow : true,
	    noPrintSelector : ".no-print",
	    iframe : true,
	    append : null,
	    prepend : null
	});
document.getElementById("printButton").style.display = "inline";
}


//handles the action when a parts search is performed by calling the appropriate function to make an ajax request.
async function PartsSearchTypeActionResult(e){
  if(e.target.value == "User"){
      document.getElementById("locationsDropdown").style.display="none"
      var data = await GetUsersListAjax();
			_BuildUsersDropdown(data);
  }
  if(e.target.value == "Location"){
      document.getElementById("UsersDropdown").style.display="none"
     var data = await GetLocationsListAjax();
		 _BuildLocationsDropdown(data);
  }
}


//Enables the search button if val = true. Disables it otherwise.
function ToggleSearchButton(val){
	 var el = document.getElementById("searchButton")
	 if(val){
		el.disabled = false;
	 }
	 else{
		 el.disabled = true;
	 }
}


//handles the styling chage when clicking on the navbar.
function navBarClick(id){

  //highlight the clicked part of the nav bar and unhighlight everything else
  document.getElementById("navbarOptionMyparts").style.backgroundColor = "#333";
  document.getElementById("navbarOptionPartFinder").style.backgroundColor = "#333";
  document.getElementById("navbarOptionAssemblyReport").style.backgroundColor = "#333";
  document.getElementById(id).style.backgroundColor = "#3BB2F7";

  SetSearchMode(id);

  NavBArClickAction();
}



//Function to handles which dropdown to show based on the SearchMode global variable.
async function NavBArClickAction(){
  HideAllDropdowns();
  HideAllTables();

  if(SearchMode == SearchModes.MY_PARTS){
		ToggleSearchButton(true)
	}

  if(SearchMode == SearchModes.PART_FINDER){
    document.getElementById("partNumberDropdown").style.display = "inline"
		ToggleSearchButton(false);
		BuildSearchTypeDropdown();
    var data = await GetPartsListAjax();
		_BuildPartNumberDropdown(data);
  }
  else if(SearchMode == SearchModes.ASSEMBLY_REPORT){
     document.getElementById("assembliesDropdown").style.display = "inline"
		 ToggleSearchButton(false);
     var data = await GetAssembiesListAjax();
		 _BuildAssembliesDropdown(data)
  }
}


//Sets the searchMode global variable based on the id of the navbar that was clicked.
function SetSearchMode(id){

	if(id == "navbarOptionMyparts"){
		SearchMode = SearchModes.MY_PARTS;
	}
	else if(id == "navbarOptionPartFinder"){
		SearchMode = SearchModes.PART_FINDER;
	}
	else if(id == "navbarOptionAssemblyReport"){
		SearchMode = SearchModes.ASSEMBLY_REPORT
	}
}
