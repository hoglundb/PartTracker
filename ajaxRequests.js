function GetUsersListAjax(){
 var url = BASE_URL + 'users';
 return  $.ajax({
   type: 'GET',
   xhrFields: {
      withCredentials: true
   },
   url: url,
   dataType: 'JSON',
   async: true,
 });
}


function GetLocationsListAjax(){
 var url = BASE_URL + 'locations';
 return $.ajax({
   type: 'GET',
   xhrFields: {
      withCredentials: true
   },
   url: url,
   dataType: 'JSON',
   async: true,
 });
}


//Makes an ajax request to get the data for the MyParts search. In the callback, we build the dable from the returned data.
function SubmitMyPartsAjax(){
  var url = BASE_URL + 'parts/my_parts';
  return $.ajax({
    type: 'GET',
    xhrFields: {
       withCredentials: true
    },
    url: url,
    dataType: 'JSON',
    async: true,
  });
}


function GetPartsListAjax(){
         var url = BASE_URL + 'components/names';
         return $.ajax({
           type: 'GET',
           xhrFields: {
              withCredentials: true
           },
           url: url,
           dataType: 'JSON',
           async: true,
         });
}


function GetAssembiesListAjax(){
  var url = BASE_URL + 'components/assemblies';
  return $.ajax({
    type: 'GET',
    xhrFields: {
       withCredentials: true
    },
    url: url,
    dataType: 'JSON',
    async: true,
  });
}
