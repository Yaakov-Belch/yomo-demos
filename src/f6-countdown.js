import React from 'react';
import {yomoView, yomoApp, cacheFn, yomoClock}
  from 'yomo/v1';
import {timeNow,combineReducers,reuse,dispatchAfter}
  from 'yomo/lib/experimental.js';

// state: {counter, timer}
const countDown=5; const interval=1000;

const counter=(state=0,action)=>{
  switch(action.type) {
    case 'reset': return action.value;
    case 'count': case 'timer': return state+action.change;
  }
  return state;
};

const timer=(state=false,action)=>{
  switch(action.type) {
    case 'timer': case 'reset': return false;
    case 'setTimer': return action.time;
  }
  return state;
};
const counterApp=combineReducers({counter,timer});

const clickTimer=(yomo,delay)=>({ onClick: ()=>
  yomo.dispatch({type:'setTimer',time:delay&&timeNow()+delay})
});
const clickCounter=(yomo,change)=>({ onClick: ()=>
  yomo.dispatch({type:'count', change})
});
const clickReset=(yomo,value=0)=>({ onClick: ()=>
  yomo.dispatch({type:'reset',value})
});

const CounterApp=yomoView(()=><div>
  <CounterView/>
  <SimpleButtons/>
  <TimedButton/>
</div>);

const CounterView=yomoView(({yomo})=>
  <div style={{fontWeight:'bold',fontSize:'x-large'}}>
    {yomo.state().counter}
  </div>
);

const SimpleButtons=yomoView(({yomo})=><div>
  <button {...clickReset(yomo,0)}>Reset: 0</button>
  <button {...clickCounter(yomo,1)}>increment</button>
  <button {...clickCounter(yomo,10)}>add 10</button>
  <button {...clickCounter(yomo,-1)}>decrement</button>
</div>);

const getTimer=cacheFn((yomo)=>yomo.state().timer);

const TimedButton=yomoView(({yomo})=> {
  const timer=getTimer(yomo);
  timer && dispatchAfter(yomo,timer,{type:'timer',change:1});
  if(timer) {
    return <button {...clickTimer(yomo,false)}>
      Reset timer ({1-yomoClock(yomo,timer,interval)})
    </button>
  } else {
    return <button {...clickTimer(yomo,countDown*interval)}>
      Start timer ({countDown})
    </button>
  }
});

yomoApp({reducer:counterApp, View:CounterApp});
