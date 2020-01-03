//builds the html table rows for the part finder data. Makes the hidden table header visable too.
function BuildPartFinderTable(data){
	ClearTables();
	HideAllTables();
	ShowTable("partFinderTable")
	var table = document.getElementById("partFinderTableBody");
	data.data.forEach(function(d){
		var rowData = [d.attributes.part_number, d.attributes.description, d.attributes.attached_to, d.attributes.qty];
		var row = table.insertRow(-1);

		for(var i = 0; i < rowData.length; i++){
			var cell = row.insertCell(i);
			cell.innerHTML = rowData[i]
		}
	});
}


//removes any tables: myParts, partFinder, Assembly report. Call this function before building a new table. Removes just the body of the table, not the header
function ClearTables(){
	var mytbl = document.getElementById("myPartsTableBody")
	while(mytbl.firstChild){
		mytbl.removeChild(mytbl.firstChild)
	}
  mytbl = document.getElementById("partFinderTableBody")
	while(mytbl.firstChild){
		mytbl.removeChild(mytbl.firstChild)
	}

	mytbl = document.getElementById("assemblyReportTableBody")
	while(mytbl.firstChild){
		mytbl.removeChild(mytbl.firstChild)
	}
}


//Shows the diven div element. Used to show table headers and rows.
function ShowTable(id){
  document.getElementById(id).style.display = "block";
}


//Function to hide the tables for each search mode. This funtion is generically called when search mode is changed.
function HideAllTables(){
  document.getElementById("myPartsTable").style.display = "none"
	document.getElementById("assemblyReportTile").style.display = 'none'
		document.getElementById("assemblyReportTable").style.display = 'none'
	document.getElementById('myPartsTable').style.display = "none"
	document.getElementById('partFinderTable').style.display = "none"
}

//Builds the assembly report table from the data made in the asseembly report ajax request.
function BuildAssemblyReportTable(data){
	ClearTables();
	HideAllTables();
	ShowTable("assemblyReportTile")
	document.getElementById("assemblyReportTile").innerHTML = "<div style='font-size:16pt'>" + "Assembly Report" + " (" + GetCurrentDate() + ")" +"</div>"
	ShowTable("assemblyReportTable")
	var table = document.getElementById("assemblyReportTableBody");
	data.data.forEach(function(d){
		var rowData = [d.attributes.part_number, d.attributes.description, d.attributes.bom_qty, d.attributes.part_qty];
		var row = table.insertRow(-1);

		for(var i = 0; i < rowData.length; i++){

			//add alert for not enough quantities if bom < quantity needed
			if(i == 3){
          if( parseInt(rowData[i]) < parseInt(rowData[i-1]) ){
              rowData[i] += "<span style='color:red; margin-left:10px'>" + " (! Not Enough Parts)" + "<span>"  //message if not enough of this type of part
					}
			}
			var cell = row.insertCell(i);
			cell.innerHTML = rowData[i]
		}
	});
}
