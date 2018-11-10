import { html, render } from 'lit-html';
import { post } from './post';
import { MDCDialog } from '@material/dialog/index';
import { MDCTextField } from '@material/textfield/index';

const groupListNode = document.querySelector('#group-list');
const userInfoNode = document.querySelector('#user-info');

const dialogNode = document.querySelector('.mdc-dialog');
const dialogConfirmButton = document.querySelector('#confirm-button');
const mdcDialog = new MDCDialog(dialogNode);
const dialogTitleNode = dialogNode.querySelector('#mdc-dialog-title');
const dialogContentNode = dialogNode.querySelector('#mdc-dialog-content');

function selectGroup() {
    if (self.lastSelectGroup) {
        self.lastSelectGroup.classList.remove('mdc-list-item--selected');
    }
    this.classList.add('mdc-list-item--selected');
    if (this.dataset.id) {
        self.groupId = this.dataset.id;
        self.lastSelectGroup = this;
        displayClases(self.groupId);
    }
}

const groupListItem = (name, id) => html`
    <a class="mdc-list-item" href="#" data-id="${id}" @click="${selectGroup}">
        <i class=" material-icons
                                                                                                                                                                                                                                                                                                                                mdc-list-item__graphic"
            aria-hidden="true">group</i>
        <span class="mdc-list-item__text">${name}</span>
    </a>
`;

let userId = -1;

const textField = (id, label, isPassword = false) => html`
<div class="mdc-text-field mdc-text-field--outlined">
    <input type="${isPassword ? 'password' : 'text'}" id="${id}" class="mdc-text-field__input">
    <label for="${id}" class="mdc-floating-label">${label}</label>
    <div class="mdc-notched-outline">
        <svg>
            <path class="mdc-notched-outline__path" />
        </svg>
    </div>
    <div class="mdc-notched-outline__idle"></div>
</div>`;

let lastDialogType;

function openSignInDialog() {
    if (lastDialogType !== 'logIn') {
        dialogTitleNode.innerHTML = 'Log In';
        render(html`
            ${textField('email', 'Email')}
            ${textField('password', 'Password', true)}
    ` , dialogContentNode);
        dialogContentNode.querySelectorAll('.mdc-text-field').forEach(textField => new MDCTextField(textField));
        dialogConfirmButton.innerHTML = 'log in';
    }
    lastDialogType = 'logIn';
    mdcDialog.open();
}

function openSignUpDialog() {
    if (lastDialogType !== 'signUp') {
        dialogTitleNode.innerHTML = 'Sign Up';
        render(html`
            ${textField('first-name', 'Firstname')}
            ${textField('last-name', 'Lastname')}
            ${textField('email', 'Email')}
            ${textField('password', 'Password', true)}
            ` , dialogContentNode);
        dialogContentNode.querySelectorAll('.mdc-text-field').forEach(textField => new MDCTextField(textField));
        dialogConfirmButton.innerHTML = 'sign up';
    }
    lastDialogType = 'signUp';
    mdcDialog.open();
}

mdcDialog.listen('MDCDialog:closing', function (event) {
    if (event.detail.action === 'yes') {
        if (lastDialogType === 'logIn') {
            logInUser({
                email: dialogContentNode.querySelector('#email').value,
                password: dialogContentNode.querySelector('#password').value
            });
        } else if (lastDialogType === 'signUp') {
            signUpUser({
                firstName: dialogContentNode.querySelector('#first-name').value,
                lastName: dialogContentNode.querySelector('#last-name').value,
                email: dialogContentNode.querySelector('#email').value,
                password: dialogContentNode.querySelector('#password').value
            });
        }
    } else {
        // action was canceled
    }
});

function displayUserInfo(user) {
    if (userId === -1) {
        render(html`
        <div class="mdc-drawer__title text-centered" style="margin-bottom: .5rem">
            You are not loged in
        </div>
        <div class="mdc-drawer__subtitle text-centered">
            <div class="mdc-button mdc-button--raised" id="login-button" @click=${openSignInDialog}>log in</div>
            <div class="mdc-button mdc-button--raised" id="signup-button" @click=${openSignUpDialog}>sign up</div>
        </div>
        `, userInfoNode);
        return;
    }

    if (!user || !user.email || !user.name) {
        return;
    }

    render(html`
        <p class="mdc-drawer__title">${user.name}</p>
        <p class="mdc-drawer__subtitle">${user.email}</p>
        <p></p>
    `, userInfoNode);
}

const classesListNode = document.querySelectorAll('#classes-list');

async function displayUserGroups() {
    const groups = await fetch(`https://testp.statescu.net/it-fest/select_group.php?user_id=${userId}`)
        .then(res => res.json())
        .then(res => res.data || []);

    if (groups.length) {
        render(html`${groups.map(group => groupListItem(group.name, group.id))}`, groupListNode);
        groupListNode.querySelector('.mdc-list-item').click();
    } else if (userId !== -1) {
        render(html`<p style="padding: 0 1rem 1rem 1rem">You have not joined any gorups yet</p>`, groupListNode);
    } else {
        render(html`<p style="padding: 0 1rem 1rem 1rem">If you log in you can join and create groups</p>`, groupListNode);
    }
}


export function logInUser({ email, password } = { email: '', password: '' }) {
    const loginData = new FormData();
    loginData.append('email', email);
    loginData.append('password', password);

    return post('https://testp.statescu.net/it-fest/login.php', loginData)
        .then(user => {
            if (user.status === 'ERROR') {
                console.error('USER_NOT_FOUND');
                return;
            }

            userId = user.id;
            displayUserGroups();
            displayUserInfo({
                name: `${user.first_name} ${user.last_name}`,
                email: user.email
            });
        })
        .catch(err => console.error(err));
}

export function logOutUser() {
    userId = -1;
    displayUserGroups();
}

export function signUpUser({ firstName, lastName, email, password }) {

}

logInUser({
    email: 'alex@simion.ro',
    password: 'testpass'
});

displayUserInfo();
displayUserGroups();

const coursesListContainerNode = document.querySelector('#courses-list-container');

async function selectClass() {
    if (self.lastSelectClass) {
        self.lastSelectClass.classList.remove('mdc-list-item--selected');
    }
    this.classList.add('mdc-list-item--selected');
    if (this.dataset.id) {
        self.classId = this.dataset.id;
        self.lastSelectClass = this;
        displayClases(self.classId);
    }

    const details = await fetch('https://testp.statescu.net/it-fest/get_classes.php?class_id=' + self.classId).then(data => data.json()).then(data => data.data);

    const template = details => html`
    <div class="leader-only" style="background: rgba(145, 145, 145, 0.1); padding:10px;">
        <h3>Upload a file</h3>
        <input type="file" name="myFile">
    </div>
    <h3>Credits: ${details.credits}</h3>
    <h3>Teacher: ${details.teacher}</h3>
    <h3>Room: ${details.room}</h3>
    <h3>Materials:</h3>
    <ul class="mdc-list demo-list">
        <li class="mdc-list-item mdc-ripple-upgraded"><span class="mdc-list-item__graphic material-icons" aria-hidden="true">get_app</span>Differential
            equations.pdf</li>
        <li class="mdc-list-item mdc-ripple-upgraded"><span class="mdc-list-item__graphic material-icons" aria-hidden="true">get_app</span>Course1.ppt</li>
    </ul>`;
    render(template(details[0]), coursesListContainerNode);
    // coursesListContainerNode.innerHTML = JSON.stringify(details);
}

const classListContainer = document.querySelector('#class-list-container');

async function displayClases(groupId) {
    const classes = await fetch('https://testp.statescu.net/it-fest/get_classes.php?group_id=' + groupId).then(data => data.json()).then(data => data.data);

    if (!classes) {
        return;
    }
    console.log(classes);
    // console.log(classesListNode);
    render(html`
    <ul class="mdc-list mdc-list--two-line classes-list" aria-orientation="vertical">
        <h1 class="titlu-class">Classes</h1>
        ${classes.map(cls => html`
        <li class="mdc-list-item" data-id="${cls.id}" @click="${selectClass}">
            <span class="mdc-list-item__text">
                <span class="mdc-list-item__primary-text">${cls.name}</span>
                <span class="mdc-list-item__secondary-text">Credits: ${cls.credits}</span>
            </span>
        </li>`)}
    </ul>`, classListContainer);

    document.querySelector('.classes-list > .mdc-list-item').click();
}
