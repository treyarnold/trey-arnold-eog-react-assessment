import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "urql";
import gql from "graphql-tag";

import { makeStyles } from '@material-ui/core/styles';
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import LinearProgress from "@material-ui/core/LinearProgress";

import GraphMetrics from "./GraphMetrics/GraphMetrics";

import * as actions from "../../store/actions";


const queryMetrics = gql`
  query {
    getMetrics
  }
`;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    width: 700
  },
  select: {
    marginTop: 30
  },
  card: {
    margin: '5% 10%'
  }
}));

const getMetrics = (state) => {
  const { allMetrics, selectedMetrics } = state.metrics;
  return {
    ...state,
    allMetrics,
    selectedMetrics,
  };
};

const Dashboard = () => {
  const classes = useStyles();
  const [lastMetricSelected, setLastMetricSelected] = useState("");
  const [result] = useQuery({
    query: queryMetrics,
  });
  const dispatch = useDispatch();

  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch({ type: actions.API_ERROR, error: error.message });
      return;
    }
    if (!data || fetching) return;
    const { getMetrics } = data;
    dispatch({ type: actions.METRICS_RECEIVED, getMetrics });
  },
    [fetching, dispatch, data, error]
  );

  const { allMetrics, selectedMetrics } = useSelector(getMetrics);

  const handleMetricDeselected = (metricDeselected) => {
    dispatch({ type: actions.METRIC_DESELECTED, metricDeselected });
  };

  const handleMetricSelected = (metricSelected) => {
    dispatch({ type: actions.METRIC_SELECTED, metricSelected });
    setLastMetricSelected(metricSelected[metricSelected.length - 1]);
  };

  if (fetching) return <LinearProgress />;

  return (
    <React.Fragment>
      {data ?
        <form className={classes.root}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="select-multiple-chip">Select Metric</InputLabel>
            <Select
              multiple
              className={classes.select}
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
        </form>
        : null}
      <GraphMetrics lastMetricSelected={lastMetricSelected} />
    </React.Fragment>
  );
};

export default Dashboard;