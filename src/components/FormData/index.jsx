import React, { useState } from 'react';
import { Button, Form, DatePicker, Select, Card } from 'antd';
import GraphData from '../GraphData/LineChart';
import Configuration from '../ConfigurationScreen';
import dayjs from 'dayjs';

const { Option } = Select;

const FormData = () => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [selectedMeters, setSelectedMeters] = useState([]);
  const [showGraph, setShowGraph] = useState(false);

  const onFinish = () => {
    setShowGraph(true);
  };

  const handleMeterSelectChange = (selectedValues) => {
    setSelectedMeters(selectedValues);
  };

  const formatTimestamp = (timestamp) => {
    return dayjs(timestamp).format('DD-MM-YYYY HH:mm');
  };

  const formattedStartTime = startTime ? formatTimestamp(startTime) : null;
  const formattedEndTime = endTime ? formatTimestamp(endTime) : null;

  return (
    <>
        {!showGraph ? (
          <Card  title={<span style={{ textAlign: 'center', fontSize: '20px' }}>Meter Data Form</span>} bordered={true} style={{ size: 'small', alignItems: 'center'}}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item label="Start Time" name="startTime">
              <DatePicker showTime onChange={(value) => setStartTime(value)} />
            </Form.Item>
            <Form.Item label="End Time" name="endTime">
              <DatePicker showTime onChange={(value) => setEndTime(value)} />
            </Form.Item>
            <Form.Item label="Meter Number" name="meterNumber">
              <Select
                mode="multiple"
                placeholder="Select meters"
                onChange={handleMeterSelectChange}
                style={{ width: '20%' }}
              >
                <Option value="M1 Power (Watts)">M1 Power (Watts)</Option>
                <Option value="M2 Power (Watts)">M2 Power (Watts)</Option>
                <Option value="M3 Power (Watts)">M3 Power (Watts)</Option>
                <Option value="M4 Power Watts">M4 Power (Watts)</Option>
              </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
          </Card>
        ) : (
          

          <Configuration
            startTime={formattedStartTime}
            endTime={formattedEndTime}
            selectedMeters={selectedMeters}
          />
        )}
    </>
  );
};

export default FormData;
