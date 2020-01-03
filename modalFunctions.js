async function DoMySearchModal(partNumber, partDescription, numParts){
   var modalContent = document.getElementById("MoveMyParts");

   var usersList =  await GetUsersListAjax();
   var locationsList = await GetLocationsListAjax();
   console.log(usersList)
}
