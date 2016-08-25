#!/usr/bin/env node
"use strict";

const fs = require('fs-extra');
const path=require('path');

const src = 'src';
const dest= 'www/example';
const index='www/index.html';
const icon= 'www/favicon.ico';

console.log('remove: www/');
fs.removeSync('www');

fs.mkdirsSync('www/js');

console.log(icon);
fs.outputFileSync(icon, fs.readFileSync('favicon.ico'));

const examples=fs.readdirSync(src)
  .filter(f=>/\.js$/.test(f))
  .map(f=>f.replace(/\.js$/, ''));

const html=(body)=>`
<!DOCTYPE html>
<html>
  <header>
    <meta charset="utf-8"/>
    <meta name="viewport"
      content="width=device-width, initial-scale=1"
    />
  </header>
  <body>
${body.replace(/^/g,'    ')}
  </body>
</html>
`;

const iBody=(examples)=>`
<ul>
${examples.map(f=>
`  <li><a href='/example/${f}.html'>${f}</a></li>`
).join("\n")}
</ul>
`;

console.log(index);
fs.outputFileSync(index,iBody(examples));

const xBody=(file)=>`
<div id="root"></div>
<script type="text/javascript" src="/bundle.js"></script>
<script type="text/javascript" src="/js/${file}.js"></script>
`;

fs.removeSync(dest);
for(const f of examples) {
  const ff=path.join(dest,`${f}.html`);
  console.log(ff);
  fs.outputFileSync(ff,html(xBody(f)));
}
