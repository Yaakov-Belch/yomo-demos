import React from 'react';
import {yomoApp,yomoView} from 'yomo/v1';
import{cacheSlow,getText,delay} from 'yomo/lib/experimental.js';
import {config} from './Util/getConfig.js';

const Spinner=()=><i className='fa fa-spinner fa-spin'/>;
const Delayed=()=><i className='fa fa-spinner'/>;

const search=(state={poll:false},action)=>{
  switch(action.type) {
    case 'set': return {...state, [action.key]:action.value};
  }
  return state;
};
const setAction=(key,value)=>({type:'set',key,value});

const Search=yomoView(({yomo})=>{
  const {poll}=yomo();
  const click=(v)=>()=>yomo.dispatch(setAction('poll',v));
  const Button=({v,txt})=>
    <button
      style={v===poll?{backgroundColor:'#888'}:{}}
      onClick={click(v)}
    >{txt}</button>;
  return <Box>
    <Button v={true} txt='start'/> &nbsp;
    <Button v={false} txt='stop'/>
    <hr/>
    <SearchResults poll={poll}/>
  </Box>;

});

const SearchResults=yomoView(({yomo,poll})=>{
  const url=config.zenAPI;
  const res=(poll?slowTextData(yomo,url):'');
  return <span>{res}</span>;
}, ({exception:{msg}})=>msg==='delay'? Delayed():Spinner()
);

const slowTextData=cacheSlow({
  delay:   1000,
  refresh: 4000,
  fn: (yomo,url)=> {
    console.log('fetch...');
    return getText(url)
  },
  fn0: (yomo,url)=> {
    console.log('fetch...');
    return delay(2000).then(()=>1*new Date());
  },
});
const Box=({children}) => <div style={boxStyle}>{children}</div>;
const boxStyle={
  width:'100%', maxWidth:'40em',
  marginLeft: 'auto', marginRight: 'auto',
  padding: '0.5em',
  border: 'solid #888 1px', borderRadius:'0.5em',
};

yomoApp({reducer:search, View:Search});
