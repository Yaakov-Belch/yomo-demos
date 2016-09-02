import React from 'react';
import {yomoApp,yomoView,cacheAsync} from 'yomo/v1';
import {getJSON} from 'yomo/lib/experimental.js';
import {config} from './Util/getConfig.js';

const showRepos=(state={input:''},action)=>{
  switch(action.type) {
    case 'set': return {...state, [action.key]:action.value};
  }
  return state;
};
const setAction=(key,value)=>({type:'set',key,value});

const ShowRepos=yomoView(({yomo})=>{
  const {input,user}=yomo.state();
  const handleChange=(e)=>
    yomo.dispatch(setAction('input',e.target.value));
  const submit=()=>
    yomo.dispatch(setAction('user',input));
  return <Box>
    Enter a github user name here: <br/>
    <input type='text' value={input} onChange={handleChange}/>
    &nbsp;
    <button onClick={submit}>Show the repositories</button>
    <hr/>
    <ReposList user={user}/>
  </Box>;

});

const ReposList=yomoView(({yomo,user})=>{
  const url=`${config.fetchAPI}${user}/repos`;
  const repos=user?getJsonData(yomo,url):[];
  return <ul>{ repos.map(({name,description})=>
    <li key={name}><b>{name}:</b>&nbsp;{description}</li>
  )}</ul>;
});

const getJsonData=cacheAsync((yomo,url)=>getJSON(url));
const Box=({children}) =>
  <div style={boxStyle}>{children}</div>;
const boxStyle={
  width:'100%', maxWidth:'40em',
  marginLeft: 'auto', marginRight: 'auto',
  padding: '0.5em',
  border: 'solid #888 1px', borderRadius:'0.5em',
};

yomoApp({reducer:showRepos, View:ShowRepos});
