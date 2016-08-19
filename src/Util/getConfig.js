export const config=require('../../config.json');

import {insecureHttps} from './insecure-https.js';
if(config.insecureHttps) { insecureHttps(); }
