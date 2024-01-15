let longTouchEventdetected;
let draggedElement; // needed for chrome browser

/**
 * This function initialize the board page
 * 
 * @param {string} tabID - HTML ID of the active menu tab
 */
async function initBoard(tabID){
    await init(tabID);
    renderBoard(tasks);
    await getOvlyAddTaskHTML();
}


/**
 * This function renders all tasks on the board
 * 
 * @param {array} tasks - array with the tasks which shall be rendered
 */
function renderBoard(tasks){
    let classifiedTasks = classifyTasks(tasks);
    Object.keys(classifiedTasks).forEach(className => renderClassification(className,classifiedTasks[className]));
}


/**
 * This function renders the classification of the className
 * 
 * @param {string} className - name of the classification. Name is part of the HTML element
 * @param {array} tasks - array which will be rendered
 */
function renderClassification(className,tasks){
    HTMLelement = document.getElementById(`boardClassification${className}`);
    HTMLelement.innerHTML = (tasks.length > 0)?getClassificationHTML(tasks):getNoTasksClassificationHTML(className);
}


/**
 * This function generates the classification HTML
 * 
 * @param {array} tasks - array of the rasks to render
 * @returns {string} - string with HTML code
 */
function getClassificationHTML(tasks){
    let HTML = '';
    tasks.forEach((task,idx) => HTML += getTaskHTML(task));
    HTML += `<div class="cardDummyDragOver"></div>`;
    return HTML;
}


/**
 * This function generates the classification HTML for no Tasks
 * 
 * @param {string} className - name of the classification.
 * @returns {string} - string with HTML code
 */
function getNoTasksClassificationHTML(className){
    return /*html*/`
        <div class="cardNoTasks">No tasks ${className}</div>
        <div class="cardDummyDragOver"></div>
    `
}

/**
 * This function generates the HTML code for one task
 * 
 * @param {JSON} task - JSIN object of the task
 * @returns {string} - string with HTML code
 */
function getTaskHTML(task){
    let category = getCategoryDetails(task.category);
    let subtaskHTML = getSubtaskHTML(task);
    let usersHTML = getTaskUsersHTML(task);
    let prio = setTaskPrioOnCard(task);
    return /*html*/`
        <div id="task${task.id}" class="cardTask" draggable="true" ondragstart="setDragData(event,this)" ondragend="setDragEndStyyle(this)" onclick="showOvlyCard(getOvlyTaskHTML(${task.id}))" ontouchstart="startDragTouch(${task.id})" ontouchmove="moveCardTouch(event,${task.id})" ontouchend="dropDragTouch(event,${task.id})">
            <div class="task-category" style="background-color: ${category.color}">${category.name}</div>
            <div class="wrapperTaskText">
                <div class="task-title">${task.title}</div>
                <div class="task-description">${task.description}</div>
            </div>
            ${subtaskHTML}
            <div class="wrapperCardTaskFooter">
                <div class="wrapperUsers">${usersHTML}</div>
                <div class="task-prio ${prio}"></div>
            </div>
        </div>
    `
}


/**
 * This function generates the subtask HTML for the task card
 * 
 * @param {JSON} task - JSIN object of the task
 * @returns {string} - string with HTML code
 */
function getSubtaskHTML(task){
    let HTML = '';
    if (task.subtasks.length > 0){
        let [progress,subtasksDone] = getTaskProgress(task);
        HTML = /*html*/`
                <div class="wrapperSubtasks">
                    <div class="subtasksProgress">
                        <div class="subtasksProgressBar" style="width: ${progress}"></div>
                    </div>
                    <span> ${subtasksDone}/${task.subtasks.length} Subtasks</span>
                </div>
    `}
    return HTML;
}


/**
 * This function classifies the tasks according the actual classification of the task
 * 
 * @param {tasks} - array with the tasks to classify
 * @returns {JSON} - JSON array with classified tasks, classification: Done,InProgress,AwaitingFeedback,Done
 */
function classifyTasks(tasks){
    let ToDo = tasks.filter(t => t.classification == 'ToDo');
    let InProgress = tasks.filter(t => t.classification == 'InProgress');
    let AwaitingFeedback = tasks.filter(t => t.classification == 'AwaitingFeedback');
    let Done = tasks.filter(t => t.classification == 'Done');
    return {ToDo,InProgress,AwaitingFeedback,Done};
}


/**
 * This function get the category details out of the categories array
 * 
 * @param {string} categoryName - name of the category 
 * @returns {JSON} - JSON array with category details, {color; name}
 */
function getCategoryDetails(categoryName){
    let categoryDetails = categories.find(c => c.name == categoryName);
    return (categoryDetails)?categoryDetails:{name: 'not assigned',color:'#A8A8A8'};
}


/**
 * This function calculates the task progress
 * 
 * @param {JSON} task - JSON object with the task details
 * @returns {array} - array with the progress informations, [progress as string in % , number of finished subtasks]
 */
function getTaskProgress(task){
    let nrSubtasksDone = task.subtasks.filter(sT => sT.state == 1).length;
    let progress = nrSubtasksDone/task.subtasks.length*100 + "%"
    return [progress,nrSubtasksDone]
}


/**
 * This function generates thes HTML code of the initials of the task card
 * 
 * @param {JSON} task - JSON object with the task details
 * @returns {string} - HTML code as string
 */
function getTaskUsersHTML(task){
    let userData = getInitialDataOfUsers(task);
    let HTML = '';
    userData.slice(0,3).forEach(data => HTML += /*html*/`<div class="initials" style="background-color: ${data.color}">${data.initials}</div>`);
    if (userData.length > 3)HTML += getDeltaUsersInitials(userData.length);
    return HTML;
}


/**
 * This function generates the HTML for the delta users element if the task have more then 3 users
 * 
 * @param {number} nrUser -  amount of the users assigned to this task
 * @returns {string} - HTML code as string
 */
function getDeltaUsersInitials(nrUser){
    let deltaUsers = nrUser - 3;
    return /*html*/`<div class="initials" style="background-color: #A8A8A8">+${deltaUsers}</div>`;
}


/**
 * This function gets the user data initials and color
 * 
 * @param {JSON} task - JSON object with the task details
 * @returns {JSON} - JSON with the user data for the initials on the card, {initials, color}
 */
function getInitialDataOfUsers(task){
    let userData=[];
    task.users.forEach(email => {
        let user = contactListSorted.find(contact => contact.email == email);
        userData.push({initials: user.initials,color: user.color});        
    });
    return userData;
}


/**
 * This function sets the priority of the task
 * 
 * @param {JSON} task - JSON object with the task details
 * @returns {string} - css classname as string
 */
function setTaskPrioOnCard(task){
    let prio = task.prio;
    switch (prio) {
        case "0":
            return 'task-prio-low';
        case "1":
            return 'task-prio-medium';
        case "2":
            return 'task-prio-urgent';
    }
}


/**
 * This function filters the tasks on the board according the text in the search input element
 */
function filterTasks(){
    let search = document.getElementById('searchInput').value.toLowerCase();
    let tasksFiltered = tasks.filter(task => task.title.toLowerCase().includes(search));
    renderBoard(tasksFiltered);
}


/**
 * This function sets the drag data
 * 
 * @param {event} event - DOM event when drag starts
 * @param {HTMLElement} card - card HTML element which is dragged 
 */
function setDragData(event,card){
    event.dataTransfer.setData("text",event.target.id);
    draggedElement = event.target.id; // needed for chrome browser
    card.style.transform = 'rotateZ(5deg)'; 
}


/**
 * This function sets the card style to default at drag end
 * 
 * @param {HTMLElement} card - card HTML element which is dragged
 */
function setDragEndStyyle(card){
    card.style.transform = 'rotateZ(0deg)'; 
}


/**
 * This function allow to drop a dragged element into this element
 * 
 * @param {event} event - DOM event when dragged element is over the element
 * @param {HTMLElement} element - HTMLelement from the classification
 */
function dragOverHandler(event,element){
    if(!isDraggedElementPartOfClassification(event,element)){
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        showDummyCard(element);
    }
}


/**
 * This function shows the dummy card if the dragged card is over the classifictaion
 * 
 * @param {HTMLElement} classification - HTMLelement from the classification
 */
function showDummyCard(classification){
    let dummyCard = classification.lastElementChild;
    dummyCard.style.display = 'flex';
    dummyCard.scrollIntoView({ block: "end" });
}


/**
 * This function hides the dummy card if the dragged card is leaving the classifictaion
 * 
 * @param {HTMLElement} classification - HTMLelement from the classification
 */
function hideDummyCard(classification){
    classification.lastElementChild.style.display = 'none';
}


/**
 * This function checks if the card is already in the classification
 * 
 * @param {event} event - DOM event when dragged element is over the element
 * @param {HTMLElement} classification - HTMLelement from the classification
 * @returns {HTMLElement} - true: dragged element is part of classification, false: dragged element is not part of classification
 */
function isDraggedElementPartOfClassification(event,classification){
    let dragElementHTMLID = event.dataTransfer.getData("text");
    if(!dragElementHTMLID) dragElementHTMLID = draggedElement; // needed for chrome Browser
    return Boolean(Array.from(classification.children).find(element => element.id == dragElementHTMLID));
}


/**
 * This function handles the drop event
 * 
 * @param {event} event - DOM event when drag starts
 * @param {string} classification - Classification where the dragged element is dropped, 'ToDo','InProgress','AwaitingFeedback','Done'
 */
async function dropHandler(event,classification){
    event.preventDefault();
    let dragElementHTMLID = event.dataTransfer.getData("text");
    if(!dragElementHTMLID) dragElementHTMLID = draggedElement; // needed for chrome Browser
    let taskID = getTaskIDFromHTMLcardID(dragElementHTMLID);
    await setTaskClassification(taskID,classification);
    filterTasks();
    document.getElementById(dragElementHTMLID).scrollIntoView({ block: "end" });
}


/**
 * This function sets the classification of the task
 * 
 * @param {number} taskID - task ID as number
 * @param {string} newClassification - new Classification, 'ToDo','InProgress','AwaitingFeedback','Done'
 */
async function setTaskClassification(taskID,newClassification){
    let idx = tasks.findIndex(task => task.id == taskID);
    tasks[idx].classification = newClassification;
    await setItem('tasks',tasks);
}


/**
 * This function gets the task ID from the HTML cardID of an task
 * 
 * @param {string} elementID - HTML cardID
 * @returns {number} - task ID as number
 */
function getTaskIDFromHTMLcardID(elementID){
    return +elementID.replace(/^\D+/g, '');
}


/* Overlay related functions */
/**
 * This function hide the overlay
 * 
 * @param {number} taskIdx - index of the task in the task array
 */
async function hideOverlayBoard(taskIdx){
    hideOvlyCard();
    saveSubtaskState(taskIdx);
    filterTasks();
    await setItem('tasks',tasks);
}


/**
 * This function deletes a task in the task array
 * 
 * @param {number} taskIdx - index of the task in the task array
 */
async function deleteTask(taskIdx){
    tasks.splice(taskIdx,1);
    tasks.forEach((task,idx) => task.id = idx);
    filterTasks();
    hideOvlyCard();
    await setItem('tasks',tasks);
}


/**
 * This function saves the subtask states
 * 
 * @param {number} taskIdx - index of the task in the task array
 */
function saveSubtaskState(taskIdx){
    let subtaskCheckboxes = document.querySelectorAll('#wrapperOvlyTaskSubtaskList input');
    subtaskCheckboxes.forEach((checkbox,idx) => {
        let state = (checkbox.checked)?1:0;
        tasks[taskIdx].subtasks[idx].state = state;
    });
}


/**
 * This function updates the task in the tasks array with the input on the page
 * 
 * @param {number} taskIdx - index of the task in the task array
 */
function updateTask(taskIdx){
    let title = document.getElementById('editTaskCardTitle').value;
    let description = document.getElementById('editTaskCardDescription').value;
    let users = selectedUsers;
    let deadline = document.getElementById('editTaskCardDueDate').value;
    let prio = getPrio();
    let category = getCategory();
    let subtasks = getSubtasks();
    let classification = tasks[taskIdx].classification;
    let id = tasks[taskIdx].id;
    tasks[taskIdx] = {title,description,users,deadline,prio,category,subtasks,classification,id};
}


/**
 * This function detects a touch start event for drag a task card
 *
 * @param {number} taskID - task ID
 */
function startDragTouch(taskID){
    longTouchEventdetected = setTimeout(() => {
        let card = document.getElementById('task'+taskID);
        card.style.height = card.clientHeight+'px';
        card.style.width = card.clientWidth+'px';
        card.style.position = 'fixed';
        card.style.transform = 'rotateZ(5deg)'; 
    }, 300);
}


/**
 * This function handles the touch move behavior
 * 
 * @param {event} event - DOM event at touch move
 * @param {number} taskID - task ID
 */
function moveCardTouch(event,taskID){
    let classification = getClassificationTouch(event);
    if (isDraggedElementOverOtherClassification(classification,taskID)) showDummyCardTouch(classification);
    updateCardPosition(event,taskID);
}


/**
 * This function handles the drop event of the task card
 * 
 * @param {event} event - DOM event at touch move
 * @param {number} taskID - task ID 
 */
async function dropDragTouch(event,taskID){
    if (longTouchEventdetected)clearTimeout(longTouchEventdetected);
    let classification = getClassificationTouch(event);
    if (isDraggedElementOverOtherClassification(classification,taskID)) await setTaskClassification(taskID,classification);
    filterTasks();
    document.getElementById('task'+taskID).scrollIntoView({ block: "end" });
}


/**
 * This function gets the touch position at a touch event
 * 
 * @param {event} event - DOM event at touch move
 * @returns {array} - array with x and y position
 */
function getTouchPosition(event){
    return [event.changedTouches[0].clientX,event.changedTouches[0].clientY];
}


/**
 * This function updates the card position relative to the window
 * 
 * @param {event} event - DOM event at touch move
 * @param {number} taskID - task ID 
 */
function updateCardPosition(event,taskID){
    let [touchPosX, touchPosY] = getTouchPosition(event);
    let card = document.getElementById('task'+taskID);
    card.style.left = (touchPosX - card.clientWidth/2) + 'px';
    card.style.top = (touchPosY - card.clientHeight/2) + 'px';
    card.style.zIndex = '2'; 
}


/**
 * This function gets the classification name under the dragged element
 * 
 * @param {event} event - DOM event at touch move
 * @returns {string} - name of the classification - ['ToDo','InProgress','AwaitingFeedback','Done']
 */
function getClassificationTouch(event){
    let allCards = getAllHTMLElementsInClassificationColmns();
    allCards.forEach(c => {c.style.zIndex = '-10';} );
    let classification = getClassificationHTMLElement(event);
    allCards.forEach(c => {c.style.zIndex = '1';} );
    classification = classification.id.split('boardClassification')[1];
    return classification
}


/**
 * This function gets all HTML Elements in all classification columns
 * 
 * @returns {array} - array with HTML elements
 */
function getAllHTMLElementsInClassificationColmns(){
    let allCards = Array.from(document.getElementsByClassName('cardTask'));
    let dummyCards = Array.from(document.getElementsByClassName('cardDummyDragOver'));
    let noTaskPlacholderCards = Array.from(document.getElementsByClassName('cardNoTasks'));
    return noTaskPlacholderCards.concat(dummyCards,allCards);
}


/**
 * This function gets the classification HTML elment
 * 
 * @param {event} event - DOM event at touch
 * @returns {HTMLElement} - HTML element of the classification under the dragged card
 */
function getClassificationHTMLElement(event){
    let [touchPosX, touchPosY] = getTouchPosition(event);
    return document.elementFromPoint(touchPosX,touchPosY);
}


/**
 * This function checks if the dragged element is over a new classification
 * 
 * @param {string} classification - actual classification of the task
 * @param {number} taskID - task ID 
 * @returns {boolean} - true: over new classification, false: over no classifcation or actual classification
 */
function isDraggedElementOverOtherClassification(classification,taskID){
    let classifications = ['ToDo','InProgress','AwaitingFeedback','Done'];
    let task = tasks.find(task => task.id == taskID);
    return classifications.includes(classification) && task.classification != classification
}


/**
 * This function hide all dummy cards
 */
function hideAllDummyCards(){
    let dummyTasks = Array.from(document.getElementsByClassName('cardDummyDragOver'));
    dummyTasks.forEach(dT => dT.style.display = 'none');
}


/**
 * This function shows the dummy card in the hovered classification
 * 
 * @param {string} classification name of the classification - ['ToDo','InProgress','AwaitingFeedback','Done']
 */
function showDummyCardTouch(classification){
    hideAllDummyCards();
    let element = document.getElementById('boardClassification'+classification);
    showDummyCard(element);
}