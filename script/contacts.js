/**
 * This function initialize the contacts page
 * 
 * @param {string} tabID - HTML ID of the active menu tab
 */
async function initContact(tabID){
    await init(tabID);
    renderContactList();
}


/**
 * This function rendes the contaact List
 */
function renderContactList(){
    let content = document.getElementById('contactlist');
    if (isContactListNotEmpty()) {
        content.innerHTML = getContactListHTLM();
        setContactListContactColor();
    } else {
        content.innerHTML = getEmptyContactListHTML();
    }
    
}


/**
 * This function checks if the contactlist is empty
 * 
 * @returns {boolean} - true if contactlist is not empty, false if list is empty
 */
function isContactListNotEmpty(){
    return contactListSorted.length > 0;
}


/**
 * This function generats the HTML for the contact list
 * 
 * @returns {string} - HTML code as string
 */
function getContactListHTLM(){
    let letter = contactListSorted[0]['name'][0];
    let listHTML = getContactListLetterHTML(letter);;
    for (let i = 0; i < contactListSorted.length; i++) {
        let contactData = contactListSorted[i];
        if (contactData['name'][0] == letter) {
            listHTML += getContactListContactHTML(i,contactData);
        } else {
            letter = contactData['name'][0];
            listHTML += getContactListLetterHTML(letter);
            listHTML += getContactListContactHTML(i,contactData);
        }
    }
    return listHTML;
}


/**
 * This function sets the color of all contact elements in the contact list
 */
function setContactListContactColor(){
    contactListSorted.forEach((e,idx)=>{
        document.getElementById("contactinitialsList" + idx).style.backgroundColor = e.color;
    });
}


/**
 * This function shows the contact details in the card
 * 
 * @param {event} event - DOM event
 * @param {*} contactID - index of the contact in the contact list
 */
function showContactDetails(event,contactID){
    hideContactDetails();
    if(event){event.stopPropagation()};
    setContactDetailsData(contactID);
    setTimeout(()=>{document.getElementById('contactCard').classList.add('showcontactCard')},1);
    setContactListActiveStyle(contactID);

    document.getElementById('wrappercontact').style.display = 'block';
    showElement(['wrappercontact'],);
}


/**
 * This function set the data from the selected contact
 * 
 * @param {number} idx - index of the contact in the contact list
 */
function setContactDetailsData(idx){
    let contactData = contactListSorted[idx];
    document.getElementById('contactinitials').innerHTML = contactData['initials'];
    document.getElementById('contactinitials').style.backgroundColor = contactData['color'];
    document.getElementById('contactname').innerHTML = contactData['name'];
    document.getElementById('contactemail').innerHTML = contactData['email'];
    document.getElementById('contactemail').setAttribute('href', 'mailto:' + contactData['email']);
    document.getElementById('contactnumber').innerHTML = contactData['phone'];
    document.getElementById('contactnumber').setAttribute('href' ,'Tel:' + contactData['phone']);
    document.getElementById('btneditContact').setAttribute('onclick',`showOvlyCard(getOvlyCardEditContactHTML(${idx}))`);
    document.getElementById('btndeleteContact').setAttribute('onclick',`deleteContact(${idx})`);
    document.getElementById('btneditContactRes').setAttribute('onclick',`showOvlyCard(getOvlyCardEditContactHTML(${idx}))`);
    document.getElementById('btndeleteContactRes').setAttribute('onclick',`deleteContact(${idx})`);
}


/**
 * This function set the selected contact list element to active style
 * 
 * @param {number} contactID - index of the contact in the contact list
 */
function setContactListActiveStyle(contactID){
    setContactListPassivStyle();
    document.getElementById('contact'+contactID).classList.add('active');
    document.getElementById('contactNameList'+contactID).style.color = '#FFFFFF';
}


/**
 * This function hides the contact details card
 */
function hideContactDetails(){
    setContactListPassivStyle();
    document.getElementById('contactCard').classList.remove('showcontactCard');
}


/**
 * This function set the actve contact list element to passive style
 */
function setContactListPassivStyle(){
    let contactID = document.getElementsByClassName('active Contactlistelement');
    if (contactID.length > 0) {
        contactID = contactID[0]['id'].slice(7);
        document.getElementById('contact'+contactID).classList.remove('active');
        document.getElementById('contactNameList'+contactID).style.color = '#000000';
    }
}


/**
 * This function saves the contact details
 * 
 * @param {number} idx - index of the contact in the contact list
 */
async function saveContact(idx){
    if (document.getElementById('wrapperCardDetails').checkValidity()) {       
        hideOvlyCard();
        contactListSorted[idx]['name'] = document.getElementById('formContactName').value;
        contactListSorted[idx]['phone'] = document.getElementById('formContactPhone').value;
        contactListSorted[idx]['email'] = document.getElementById('formContactEmail').value;
        contactListSorted[idx]['initials'] = getContactInitials(document.getElementById('formContactName').value);
        await setItem('contacts',contactListSorted);
        renderContactList();
        setContactDetailsData(idx);
        setContactListActiveStyle(idx);
    }
}


/**
 * This function deletes the contact from the contact list
 * 
 * @param {number} idx - index of the contact in the contact list
 */
async function deleteContact(idx){
    contactListSorted.splice(idx,1);
    await setItem('contacts',contactListSorted);
    hideOvlyCard();
    renderContactList();
    hideContactDetails();
}


/**
 * This function creats a new contact and shows it on the page
 */
async function createContact(){
    if (document.getElementById('wrapperCardDetails').checkValidity()) {
        let contact =  getContactDetailsFromForm();
        let idx = await addContactToList(contact);
        renderContactList();
        showContactDetails('',idx);
        hideOvlyCard();
        showPopup();
    }
}


/**
 * This function collects the contact data from the form of a new contact
 * 
 * @returns {JSON} - JSON array with the contact details, fields: name, phone,email, initials, color
 */
function getContactDetailsFromForm(){
    return {
        name: document.getElementById('formContactName').value,
        phone: document.getElementById('formContactPhone').value,
        email: document.getElementById('formContactEmail').value,
        initials: getContactInitials(document.getElementById('formContactName').value),
        color: generateRendomColor() // Farbe random zuweisen
    };
}


/**
 * This function adds an contact to the list and sort the list alphabetical
 * 
 * @param {JSON} contact - JSON array with the contact details, fields: name, phone,email, initials, color
 * @returns {number} - index of the contact in the new sorted list
 */
async function addContactToList(contact){
    contactListSorted.push(contact);
    contactListSorted.sort((a,b) => a['name'] < b['name'] ? -1 : a['name'] > b['name'] ? 1 : 0);
    await setItem('contacts',contactListSorted);
    return contactListSorted.findIndex((c) => c['name'] == contact['name'] );
}


// functions for responsive design

function showBtnResContactDetails(event){
    event?stopHideElement(event):'';
    document.getElementById('wrapperBtnResContactDetails').classList.add('showBtnRes');
}

function hideBtnResContactDetails(){
    document.getElementById('wrapperBtnResContactDetails').classList.remove('showBtnRes');
}


// help functions
/**
 * This Function generates a random hex color value
 * 
 * @returns - return a hex color value as a string
 */
function generateRendomColor(){
    let randomColor = Math.floor(Math.random()*16777215).toString(16.).toUpperCase();
    return "#" + randomColor;
}