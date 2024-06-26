
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

const LineData = ({ startTime, endTime, selectedMeters, showWidget }) => {
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

    svg.selectAll('.text')
      .data(meterData)
      .enter()
      .append('text')
      .attr('transform', d => `translate(${width},${yScale(d.values[d.values.length - 1].value)})`)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'start')
      .attr('fill', (d, i) => colors(i))
      .text(d => d.name);

    const tooltip = d3.select(tooltipRef.current)
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', '#FBEEE6')
      .style('border', '1px solid #ccc')
      .style('padding', '10px')
      .style('pointer-events', 'none');

    meterData.forEach((meter, i) => {
      svg.selectAll(`.dot-${i}`)
        .data(meter.values)
        .enter()
        .append('circle')
        .attr('class', `dot-${i}`)
        .attr('cx', d => xScale(d.Timestamp))
        .attr('cy', d => yScale(d.value))
        .attr('r', 3)
        .attr('fill', colors(i))
        .on('mousemove', (event, d) => {
          tooltip.style('opacity', 1)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 28}px`)
            .html(`Time: ${d3.timeFormat('%d-%m-%Y %H:%M')(d.Timestamp)}<br>${meter.name}: ${d.value} W`);
        })
        .on('mouseout', () => {
          tooltip.style('opacity', 0);
        });
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

export default LineData;