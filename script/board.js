// delete at the end ------------------------------------------- start
let dummyTasks = [
    {
        title: "Leos Tasks0", 
        category: "Backend",
        classification: 'ToDo',
        deadline: "2023-12-10",
        description: "Beschreibung",
        prio: "0",
        subtasks:[ 
            {
                description: "Test1",
                state: 1
            },
            {
                description: "Test2",
                state: 1
            }
        ],
        users: [ "daniel.schmidt@yahoo.de", "sarahw@gmail.com", "simon.huber@gmail.com" ],
        id: 0,
    },
    {
        title: "Leos Tasks1", 
        category: "Frontend",
        classification: 'InProgress',
        deadline: "2023-12-10",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore quis veniam officiis maxime consequuntur deleniti molestias necessitatibus, magni dolor, consequatur hic ea blanditiis at! Necessitatibus pariatur laboriosam quod accusamus at!",
        prio: "1",
        subtasks:[ 
            {
                description: "Test1",
                state: 0
            },
            {
                description: "Test2",
                state: 0
            }
        ],
        users: [ "daniel.schmidt@yahoo.de", "sarahw@gmail.com", "simon.huber@gmail.com" ],
        id: 1,
    },
    {
        title: "Leos Tasks2", 
        category: "Design",
        classification: 'AwaitFeedback',
        deadline: "2023-12-10",
        description: "Beschreibung",
        prio: "2",
        subtasks:[ 
            {
                description: "Test1",
                state: 0
            },
            {
                description: "Test2",
                state: 1
            }
        ],
        users: [ "daniel.schmidt@yahoo.de", "sarahw@gmail.com", "simon.huber@gmail.com" ],
        id: 2,
    },
    {
        title: "Leos Tasks3", 
        category: "Testing",
        classification: 'ToDo',
        deadline: "2023-12-10",
        description: "Beschreibung",
        prio: "2",
        subtasks:[ 
            {
                description: "Test1",
                state: 0
            },
            {
                description: "Test2",
                state: 1
            }
        ],
        users: [ "daniel.schmidt@yahoo.de", "sarahw@gmail.com", "simon.huber@gmail.com" ],
        id: 3,
    },
    {
        title: "Leos Tasks4", 
        category: "Testing",
        classification: 'Done',
        deadline: "2023-12-10",
        description: "Beschreibung",
        prio: "2",
        subtasks:[ 
            {
                description: "Test1",
                state: 0
            },
            {
                description: "Test2",
                state: 1
            },
            {
                description: "Test2",
                state: 1
            },
            {
                description: "Test2",
                state: 0
            },
            {
                description: "Test2",
                state: 1
            }
        ],
        users: [ "daniel.schmidt@yahoo.de", "sarahw@gmail.com", "simon.huber@gmail.com" ],
        id: 4,
    },
]
// delete at the end ------------------------------------------- end

/**
 * This function initialize the board page
 * 
 * @param {string} tabID - HTML ID of the active menu tab
 */
async function initBoard(tabID){
    await init(tabID);
    renderBoard(tasks);
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
        <div id="task${task.id}" class="cardTask" draggable="true" ondragstart="setDragData(event,this)" ondragend="setDragEndStyyle(this)">
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
    let AwaitingFeedback = tasks.filter(t => t.classification == 'AwaitFeedback');
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
    return categories.find(c => c.name == categoryName);
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