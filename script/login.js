let pwdIptFocused = false;

/**
 * This funtion initialize the login page
 */
async function initLogin() {
    renderLoginCard(getLogInCardHTML());
    //contactListSorted = await getItem('contacts');
    //loadLogin();
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
    if (await isLoginDataCorrect(email,pwd)) {
        //safeLogin(JSON.stringify(user)); ---------------------------------------------------------------
        console.log('login ok');
        //window.location.href = 'pages/summary.html'+'?user='+user.id; --------------------------------------
    }
    else {
        console.log('wrong password')
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
async function checkSignUpData(){
    if (isPwdMatching()) {
        let[name,email,pwd] = getSignUpData();
        if (await isUserRegisterd(email)) {
            showErrIptMsg('msgEmail','email adresse already exist - registration not possible');
            styleInputWrong('email');
        } else{
            console.log('user added - email muss noch gesendet werden!!!!');
            await addUser(name,email,pwd);
            showSignUpInformation();
            renderLoginCard(getLogInCardHTML());
            showElement(['signUp']);
        }
    } else{
        showErrIptMsg('msgPwd','Password confirmation is wrong!');
        styleInputWrong('pwdCon');
        styleInputWrong('pwd');
    }
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
 */
function showSignUpInformation(){
    document.getElementById('signedUpSuccessfully').classList.add("addAnimtaion");
    setTimeout(function(){document.getElementById('signedUpSuccessfully').classList.remove("addAnimtaion")},2000);
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
    iptElement.classList.remove('showPwd');
    iptElement.type = 'password';
    pwdIptFocused = false;
}
