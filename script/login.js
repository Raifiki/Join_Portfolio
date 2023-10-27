let pwdIptFocused = false;

/**
 * This funtion initialize the login page
 */
async function initLogin() {
    renderLoginCard(getLogInCardHTML());
    //contactListSorted = await getItem('contacts');
    await loadLoginDatafromLS();
    //checkState();
}

/**
 * This function set the inner HTML of login card 
 * 
 * @param {string} HTMLCardContent - HTML code which has to be rendered
 */
function renderLoginCard(HTMLCardContent){
    document.getElementById('loginCard').innerHTML = HTMLCardContent;
}


/**
 * This function checks if the user is registered
 */
async function checkLoginData() {
    let [email,pwd] = getLoginData();
    let user = await isLoginDataCorrect(email,pwd);
    if (user) {
        saveLoginDataInLS(user.email);
        window.location.href = 'pages/contacts.html'+'?user='+user.id;
    }
    else {
        showErrIptMsg('errMsgPwd','Ups, wrong password! Try again.');
        styleInputWrong('pwd');
    }
}

/**
 * This function get the login data of the login form
 * 
 * @returns {Array} - array with the email adresse and the pasword, [email,pwd]
 */
function getLoginData(){
    let email = document.getElementById('email').value;
    let pwd = document.getElementById('pwd').value;
    return [email,pwd];
}


/**
 * This function checks if the user is registered
 * 
 * @param {string} email - email adresse of the user
 * @param {string} pwd - password of the user
 * @returns {boolean} - true: user us registerd, false - user is not registerd
 */
async function isLoginDataCorrect(email,pwd){
    let users = await getItem('users');
    return users.find(u => u.email == email && u.pwd == pwd);
}


/**
 * This function shows the error massage in case of wrong input data
 * 
 * @param {htmlID} errMsgHtmlId - The ID of the HTML element where the massage shall be shown
 * @param {string} massage - the massage which will be shown
 */
function showErrIptMsg(errMsgHtmlId,massage){
    document.getElementById(errMsgHtmlId).innerHTML = massage;
}


/**
 * This function highlight the input fieled which is not correct
 * 
 * @param {htmlID} inputHtmlId - The ID of the HTML element to highlight
 */
function styleInputWrong(inputHtmlId){
    let inp = document.getElementById(inputHtmlId);
    inp.classList.add('border-wrg');
    //inp.value = '';
}


/**
 * This function checks if the input data to sign in are valid
 */
async function checkSignUpData(form){
    if (isPwdMatching()) {
        let[name,email,pwd] = getSignUpData();
        if (await isUserRegisterd(email)) {
            showErrIptMsg('msgEmail','email adresse already exist - registration not possible');
            styleInputWrong('email');
        } else{
            console.log('user added - email muss noch gesendet werden!!!!');
            await addUser(name,email,pwd);
            await showPopup('You Signed Up successfully');
            form.submit();
        }
    } else{
        showErrIptMsg('msgPwd','Password confirmation is wrong!');
        styleInputWrong('pwdCon');
        styleInputWrong('pwd');
    }
}


/**
 * This function updates the password if all conditions (pwd matching + user is registered) are correct
 */
async function changePassword(){
    if (isPwdMatching()) {
        let email = URL_PARAMS.get('email');
        let popuptext = 'failed: Email address does not exist';
        if(await isUserRegisterd(email)){
            popuptext = 'You changed your password successfully';
            await replacePwd(email);
        }
        await showPopup(popuptext);
        window.location.replace('https://leonard-weiss.developerakademie.net/Projekte/M12_JoinPortfolio/index.html');
    } else{
        showErrIptMsg('msgPwd','Password confirmation is wrong!');
        styleInputWrong('pwdCon');
        styleInputWrong('pwd');
    } 
}


/**
 * This function replace the existing password with the new password
 * 
 * @param {string} email - email of the user to change the password
 */
async function replacePwd(email){
    let users = await getItem('users');
    let idxUser = users.findIndex(u => u.email == email);
    users[idxUser].pwd = document.getElementById('pwd').value;
    setItem('users',users);
}


/**
 * This function checks if the entered passwors are matching
 * 
 * @returns {boolean} - true: passwords are matching, false: passwords are not matching
 */
function isPwdMatching(){
    let pwd1 = document.getElementById('pwd').value;
    let pwd2 = document.getElementById('pwdCon').value;
    return pwd1 === pwd2;
}


/**
 * This function checks if the user is registered
 * 
 * @param {string} email - email adresse of the user
 * @returns {boolean} - true: user us registerd, false - user is not registerd
 */
async function isUserRegisterd(email){
    let users = await getItem('users');
    return users.find(u => u.email == email);
}


/**
 * This function get the login data of the sign up form
 * 
 * @returns {Array} - array with the name, email adresse and the pasword, [name,email,pwd]
 */
function getSignUpData(){
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let pwd = document.getElementById('pwd').value;
    return [name,email,pwd];
}


/**
 * This function add a new user to the users in the backend
 * 
 * @param {string} name - name of the new user, 'Name Lastname'
 * @param {string} email - email adress of the new user
 * @param {string} pwd - passwort of the new user
 */
async function addUser(name,email,pwd){
    let users = await getItem('users');
    let id = users.length + 1;
    users.push({id: id,name: name, email: email, pwd: pwd});
    setItem('users', users);
}


/**
 * This function shows the information that the sign up was successfully
 * 
 * @param {string} popupText - text which will be shown in popup
 */
async function showPopup(popupText){
    document.getElementById('popupText').innerHTML = popupText;
    document.getElementById('popupWrapper').classList.add("showPopup");
    document.getElementById('popupText').classList.add("addAnimtaion");
    await wait(1500);
}


/**
 * This function toggles the passwort between visible and not visible
 * 
 * @param {event} event - DOM event
 */
function togglePwdVisbile(event){
    event.stopPropagation();
    let iptElement = document.getElementById('pwd');
    if (pwdIptFocused) (iptElement.classList.contains('showPwd'))?hidePassword():showPassword();
    pwdIptFocused = true;
}


/**
 * This function show the password at the password input element
 */
function showPassword(){
    let iptElement = document.getElementById('pwd');
    iptElement.classList.add('showPwd');
    iptElement.type = 'text';
}


/**
 * This function hides the password at the password input element
 */
function hidePassword(){
    let iptElement = document.getElementById('pwd');
    if (iptElement) {
        iptElement.classList.remove('showPwd');
        iptElement.type = 'password';
        pwdIptFocused = false;
    }
}


/**
 * This function saves the email adress of the user in the local storage if wanted
 * 
 * @param {string} email - email adress of the login form as a string
 */
function saveLoginDataInLS(email){
    let saveLoginData = document.getElementById('iptSaveLoginData');
    if (saveLoginData.checked) {
        localStorage.setItem('userEmail',JSON.stringify(email));
    } else {
        localStorage.removeItem('userEmail');
    }
}


/**
 * This funtion loads the stored login data to the login form if wanted
 */
async function loadLoginDatafromLS(){
    let email = JSON.parse(localStorage.getItem('userEmail'));
    if (email) {
        let users = await getItem('users');
        let user = users.find(u => u.email == email);
        document.getElementById('email').value = user['email'];
        document.getElementById('pwd').value = user['pwd'];
        document.getElementById('iptSaveLoginData').checked = true;
    }
}


/**
 * This function send an email to change the user password if the conditions (email adress is registered) are fullfilled
 * 
 * @param {HTMLform} form - form from which the function is triggered
 */
async function sendEmailForgotPwd(form){
    let email =  document.getElementById('email').value;
    if (await isUserRegisterd(email)) {
        await showPopup('An E-Mail has been sent to you');
        form.submit();
    } else {
        showErrIptMsg('msgMail','Email not exist!');
        styleInputWrong('email');
    }
}


/**
 * This function renders the login page with the login card and the signUp header
 */
function showLoginPage(){
    renderLoginCard(getLogInCardHTML());
    showElement(['signUp']);
}


/**
 * This function pause the SW by a time
 * 
 * @param {number} time - time in ms to pause
 * @returns {Promise} - promise which will be fullfilled after the time parameter
 */
function wait(time){
    return new Promise(resolve => setTimeout(resolve,time));
}