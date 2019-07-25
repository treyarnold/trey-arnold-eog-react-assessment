import * as actions from "../actions";

const initialState = {
  allMetrics: [],
  selectedMetrics: [],
  measurements: {},
};

const metricsRecevied = (state, action) => {
  return {
    ...state,
    allMetrics: action.getMetrics,
  };
};

const metricSelected = (state, action) => {
  return {
    ...state,
    selectedMetrics: action.metricSelected
  }
};

const metricDeselected = (state, action) => {
  const newSelectedMetrics = {...state};
  newSelectedMetrics.selectedMetrics.splice(newSelectedMetrics.selectedMetrics.indexOf(action.metricDeselected), 1);
  return {
    ...newSelectedMetrics,
  }
}

const handlers = {
  [actions.METRICS_RECEIVED]: metricsRecevied,
  [actions.METRIC_SELECTED]: metricSelected,
  [actions.METRIC_DESELECTED]: metricDeselected,
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};