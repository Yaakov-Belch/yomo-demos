import React from 'react';
import { yomoApp, yomoView } from 'yomo/v1';

const counter=(state=0, action) => {
  switch(action.type) {
    case 'increment': return state+1;
    case 'decrement': return state-1;
  }
  return state;
};

const incrementAction=()=>({type:'increment'});
const decrementAction=()=>({type:'decrement'});

const Counter=yomoView(({yomo})=>{
  const count=yomo.state();
  const inc=()=>yomo.dispatch(incrementAction());
  const dec=()=>yomo.dispatch(decrementAction());
  return <div>
    <div style={{fontWeight:'bold',fontSize:'x-large'}}>
      {count}
    </div>
    <div>
      <button onClick={dec}> &#8211; </button>
      <button onClick={inc}> + </button>
    </div>
  </div>;
});

yomoApp({reducer:counter, View: Counter});
