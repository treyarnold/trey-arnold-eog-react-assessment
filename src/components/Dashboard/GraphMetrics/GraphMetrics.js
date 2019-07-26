import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

import { useQuery } from "urql";
import gql from "graphql-tag";

import * as actions from "../../../store/actions";

const getMeasurementsQuery = gql`
  query($metric: String!, $before: Timestamp, $after: Timestamp) {
    getMeasurements(
      input: { metricName: $metric, before: $before, after: $after }
    ) {
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

const getMetrics = state => {
  const { measurements, selectedMetrics } = state.metrics;
  return {
    measurements,
    selectedMetrics
  };
};

// eslint-disable-next-line react/prop-types
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
      setHeartBeat(heartBeats.heartBeat);
    }
  }, [heartBeats]);

  const [result] = useQuery({
    query: getMeasurementsQuery,
    variables: {
      metric: `${lastMetricSelected}`,
      before: heartBeat,
      after: heartBeat - 1800000
    }
  });

  const { fetching, data, error } = result;

  useEffect(() => {
    if (!data || fetching) return;
    const { getMeasurements } = data;
    dispatch({
      type: actions.SELECTED_MEASUREMENTS,
      getMeasurements,
      lastMetricSelected
    });
  }, [fetching, dispatch, data, error, lastMetricSelected]);

  useEffect(() => {
    const selected = measurements[selectedMetrics[0]];
    if (selected && selected.points.length) {
      const newChartData = [];
      const arraySize = selected.points.length;
      for (let i = 0; i < arraySize; i += 1) {
        const timestamp = new Date(selected.points[i].at);
        const dataPoint = {
          at: timestamp.toString().substring(15, 24)
        };
        selectedMetrics.map(metric => {
          dataPoint[metric] = measurements[metric].points[i].value;
          return null;
        });
        newChartData.push(dataPoint);
      }
      setChartData(newChartData);
    }
  }, [measurements]);

  return selectedMetrics.length ? (
    <ResponsiveContainer width="80%" height="60%" margin={{ left: 50 }}>
      <LineChart data={chartData}>
        {selectedMetrics.map(metric => (
          <Line
            key={Math.random()}
            dot={false}
            type="monotone"
            dataKey={metric}
          />
        ))}
        <XAxis dataKey="at" />
        <YAxis label={{ value: "PSI", angle: -90, position: "insideLeft" }} />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  ) : null;
};

export default GraphMetrics;
