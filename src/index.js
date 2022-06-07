import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const lineList={};
lineList[2]={bg: '#DD5555', fg: '#000000'};
lineList[4]={bg: '#00daff', fg: '#000000'};
lineList[6]={bg: '#dd9a00', fg: '#000000'};
lineList[7]={bg: '#bfca19', fg: '#000000'};
lineList[8]={bg: '#bfca19', fg: '#000000'};
lineList[9]={bg: '#3ad200', fg: '#000000'};

lineList[11]={bg: '#dd9a00', fg: '#000000'};
lineList[12]={bg: '#3ad200', fg: '#000000'};
lineList[13]={bg: '#bfca19', fg: '#000000'};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App lineColorList={lineList}/>
  </React.StrictMode>
);