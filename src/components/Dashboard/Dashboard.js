import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useQuery } from "urql";
import gql from "graphql-tag";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import LinearProgress from "@material-ui/core/LinearProgress";

import GraphMetrics from "./GraphMetrics/GraphMetrics";

import * as actions from "../../store/actions";


const queryMetrics = gql`
  query {
    getMetrics
  }
`;

const getMetrics = (state) => {
  const { allMetrics, selectedMetrics } = state.metrics;
  return {
    allMetrics,
    selectedMetrics,
  };
};

const Dashboard = () => {
  // const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [result] = useQuery({
    query: queryMetrics,
  });
  let metricSelector;

  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch({ type: actions.API_ERROR, error: error.message });
      return;
    }
    if (!data || fetching) return;
    const { getMetrics } = data;
    dispatch({ type: actions.METRICS_RECEIVED, getMetrics })
  },
    [dispatch, data, error]
  );


  const dispatch = useDispatch();
  const { allMetrics, selectedMetrics } = useSelector(getMetrics);

  const handleMetricDeselected = (metricDeselected) => {
    dispatch({ type: actions.METRIC_DESELECTED, metricDeselected })

  };

  const handleMetricSelected = (metricSelected) => {
    dispatch({ type: actions.METRIC_SELECTED, metricSelected })
  };
  if (fetching) return <LinearProgress />;

  return (
    <React.Fragment>
      {data ?
        <FormControl>
          <InputLabel htmlFor="select-multiple-chip">Chip</InputLabel>
          <Select
            multiple
            value={selectedMetrics}
            onChange={(event) => handleMetricSelected(event.target.value)}
            input={<Input id="select-multiple-chip" />}
            renderValue={selected => (
              <div>
                {selected.map(value => (
                  <Chip key={value} label={value} onDelete={() => handleMetricDeselected(value)} />
                ))}
              </div>
            )}
          // MenuProps={MenuProps}
          >
            {allMetrics.map(metric => {
              if (!selectedMetrics.includes(metric)) {
                return (
                  <MenuItem key={metric} value={metric} >
                    {metric}
                  </MenuItem>
                )
              }
              return null
            })}
          </Select>
        </FormControl>
        : <p>An error had occured</p>}
      {metricSelector}
      <GraphMetrics metrics={selectedMetrics} />
    </React.Fragment>
  );
};

export default Dashboard;