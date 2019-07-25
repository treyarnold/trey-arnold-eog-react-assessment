import React, { useState } from "react";
import { useQuery } from "urql";
import gql from "graphql-tag";


const GraphMetrics = (props) => {
  const getLastKnownMeasurement = gql`
    query {
      getLastKnownMeasurement(metricName: "${props.metrics[0]}") {
        metric
        value
        unit
        at
      }
    }
  `;
  const [equipmentValue, setEquipmentValue] = useState({});
  const [res] = useQuery({
    query: getLastKnownMeasurement,
  });
  console.log("res.data",res.data);
  if(res.data && props.metrics.length) {
    if (res.data.getLastKnownMeasurement) console.log(res.data.getLastKnownMeasurement.metric, res.data.getLastKnownMeasurement.value);
  }

  // let test = () => (<h3>Select a metric</h3>);
  // if (props.metrics) test = props.metrics.map(metric => (<h3>{metric}</h3>))
  console.log(props.metrics)
  return (
    props.metrics.length ? props.metrics.map(metric => (<h3>{metric}</h3>)) : <h3>Select a metric</h3>
  )
}

export default GraphMetrics;