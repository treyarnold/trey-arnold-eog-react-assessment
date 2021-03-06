import { createStore, applyMiddleware, combineReducers } from "redux";
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import sagas from "./sagas";
import weatherReducer from "./reducers/Weather";
import metricReducer from "./reducers/Metrics";

export default () => {
  const rootReducer = combineReducers({
    weather: weatherReducer,
    metrics: metricReducer
  });

  const composeEnhancers = composeWithDevTools({});
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = applyMiddleware(sagaMiddleware);
  const store = createStore(rootReducer, composeEnhancers(middlewares));

  sagas.forEach(sagaMiddleware.run);

  return store;
};
