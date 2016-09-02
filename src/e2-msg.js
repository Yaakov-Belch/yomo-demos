import {config} from './Util/getConfig.js';
const {ipcUrl}=config;

const srvId='srv/msg';
 
import React from 'react';
import {yomoApp, yomoView, cacheFn, yomoAuditor, yomoRunner}
  from 'yomo/v1';
import {
  yomoBridge,linkPipes, getPipe,pipes, yomoRun,
  combineReducers, reuse
} from 'yomo/lib/experimental.js';

const loginHandler=(yomo)=>{
  const me=yomo().inputs.me;
  return ()=>yomo.dispatch({type:'login',me});
};

const iHandler=(yomo,key,value)=>()=>
  yomo.dispatch({type:'input',key,value});
const ispec=(yomo,key)=>({
  value:yomo().inputs[key]||'',
  onChange: (e)=>yomo.dispatch(
    {type:'input',key,value:e.target.value}
  ),
})
const peerHandler=(yomo)=>{
  const {peer}=yomo().inputs;
  return ()=>yomo.dispatch({type:'addPeer',peer});
}
const peersAction=(peers)=>({type:'peers',peers});

const me=(state='',action)=>{
  switch(action.type) {
    case 'login': return action.me;
  }
  return state;
}

const inputs=(state={},action)=>{
  switch(action.type) {
    case 'input': return {...state,[action.key]:action.value};
    case 'login': return {};
  }
  return state;
}

const defaultPeers={Yaakov:1,Yael:1,Yishay:1};
const peers=(state={},action)=>{
  const old=state;
  switch(action.type) {
    case 'addPeer': state={...state, [action.peer]:1}; break;
    case 'peers':   state={...state, ...action.peers}; break;
    case 'login':   state=defaultPeers; break;
  }
  return reuse(old,state);
};

const msgClient=combineReducers({
  inputs,me,peers,pipes
});

const MsgClient=yomoView(({yomo})=>
  yomo().me?<MsgForm/>:<LoginForm/>
);
const LoginForm=yomoView(({yomo})=><div>
  Open this URL in several browsers. <br/>
  <input type='text' {...ispec(yomo,'me')}/>
  <button onClick={loginHandler(yomo)}>Sign in</button>
</div>);
const MsgForm=yomoView(()=><div>
  <Peers/><NewMessage/><MsgList i={true}/><MsgList i={false}/>
</div>);
const Peers=yomoView(({yomo})=>{
  const {peer}=yomo().inputs;
  return <div>
    <input type='text' {...ispec(yomo,'peer')}/>
    <button onClick={peerHandler(yomo)}>add</button>
    <hr/>
    {Object.keys(yomo().peers).map(p=>
      <button key={p}
        onClick={iHandler(yomo,'peer',p)}
        style={p===peer? {backgroundColor:'#888'}:{}}
      >
        {p}
      </button>
    )}
  </div>;
});
const sendMsg=(yomo)=>{
  const {me}=yomo();
  const {peer,msg}=yomo().inputs;
  return ()=>{
    yomo.dispatch({type:'pipe',id:`${me}-${peer}`,value:msg});
    yomo.dispatch({type:'input',key:'msg',value:''});
  };
};
const NewMessage=yomoView(({yomo})=><div>
  <input type='text' {...ispec(yomo,'msg')}/>
  <button onClick={sendMsg(yomo)}>
    Send from {yomo().me} to {yomo().inputs.peer}.
  </button>
</div>);
const MsgList=yomoView(({yomo,i})=>{
  const me=yomo().me;
  const peerList=Object.keys(yomo().peers);
  return <div>
    <hr/>
    {i? 'incoming':'outgoing'} messages:
    <hr/>
    {peerList.map(p=><PeerMsgs key={p} peer={p} i={i}/>)}
  </div>
});
const PeerMsgs=yomoView(({yomo,i,peer})=>{
  const me=yomo().me;
  const pipeId=i? `${peer}-${me}`:`${me}-${peer}`;
  const {bottom,data}=getPipe(yomo,pipeId);
  const accHandler=(key)=>()=>yomo.dispatch(
    {type:'pipe',acc:key+1,id:pipeId}
  );
  if(data.length===0) { return null; }
  return <div>
    {data.map((msg,j)=><div key={bottom+j}>
      {i && <button onClick={accHandler(bottom+j)}>x</button>}
      <b>{peer}:</b>{msg}<br/>
    </div>)}
    <hr/>
  </div>
});

const peerId='srv/msg';
const bridge=yomoBridge([{linkPipes}],{ipcUrl});

const rdMe=cacheFn(yomo=>yomo().me);
const rdPeers=cacheFn(yomo=>yomo().peers);
const setPeers=yomoRunner((yomo)=>
  bridge(yomo,
    {peerId,fname:'setPeers'},
    rdMe(yomo),rdPeers(yomo)
  )
);
const getPeers=yomoAuditor(yomo=>{
  const p=bridge(yomo,{peerId,fname:'getPeers'},rdMe(yomo));
  const q=rdPeers(yomo);
  const r={}; let ok;
  for(let k in p) { q[k] || (r[k]=ok=1); }
  return ok && {type:'peers',peers:r};
});

const xMsgs=yomoRunner(yomo=>{
  const me=rdMe(yomo);
  const p =rdPeers(yomo);
  for(let peer in p) {
    xm1(yomo,me,peer);
    if(peer!==me) {xm1(yomo,peer,me);}
  };
});
const xm1=(yomo,a,b)=>{
  const pipeId=`${a}-${b}`;
  bridge(yomo,{peerId,fname:'linkPipes',v0:0},
    'pipe',pipeId,'pipe',pipeId
  );
};

const yomo=yomoApp({reducer:msgClient, View:MsgClient});
yomoRun(yomo,false,yomoApp);
yomoRun(yomo,false,getPeers);
yomoRun(yomo,false,xMsgs);
