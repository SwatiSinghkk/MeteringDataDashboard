import React from 'react';
import { Alert } from 'antd';


const AlertLeakage = ({ leakage }) => {

    return (
      <div>
          <Alert message={`Alert: Leakage current exceeded 300 Watts at :-` } type="warning" showIcon />
          <ul>
           {leakage.map((timestamp, index) => (
             <li key={index}>{timestamp.toString()}</li>
           ))}
         </ul>
      </div>
    );
  };
  export default AlertLeakage;