import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

import { useQuery } from "urql";
import gql from "graphql-tag";

import * as actions from "../../../store/actions";

const getMeasurementsQuery = gql`
  query ($metric: String!, $before: Timestamp, $after: Timestamp) {
    getMeasurements(input: {metricName: $metric,
    before: $before, after: $after}) {   
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
  const { measurements, selectedMetrics } = state.metrics;
  return {
    measurements,
    selectedMetrics,
  };
};

const GraphMetrics = ({ lastMetricSelected }) => {
  const [heartBeat, setHeartBeat] = useState();
  const dispatch = useDispatch();
  const { measurements, selectedMetrics } = useSelector(getMetrics);
  const [chartData, setChartData] = useState();
  const heartBeats = useQuery({
    query: getHeartbeat
  })[0].data;

  useEffect(() => {
    if (heartBeats) {
      setHeartBeat(heartBeats.heartBeat)
    }
  }, [heartBeats])

  const [result] = useQuery({
    query: getMeasurementsQuery,
    variables: {
      metric: `${lastMetricSelected}`,
      before: heartBeat,
      after: heartBeat - 1800000,
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

  useEffect(() => {
    if (measurements[selectedMetrics[0]] && measurements[selectedMetrics[0]].points.length) {
      const newChartData = [];
      const arraySize = measurements[selectedMetrics[0]].points.length;
      for (let i = 0; i < arraySize; i++) {
        const timestamp = new Date(measurements[selectedMetrics[0]].points[i].at);
        const dataPoint = {
          at: timestamp.toString().substring(15,24)
        };
        selectedMetrics.map((metric) => {
          dataPoint[metric] = measurements[metric].points[i].value;
        });
        newChartData.push(dataPoint);
      }
      setChartData(newChartData);
    }
  }, [measurements]);

  return (
    chartData ?
      <ResponsiveContainer width="80%" height="60%">
        <LineChart data={chartData}>
          {selectedMetrics.map((metric, idx) => (
            <Line key={idx} type="monotone" dataKey={metric} />
          ))}
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="at" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
      : null
  )
}

export default GraphMetrics;