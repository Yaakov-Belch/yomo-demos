import React from 'react';
import { yomoApp, yomoView } from 'yomo/v1';

const counter=(state=0,action)=>{
  switch(action.type) {
    case 'increment': return state+1;
    case 'decrement': return state-1;
    case 'set': return +action.value;
  }
  return state;
};

const incrementAction=()=>({type:'increment'});
const decrementAction=()=>({type:'decrement'});
const setAction=(value)=>({type:'set', value});

const Counter=yomoView(({yomo})=>{
  const count=yomo();
  const inc=()=>yomo.dispatch(incrementAction());
  const dec=()=>yomo.dispatch(decrementAction());
  const set=(value)=>()=>yomo.dispatch(setAction(value));
  const handleChange=(e)=>yomo.dispatch(setAction(e.target.value));
  return <div>
    <div style={{fontWeight:'bold',fontSize:'x-large'}}>{count}</div>
    <div>
      <button onClick={dec}> &#8211; </button>
      <button onClick={inc}> + </button>
    </div>
    <div>
      {[...Array(10).keys()].map(value=>
        <button key={value}
          onClick={set(value)}
          style={count==value? {backgroundColor:'#888'}:{}}
        >
          {value}
        </button>
      )}
      &nbsp; {count>9 && 'Bigger than nine.'}
    </div>
    <div>
      <input type='text' value={count} onChange={handleChange}/>
    </div>
  </div>;
});
yomoApp({reducer:counter, View:Counter});
