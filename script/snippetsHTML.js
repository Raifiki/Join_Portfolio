
/**
 * This function generates the LogIn card HTML on the login page
 * 
 * @returns {string} - string with HTML code for Log In Card
 */
function getLogInCardHTML(email){  
    return /*html*/`
            <h1>Log in</h1>
            <div id="underline"></div>
            <form onsubmit="checkLoginData(); return false">
                <input type="email" id="email" name="Email" placeholder="Email" required>
                <input type="password" id="pwd" name="Password" placeholder="Password" required>
                <span id="errMsgPwd"></span>
                <div class="pwd-ext">
                    <input type="checkbox" name="Remember" id="saveLogin">
                    <label for="saveLogin">Remember me</label>
                    <a onclick="renderLoginCard(getForgotPwdCardHTML());hideElement(['signUp'])">Forgot my password</a>
                </div>
                <div class="but-area">
                    <button class="but-dark">Log in</button>
                    <button class="but-light" onclick="loginGuest()">Guest Log in</button>
                </div>
            </form>
    `
}


/**
 * This function generates the Sign Up card HTML on the login page
 * 
 * @returns {string} - string with HTML code for sign up Card
 */
function getSignUpCardHTML(){
    return /*html*/`
        <img class="arrow-back" src="./img/icons/arrow_left_lightblue.svg" alt="back" onclick="renderLoginCard(getLogInCardHTML()); showElement(['signUp'])">
        <h1>Sign up</h1>
        <div id="underline"></div>
        <form onsubmit="checkSignUpData(); return false">
            <input type="name" id="name" name="Name" placeholder="Name Lastname" pattern="[A-ZÄÖÜ][a-zäöüß]{1,} [A-ZÄÖÜ][a-zäöüß]{1,}" title="Name Lastname" required>
            <span id="msgName"></span>
            <input type="email" id="email" name="Email" placeholder="Email" required>
            <span id="msgEmail"></span>
            <input type="password" id="pwd" name="Password" placeholder="Password" minlength="8" required>
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
function getForgotPwdCardHTML(){
    return /*html*/`
        <img class="arrow-back" src="./img/icons/arrow_left_lightblue.svg" alt="back" onclick="renderHTML('content',LoginHTML); showElementID('signUp')">
        <h1>I forgot my password</h1>
        <div id="underline"></div>
        <p>Don't worry! We will send you an email with the istructions to reset your password.</p>
        <form action="https://join-615.developerakademie.net/php/send_mail_change_pwd.php" method="POST"> 
            <input type="email" id="email" name="Email" placeholder="Email" required>
            <span id="msgMail"></span>
            <button class="but-dark">Send me the email</button>
        </form>
`;
}