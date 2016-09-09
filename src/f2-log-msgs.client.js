import React from 'react';
import {yomoView, yomoApp, yomoClock}
  from 'yomo/v1';
import {
  timeNow,combineReducers,reuse,persistRedux,dispatchAfter
} from 'yomo/lib/experimental.js';

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

// state: [{id,txt,rmTime}...]

const addMsg=(yomo)=>yomo.dispatch({
  type:'newMsg',id:id++,txt:randomMsg(), rmTime:timeNow()+delay
});
const restartTimeout=(yomo,id)=>yomo.dispatch({
  type:'restartTimeout',id,rmTime:timeNow()+delay
});

const msg=(state,action)=>{
  if(state.id===action.id) { switch(action.type) {
    case 'rmMsg': return null;
    case 'restartTimeout': return {...state,rmTime:action.rmTime};
  }}
  return state;
};
const newMsgs=(action)=>{
  const {type,id,txt,rmTime}=action;
  return (type==='newMsg')? [{id,txt,rmTime}]: []
}
const msgs=(state=[],action)=> {
  state=reuse(state,[
    ...state.map(m=>msg(m,action)).filter(m=>m),
    ...newMsgs(action)
  ]);
  console.log(action);
  console.log(JSON.stringify(state,null,2));
  return state;
}

const MsgList=yomoView(({yomo})=>
  <div>
    {console.log(yomo.state())&&null||null}
    <AddMsg/> Add messages, click on them and hit [reload].
    {yomo.state().map((m)=><ShowMsg key={m.id} {...m}/>)}
  </div>
);

const AddMsg=yomoView(({yomo})=>
  <button onClick={()=>addMsg(yomo)}> Add a message </button>
);

const ShowMsg=yomoView(({yomo,id,txt,rmTime})=>{
  dispatchAfter(yomo,rmTime,{type:'rmMsg',id});
  const handler=()=>restartTimeout(yomo,id);
  return (
    <Msg onClick={handler} interval={delay} end={rmTime}>{txt}</Msg>
  );
});

const Msg=yomoView(({yomo,interval,end,onClick,children})=>
  <div style={slider(yomo,end,interval)} onClick={onClick}>
    {children}
  </div>
);

const yomo=yomoApp({reducer:msgs,View:MsgList});
persistRedux(yomo,'f5-msg',false); 
