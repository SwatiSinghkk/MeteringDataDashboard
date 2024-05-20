import * as d3 from 'd3';
export const calculateAlerts = (filteredData) => {
 const timestampsExceeding1000 = filteredData
  .filter(entry => {
    const totalPower = parseInt(entry["M1 Power (Watts)"]) + parseInt(entry["M2 Power (Watts)"]) + parseInt(entry["M3 Power (Watts)"]) + parseInt(entry["M4 Power Watts"]);
    return totalPower > 1000;
  })
  .map(entry => entry.Timestamp);


return timestampsExceeding1000;
};
  

export const calculateLeakage = (data) => {
  const timestampsExceedingThreshold = data
    .filter(entry => {
      const totalIndividualPower = parseInt(entry["M1 Power (Watts)"]) + parseInt(entry["M2 Power (Watts)"]) + parseInt(entry["M3 Power (Watts)"]) + parseInt(entry["M4 Power Watts"]);
      const clusterPower = parseInt(entry["Cluster Meter Power (Watts)"]);
      const leakageCurrent = clusterPower - totalIndividualPower;
      return leakageCurrent > 300;
    })
    .map(entry => entry.Timestamp);


  return timestampsExceedingThreshold;
};

