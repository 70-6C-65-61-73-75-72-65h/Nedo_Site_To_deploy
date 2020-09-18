import { compose, applyMiddleware, combineReducers, createStore } from "redux";
import {reducer as formReducer} from "redux-form";
import geoReducer from "./geo-reducer";
import thunkMiddleware from "redux-thunk";

let reducers = combineReducers({
    geoLocation: geoReducer,
    form :formReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunkMiddleware)))


window.__store__ = store;
export default store;
