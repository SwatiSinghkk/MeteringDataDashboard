
import React, { useContext } from 'react';
import { Button, Modal } from 'antd';
import LineData from '../GraphData/LineChart';
import StackData from '../GraphData/StackChart';
import { AppContext } from '../../context/AppContext';

const Configuration = () => {
  const { isModalOpen, setIsModalOpen, isLineChart, setIsLineChart, showWidget, setShowWidget, startTimeRef, endTimeRef, selectedMetersRef } = useContext(AppContext);

  const showModal = () => { setIsModalOpen(true); };
  const handleOk = () => { setIsModalOpen(false); };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsLineChart(true);
    setShowWidget(true);
  };

  return (
    <>
      <Button type="primary" style={{ margin: '0.8em', backgroundColor: '#001529' }} onClick={showModal}>Configure Screen</Button>
      <Modal title={<span style={{ textAlign: 'center', fontSize: '20px', color: '#1890ff' }}> Configuration </span>} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div>
          <span>
            <p style={{ color: 'Black', font: '10px' }}>Change Chart type</p>
            <Button onClick={() => setIsLineChart(!isLineChart)}>{isLineChart ? 'StackGraph' : 'LineGraph'}</Button>
          </span>
          <span>
            <p style={{ color: 'Black', font: '10px' }}>Alerts</p>
            <Button onClick={() => setShowWidget(!showWidget)}>{showWidget ? 'Hide Alerts' : 'Show Alerts'}</Button>
          </span>
        </div>
      </Modal>
      {isLineChart ? (
        <LineData startTime={startTimeRef.current} endTime={endTimeRef.current} selectedMeters={selectedMetersRef.current} showWidget={showWidget} />
      ) : (
        <StackData startTime={startTimeRef.current} endTime={endTimeRef.current} selectedMeters={selectedMetersRef.current} showWidget={showWidget}/>
      )}
    </>
  );
};

export default Configuration;
