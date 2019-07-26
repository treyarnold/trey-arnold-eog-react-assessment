import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "urql";
import gql from "graphql-tag";

import { makeStyles } from "@material-ui/core/styles";
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
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    marginTop: 30,
    marginBottom: 30
  },
  formControl: {
    margin: theme.spacing(1),
    width: 700,
    marginLeft: "auto",
    marginRight: "10%"
  },
  select: {
    marginTop: 30
  }
}));

const retrieveMetrics = state => {
  const { allMetrics, selectedMetrics } = state.metrics;
  return {
    ...state,
    allMetrics,
    selectedMetrics
  };
};

const Dashboard = () => {
  const classes = useStyles();
  const [lastMetricSelected, setLastMetricSelected] = useState("");
  const [result] = useQuery({
    query: queryMetrics
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
  }, [fetching, dispatch, data, error]);

  const { allMetrics, selectedMetrics } = useSelector(retrieveMetrics);

  const handleMetricDeselected = metricDeselected => {
    dispatch({ type: actions.METRIC_DESELECTED, metricDeselected });
  };

  const handleMetricSelected = metricSelected => {
    dispatch({ type: actions.METRIC_SELECTED, metricSelected });
    setLastMetricSelected(metricSelected[metricSelected.length - 1]);
  };

  if (fetching) return <LinearProgress />;

  return (
    <React.Fragment>
      {data ? (
        <form className={classes.root}>
          <FormControl className={classes.formControl}>
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            <InputLabel htmlFor="select-multiple-chip">
              Select Metric
            </InputLabel>
            <Select
              multiple
              className={classes.select}
              value={selectedMetrics}
              onChange={event => handleMetricSelected(event.target.value)}
              input={<Input id="select-multiple-chip" />}
              renderValue={selected => (
                <div>
                  {selected.map(value => (
                    <Chip
                      key={value}
                      label={value}
                      onDelete={() => handleMetricDeselected(value)}
                    />
                  ))}
                </div>
              )}
              // MenuProps={MenuProps}
            >
              {allMetrics.map(metric => {
                if (!selectedMetrics.includes(metric)) {
                  return (
                    <MenuItem key={metric} value={metric}>
                      {metric}
                    </MenuItem>
                  );
                }
                return null;
              })}
            </Select>
          </FormControl>
        </form>
      ) : null}
      <GraphMetrics lastMetricSelected={lastMetricSelected} />
    </React.Fragment>
  );
};

export default Dashboard;
