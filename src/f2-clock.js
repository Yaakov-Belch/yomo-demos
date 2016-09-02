import React from 'react';
import {yomoView, yomoApp, yomoClock} from 'yomo/v1';

let counter=0; const colors=['black','red','green','blue'];
const style=()=>
  ({border:'5px solid black', borderRadius:8 , padding:5});

const clock=(state=1000,action)=>action.dt||state||1000;
const Clock=yomoView(({yomo})=>{
  const bProps=(dt)=>({
    onClick:()=>yomo.dispatch({type:'setDt',dt}),
    style: (dt===yomo.state())?{backgroundColor:'#8888'}:{}
  });
  const delay=yomo.state();

  const timeInt=yomoClock(yomo,0,delay)*delay;

  const timeStr= new Date(timeInt).toLocaleTimeString();
  console.log('render:', timeStr);
  const s=1000; const min=60*s;
  return <div>
     <button {...bProps(1*s)}>1s</button>
     <button {...bProps(2*s)}>2s</button>
     <button {...bProps(5*s)}>5s</button>
     <button {...bProps(10*s)}>10s</button>
     <button {...bProps(15*s)}>15s</button>
     <button {...bProps(1*min)}>1min</button>
     <br/>
     <br/>
     <span style={style()}>{timeStr}</span>
  </div>
  });

yomoApp({reducer:clock,View:Clock});

