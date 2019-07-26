import * as actions from "../actions";

const initialState = {
  allMetrics: [],
  selectedMetrics: [],
  measurements: {},
};

const metricsRecevied = (state, action) => {
  const measurements = {};
  if(action.getMetrics.length) {
    action.getMetrics.map(metric => {
      measurements[metric] = {
        name: metric,
        columns: ["time", "value", "unit"],
        points: [],
      }
    })
  }
  return {
    ...state,
    measurements,
    allMetrics: action.getMetrics,
  };
};

const metricSelected = (state, action) => {
  return {
    ...state,
    selectedMetrics: action.metricSelected
  };
};

const metricDeselected = (state, action) => {
  const newSelectedMetrics = {...state};
  newSelectedMetrics.selectedMetrics.splice(newSelectedMetrics.selectedMetrics.indexOf(action.metricDeselected), 1);
  return {
    ...newSelectedMetrics,
  };
};

const selectedMeasurements = (state, action) => {
  console.log(action);
  return {
    ...state,
    measurements: {
      ...state.measurements,
      [action.lastMetricSelected]: {
        ...state.measurements[action.lastMetricSelected],
        points: action.getMeasurements
      }
    }
  };
};

const handlers = {
  [actions.METRICS_RECEIVED]: metricsRecevied,
  [actions.METRIC_SELECTED]: metricSelected,
  [actions.METRIC_DESELECTED]: metricDeselected,
  [actions.SELECTED_MEASUREMENTS]: selectedMeasurements,
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};