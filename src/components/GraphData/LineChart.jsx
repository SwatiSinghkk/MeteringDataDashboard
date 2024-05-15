import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, Col, Row } from 'antd';
import { AlertOutlined} from '@ant-design/icons';
import './style.css';
import AlertComponent from '../Widget';
import AlertLeakage from '../Widget/LeakageAlert';
import useDataFetcher from './DataFetcher';
import { calculateAlerts } from './AlertsData';
import { calculateLeakage } from './AlertsData';



const LineData = ({ startTime, endTime, selectedMeters, showWidget }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [highlightedDuration, setHighlightedDuration] = useState(null);
  const svgRef = useRef();

  const data = useDataFetcher(startTime, endTime);
  const alerts = calculateAlerts(data);
  const leakage = calculateLeakage(data);

  

useEffect(() => {
  if (data.length > 0) {
    drawChart(data, selectedMeters);
  }
}, [data, selectedMeters, highlightedDuration]);


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

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.Timestamp))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(...meters.map(meter => parseFloat(d[meter]))))])
      .nice()
      .range([height, 0]);

    const line = d3.line()
      .x(d => xScale(d.Timestamp))
      .y(d => yScale(d.value));

    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    const meterData = meters.map((meter, i) => ({
      name: meter,
      values: data.map(d => ({ Timestamp: d.Timestamp, value: parseFloat(d[meter]) }))
    }));

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .call(d3.axisLeft(yScale));

    svg.selectAll('.line')
      .data(meterData)
      .enter()
      .append('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', (d, i) => colors(i))
      .attr('stroke-width', 1.5)
      .attr('d', d => line(d.values));
    
  //   svg.selectAll('.text')
  //     .data(meterData)
  //     .enter()
  //     .append('text')
  //     .attr('transform', d => `translate(${width},${yScale(d.values[d.values.length - 1].value)})`)
  //     .attr('dy', '0.35em')
  //     .attr('text-anchor', 'start')
  //     .attr('fill', (d, i) => colors(i))
  //     .text(d => d.name);

  //     if (highlightedDuration) {
  //       const svg = d3.select(svgRef.current);
  
  //       // Remove any existing highlights
  //       svg.selectAll('.highlight').remove();
  
  //       // Add highlight to the chart
  //       svg.append('rect')
  //         .attr('class', 'highlight')
  //         .attr('x', xScale(highlightedDuration.start))
  //         .attr('y', 0)
  //         .attr('width', xScale(highlightedDuration.end) - xScale(highlightedDuration.start))
  //         .attr('height', height)
  //         .attr('fill', 'yellow')
  //         .attr('opacity', 0.5);
  //     }

  // };
  // const handleAlertClick = (timestamp) => {
  //   // Find the corresponding data point for the clicked timestamp
  //   const duration = {
  //     start: new Date(timestamp),
  //     end: new Date(timestamp.getTime() + 60000) // Assuming duration is 1 minute, adjust as needed
  //   };
  //   setHighlightedDuration(duration);

  };
  return(
    <>
    <Card>
      <div className="card-header">
        <button className="alert-button" onClick={() => setShowAlert(!showAlert)}><AlertOutlined /> Alerts </button>
      </div>
      <div ref={svgRef}></div>
      
      {(showWidget && showAlert) && <AlertComponent alerts={alerts} />}
      {(showWidget && showAlert) && <AlertLeakage leakage={leakage} />}
     
    </Card>
    </>
  );
};

export default LineData;
