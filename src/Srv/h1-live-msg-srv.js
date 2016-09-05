import {config} from '../Util/getConfig.js';
const {ipcUrl}=config;

const peers=['Alice','Bob','Carol'];
const myId ='Srv1';

import {yomoApp,cacheFn} from 'yomo/v1';
import {
  yomoBridge,linkPipes, pipes, yomoRun, connCheck,
  combineReducers,
} from 'yomo/lib/experimental.js';

const bridge=yomoBridge(
  [{linkPipes,connCheck}],
  {ipcUrl,myId}
);
const runBridge=bridge.curry({});

const yomo=yomoApp({reducer: combineReducers({pipes})});
yomoRun(yomo,false,runBridge);
