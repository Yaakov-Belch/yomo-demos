import React from 'react';
import {yomoView, yomoApp, yomoClock,dispatchAfter}
  from 'yomo/v1';
import {timeNow,combineReducers,reuse}
  from 'yomo/lib/experimental.js';

const sampleMsgs=['Hello world.', 'Hey!', 'How are you?'];

const delay=5000; const jumps=100; const color='#cccccc';
const msgStyle={cursor:'pointer', border:'1px solid black'};
const slider=(yomo,rmTime,delay)=>{
  const pos=100+yomoClock(yomo,rmTime,delay/jumps)*(100/jumps);
  return {
    ...msgStyle,
    backgroundImage: `linear-gradient(90deg,
      ${color}, ${color} ${pos}%, white ${pos}%, white
    )`,
  }
};

let id=1;

// state: {msgs: [{id,txt,rmTime}...] ... }

const addMsg=(yomo,txt)=>yomo.dispatch({
  type:'newMsg',id:id++,txt, rmTime:timeNow()+delay
});
const refreshMsg=(yomo,id)=>yomo.dispatch({
  type:'refreshMsg',id,rmTime:timeNow()+delay
});

const msg=(state,action)=>{
  if(state.id===action.id) { switch(action.type) {
    case 'rmMsg': return null;
    case 'refreshMsg': return {...state,rmTime:action.rmTime};
  }}
  return state;
};
const newMsgs=(action)=>{
  const {type,id,txt,rmTime}=action;
  return (type==='newMsg')? [{id,txt,rmTime}]: []
}
const msgs=(state=[],action)=>
  reuse(state,[
    ...state.map(m=>msg(m,action)).filter(m=>m),
    ...newMsgs(action)
  ]);
const msgList=combineReducers({msgs});

const MsgList=yomoView(({yomo})=>
  <div>
    {sampleMsgs.map((txt,key)=><AddMsg key={key} txt={txt}/>)}
    {yomo().msgs.map((m)=><ShowMsg {...{...m,key:m.id}}/>)}
  </div>
);

const AddMsg=yomoView(({yomo,txt})=>
  <button onClick={()=>addMsg(yomo,txt)}> {txt} </button>
);

const ShowMsg=yomoView(({yomo,id,txt,rmTime})=>{
  dispatchAfter(yomo,rmTime,{type:'rmMsg',id});
  return <div
    key={id}
    style={slider(yomo,rmTime,delay)}
    onClick={()=>refreshMsg(yomo,id)}
  >
    {txt}
  </div>
});

yomoApp({reducer:msgList,View:MsgList});
 
