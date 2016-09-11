import React from 'react';
import {yomoView, yomoApp, yomoClock}
  from 'yomo/v1';
import {timeNow,combineReducers,reuse,dispatchAfter}
  from 'yomo/lib/experimental.js';

const sampleMsgs=[
"It's nice to be important, but more important to be nice.",
"Never run from your problems."
+" You'll get tired, & they'll end up catching you.",
"The road to success is always under construction",
"When your past calls you, don't answer."
+" It has nothing new to say.",
"Logic will get you from A to B."
+" Your imagination will take you anywhere.",
"Don't worry if people talk behind ur back."
+" It simply means ur are two steps ahead of them already!"
];
const randomMsg=()=>
  sampleMsgs[Math.floor(Math.random()*sampleMsgs.length)];

const delay=5000;
const msgStyle={border:'1px solid black'};
let id=1;

// state: {msgs: [{id,txt,rmTime}...] ... }

const addMsg=(yomo)=>yomo.dispatch({
  type:'newMsg',id:id++,txt:randomMsg(), rmTime:timeNow(yomo)+delay
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
    <AddMsg/>
    {yomo.state().msgs.map((m)=>
      <ShowMsg {...{...m,key:m.id}}/>)
    }
  </div>
);

const AddMsg=yomoView(({yomo,txt})=>
  <button onClick={()=>addMsg(yomo)}>Add a message.</button>
);

const ShowMsg=yomoView(({yomo,id,txt,rmTime})=>{
  dispatchAfter(yomo,rmTime,{type:'rmMsg',id});
  return <div key={id} style={msgStyle}>{txt}</div>
});

yomoApp({reducer:msgList,View:MsgList});
 
