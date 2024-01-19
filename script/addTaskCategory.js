  /**
 * This function open the drop down menu for categories
 * 
 * @param {string} ID - ID of the hidden elment
 */
  function openDropdownCategoryList(ID,event){
    setDefaultFormSettings()
    event.stopPropagation();
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
  document.getElementById('wrapperCategoryHL').setAttribute('onclick','openDropdownCategoryList(["wrapperCategoryList"],event)');
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
