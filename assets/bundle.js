/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
//import $ from 'jquery'
//import './jquery.init.js';

// require jQuery normally
const $ = require('jquery');
// create global $ and jQuery variables
global.$ = global.jQuery = $;

//import "datatables.net-dt/twbs/bootstrap/scss/bootstrap.scss";

import "/vendor/twbs/bootstrap/scss/bootstrap.scss";

//import "/vendor/tinymce/tinymce/tinymce.js";

import '@fortawesome/fontawesome-free/css/all.css';

//import 'gijgo/css/gijgo.min.css';
//import 'gijgo/js/gijgo.js';


//import 'gijgo/js/messages/messages.ru-ru.min.js';

import './styles/styles.scss';
import './styles/fonts.css';

import './js/jquery.cookie.js';
import './js/md5.min.js';
//import './js/scripts.js';
