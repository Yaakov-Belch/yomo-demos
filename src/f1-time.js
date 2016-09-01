
import {yomoApp, yomoRunner, yomoClock} from 'yomo/v1';
import {delay,timeNow} from 'yomo/lib/experimental.js';
delay(3500).then(()=>process.exit(0));

const app=(state={},action)=>state;

const t000=timeNow();
const vc0=yomoRunner((yomo,t0,step,msg)=>
  console.log(msg,yomoClock(yomo,t0,step),timeNow()-t000)
);
const vc=(t0,step,msg)=>vc0.curry(t0,step,msg);

yomoApp({reducer:app, run:[
  vc(timeNow()+1050,0,'--------'),
  vc(timeNow()+1000,300,'...')
]});
 
