
import {yomoApp, cacheFn, yomoClock} from 'yomo/v1';
import {delay,timeNow,yomoRun} from 'yomo/lib/experimental.js';
delay(3500).then(()=>process.exit(0));

const app=(state={},action)=>state;

const t000=timeNow();
const vc0=cacheFn((yomo,t0,step,msg)=>
  console.log(msg,yomoClock(yomo,t0,step),timeNow()-t000)
);
const vc=(t0,step,msg)=>vc0.curry(t0,step,msg);

const yomo=yomoApp({reducer:app});
yomoRun(yomo,false,vc(timeNow()+1050,0,'--------'));
yomoRun(yomo,false,vc(timeNow()+1000,300,'...'));
 
