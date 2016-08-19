import React from 'react';
import {yomoApp, yomoView} from 'yomo/v1';

import TextArea from 'react-textarea-autosize';
import marked from 'marked';

const mdEditor=(state='', action)=>{
  switch(action.type) {
    case 'set': return action.value;
  }
  return state;
};
const setAction=(value)=>({type:'set', value});

const MarkDown=({md,style})=><div style={style||{}}
  dangerouslySetInnerHTML={{__html:marked(md)||''}}
/>;
const Box=({children}) => <div style={boxStyle}>{children}</div>;
const boxStyle={
  width:'100%', maxWidth:'40em',
  marginLeft: 'auto', marginRight: 'auto',
  padding: '0.5em',
  border: 'solid #888 1px', borderRadius:'0.5em',
};
const MdEditor=yomoView(({yomo})=>{
  const md=yomo();
  const handleChange=(e)=>yomo.dispatch(setAction(e.target.value));
  return <Box>
    Write some markdown text here: <br/>
    <TextArea value={md} onChange={handleChange} style={{width:'99%'}}/>
    <MarkDown md={md} style={{width:'25em'}}/>
  </Box>;
});
yomoApp({reducer:mdEditor, View:MdEditor});
