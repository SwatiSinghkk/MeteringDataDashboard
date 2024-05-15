import * as d3 from 'd3';
export const calculateAlerts = (filteredData) => {
 const timestampsExceeding1000 = filteredData
  .filter(entry => {
    const totalPower = entry['M1 Power (Watts)'] + entry['M2 Power (Watts)'] + entry['M3 Power (Watts)'] + entry['M4 Power Watts'];
    return totalPower > 1000;
  })
  .map(entry => entry.Timestamp);

console.log(timestampsExceeding1000,'jj');
return timestampsExceeding1000;
};

export const calculateLeakage = (filteredData) => {
    const alerts = filteredData.filter(entry => {
      const totalPowerConsumed = entry['M1 Power (Watts)'] + entry['M2 Power (Watts)'] + entry['M3 Power (Watts)'] + entry['M4 Power Watts'];
      const leakageCurrent = entry['Cluster Meter Power (Watts)'] - totalPowerConsumed;
        return leakageCurrent > 300;
    })
    .map(entry => entry.Timestamp);
  console.log(alerts,'leakage');
  console.log(filteredData, 'filteredData');
    return alerts;
  };
  
