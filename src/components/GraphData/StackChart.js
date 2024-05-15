import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card } from 'antd';
import { AlertOutlined } from '@ant-design/icons';
import './style.css';
import AlertComponent from '../Widget';
import useDataFetcher from './DataFetcher';
import { calculateAlerts } from './AlertsData';
import { calculateLeakage } from './AlertsData';
import AlertLeakage from '../Widget/LeakageAlert';


const StackData = ({ startTime, endTime, selectedMeters }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertTimestamp, setAlertTimestamp] = useState(null);
  const svgRef = useRef();

const data = useDataFetcher(startTime, endTime);
const alerts = calculateAlerts(data);
const leakage = calculateLeakage(data);

useEffect(() => {
  if (data.length > 0) {
    drawChart(data, selectedMeters);
  }
}, [data, selectedMeters]);

  const drawChart = (data, meters) => {

    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 30, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const parseTime = d3.timeParse('%d-%m-%Y %H:%M');
    data.forEach(entry => {
      entry.Timestamp = parseTime(entry.Timestamp);
    });

    const stack = d3.stack()
      .keys(meters)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const stackedData = stack(data);

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.Timestamp))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])])
      .nice()
      .range([height, 0]);

    const area = d3.area()
      .x(d => xScale(d.data.Timestamp))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]));

    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    svg.selectAll('.area')
      .data(stackedData)
      .enter()
      .append('path')
      .attr('class', 'area')
      .style('fill', (d, i) => colors(i))
      .attr('d', area);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .call(d3.axisLeft(yScale));
  };

  return (
    <Card>
      <div className="card-header">
        <button className="alert-button" onClick={() => setShowAlert(!showAlert)}><AlertOutlined /> Alerts </button>
      </div>
      <div ref={svgRef}></div>
      {showAlert && <AlertComponent alerts={alerts} />}
      {showAlert && <AlertLeakage leakage={leakage} />}
     
    </Card>
  );
};

export default StackData;
