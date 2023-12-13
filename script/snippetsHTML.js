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
                    <button class="but-light" onclick="">Guest Log in</button>
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
                    <a href="">Privacy policy</a> 
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
            <button class="ovlyTaskBtn">
                <span id="ovlyTaskBtnImgDelete"></span>
                <span>Delete</span>
            </button>
            <div class="verticalLine"></div>
            <button class="ovlyTaskBtn">
                <span id="ovlyTaskBtnImgEdit"></span>
                <span>Edit</span>
            </button>
        </div>
        </div>
        <button id="ovlyBtnClose" onclick="hideOvlyCard(),filterTasks()">
            <img src="../img/icons/board/close.svg" alt="">
        </button>

    `
}


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


function getOvlyTaskSubtaskHTML(subtaskList){
    let HTML = '';
    subtaskList.forEach(task => {
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



