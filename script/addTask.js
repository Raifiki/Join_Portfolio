let selectedUsers = [];

/**
 * This function initialize the addTask page
 * 
 * @param {string} tabID - HTML ID of the active menu tab
 */
async function initAddTask(tabID){
    await init(tabID);
}


/**
 * This function open the drop down menu for members
 * 
 * @param {string} ID - ID of the hidden elment
 */
function openDropdownMemberList(ID){
    showElement(ID, '');
    document.getElementById('wrapperAssignedToHL').classList.add('styleOpen');
    document.getElementById('wrapperAssignedToHLImg').classList.add('styleOpen');
    document.getElementById('inputSearchAssignedTo').disabled = false;
    document.getElementById('inputSearchAssignedTo').setAttribute('placeholder','Search');
    document.getElementById('wrapperAssignedToHLImg').setAttribute('onclick','closeDropdownMemberList(["wrapperMemberList"])');
    generateMemberListHTML();
  }
  

  /**
   * This function close the drop down menu for the members
   * 
 * @param {string} ID - ID of the hidden elment
   */
  function closeDropdownMemberList(ID) {
    hideElement(ID,'');
    document.getElementById('wrapperAssignedToHL').classList.remove('styleOpen');
    document.getElementById('wrapperAssignedToHLImg').classList.remove('styleOpen');
    document.getElementById('inputSearchAssignedTo').disabled = true;
    document.getElementById('inputSearchAssignedTo').value='';
    document.getElementById('inputSearchAssignedTo').setAttribute('placeholder','Select contacts to assign');
    document.getElementById('wrapperAssignedToHLImg').setAttribute('onclick','openDropdownMemberList(["wrapperMemberList"])');
    getSelectedMembers();
    document.getElementById('wrapperAssignedToActual').innerHTML = getAssignedToHTML(selectedUsers);
  }


  /**
   * This function generates the member list HTML for the dropdown menu
   * 
   */
  function generateMemberListHTML(){
    let dropdownHTML = document.getElementById('wrapperMemberList');
    dropdownHTML.innerHTML = '';
    let memberList = filterContactList();
    for (let i = 0; i < memberList.length; i++) {
        let contact = memberList[i];
        dropdownHTML.innerHTML += getMemberHTML(contact,i);
        document.getElementById(`memberInitials${i}`).style.backgroundColor = contact.color;
    }
}


/**
 * This function generates the HTML for one member of the dropdown in the contact list
 * 
 * @param {JSON} contact - JSON array with the contact details from the sorted contact list
 * @param {number} i - index of the contact in the sorted contact list
 * @returns {string} - HTML code as string
 */
function getMemberHTML(contact,i){
    let checked = (selectedUsers.includes(contact.email))?'checked':'';
    return /*html*/`
        <div id="wrapperMemberListElement">
            <label for="member${i}">
                <div class="memberInitials" id="memberInitials${i}">${contact['initials']}</div>
                ${contact['name']}
            </label>
            <input id="member${i}" type="checkbox" value="${contact['email']}" ${checked}>
        </div>
    `
}


/**
 * This function generates a list with all selected members of the assigned to dropdown list
 * 
 * @returns {array} - array with email adresses as string
 */
function getSelectedMembers(){
    let memberListElements = document.querySelectorAll('#wrapperMemberList input[type="checkbox"]');
    memberListElements.forEach(m => {
        let memberEmail = m.value;
        if (selectedUsers.includes(memberEmail) && !m.checked) {
            let idx = selectedUsers.indexOf(memberEmail);
            selectedUsers.splice(idx,1);
        } else if(!selectedUsers.includes(memberEmail) && m.checked){
            selectedUsers.push(memberEmail);
        }
    });
  }


  /**
   * This functions filters the member list according the value of the search field
   * 
   * @returns {JSON} - JSON array with all members which contains the search names
   */
  function filterContactList(){
    let search = document.getElementById('inputSearchAssignedTo').value.toLowerCase();
    let filteredList = contactListSorted.filter(c => c.name.toLowerCase().includes(search))
    return filteredList;
  }