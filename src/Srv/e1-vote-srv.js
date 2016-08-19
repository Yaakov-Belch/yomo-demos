import {config} from '../Util/getConfig.js';
const {ipcUrl}=config;

import {yomoApp,cacheFn} from 'yomo/v1';
import {yomoBridge,onOffAction,reuse}
  from 'yomo/lib/experimental.js';

const submit=cacheFn((yomo,votes,id)=>
  onOffAction(yomo,{votes})
);
const results=cacheFn((yomo)=>yomo());

const votes=(state={},action)=>{
  const {votes,onOff}=action;
  if(!onOff) { return state; }
  const old=state;
  state={...state};
  Object.keys(votes).forEach(k=>{
    const v=(state[k]||0) + onOff*votes[k];
    if(v===0) { delete state[k]; } else { state[k]=v; }
  });
  // console.log('-------',old,onOff,votes,state);
  return reuse(old,state);
}

const bridge=yomoBridge(
  [{submit,results},{}],
  {ipcUrl,myId:'srv/vote'}
);
const runBridge=bridge.curry({});
yomoApp({
  reducer: (votes),
  run: [runBridge],
});
