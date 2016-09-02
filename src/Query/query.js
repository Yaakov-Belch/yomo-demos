import React from 'react';
import {yomoView,cacheFn,cacheAsync} from 'yomo/v1';
import {delay,getBuffer,OkIcon}
  from 'yomo/lib/experimental.js';
import {config} from '../Util/getConfig.js';

import TextArea from 'react-textarea-autosize';
import {style}  from './style.js';
import {Line as Progress} from 'rc-progress';


export const survey=(state={},action)=>{
  return {
    stage:    stage(state.stage,action),
    maxStage: Math.max(state.stage||1,state.maxStage||1),
    a:a(state.a,action),
    data:data(state.data,state.a,state.stage,action),
  };
};
const stage=(state=1,action)=>{
  switch(action.type){
    case 'setStage': return action.stage;
  }
  return state;
};
const a=(state={},action)=>{
  switch(action.type) {
    case 'set':
      const {id, value, info}=action;
      state={...state, [id]: value};
      if(info) { state={...state, [`${id}-info`]: info}; }
      return state;
  }
  return state;
};
const data=(state,newState,stage,action) => {
  switch(action.type){
    case 'setStage': return {...newState,stage};
  }
  return state;
}

const setStageAction=(stage)=>({type:'setStage', stage});
const setAction=(id,value,info)=>({type:'set',id,value,info});

const io=(yomo,id)=>{
  const value=yomo.state().a[id] || '';
  const onChange=e=>yomo.dispatch(setAction(id,e.target.value));
  return {value, onChange};
};

export const Survey=yomoView(({yomo,children})=>{
  const {stage, maxStage}=yomo.state();
  const go=(stage)=>()=>yomo.dispatch(setStageAction(stage));
  const [skip, ...c2]=children;
  const showHeader=c2.length>1;
  const corner=showHeader? {borderTopLeftRadius: '0em'} : {};
  const surveyBody={...style.surveyBody, ...corner};
  return <div style={style.survey}>
    {children[stage-1]}
    <PrevNext stage={stage} lastStage={children.length}/>
    <HiddenUpLoad/>
  </div>;
});
const PrevNext=yomoView(({yomo, stage, lastStage})=>{
  const pct=(100*(stage-1)/(lastStage-1)).toFixed(0);
  const go=(stage)=>()=>yomo.dispatch(setStageAction(stage));
  return <div style={style.prevNext}>
    {stage>  1 && stage < lastStage &&
      <button onClick={go(stage-1)} style={style.pnButton}>Back</button>}
    {stage<  lastStage-1 &&
      <button onClick={go(stage+1)} style={style.pnButton}>Next</button>}
    {stage===lastStage-1 &&
      <button  onClick={go(lastStage)} style={style.pnButton}>
        Submit
      </button>}
    {stage===lastStage && <LoadDone/> }
    { lastStage>2 && <div>
      <Progress percent={pct} trailColor='#eee'/>
      {pct}%
    </div> }
  </div>;
});
const upload=cacheAsync((yomo,data)=>{
  const url=config.queryAPI;
  const opts={
    url,
    method:'POST', headers:{'Content-Type':'text/plain'},
    body: JSON.stringify(data)
  };
  if(data){console.log(url,data);}
  // return delay(1000);
  return data? getBuffer(opts) : delay(1);
});
const getData=cacheFn((yomo)=>yomo.state().data);
const HiddenUpLoad=yomoView(({yomo})=> {
  try{upload(yomo, getData(yomo));} catch(e){}
  return <span/>;
}, ()=>null);
const LoadDone=yomoView(({yomo})=>{
  upload(yomo, getData(yomo));
  return <OkIcon size='2em'/>;
});

export const Page=yomoView(({yomo,children})=>{
  return <div>
    {children}
  </div>;
});
export const Q=yomoView(({yomo, children})=>{
  return <div style={style.question}>{children}</div>;
});
export const Qa=yomoView(({yomo, children, id})=>{
  return <div>
    {children}
    <div>
      <TextArea style={style.textArea} minRows={3} {...io(yomo,id)}/>
    </div>
  </div>;
});
export const Qs=yomoView(({yomo, id, children})=>{
  return <span>
    {children}
    <input type='text' {...io(yomo, id)} />
  </span>;
});
export const Qc=yomoView(({yomo,id,children})=>{
  const [top,...rest]=children;
  const value=yomo.state().a[id];
  const click=(v,child)=>{
    const {info}=child.props;
    if(!info) {
      console.error('Missing info for Qc option:', child.props.children);
    }
    return ()=>yomo.dispatch(setAction(id,v,info));
  };
  return <div>
    {top}
    {rest.map((child,k)=>
      <div key={k+1} onClick={click(k+1,child)}>
        <input type='radio'
          checked={value===k+1} readOnly={true} style={style.radio}
        />
        {child}
      </div>
    )}
  </div>;
});
export const O=yomoView(({yomo, children})=>{
  return <span>{children}</span>;
});
