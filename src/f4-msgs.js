import React from 'react';
import {yomoView, yomoApp, yomoClock}
  from 'yomo/v1';
import {timeNow,combineReducers,reuse,dispatchAfter}
  from 'yomo/lib/experimental.js';

const sampleMsgs=['Hello world.', 'Hey!', 'How are you?'];

const delay=5000;
const msgStyle={border:'1px solid black'};
let id=1;

// state: {msgs: [{id,txt,rmTime}...] ... }

const addMsg=(yomo,txt)=>yomo.dispatch({
  type:'newMsg',id:id++,txt, rmTime:timeNow()+delay
});

const msg=(state,action)=>{
  if(state.id===action.id) { switch(action.type) {
    case 'rmMsg': return null;
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
    {yomo.state().msgs.map((m)=>
      <ShowMsg {...{...m,key:m.id}}/>)
    }
  </div>
);

const AddMsg=yomoView(({yomo,txt})=>
  <button onClick={()=>addMsg(yomo,txt)}> {txt} </button>
);

const ShowMsg=yomoView(({yomo,id,txt,rmTime})=>{
  dispatchAfter(yomo,rmTime,{type:'rmMsg',id});
  return <div key={id} style={msgStyle}>{txt}</div>
});

yomoApp({reducer:msgList,View:MsgList});
 
