let selectedUsers = [];

// remove at the end -------------
let categories = [
    {
        color: '#FFC701',
        name: 'Testing'
    },
    {
        color: '#FF7A00',
        name: 'Frontend'
    },
    {
        color: '#0038FF',
        name: 'Backend'
    },
    {
        color: '#FC71FF',
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
            <div class="wrapperCategoryListElement" onclick="setInputCategoryNewSettings(event)">
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
   * @param {string} name - name of the category
   * @param {event} event - dom event of oncklick the category elemnt
   */
  function editCategory(name,event){
    event.stopPropagation();
    setInputCategoryEditSettings(name);
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


  /**
   * This function sets the HTML element input settings if category can be edited
   * 
   * @param {string} name - name of the category
   */
  function setInputCategoryEditSettings(name){
    let inputElement = document.getElementById('inputNewCategory');
    inputElement.disabled = false;
    inputElement.value = name;
    inputElement.focus();
    hideElement(['wrapperDropDownArrowCategory']);
    showElement(['categoryEditBtns']);
    showCategoryColorSelection(name);
    document.getElementById('btnSaveCategoryChanges').setAttribute('onclick',`saveCategory('${name}')`)
  }


  /**
   * This function set the category input field to choose settings
   */
  function setInputCategoryChooseSettings(){
    let inputElement = document.getElementById('inputNewCategory');
    inputElement.setAttribute('placeholder','Select task category');
    inputElement.disabled = true;
    inputElement.value = '';
    showElement(['wrapperDropDownArrowCategory']);
    hideElement(['categoryEditBtns','wrapperCategoryColor']);
  }


  /**
   * This function saves the category changes
   * 
   * @param {string} oldName - name which are still valid in the categories array
   */
  function saveCategoryChanges(oldName){
    let idx =categories.findIndex(c => c.name == oldName);
    categories[idx].name = document.getElementById('inputNewCategory').value;
    categories[idx].color = getCheckedCategoryColor();
  }


  /**
   * This function sets the input HTML elemnt to new category settings
   * 
   * @param {event} event - dom event of oncklick the category elemnt
   */
  function setInputCategoryNewSettings(event){
    document.getElementById('inputNewCategory').setAttribute('placeholder','Add new category name');
    editCategory('',event);
  }


  /**
   * This function saves the category settings in the input field
   * 
   * @param {string} oldName - name which are still valid in the categories array, '' for new category
   */
  function saveCategory(oldName){
    (oldName == '')? saveNewCategory():saveCategoryChanges(oldName);
    setInputCategoryChooseSettings();
  }


  /**
   * This functions add a new category to the categories array
   */
  function saveNewCategory(){
    let name = document.getElementById('inputNewCategory').value;
    let color = getCheckedCategoryColor();
    if(name != '')categories.push({name, color});
  }


  /**
   * This function shows the color selection on the HTML page
   * 
   * @param {string} name - name of the category,'' for new category
   */
  function showCategoryColorSelection(name){
    showElement(['wrapperCategoryColor']);
    if(name)setColorInSelection(categories[0].color);
  }


  /**
   * This function sets the actual color in the selection
   * 
   * @param {string} oldName - name which are still valid in the categories array
   */
  function setColorInSelection(oldColor){
    let colors = Array.from(document.querySelectorAll('#wrapperCategoryColor input[type="radio"]'));
    let color = colors.find(c => c.value == oldColor);
    color.checked = true;
  }


  /**
   * This function checks which color is selected
   * 
   * @returns {string} - string with the selected color code in hex
   */
  function getCheckedCategoryColor(){
    let color = document.querySelector('#wrapperCategoryColor input[type="radio"]:checked').value;
    return color;
  }