import { MDCDrawer } from '@material/drawer/index';
import { MDCTopAppBar } from '@material/top-app-bar/index';
import './searchGroups';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/serviceWorker.js'));
}

const drawer = new MDCDrawer(document.querySelector('.mdc-drawer'));
const topAppBar = new MDCTopAppBar(document.querySelector('.mdc-top-app-bar'));

topAppBar.listen('MDCTopAppBar:nav', () => {
    drawer.open = !drawer.open;
});

// document.querySelector('#search-group').addEventListener('click', function () {
//     drawer.open = false;
// });