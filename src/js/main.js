import { MDCDrawer } from '@material/drawer/index';
import { MDCTopAppBar } from '@material/top-app-bar/index';
import { MDCTextField } from '@material/textfield';
import { MDCRipple } from '@material/ripple';
import { MDCTabBar } from '@material/tab-bar';
import './searchGroups';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/serviceWorker.js'));
}

const drawer = new MDCDrawer(document.querySelector('.mdc-drawer'));
const topAppBar = new MDCTopAppBar(document.querySelector('.mdc-top-app-bar'));
const textField = new MDCTextField(document.querySelector('.mdc-text-field'));
const tabBar = new MDCTabBar(document.querySelector('.mdc-tab-bar'));

document.querySelectorAll('.mdc-button, .mdc-icon-button').forEach(function (button) {
    const ripple = new MDCRipple(button);
    ripple.unbounded = true;
});

topAppBar.listen('MDCTopAppBar:nav', () => {
    drawer.open = !drawer.open;
});

// Search bar
const searchBar = document.querySelector('.search-bar');
const searchButton = document.querySelector('#search-button');


searchButton.addEventListener('click', function () {
    searchBar.classList.add('active');
});

document.querySelector('.mdc-drawer-app-content').addEventListener('click', function () {
    searchBar.classList.remove('active');
});

// Classes select
const listItems = document.querySelectorAll('.mdc-list-item');
listItems.forEach((item) => item.addEventListener('click', function () {
    listItems.forEach((i) => i.classList.remove('active'));
    item.classList.add('active');
}))

// document.querySelector('#search-group').addEventListener('click', function () {
//     drawer.open = false;
// });