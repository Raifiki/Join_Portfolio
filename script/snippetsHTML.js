//login page related ------------------------------------
/**
 * This function generates the LogIn card HTML on the login page
 * 
 * @returns {string} - string with HTML code for Log In Card
 */
function getLogInCardHTML(email) {
    return /*html*/`
            <h1>Log in</h1>
            <div id="underline"></div>
            <form onsubmit="checkLoginData(); return false">
                <input type="email" id="email" name="Email" placeholder="Email" required>
                <input type="password" id="pwd" name="Password" onclick="togglePwdVisbile(event)" placeholder="Password" required>
                <span id="errMsgPwd"></span>
                <div class="pwd-ext">
                    <input type="checkbox" name="Remember" id="iptSaveLoginData">
                    <label for="saveLogin">Remember me</label>
                    <a onclick="renderLoginCard(getForgotPwdCardHTML());hideElement(['signUp'])">Forgot my password</a>
                </div>
                <div class="but-area">
                    <button class="but-dark" onclick="">Log in</button>
                    <button class="but-light" type="button" onclick="window.location.href = 'pages/summary.html'+'?redir=LogIn';" >Guest Log in</button>
                </div>
            </form>
    `
}


/**
 * This function generates the Sign Up card HTML on the login page
 * 
 * @returns {string} - string with HTML code for sign up Card
 */
function getSignUpCardHTML() {
    return /*html*/`
        <img class="arrow-back" src="./img/icons/login/arrow_left_lightblue.svg" alt="back" onclick="renderLoginCard(getLogInCardHTML()); showElement(['signUp'])">
        <h1>Sign up</h1>
        <div id="underline"></div>
        <form onsubmit="checkSignUpData(this); return false" action="https://leonard-weiss.developerakademie.net/Projekte/M12_JoinPortfolio/php/send_mail_addUser.php" method="POST">
            <input type="name" id="name" name="Name" placeholder="Name Lastname" pattern="[A-ZÄÖÜ][a-zäöüß]{1,} [A-ZÄÖÜ][a-zäöüß]{1,}" title="Name Lastname" required>
            <span id="msgName"></span>
            <input type="email" id="email" name="Email" placeholder="Email" required>
            <span id="msgEmail"></span>
            <input type="password" id="pwd" name="Password" placeholder="Password" minlength="8" onclick="togglePwdVisbile(event)" required>
            <input type="password" id="pwdCon" name="Password" placeholder="Confirm Password" minlength="8" required>
            <span id="msgPwd"></span>
            <div id="privacyPolicy">
            <input type="checkbox" name="acceptPolicy" id="checkPolicy" required>
                <label for="checkPolicy">
                    <span>I accept the</span>
                    <a href="./pages/impressumLogin.html?user=0&redir=LogIn&dir=privacypolicy" target="_blank">Privacy policy</a> 
                </label>
            </div>
            <button class="but-dark" type="submit">Sign up</button>          
        </form>
    `
}


/**
 * This function generates the forgot password card HTML on the login page
 * 
 * @returns {string} - string with HTML code for forgot password Card
 */
function getForgotPwdCardHTML() {
    return /*html*/`
        <img class="arrow-back" src="./img/icons/login/arrow_left_lightblue.svg" alt="back" onclick="renderLoginCard(getLogInCardHTML()); showElement(['signUp'])">
        <h1>I forgot my password</h1>
        <div id="underline"></div>
        <p>Don't worry! We will send you an email with the istructions to reset your password.</p>
        <form onsubmit="sendEmailForgotPwd(this); return false"  action="https://leonard-weiss.developerakademie.net/Projekte/M12_JoinPortfolio/php/send_mail_change_pwd.php" method="POST"> 
            <input type="email" id="email" name="Email" placeholder="Email" required>
            <span id="msgMail"></span>
            <button class="but-dark">Send me the email</button>
        </form>
`;
}


//contact page related ------------------------------------
/**
 * This function generates the HTML code for the overlay to add a new contact
 * 
 * @returns {string} - HTML code as string
 */
function getOvlyCardNewContactHTML() {
    return /*html*/`
        <div id="ovlyCardHeader">
            <img src="../img/icons/navbar/logo_white.svg" alt="logo">
            <span id="ovlyCardHL">Add contact</span>
            <span id="ovlyCardST">Tasks are better with a team!</span>
            <div id="ovlyCardLine"></div>
        </div>
        <form id="wrapperCardDetails" onsubmit="return false">
            <div id="ovlUserIC">
                <img src="../img/icons/contact/user_line-white.svg" alt="">
            </div>
            <div id="wrapperFormOvlyContact">
                <div id="ovlyCardForm">
                    <div>
                        <input id="formContactName" type="text" placeholder="Name"
                        pattern="[A-ZÄÖÜ][a-zäöüß]{1,} [A-ZÄÖÜ][a-zäöüß]{1,}"
                        title="Name Lastname" required>
                        <img src="../img/icons/contact/user_line.svg" alt="user">
                    </div>
                    <div>
                        <input id="formContactEmail" type="email" placeholder="Email" 
                        required>
                        <img src="../img/icons/contact/mail.svg" alt="letter">
                    </div>
                    <div>
                        <input id="formContactPhone" type="text" placeholder="Phone" 
                        pattern="[0-9+ ]{1,}"
                        title="only numbers and + sign"
                        required>
                        <img src="../img/icons/contact/phone.svg" alt="phone">
                    </div>
                </div>
                <div id="ovlywrapperBtn">
                    <button id="ovlyBtnSecondary" class="but-light" type="submit" formnovalidate onclick="hideOvlyCard()">
                        <span>Cancel</span>
                        <img src="../img/icons/contact/close.svg" alt="cross">
                    </button>
                    <button id="ovlyBtnPrimary" class="but-dark" type="submit" onclick="createContact()">
                        <span>Create contact</span>
                        <img src="../img/icons/contact/check.svg" alt="check">
                    </button>
                </div>
            </div>
            <button id="ovlyBtnClose" formnovalidate onclick="hideOvlyCard()"></button>
        </form>
    `
}


/**
 * This function generates the HTML code for an letter field within the contact List
 * 
 * @param {string} letter - letter which will be shown
 * @returns {string} - HTML code as string
 */
function getContactListLetterHTML(letter) {
    return /*html*/`
        <div class="ContactlistelementLetter">
            <span class="listLetter">${letter}</span>
            <div class="line"></div>
        </div>
    `
}

/**
 * This function generates the HTML code for an contact field wthin the contact List
 * 
 * @param {number} idx - index of the contact in the sorted contact list
 * @param {JSON} contactData - JSON array with the contact data, JSON filds: color, email,initials, name, phone
 * @returns {string} - HTML code as string
 */
function getContactListContactHTML(idx, contactData) {
    return /*html*/`
        <div id="contact${idx}" class="Contactlistelement" onclick="showContactDetails(event,'${idx}')">
            <span id="contactinitialsList${idx}" class="contactinitialsList">${contactData['initials']}</span>
            <div class="wrapperContact">
                <span id="contactNameList${idx}" class="contactnameList">${contactData['name']}</span>
                <span id="contactemailList${idx}" class="contactemailList">${contactData['email']}</span>
            </div>
        </div>
    `
}


/**
 * This function generates the HTML for a empty contact List
 * 
 * @returns {string} - HTML code as string
 */
function getEmptyContactListHTML() {
    return /*html*/`
            <div id="wrapperNoContacts">
                <span>Your contact list is empty</span>
            </div>
        `;
}


/**
 * This function generates the overlay card HTML for edit contact
 * 
 * @param {number} idx - index of the contact in the sorted contact list
 * @returns {string} - HTML code as string
 */
function getOvlyCardEditContactHTML(idx) {
    let contactData = contactListSorted[idx];
    return /*html*/`
        <div id="ovlyCardHeader">
                    <img src="../img/icons/navbar/logo_white.svg" alt="logo">
                    <span id="ovlyCardHL">Edit contact</span>
                    <div id="ovlyCardLine"></div>
                </div>
                <form id="wrapperCardDetails" onsubmit="return false">
                    <div id="ovlUserIC" style="background-color: ${contactData['color']}">
                        <span>${contactData['initials']}</span>
                    </div>
                    <div id="wrapperFormOvlyContact">
                        <div id="ovlyCardForm">
                            <div>
                                <input id="formContactName" type="text" placeholder="Name" value="${contactData['name']}"
                                pattern="[A-ZÄÖÜ][a-zäöüß]{1,} [A-ZÄÖÜ][a-zäöüß]{1,}"
                                title="Name Lastname" required>
                                <img src="../img/icons/contact/user_line.svg" alt="user">
                            </div>
                            <div>
                                <input id="formContactEmail" type="email" placeholder="Email" value="${contactData['email']}" 
                                required>
                                <img src="../img/icons/contact/mail.svg" alt="letter">
                            </div>
                            <div>
                                <input id="formContactPhone" type="text" placeholder="Phone" value="${contactData['phone']}"
                                pattern="[0-9+ ]{1,}"
                                title="only numbers and + sign"
                                required>
                                <img src="../img/icons/contact/phone.svg" alt="phone">
                            </div>
                        </div>
                        <div id="ovlywrapperBtn">
                            <button id="ovlyBtnSecondary" class="but-light" type="submit" formnovalidate onclick="deleteContact(${idx})">
                                <span>Delete</span>
                            </button>
                            <button id="ovlyBtnPrimary" class="but-dark" type="submit" onclick="saveContact(${idx})">
                                <span>Save</span>
                                <img src="../img/icons/contact/check.svg" alt="check">
                            </button>
                        </div>
                    </div>
                    <button id="ovlyBtnClose" formnovalidate onclick="hideOvlyCard()"></button>
                </form>
    `
}


//addTask page related ------------------------------------
/**
 * This function generates the HTML code snippet for the assigned members to the task
 * 
 * @param {Array} members - Array with the email adress of each member as a string
 * @param {boolean} includeName - flag if the name shall be shown as well
 * @returns {string} - HTML code as string
 */
function getAssignedToHTML(members,includeName){
    let HTML='';
    members.forEach(m => {
        let member = contactListSorted.filter(c => c['email'] == m)[0]; // email is unique
        HTML += (includeName)? getAssignedToInitialsAndNameHTML(member):getAssignedToInitialsHTML(member);
    });
    return HTML;
}


/**
 * This function generates the HTML code of the initials of an assigned member 
 * 
 * @param {JSON} member - JSON object with the member details
 * @returns {string} - HTML code as string
 */
function getAssignedToInitialsHTML(member){
    return /*html*/`<div class="memberInitials" style="background-color: ${member['color']};">${member['initials']}</div>`
}


/**
 * This function generates the HTML code of the initials and the name of an assigned member 
 * 
 * @param {JSON} member - JSON object with the member details
 * @returns {string} - HTML code as string
 */
function getAssignedToInitialsAndNameHTML(member){
    return /*html*/`
            <div class="assignedToElement">
                <span class="memberInitials" style="background-color: ${member['color']};">${member['initials']}</span>
                <span>${member['name']}</span>
            </div>
        `
}


/**
 * This function generates the HTML code for the addTask overlay on the board page
 */
let ovlyAddTaskHTML;
async function getOvlyAddTaskHTML(){
    let response = await fetch('../templates/addTask.html');
    ovlyAddTaskHTML = await response.text();
    ovlyAddTaskHTML += /*html*/`
        <button id="ovlyBtnClose" onclick="hideOvlyCard(),filterTasks()">
            <img src="../img/icons/board/close.svg" alt="">
        </button>
    `;
}


/**
 * This function generates the HTML code for the task overlay
 * 
 * @param {number} idx - index of the task within the tasks array
 * @returns {string} - HTML code as string
 */
function getOvlyTaskHTML(idx){
    let task = tasks[idx];
    let category = getCategoryDetails(task.category);
    let prioHTML = getPriorityHTML(task.prio);
    let usersHTML = getOvlyTaskAssignedToHTML(task.users);
    let subtasksHTML = getOvlyTaskSubtaskHTML(task.subtasks);
    return /*html*/`
        <div id="wrapperOvlyCardTask">
            <div class="task-category" style="background-color: ${category.color}">${category.name}</div>
            <div id="ovlyTaskTitle">${task.title}</div>
            <div id="ovlyTaskDescription">${task.description}</div>
            <div id="wrapperOvlyTaskDetails">
                <div class="wrapperOvlyTaskDetailsColumn">
                    <span>Due date:</span>
                    <span>Priority:</span>
                </div>
                <div class="wrapperOvlyTaskDetailsColumn">
                    <span>${task.deadline}</span>
                    <span>${prioHTML}</span>
                </div>
            </div>
            <div id="wrapperOvlyTaskAssignedTo">
                <span>Assigned To:</span>
                <div id="wrapperOvlyTaskUserList">${usersHTML}</div>
            </div>
            <div id="wrapperOvlyTaskSubtask">
                <span>Subtasks</span>
                <div id="wrapperOvlyTaskSubtaskList">${subtasksHTML}</div>
            </div>
            <div id="wrapperOvlyTaskBtnGroup">
            <button class="ovlyTaskBtn" onclick="deleteTask(${idx})">
                <span id="ovlyTaskBtnImgDelete"></span>
                <span>Delete</span>
            </button>
            <div class="verticalLine"></div>
            <button class="ovlyTaskBtn" onclick="showOvlyCard(getOvlyEditTaskHTML(${idx}))">
                <span id="ovlyTaskBtnImgEdit"></span>
                <span>Edit</span>
            </button>
        </div>
        </div>
        <button id="ovlyBtnClose" onclick="hideOverlayBoard(${idx})">
            <img src="../img/icons/board/close.svg" alt="">
        </button>

    `
}


/**
 * This function generates the HTML code for the Priority part in the task overlay
 * 
 * @param {number} prio - Priority of the task, 0,1,2
 * @returns {string} - HTML code as string
 */
function getPriorityHTML(prio){
    let prioName, prioImg;
    if (prio == 2) {
        prioName = 'Urgent';
        prioImg = '../img/icons/board/prioUrgent copy.svg';
    } else if(prio == 1){
        prioName = 'Medium';
        prioImg = '../img/icons/board/prioMedium copy.svg';
    } else {
        prioName = 'Low';
        prioImg = '../img/icons/board/prioLow copy.svg';
    }
    return /*html*/`
        <div id="ovlyTaskPrio" >
            <span>${prioName}</span>
            <img src="${prioImg}" alt="">
        </div>
    `
}


/**
 * This function generates the HTML code for the assignedTo part in the task overlay
 * 
 * @param {Array} emailList - array with email adresses from the users
 * @returns {string} - HTML code as string
 */
function getOvlyTaskAssignedToHTML(emailList){
    let HTML='';
    emailList.forEach(user => {
        let member = contactListSorted.find(contact => contact.email == user)
        HTML += /*html*/`
            <div class="wrapperOvlyTaskUser">
                <span class="ovlyTaskUserInitials" style="background-color: ${member.color}">${member.initials}</span>
                <span class="ovlyTaskUserName">${member.name}</span>
            </div>
        `
    });
    return HTML;
}


/**
 * This function generates the HTML code for the subtask part in the task overlay
 * 
 * @param {Array} subtaskList - array with the subtasks
 * @returns {string} - HTML code as string
 */
function getOvlyTaskSubtaskHTML(subtaskList){
    let HTML = '';
    subtaskList.forEach((task) => {
        let checked = (task.state == 1)? "checked":"";
        HTML += /*html*/`
            <div class="wrapperOvlyTaskSubtaskElement">
                <input type="checkbox" ${checked}>
                <span class="ovlyTaskSubtaskDescription">${task.description}</span>
            </div>
        `
    })
    return HTML
}


/**
 * This function generates the EditTask overlay
 * 
 * @param {number} taskIdx - index of the task in the tasks array
 * @returns {string} - HTML code as string
 */
function getOvlyEditTaskHTML(taskIdx){
    let task = tasks[taskIdx];
    let assignedToHTML = getAssignedToHTML(task.users);
    let subtaskHTML = getOvlyEditTaskSubtaskHTML(task.subtasks);
    let prioHTML = getEditTaskPrioHTML(task.prio);
    selectedUsers = task.users;
    return /*html*/`
        <form id="wrapperOvlyCardEditTask" onsubmit="updateTask(${taskIdx});showOvlyCard(getOvlyTaskHTML(${taskIdx}));return false">
            <div class="editTaskCardElement">
                <label for="editTaskCardTitle">Title</label>
                <input id="editTaskCardTitle"  type="text" placeholder="Enter a title" value="${task.title}">
            </div>
            <div class="editTaskCardElement">
                <label for="editTaskCardDescription">Description</label>
                <textarea id="editTaskCardDescription" placeholder="Enter a description">${task.description}</textarea>
            </div>
            <div class="editTaskCardElement">
                <label for="editTaskCardDueDate">Due date</label>
                <input id="editTaskCardDueDate" type="date" value="${task.deadline}">
            </div>
            <div class="editTaskCardElement">
                <span for="editTaskCardPriority">Priority</span>
                <div id="wrapperPrio">${prioHTML}</div>
            </div>
            <div class="editTaskCardElement" id="wrapperAssignedTo">
                <span>Assigned to</span>
                <div>
                    <div class="" id="wrapperAssignedToHL">
                        <input id="inputSearchAssignedTo" type="text" placeholder="Select contacts to assign" disabled onkeyup="generateMemberListHTML()">    
                        <div class="wrapperDropDownArrow">
                            <img class="" id="wrapperAssignedToHLImg" src="../img/icons/addTask/arrow_drop_down.svg" alt="" onclick="openDropdownMemberList(['wrapperMemberList'])"> 
                        </div>
                    </div>
                    <div class="display-none" id="wrapperMemberList"></div>
                </div>
                <div id="wrapperAssignedToActual">${assignedToHTML}</div>
            </div>
            <div id="wrapperCategory" class="editTaskCardElement">
                <span>Category</span>
                <div>
                    <div class="" id="wrapperCategoryHL">
                        <input id="inputNewCategory" type="text" placeholder="Select task category" disabled value="${task.category}">
                        <div class="wrapperDropDownArrow" id="wrapperDropDownArrowCategory">
                            <img class="" id="wrapperCategoryHLImg" src="../img/icons/addTask/arrow_drop_down.svg" alt="" onclick="openDropdownCategoryList(['wrapperCategoryList'])"> 
                        </div>
                        <div id="categoryEditBtns" class="wrapperEditBtns display-none">
                            <div class="wrapperEditBtn" onclick="setInputCategoryChooseSettings()">
                                <img src="../img/icons/addTask/cross.svg" alt="discard">
                            </div>
                            <div class="verticalLine"></div>
                            <div class="wrapperEditBtn" id="btnSaveCategoryChanges">
                                <img src="../img/icons/addTask/check.svg" alt="check">
                            </div>
                        </div>
                    </div>
                    <div id="wrapperCategoryColor" class="display-none">
                        <input id="categoryColorYellow" type="radio" name="color" value="#FFC701">
                        <label id="categoryColorYellowlabel" for="categoryColorYellow">
                            <div class="colorDot" style="background-color: #FFC701;"></div>          
                        </label>
                        <input id="categoryColorOrange" type="radio" name="color" value="#FF7A00">
                        <label id="categoryColorOrangelabel" for="categoryColorOrange">
                            <div class="colorDot" style="background-color: #FF7A00;"></div>
                        </label>
                        <input id="categoryColorPink" type="radio" name="color" value="#FF71FF">
                        <label id="categoryColorPinklabel" for="categoryColorPink">
                            <div class="colorDot" style="background-color: #FF71FF;"></div>
                        </label>
                        <input id="categoryColorBlue" type="radio" name="color" value="#0038FF">
                        <label id="categoryColorBluelabel" for="categoryColorBlue">
                            <div class="colorDot" style="background-color: #0038FF;"></div>
                        </label>
                        <input id="categoryColorLightblue" type="radio" name="color" value="#1FD7C1">
                        <label id="categoryColorLightbluelabel" for="categoryColorLightblue">
                            <div class="colorDot" style="background-color: #1FD7C1;"></div>
                        </label>
                    </div>
                    <div class="display-none" id="wrapperCategoryList"></div>
                </div>
            </div>
            <div class="editTaskCardElement" id="wrapperSubtask">
                <div>
                    <span>Subtasks</span>
                </div>
                <div>
                    <div class="" id="wrapperSubtaskHL">
                        <input id="inputNewSubtask" type="text" placeholder="Add new subtask" disabled>
                        <div class="wrapperDropDownArrow" id="wrapperBtnAddSubtask" onclick="setInputNewSubtaskEditSettings()">
                            <img class="" id="addSubtaskHLImg" src="../img/icons/addTask/add.svg" alt=""> 
                        </div>
                        <div id="subtaskEditBtn" class="wrapperEditBtns display-none">
                            <div class="wrapperEditBtn" onclick="setInputNewSubtaskSettingsDefault()">
                                <img src="../img/icons/addTask/cross.svg" alt="discard">
                            </div>
                            <div class="verticalLine"></div>
                            <div class="wrapperEditBtn" id="btnSaveSubtask" onclick="addSubtask()">
                                <img src="../img/icons/addTask/check.svg" alt="check">
                            </div>
                        </div>
                    </div>
                    <div class="" id="wrapperSubtaskList">${subtaskHTML}</div>
                </div>
            </div>
            <button id="ovlyEditTaskSubmitBtn" class="but-dark">
                <span>Ok</span>
                <img src="../img/icons/board/check.svg" alt="">
            </button>
        </form>
        <button id="ovlyBtnClose" onclick="hideOvlyCard()">
            <img src="../img/icons/board/close.svg" alt="">
        </button>
    `
}


/**
 * This function generates the subtask section in the edit task overlay
 * 
 * @param {Array} subtaskList - array with all subtasks
 * @returns {string} - HTML code as string
 */
function getOvlyEditTaskSubtaskHTML(subtaskList){
    subTasks = [];
    subtaskList.forEach((st,idx) => subTasks[idx] = st.description);
    let HTML = '';
    subTasks.forEach((st,idx) => {HTML +=getSubtaskElementHTML(idx)})
    return HTML
}


/**
 * This function generates the prio section in the edit task overlay
 * 
 * @param {number} prio - priority of the task, 0,1,2
 * @returns {string} - HTML code as string
 */
function getEditTaskPrioHTML(prio){
    let low = (prio == 0)? "checked":"";
    let medium = (prio == 1)? "checked":"";
    let urgent = (prio == 2)? "checked":"";
    return /*html*/`
        <input id="prioUrgent" type="radio" name="prio" value=2 ${urgent}>
        <label id="prioUrgentlabel" for="prioUrgent">
            <span>Urgent</span>
            <div class="prioImg" id="prioImgUrgent"></div>
        </label>
        <input id="prioMedium" type="radio" name="prio" value=1 ${medium}>
        <label id="prioMediumlabel" for="prioMedium">
            <span>Medium</span>
            <div class="prioImg" id="prioImgMedium"></div>
        </label>
        <input id="prioLow" type="radio" name="prio" value=0 ${low}>
        <label id="prioLowlabel" for="prioLow">
            <span>Low</span>
            <div class="prioImg" id="prioImgLow"></div>
        </label>
    `
}