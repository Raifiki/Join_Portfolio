let selectedUsers = [];

// remove at the end -------------
let categories = [
    {
        color: '#ffc701',
        name: 'Testing'
    },
    {
        color: '#ff7a00',
        name: 'Frontend'
    },
    {
        color: '#0038ff',
        name: 'Backend'
    },
    {
        color: '#fc71ff',
        name: 'Design'
    },
]
// remove at the end -------------


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
        <div class="wrapperMemberListElement">
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


  /**
 * This function open the drop down menu for categories
 * 
 * @param {string} ID - ID of the hidden elment
 */
function openDropdownCategoryList(ID){
    showElement(ID, '');
    document.getElementById('wrapperCategoryHL').classList.add('styleOpen');
    document.getElementById('wrapperCategoryHLImg').classList.add('styleOpen');
    document.getElementById('wrapperCategoryHLImg').setAttribute('onclick','closeDropdownCategoryList(["wrapperCategoryList"])');
    generateCategoryListHTML();
  }
  

  /**
   * This function close the drop down menu for the categories
   * 
 * @param {string} ID - ID of the hidden elment
   */
  function closeDropdownCategoryList(ID) {
    hideElement(ID,'');
    document.getElementById('wrapperCategoryHL').classList.remove('styleOpen');
    document.getElementById('wrapperCategoryHLImg').classList.remove('styleOpen');
    document.getElementById('wrapperCategoryHLImg').setAttribute('onclick','openDropdownCategoryList(["wrapperCategoryList"])');
  }


  /**
   * This function generates the category list HTML for the dropdown menu
   */
  function generateCategoryListHTML(){
    let dropdownHTML = document.getElementById('wrapperCategoryList');
    dropdownHTML.innerHTML = /*html*/`
            <div class="wrapperCategoryListElement" onclick="addNewCategory(event)">
                Add new categroy
            </div>
        `;
    categories.forEach(category => {
        dropdownHTML.innerHTML += getCategoryHTML(category);
    });
  }


  /**
   * This function generates the HTML for one category of the dropdown in the category list
   * 
   * @param {JSON} category - JSON array with the category details from the category list
   * @returns {string} - HTML code as string
   */
  function getCategoryHTML(category){
    return /*html*/`
            <div class="wrapperCategoryListElement" onclick="setCategory('${category.name}')">
                <div class="wrapperCategoryDetails">
                    <div class="categoryColor" style="background-color: ${category.color};"></div>
                    <span class="categoryName">${category.name}</span>
                </div>
                <div class="wrapperCategoryOtions">
                    <div class="categoryOptionEdit" onclick="editCategory('${category.name}',event)"></div>
                    <div class="verticalLine"></div>
                    <div class="categoryOptionDelete" onclick="deleteCategory('${category.name}',event)"></div>
                </div>
            </div>
        `
  }


  /**
   * This functions sets the category in the input field
   * 
   * @param {string} name - name of the category
   */
  function setCategory(name){
    document.getElementById('inputNewCategory').value = name;
    closeDropdownCategoryList(["wrapperCategoryList"]);
  }


  /**
   * This function enables the input HTML element to edit the category
   * 
   * @param {string} name - Name of the category to edit
   * @param {event} event - dom event of oncklick the category elemnt
   */
  function editCategory(name,event){
    event.stopPropagation();
    let inputElement = document.getElementById('inputNewCategory');
    inputElement.disabled = false;
    inputElement.value = name;
    inputElement.focus();
    closeDropdownCategoryList(["wrapperCategoryList"]);
  }


  /**
   * This function deletes a category from the category list 
   * 
   * @param {string} name - Name of the category which will be deleted
   * @param {event} event - dom event of oncklick the category elemnt
   */
  function deleteCategory(name,event){
    event.stopPropagation();
    let idx = categories.findIndex(c => c.name == name);
    categories.splice(idx,1);
    generateCategoryListHTML();
  }


  function addNewCategory(event){
    document.getElementById('inputNewCategory').setAttribute('placeholder','Add new category name');
    editCategory('',event);
  }