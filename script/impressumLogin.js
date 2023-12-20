/**
 * This function initialize the summary page
 * 
 * @param {string} tabID - HTML ID of the active menu tab
 */
async function initImpressumLogin(tabID){
    await init(tabID);
    setRedirecttionToLoginPage();
    (DIR == 'impressum')?showLegalNotice():showPrivacyPolicy();
}


/**
 * This function shows the Privacy Policy page
 */
function showPrivacyPolicy(){
    showElement(['contentPrivacyPolicy']);
    hideElement(['contentImpressum', 'content']); 
    setActiveMenuTab('tabPrivacyPolicy');
}


/**
 * This function shows the LegalNotice page
 */
function showLegalNotice(){
    showElement(['contentImpressum']);
    hideElement(['contentPrivacyPolicy', 'content']); 
    setActiveMenuTab('tabimpressum');
}


/**
 * This function sets the redirection to the login page
 */
function setRedirecttionToLoginPage(){
    let HTMLElements =Array.from(document.getElementsByClassName('btnreturn'));
    HTMLElements.forEach(Btn => { Btn.setAttribute('onclick','location.href = "../index.html"');});
}