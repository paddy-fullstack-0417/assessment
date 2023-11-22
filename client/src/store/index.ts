import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from 'redux-thunk';
import user from "./user.reducer";
import results from "./results.reducer";

const store = createStore(
  combineReducers({user, results}),
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;