let selectedUsers = [];
let subTasks = [];
let taskClassification = 'ToDo';


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
    document.getElementById('inputSearchAssignedTo').setAttribute('placeholder','Search');
    document.getElementById('wrapperAssignedToHLImg').setAttribute('onclick','closeDropdownMemberList(["wrapperMemberList"])');
    document.getElementById('wrapperAssignedToHL').removeAttribute('onclick');
    generateMemberListHTML();
  }
  

  /**
   * This function close the drop down menu for the members
   * 
 * @param {string} ID - ID of the hidden elment
   */
  function closeDropdownMemberList(ID) {
    console.log('clicked')
    hideElement(ID,'');
    document.getElementById('wrapperAssignedToHL').classList.remove('styleOpen');
    document.getElementById('wrapperAssignedToHLImg').classList.remove('styleOpen');
    document.getElementById('inputSearchAssignedTo').value='';
    document.getElementById('inputSearchAssignedTo').setAttribute('placeholder','Select contacts to assign');
    setTimeout(()=>{document.getElementById('wrapperAssignedToHL').setAttribute('onclick','openDropdownMemberList(["wrapperMemberList"])');},100);
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
    document.getElementById('wrapperCategoryHL').removeAttribute('onclick');
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
  setTimeout(()=>{document.getElementById('wrapperCategoryHL').setAttribute('onclick','openDropdownCategoryList(["wrapperCategoryList"])')},100);
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
async function deleteCategory(name,event){
  event.stopPropagation();
  let idx = categories.findIndex(c => c.name == name);
  categories.splice(idx,1);
  await setItem('categories',categories);
  generateCategoryListHTML();
  changeCategoryNameInTasks(name,'');
  await setItem('tasks',tasks);
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
  let newName = document.getElementById('inputNewCategory').value;
  categories[idx].name = newName;
  categories[idx].color = getCheckedCategoryColor();
  changeCategoryNameInTasks(oldName, newName);
}


/**
 * This function changes the category name of the existing tasks which had the same category
 * 
 * @param {string} oldName - name which are still valid in the tasks array
 * @param {string} newName - name which will be valid in the tasks array
 */
function changeCategoryNameInTasks(oldName, newName){
  tasks.forEach(task => {if (task.category == oldName)task.category = newName});
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
async function saveCategory(oldName){
  (oldName == '')? saveNewCategory():saveCategoryChanges(oldName);
  await setItem('categories',categories);
  await setItem('tasks',tasks);
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


/**
 * This funtion sets the new subtask input HTML element settings to edit
 */
function setInputNewSubtaskEditSettings(){
  let iptHTMLelement = document.getElementById('inputNewSubtask');
  iptHTMLelement.disabled = false;
  iptHTMLelement.focus();
  hideElement(['wrapperBtnAddSubtask']);
  showElement(['subtaskEditBtn']);
}


/**
 * This function sets the add subtask HTML input element settings to default
 */
function setInputNewSubtaskSettingsDefault(){
  let iptHTMLelement = document.getElementById('inputNewSubtask');
  iptHTMLelement.value = '';
  iptHTMLelement.setAttribute('placeholder','Add new subtask')
  setTimeout(()=>{
    hideElement(['subtaskEditBtn']);
    showElement(['wrapperBtnAddSubtask']);
  },100);
}


/**
 * This function add a new subtask to the subtasks array
 */
function addSubtask(){
  let iptHTMLelement = document.getElementById('inputNewSubtask');
  let newSubtask = iptHTMLelement.value;
  if(newSubtask) {
      subTasks.push(newSubtask);
      setInputNewSubtaskSettingsDefault();
  }
  renderSubtasksList();
}


/**
 * This function rendes the subtask list
 */
function renderSubtasksList(){
  let subtaskListHTML = document.getElementById('wrapperSubtaskList');
  subtaskListHTML.innerHTML = '';
  subTasks.forEach((sT,idx) => subtaskListHTML.innerHTML += getSubtaskElementHTML(idx));
}


/**
 * This function generates the HTML of one subtask of the subtask list
 * 
 * @param {number} idx - index of the subtaskt in the subtasks array
 * @returns {string} - HTML code as string
 */
function getSubtaskElementHTML(idx){
  return /*html*/`
      <div class="wrapperSubtaskListElement">
          <input id="iptSubtask${idx}" class="subtaskIptElement" type="text" disabled value="${subTasks[idx]}"> 
          <div id="pointSubtask${idx}" class="subtaskListPoint"></div>
          <div id="optionsSubtask${idx}" class="wrapperSubtaskOtions">
                  <div class="subtaskOptionEdit" onclick="editSubtask(${idx})"></div>
                  <div class="verticalLine"></div>
                  <div class="subtaskOptionDelete" onclick="deleteSubtask(${idx})"></div>
          </div>
          <div id="optionsSubtaskEdit${idx}" class="wrapperSubtaskOtions display-none">
              <div class="subtaskOptionDelete" onclick="deleteSubtask(${idx})"></div>
              <div class="verticalLine"></div>
              <div class="subtaskOptionCheck" onclick="saveSubtask(${idx})"></div>
          </div>
      </div>
  `
}


/**
 * This function deletes the subtask with the index in the subtasks array 
 * 
 * @param {number} idx - index of the subtaskt in the subtasks array
 */
function deleteSubtask(idx){
  subTasks.splice(idx,1);
  renderSubtasksList();
}


/**
 * This function set the input settigns of the subtask editable
 * 
 * @param {number} idx - index of the subtaskt in the subtasks array
 */
function editSubtask(idx){
  let iptElement = document.getElementById(`iptSubtask${idx}`);
  iptElement.disabled = false;
  iptElement.focus();
  hideElement([`pointSubtask${idx}`,`optionsSubtask${idx}`]);
  showElement([`optionsSubtaskEdit${idx}`]);
}


/**
 * This function saves the cahnges of the subtask
 * 
 * @param {number} idx - index of the subtaskt in the subtasks array
 */
function saveSubtask(idx){
  let iptElement = document.getElementById(`iptSubtask${idx}`);
  subTasks[idx] = iptElement.value;
  iptElement.disabled = true;
  hideElement([`optionsSubtaskEdit${idx}`]);
  showElement([`pointSubtask${idx}`,`optionsSubtask${idx}`]);
}


/**
 * This function clears the form to default settings
 */
function clearFormAddTask(){
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDescription').value = '';
  clearAssignedToSection();
  document.getElementById('taskDueDate').value = '';
  clearPrioSection();
  setInputCategoryChooseSettings();
  clearSubtaskSection();
}


/**
 * This function clears the Assigned to section to default
 */
function clearAssignedToSection(){
  closeDropdownMemberList(['wrapperMemberList']);
  selectedUsers = [];
  document.getElementById('wrapperAssignedToActual').innerHTML = getAssignedToHTML(selectedUsers);
}


  /**
 * This function clears the prio section to default
 */
function clearPrioSection(){
  let prioBtn = document.querySelector('#wrapperPrio input:checked');
  if(prioBtn) prioBtn.checked = false;
}


  /**
 * This function clears the subtask section to default
 */
function clearSubtaskSection(){
  subTasks=[];
  setInputNewSubtaskSettingsDefault();
  renderSubtasksList();
}


/**
 * This function takes all the form data and generates a new task
 * 
 * @returns {JSON} - JSON object as task
 */
function generateNewTask(){
  let title = document.getElementById('taskTitle').value;
  let description = document.getElementById('taskDescription').value;
  let users = selectedUsers;
  let deadline = document.getElementById('taskDueDate').value;
  let prio = getPrio();
  let category = getCategory();
  let subtasks = getSubtasks();
  let classification = taskClassification;
  let id = getNewTaskID();
  return {title,description,users,deadline,prio,category,subtasks,classification,id}
}

/**
 * This function gets the choosen prio of the task
 * 
 * @returns {number} - number of the prio, 0:low;1:medium;2:high
 */
function getPrio(){
  let prio = document.querySelector('#wrapperPrio input:checked');
  if(prio) prio = prio.value;
  return prio;
}


/**
 * This function gets the choosen category
 * 
 * @returns {string} - category name
 */
function getCategory(){
  let category = document.getElementById('inputNewCategory').value;
  if(category) return category;
}


/**
 * This function gets the subtasks of the new task
 * 
 * @returns {JSON} - JSON array with all subtasks, each subtask has the field state and description
 */
function getSubtasks(){
  let tasks = [];
  subTasks.forEach(sT => {tasks.push({description:sT,state:0});});
  return tasks;
}


/**
 * This function calculates the ID for a new task with respect to the existing tasks
 * 
 * @returns {number} - task ID for a new task
 */
function getNewTaskID(){
  let lastID = -1;
  tasks.forEach(task => lastID = Math.max(task.id,lastID));
  return ++lastID;
}


/**
 * This function adds a new task to the task list
 */
async function addNewTaskToTasklist(){
  let newTask = generateNewTask();
  if(newTask.category){
      tasks.push(newTask);
      await setItem('tasks',tasks); 
      showPopup();
      (activeTab == 'tabaddtask')?openBoardPage():closeAddTaskOvly();
      clearFormAddTask();
  };
}


/**
 * This function opens the board page afer 3 seconds
 */
function openBoardPage(){
  setTimeout(function(){window.location.href = 'board.html'+'?user='+ USER},3000);
}


/**
 * This function close the addTask overlay at the board page
 */
function closeAddTaskOvly(){
  setTimeout(function(){
    renderBoard(tasks);
    hideOvlyCard();
  },3000);
}