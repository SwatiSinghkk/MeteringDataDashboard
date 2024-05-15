import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import * as d3 from 'd3';

const useDataFetcher = (startTime, endTime) => {
  const [data, setData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/meterData.csv');
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);
        const parsedData = Papa.parse(csv, { header: true }).data;
        const StartTime = d3.timeParse('%d-%m-%Y %H:%M')(startTime);
        const EndTime = d3.timeParse('%d-%m-%Y %H:%M')(endTime);

        const filteredData = parsedData.filter(entry => {
          const timestamp = d3.timeParse('%d-%m-%Y %H:%M')(entry.Timestamp);
          return timestamp >= StartTime && timestamp <= EndTime;
        });

        setData(filteredData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [startTime, endTime]);

  return data
};

export default useDataFetcher;
