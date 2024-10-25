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


//------------------  Touch Drag and Drop ---------------------------------
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
