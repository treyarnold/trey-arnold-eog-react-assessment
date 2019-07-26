import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import getHeartbeat from "./Heartbeat";

import { useQuery } from "urql";
import gql from "graphql-tag";

import * as actions from "../../../store/actions";

const getMeasurementsQuery = gql`
  query ($metric: String!) {
    getMeasurements(input: {metricName: $metric,
    before: 1564112276618, after: 1564112096618}) {   
      metric
      value
      unit
      at
    }
  }      
  `;

const getHeartbeat = gql`
  query {
    heartBeat
  }
`;

const getMetrics = (state) => {
  const { allMetrics, selectedMetrics } = state.metrics;
  return {
    allMetrics,
    selectedMetrics,
  };
};

const GraphMetrics = ({ lastMetricSelected }) => {
  const [heartBeat, setHeartBeat] = useState();
  const dispatch = useDispatch();
  const { allMetrics, selectedMetrics } = useSelector(getMetrics);
  const heartBeats = useQuery({
    query: getHeartbeat
  })[0].data;

  useEffect(()=> {
    if (heartBeats) {
      setHeartBeat(heartBeats.heartBeat)
    }
  }, [heartBeats])

  const [result] = useQuery({
    query: getMeasurementsQuery,
    variables: {
      metric: `${lastMetricSelected}`,
      before: heartBeat,
      after: heartBeat - 180000, 
    }
  });

  const { fetching, data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch({ type: actions.API_ERROR, error: error.message });
      return;
    }
    if (!data || fetching) return;
    const { getMeasurements } = data;
    dispatch({ type: actions.SELECTED_MEASUREMENTS, getMeasurements, lastMetricSelected });
  },
    [fetching, dispatch, data, error]
  );



  // allMetrics.map((metric) => {
  //   const getMeasurementsQuery = gql`
  //       query {
  //         getMeasurements(input: {metricName: "${metric}",
  //         before: 1564112276618, after: 1564112096618}) {   
  //           value
  //           unit
  //           at
  //         }
  //       }      
  //     `;
  //     const [result] = useQuery({
  //       query: getMeasurementsQuery,
  //     });
  //     const { fetching, data, error } = result;
  //     if (error) {
  //       dispatch({ type: actions.API_ERROR, error: error.message });
  //       return;
  //     }
  //     if (!data || fetching) return;
  //     console.log(metric, data);
  //     // dispatch({ type: actions.MEASURMENT_RECEIVED, getMetrics });
  // });
  // useEffect(() => {
  //   // const { getMetrics } = data;
  // },
  //   [dispatch, data, error]
  // );


  // console.log("res.data", res.data);
  // if (res.data && props.metrics.length) {
  //   if (res.data.getLastKnownMeasurement) console.log(res.data.getLastKnownMeasurement.metric, res.data.getLastKnownMeasurement.value);
  // }

  // let test = () => (<h3>Select a metric</h3>);
  // if (props.metrics) test = props.metrics.map(metric => (<h3>{metric}</h3>))
  // console.log(props.metrics)
  return (
    // props.metrics.length ? props.metrics.map(metric => (<h3>{metric}</h3>)) : <h3>Select a metric</h3>
    null
  )
}

export default GraphMetrics;