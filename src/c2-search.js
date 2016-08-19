import React from 'react';
import {yomoApp,yomoView} from 'yomo/v1';
import{cacheSlow,delay,getJSON} from 'yomo/lib/experimental.js';
import {config} from './Util/getConfig.js';

const search=(state={query:''},action)=>{
  switch(action.type) {
    case 'set': return {...state, [action.key]:action.value};
  }
  return state;
};
const setAction=(key,value)=>({type:'set',key,value});

const Search=yomoView(({yomo})=>{
  const {query}=yomo();
  const handleChange=(e)=>
    yomo.dispatch(setAction('query',e.target.value));
  return <Box>
    Enter search terms for github issues: <br/>
    <input type='text' value={query} onChange={handleChange}/>
    &nbsp;
    <hr/>
    <SearchResults query={query}/>
  </Box>;

});

const SearchResults=yomoView(({yomo,query})=>{
  const q=encodeURIComponent(query);
  const qq=`q=${q}&per_page=5`
  const url=`${config.searchAPI}?${qq}`;
  const {items}=(query?slowJsonData(yomo,url):{items:[]});
  return <ul>{ items.map(({id,body})=>
    <li key={id}>{body}</li>) }
  </ul>;
});

const slowJsonData=cacheSlow({
  delay: 600,
  fn: (yomo,url)=> {
    console.log('fetch...');
    return getJSON(url)
  },
  fn1: (yomo,url)=> {
    console.log('fetch...');
    return delay(1000).then(()=>({items:[{id:1,body:url}]}));
  },
});
const Box=({children})=><div style={boxStyle}>{children}</div>;
const boxStyle={
  width:'100%', maxWidth:'40em',
  marginLeft: 'auto', marginRight: 'auto',
  padding: '0.5em',
  border: 'solid #888 1px', borderRadius:'0.5em',
};

yomoApp({reducer:search, View:Search});
