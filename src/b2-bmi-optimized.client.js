import React from 'react';
import {yomoApp,yomoView,cacheFn} from 'yomo/v1';

const setAction=(name,value)=>({type:'set', [name]:value});

const bmiCalculator=(state={},action)=>{
  return {
    height: height(state.height,action),
    weight: weight(state.weight,action),
  };
};

const height=(state='',action)=>{
  if(action.type==='set' && 'height' in action){ return action.height; }
  return state;
};
const weight=(state='',action)=>{
  if(action.type==='set' && 'weight' in action){ return action.weight; }
  return state;
};

const BmiCalculator=yomoView(({yomo})=>
  <Box>
    <Input name='height' unit='m' >Height:</Input>
    <Input name='weight' unit='kg'>Weight:</Input>
    <hr/>
    <BmiResults />
    <NormalWeights />
  </Box>
);

const Box=({children}) => <div style={boxStyle}>{children}</div>;

const Input=yomoView(({yomo,children,name,unit})=>{
  const value=yomo.state()[name];
  const handleChange=(e)=>yomo.dispatch(setAction(name,e.target.value));
  return <div>
     <label style={labelStyle} htmlFor={name}>{children}</label>
     <input id={name} value={value} onChange={handleChange}/>
     &nbsp; {unit}
  </div>;
});

const BmiResults=yomoView(({yomo})=>{
  const {bmi,category,style}=bmiResults(yomo);
  return <div>
    <label style={labelStyle}>BMI:</label>
    {bmi} &nbsp;
    <span style={style}>{category}</span>
  </div>;
});
const bmiResults=(yomo)=>{
  const {height,weight}=yomo.state();
  const bmi=(weight/(height*height)).toFixed(1);
  const [category,style]=
    bmi< 18.5? ['underweight',{color:'red'}] :
    bmi<=25.0? ['normal', {}] :
    bmi<=30.0? ['overweight', {color:'red'}] :
      ['obese',{backgroundColor:'red', fontWeight:'bold'}];
  return {bmi,category,style};
};

const NormalWeights=yomoView(({yomo})=>{
  console.log('----- render: NormalWeights');
  return <div>
    <label style={labelStyle}>Normal weight:</label>
    {weightForBmi(yomo,18.5)} kg &#8211;
    {weightForBmi(yomo,25.0)} kg
  </div>;
});
const getHeight=cacheFn((yomo)=>yomo.state().height);
const weightForBmi=cacheFn((yomo,bmi)=> {
  const height=getHeight(yomo);
  console.log(`compute weightForBmi(${bmi}) for ${height} m`);
  return (bmi*height*height).toFixed(1);
});

const boxStyle={
  width:'100%', maxWidth:'40em',
  marginLeft: 'auto', marginRight: 'auto',
  padding: '0.5em',
  border: 'solid #888 1px', borderRadius:'0.5em',
};

const labelStyle={
  display: 'inline-block',  width: '8em',  textAlign: 'right',
  fontWeight: 'bold',
  margin: '0.5em',
};

yomoApp({reducer:bmiCalculator, View:BmiCalculator});
