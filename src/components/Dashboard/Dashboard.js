import React, { useState } from "react";
import { useQuery } from "urql";
import gql from "graphql-tag";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';

const getMetrics = gql`
  query {
    getMetrics
  }
`;


const Dashboard = () => {
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [res] = useQuery({
    query: getMetrics,
  });

  const deselected = (metricRemoved) => {
    const newMetrics = [...selectedMetrics];
    newMetrics.splice(newMetrics.indexOf(metricRemoved), 1);
    setSelectedMetrics(newMetrics);
  };

  let metrics;
  if (res.fetching) {
    metrics = <p>Loading...</p>;
  } else if (res.error) {
    metrics = <p>An error had occured</p>;
  } else {
    metrics = (
      <FormControl>
        <InputLabel htmlFor="select-multiple-chip">Chip</InputLabel>
        <Select
          multiple
          value={selectedMetrics}
          onChange={(event) => setSelectedMetrics(event.target.value)}
          input={<Input id="select-multiple-chip" />}
          renderValue={selected => (
            <div>
              {selected.map(value => (
                <Chip key={value} label={value} onDelete={() => deselected(value)}  />
              ))}
            </div>
          )}
        // MenuProps={MenuProps}
        >
          {res.data.getMetrics.map(metric => {
            if (!selectedMetrics.includes(metric)) {
              return (
                <MenuItem key={metric} value={metric} >
                  {metric}
                </MenuItem>
              )
            }
          })}
        </Select>
      </FormControl>
    );
  }

  return (
    <React.Fragment>
      {metrics}
    </React.Fragment>
  );
};

export default Dashboard;