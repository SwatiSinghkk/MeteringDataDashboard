import React , { useState } from 'react';
import { Button, Modal, Space } from 'antd';
import LineData from '../GraphData/LineChart';
import StackData from '../GraphData/StackChart';

const Configuration = ({ startTime, endTime, selectedMeters }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLineChart, setIsLineChart] = useState(true);
    const [showWidget, setShowWidget] = useState(true);

    const showModal = () => {
        setIsModalOpen(true);
      };
      const handleOk = () => {
        setIsModalOpen(false);
      };

      const handleCancel = () => {
        setIsModalOpen(false);
        setIsLineChart(true);
        setShowWidget(true);
      }

  return  (
    <>
      <Button type="primary" style={{ margin: '0.8em' , backgroundColor: '#001529'}} onClick={showModal}>
       Configure Screen
      </Button>
      <Modal title={<span style={{ textAlign: 'center', fontSize: '20px', color: '#1890ff' }}> Configuration </span>}  open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div>
        <span>
        <p style = {{color : 'Black', font: '10px'}}>Change Chart type  </p>
        <Button  onClick={() => setIsLineChart(!isLineChart)}>{isLineChart? 'StackGraph' : 'LineGraph'}</Button>
        </span>
        <span>
        <p style = {{color : 'Black', font: '10px'}}>Alerts  </p>
        <Button  onClick={() => setShowWidget(!showWidget)}>{showWidget? 'Turn On' : 'Turn Off'}</Button>
        </span>
        </div>
      </Modal>
      {isLineChart?(
        <LineData
        startTime={startTime}
        endTime={endTime}
        selectedMeters={selectedMeters}
        showWidget = {showWidget}
      />):
      (<StackData
        startTime={startTime}
        endTime={endTime}
        selectedMeters={selectedMeters}
      />)}
    </>
  );
};

export default Configuration;