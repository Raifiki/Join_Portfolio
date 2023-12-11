
let dummyTasks = [
    {
        title: "Leos Tasks0", 
        category: "Backend",
        condition: 'ToDo',
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
    },
    {
        title: "Leos Tasks1", 
        category: "Frontend",
        condition: 'InProgress',
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
    },
    {
        title: "Leos Tasks2", 
        category: "Design",
        condition: 'AwaitFeedback',
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
    },
    {
        title: "Leos Tasks3", 
        category: "Testing",
        condition: 'ToDo',
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
    },
    {
        title: "Leos Tasks4", 
        category: "Testing",
        condition: 'ToDo',
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
    },
]


/**
 * This function initialize the board page
 * 
 * @param {string} tabID - HTML ID of the active menu tab
 */
async function initBoard(tabID){
    await init(tabID);
    tasks = dummyTasks; // ---------------------------------------> delete this line at the end
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
    tasks.forEach(task => HTML += getTaskHTML(task));
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
    let [progress,subtasksDone] = getTaskProgress(task);
    let usersHTML = getTaskUsersHTML(task);
    let prio = setTaskPrioOnCard(task);
    return /*html*/`
        <div class="cardTask">
            <div class="task-category" style="background-color: ${category.color}">${category.name}</div>
            <div class="wrapperTaskText">
                <div class="task-title">${task.title}</div>
                <div class="task-description">${task.description}</div>
            </div>
            <div class="wrapperSubtasks">
                <div class="subtasksProgress">
                    <div class="subtasksProgressBar" style="width: ${progress}"></div>
                </div>
                <span> ${subtasksDone}/${task.subtasks.length} Subtasks</span>
            </div>
            <div class="wrapperCardTaskFooter">
                <div class="wrapperUsers">${usersHTML}</div>
                <div class="task-prio ${prio}"></div>
            </div>
        </div>
    `
}


/**
 * This function classifies the tasks according the actual condition of the task
 * 
 * @param {tasks} - array with the tasks to classify
 * @returns {JSON} - JSON array with classified tasks, classification: Done,InProgress,AwaitingFeedback,Done
 */
function classifyTasks(tasks){
    let ToDo = tasks.filter(t => t.condition == 'ToDo');
    let InProgress = tasks.filter(t => t.condition == 'InProgress');
    let AwaitingFeedback = tasks.filter(t => t.condition == 'AwaitFeedback');
    let Done = tasks.filter(t => t.condition == 'Done');
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