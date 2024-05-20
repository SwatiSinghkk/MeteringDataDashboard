import React from 'react';
import { Alert } from 'antd';

const AlertComponent = ({ alerts }) => {
  return (
    <div>
      <Alert message={`Alert: Total power consumption exceeded 1000 Watts` } type="warning" showIcon />
      <ul>
         {alerts.map((timestamp, index) => (
           <li key={index}>{timestamp.toString()}</li>
         ))}
       </ul>
    </div>
  );
};
export default AlertComponent;

