import { MDCDrawer } from '@material/drawer/index';
import { MDCTopAppBar } from '@material/top-app-bar/index';
import { MDCTextField } from '@material/textfield';
import './loginUser';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/serviceWorker.js'));
}

const drawer = new MDCDrawer(document.querySelector('.mdc-drawer'));
const topAppBar = new MDCTopAppBar(document.querySelector('.mdc-top-app-bar'));
const textField = new MDCTextField(document.querySelector('.mdc-text-field'));

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