import { html, render } from 'lit-html';
import { post } from './post';
import { MDCDialog } from '@material/dialog/index';
import { MDCTextField } from '@material/textfield/index';

const groupListNode = document.querySelector('#group-list');
const userInfoNode = document.querySelector('#user-info');

const dialogNode = document.querySelector('.mdc-dialog');
const dialogConfirmButton = document.querySelector('#confirm-button');
const mdcDialog = new MDCDialog(dialogNode);
const dialogTitleNode = dialogNode.querySelector('#my-dialog-title');
const dialogContentNode = dialogNode.querySelector('#my-dialog-content');

const groupListItem = name => html`
    <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">group</i>
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

async function displayUserGroups() {
    const groups = await fetch(`https://testp.statescu.net/it-fest/select_group.php?user_id=${userId}`)
        .then(res => res.json())
        .then(res => res.data || []);

    if (groups.length) {
        render(html`${groups.map(group => groupListItem(group.name))}`, groupListNode);
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

displayUserInfo();
displayUserGroups();