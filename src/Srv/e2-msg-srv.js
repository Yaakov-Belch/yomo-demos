import {config} from '../Util/getConfig.js';
const {ipcUrl}=config;

import {yomoApp,cacheFn,yomoRunner} from 'yomo/v1';
import {
  yomoBridge,linkPipes, getPipe,pipes, yomoRun,
  combineReducers, reuse
} from 'yomo/lib/experimental.js';

const peers=(state={},action)=>{
  switch(action.type){
    case 'peers':
      const {me,peers}=action;
      state= {...state,
        [me]:{...(state[me]||{}),...peers}
      };
      return state;
  }
  return state;
};

const setPeers=cacheFn((yomo,me,peers)=>{
  yomo.dispatchSoon({type:'peers',me,peers});
  return true;
});
const getPeers=cacheFn((yomo,me)=>yomo.state().peers[me]||{});

const myId='srv/msg';
const bridge=yomoBridge(
  [{linkPipes,setPeers,getPeers}],
  {ipcUrl,myId}
);
const runBridge=bridge.curry({});

const yomo=yomoApp({reducer: combineReducers({peers,pipes})});
yomoRun(yomo,false,runBridge);

