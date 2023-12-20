// constants
const STORAGE_TOKEN = 'EH5N6IL0LSYQ4GHFSIBEVC7HDAT7OZ5RUXQSYQ9H';
//const STORAGE_TOKEN = 'P7OMDX48VPM4JUZTV5XU4B2F8396RU7GAE847Q5K';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
const URL_PARAMS = new URLSearchParams(window.location.search);
const USER = URL_PARAMS.get('user');
const REDIR = URL_PARAMS.get('redir');
const DIR = URL_PARAMS.get('dir');

let activeTab;
let contactListSorted = [];
let tasks = [];
let categories = [];

/**
 * This function initialize all common parts of the webside
 * 
 * @param {string} tabID - HTML ID of the active tab as string
 */
async function init(tabID) {
    await includeHTMLasync();
    contactListSorted = await getItem('contacts');
    tasks = await getItem('tasks');
    categories =  await getItem('categories');
    setActiveMenuTab(tabID);
    activeTab = tabID;
    await setHeaderUserData();
    setTabLink(USER);
}


// common used funcitons
/**
 * This function hide HTML elements
 * 
 * @param {array} ID - Array with HTMLIDs to hide
 */
function hideElement(ID) {
    ID.forEach(id => document.getElementById(id).classList.add('display-none'));
}


/**
 * This function show HTML elements
 * 
 * @param {array} ID - Array with HTMLIDs to show
 * @param {*} event - DOM event
 */
function showElement(ID, event) {
    if(event){event.stopPropagation()};
    ID.forEach(id => document.getElementById(id).classList.remove('display-none'));
}


/**
 * This function shows the overlay card
 * 
 * @param {string} cardHTML - HTML code for overlay card as string
 */
function showOvlyCard(cardHTML) {
    document.getElementById('ovlyCard').classList.add('showovlyCard');
    document.getElementById('ovly').classList.add('showovly');
    document.getElementById('ovlyCard').innerHTML = cardHTML;
}


/**
 * This function hides the overlay card
 */
function hideOvlyCard() {
    if (document.getElementById('ovlyCard')) {
        document.getElementById('ovlyCard').classList.remove('showovlyCard');
        document.getElementById('ovly').classList.remove('showovly');
    }
}


/**
 * This function stops to hide an element
 * 
 * @param {event} event - DOM event
 */
function stopHideElement(event) {
    event.stopPropagation();
}


/**
 * This function seperates the initials of the user name. User name has to be in this form: 'Name Lastname'
 * 
 * @param {string} name - user name in this form 'Name Lastname'
 * @returns {string} - Initials of the user
 */
function getContactInitials(name){
    let separatedName = name.split(" ");
    return separatedName[0][0] + separatedName[1][0];
}


/**
 * This function shows the popup element
 */
function showPopup(){
    document.getElementById('ovlyPopup').classList.add("addAnimtaion");
    setTimeout(function(){document.getElementById('ovlyPopup').classList.remove("addAnimtaion")},2000);
}


// menu related functions
/**
 * This function set the active style for the active navbar tab
 * 
 * @param {string} tabID - HTML-ID for the navbar tab which shall be active
 */
function setActiveMenuTab(tabID) {
    let tabIDs = ['tabsummary', 'tabboard', 'tabaddtask', 'tabcontacts', 'tabPrivacyPolicy','tabimpressum'];
    for (let i = 0; i < tabIDs.length; i++) document.getElementById(tabIDs[i]).classList.remove('active');
    if (tabID) document.getElementById(tabID).classList.add('active');
}


/**
 * This function sets the hyperlink for the navbar tabs with dependencies on the user which is signed in
 * 
 * @param {number} userID - ID of the active user
 */
function setTabLink(userID){
    if (userID) {
        document.getElementById('tabsummary').setAttribute('href',`../pages/summary.html?user=${userID}`);
        document.getElementById('tabboard').setAttribute('href',`../pages/board.html?user=${userID}`);
        document.getElementById('tabaddtask').setAttribute('href',`../pages/addTask.html?user=${userID}`);
        document.getElementById('tabcontacts').setAttribute('href',`../pages/contacts.html?user=${userID}`);
    }
}


// header related functions
/**
 * This function sets the users header data 
 */
async function setHeaderUserData(){
    let userID = USER;
    if (userID) {
        let users = await getItem('users');
        let user = users.filter(u=>u['id']==userID);
        if (user.length != 0 ){
            let initials = getContactInitials(user[0]['name']);
            document.getElementById('headerInitials').innerHTML = initials;
        }else{
            console.warn('userID not found');
        }
    } else {
        document.getElementById('headerInitials').innerHTML = 'Guest';
    }
}


// server relatede functions
/**
 * This function saves data on the backend
 * 
 * @param {string} key - key to save the data on the backend
 * @param {json} value - data which has to be saved
 * @returns 
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload)})
    .then(res => res.json());
}


/**
 * This function load data from the backend
 * 
 * @param {string} key - key which data shall be loaded
 * @returns {json} - data which are stored at the beckend as jason 
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    let response = await fetch(url).then(res => res.json());
    response = response['data']['value'].replace(/\'/g,'"'); // answer from server in case of JSON array not correct
    return JSON.parse(response);
}
