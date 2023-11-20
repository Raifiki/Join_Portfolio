// summary page related functions

/**
 * This function initialize the summary page
 * 
 * @param {string} tabID - HTML ID of the active menu tab
 */
async function initSummary(tabID){
    await init(tabID);
    await setGreedingDetials();
    setSummaryDetails();
}


/**
 * This function calculates the Details for the summary page
 */
function calcSummaryNumbers(){
    let [cntToDo,cntProgress,cntFeedback,cntDone,cntUrgent,cntBoard] = [0,0,0,0,0,0];
    let urgentDate = 0;
    tasks.forEach(task => {
        if (getTaskState(task) == 'ToDo') cntToDo++;
        if (getTaskState(task) == 'InProgress') cntProgress++;
        if (getTaskState(task) == 'AwaitFeedback') cntFeedback++;
        if (getTaskState(task) == 'Done') cntDone++;
        if (isTaskUrgent(task)) {
            cntUrgent++;
            let taskDate = Date.parse(task.deadline);
            urgentDate = getSmallestDate([urgentDate,taskDate]);
        }
    });
    if(urgentDate == 0) urgentDate = getSmallestDate (tasks.map(t => Date.parse(t.deadline)));
    let urgentDateString = new Date(urgentDate).toLocaleDateString('en-GB', {year:"numeric", month:"long", day:"2-digit"});
    cntBoard = tasks.length;
    return ({cntToDo,cntProgress,cntFeedback,cntDone,cntUrgent,urgentDateString,cntBoard});
}


/**
 * This function checks in which state the task is
 * 
 * @param {JSON} task - task object
 * @returns {string} - state of the task as string, [ToDo, InProgress, AwaitingFeedback, Done]
 */
function getTaskState(task){
    let state = task.condit;
    switch (state) {
        case 0:
            return 'ToDo';
        case 1:
            return 'InProgress';
        case 2:
            return 'AwaitFeedback';
        case 3:
            return 'Done';
    }
}


/**
 * This function checks if the task is urgent
 * 
 * @param {JSON} task - task object
 * @returns {flag} - true: task is urgent, false: task is not urgent
 */
function isTaskUrgent(task){
    if (task.prio == 2) return true;
}


/**
 * This function defines the smallest date
 * 
 * @param {Array} dates - Array of dates in milliseconds
 * @returns {number} - Date in milliseconds
 */
function getSmallestDate (dates){
    return Math.min(...dates);
}


/**
 * This function sets the summary details in the HTML page
 */
function setSummaryDetails(){
    let tasksDetails = calcSummaryNumbers();
    document.getElementById('tasksToDoNumber').innerHTML = tasksDetails.cntToDo;
    document.getElementById('tasksDoneNumber').innerHTML = tasksDetails.cntDone;
    document.getElementById('urgentTasksNumber').innerHTML = tasksDetails.cntUrgent;
    document.getElementById('date').innerHTML = tasksDetails.urgentDateString;
    document.getElementById('tasksBoardNumber').innerHTML = tasksDetails.cntBoard;
    document.getElementById('tasksProgressNumber').innerHTML = tasksDetails.cntProgress;
    document.getElementById('tasksFeedbackNumber').innerHTML = tasksDetails.cntFeedback;
}


/**
 * This function sets the greeding on the summary page
 */
async function setGreedingDetials(){
    document.getElementById('greetingText').innerHTML = getGreedingText();
    document.getElementById('greetingName').innerHTML = '';
    if (USER > 0) {
        let user = await getItem('users');
        user = user.filter(u => u.id == USER)[0];
        document.getElementById('greetingName').innerHTML = user.name;
    }
}


/**
 * This function retuns the greeding text dependend on the time
 * 
 * @returns {string} - greeding sentence
 */
function getGreedingText(){
    let time = new Date().getHours();
    let greeding
    if (time < 12 && time > 5) {
        greeding = 'Good morning';
    } else if(time < 17){
        greeding = 'Good afternoon';
    } else if(time < 22){
        greeding = 'Good evening';
    } else {
        greeding = 'Hello';
    }
    if(USER > 0) greeding += ',';
    return greeding;
}


/**
 * This function opens the board page
 */
function forwardToBoardPage(){
    window.location.href = 'board.html'+'?user='+ USER;
}