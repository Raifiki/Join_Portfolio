// constants
const STORAGE_TOKEN = 'EH5N6IL0LSYQ4GHFSIBEVC7HDAT7OZ5RUXQSYQ9H';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
const URL_PARAMS = new URLSearchParams(window.location.search);
const USER = URL_PARAMS.get('user');

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