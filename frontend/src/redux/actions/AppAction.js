import {
  SAVE_ROUTE_HISTORY, ROUTE_REDIRECT
} from "../reducers/AppReducer"

export function saveRouteHistory(history){
  return (dispatch) => {
    dispatch({ type : SAVE_ROUTE_HISTORY, payload : history })
  }
}

export function redirect(route){
  return (dispatch, getState) => {
    getState().app.history.push(route);
    dispatch({ type : ROUTE_REDIRECT, payload : route })
  }
}