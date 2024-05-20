
import React, { useContext, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, Button } from 'antd';
import { AlertOutlined } from '@ant-design/icons';
import './style.css';
import AlertComponent from '../Widget';
import AlertLeakage from '../Widget/LeakageAlert';
import useDataFetcher from './DataFetcher';
import { calculateAlerts, calculateLeakage } from './AlertsData';
import { AppContext } from '../../context/AppContext';

const StackData = ({ startTime, endTime, selectedMeters, showWidget }) => {
  const { showAlert, setShowAlert } = useContext(AppContext);
  const svgRef = useRef();
  const tooltipRef = useRef();

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
    
    svg.selectAll('.text')
      .data(meters)
      .enter()
      .append('text')
      .attr('x', width + 5)
      .attr('y', (d, i) => 20 * i)
      .attr('text-anchor', 'start')
      .attr('fill', (d, i) => colors(i))
      .attr('font-size', '12px')
      .attr('font-family', 'Arial, sans-serif')
      .text(d => d);
    
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));
    
    svg.append('g')
      .call(d3.axisLeft(yScale));

    
    const tooltip = d3.select(tooltipRef.current)
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', '#FBEEE6')
      .style('border', '1px solid #ccc')
      .style('padding', '10px')
      .style('pointer-events', 'none');

    svg.selectAll('.area')
      .on('mousemove', (event, d) => {
        const [x, y] = d3.pointer(event);
        const x0 = xScale.invert(x);
        const y0 = yScale.invert(y);
        const closestDataPoint = data.reduce((prev, curr) =>
          Math.abs(curr.Timestamp - x0) < Math.abs(prev.Timestamp - x0) ? curr : prev
        );

        const meterValues = meters.map(meter => `${meter}: ${closestDataPoint[meter]} W`).join('<br>');

        tooltip.style('opacity', 1)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`)
          .html(`Time: ${d3.timeFormat('%d-%m-%Y %H:%M')(closestDataPoint.Timestamp)}<br>${meterValues}`);
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });
  };

  return (
    <Card>
      <div className="card-header">
        <Button danger onClick={() => setShowAlert(!showAlert)} disabled={!showWidget}><AlertOutlined /> Alerts </Button>
      </div>
      <div ref={svgRef}></div>
      <div ref={tooltipRef} className="tooltip"></div>
      {(showWidget && showAlert) && <AlertComponent alerts={alerts} />}
      {(showWidget && showAlert) && <AlertLeakage leakage={leakage} />}
    </Card>
  );
};

export default StackData;

