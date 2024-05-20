
import React, { useContext } from 'react';
import { Button, Form, DatePicker, Select, Card } from 'antd';
import { AppContext } from '../../context/AppContext';
import dayjs from 'dayjs';
import Configuration from '../ConfigurationScreen/index';

const { Option } = Select;

const FormData = () => {
  const { startTimeRef, endTimeRef, selectedMetersRef, showGraph, setShowGraph } = useContext(AppContext);

  const formatTimestamp = (timestamp) => {
    return dayjs(timestamp).format('DD-MM-YYYY HH:mm');
  };
  
  const onFinish = () => {
    setShowGraph(true);
  };

  return (
    <>
      {!showGraph ? (
        <Card title={<span style={{ textAlign: 'center', fontSize: '20px' }}>Meter Data Form</span>} bordered={true} style={{ size: 'small', alignItems: 'center' }}>
          <Form name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ remember: true }} onFinish={onFinish} autoComplete="off">
            <Form.Item label="Start Time" name="startTime">
              <DatePicker showTime onChange={(value) => { startTimeRef.current = formatTimestamp(value); }} />
            </Form.Item>
            <Form.Item label="End Time" name="endTime">
              <DatePicker showTime onChange={(value) => { endTimeRef.current = formatTimestamp(value); }} />
            </Form.Item>
            <Form.Item label="Meter Number" name="meterNumber">
              <Select mode="multiple" placeholder="Select meters" onChange={(values) => { selectedMetersRef.current = values; }} style={{ width: '27%' }}>
                <Option value="M1 Power (Watts)">M1 Power (Watts)</Option>
                <Option value="M2 Power (Watts)">M2 Power (Watts)</Option>
                <Option value="M3 Power (Watts)">M3 Power (Watts)</Option>
                <Option value="M4 Power (Watts)">M4 Power (Watts)</Option>
              </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>
        </Card>
      ) : (
        <Configuration />
      )}
    </>
  );
};

export default FormData;
