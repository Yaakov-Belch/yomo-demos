import {config} from './Util/getConfig.js';
const {ipcUrl}=config;

import React from 'react';
import {yomoApp, yomoView, yomoRunner} from 'yomo/v1';
import {combineReducers,yomoBridge}
  from 'yomo/lib/experimental.js';

import shortid from 'shortid';
const id=shortid.generate();

const setAction=(value)=>({type:'set', value});
const voteAction=(key,value)=>({type: 'vote',key,value});

const input=(state='',action)=>{
  switch(action.type) {
    case 'set': return action.value;
    case 'vote': return '';
  }
  return state;
};
const votes=(state={}, action)=>{
  switch(action.type) {
    case 'vote':  return chgObj(state,action.key,action.value);
  }
  return state;
};
const chgObj=(obj,key,value)=> {
  if(obj[key]===value) { return obj; }
  obj={...obj};
  if(value==='!') { value=obj[key]? undefined:1; }
  if(value===undefined) { delete obj[key]; }
  else { obj[key]=value; }
  return obj;
};
const voting=combineReducers({input, votes});

const bridge=yomoBridge([],{ipcUrl,myId:id});
const submit =bridge.curry({peerId:'srv/vote',fname:'submit'});
const results=bridge.curry({peerId:'srv/vote',fname:'results'});

const sendIt=yomoRunner((yomo)=>submit(yomo,yomo().votes,id));

const Voting=yomoView(()=><div>
  Open this URL in several browsers. <br/>
  <Input/><Results/>
</div>);
const Input=yomoView(({yomo})=>{
  const {input}=yomo();
  const handler=(e)=>yomo.dispatch(setAction(e.target.value));
  const add=(value)=>()=>yomo.dispatch(voteAction(input,value));
  return <div>
    <input type='text' value={input} onChange={handler}/>
    <button onClick={add(1)}> vote </button>
  </div>;
});
const Results=yomoView(({yomo})=>{
  const {votes}=yomo();
  const allVotes=results(yomo);
  const castVote=(key)=>()=>yomo.dispatch(voteAction(key,'!'));
  return <div>
    {Object.keys(allVotes).map(key=>
      <div key={key}>
        {allVotes[key]}: {key}
        <button onClick={castVote(key)}>
          {votes[key]? '-':'+'}
        </button>
      </div>
    )}
  </div>;
});

yomoApp({
  reducer:voting, View: Voting,
  run:[sendIt],
});
