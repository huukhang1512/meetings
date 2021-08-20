// TODO: define actions
export const SAVE_ROUTE_HISTORY =  "SAVE_ROUTE_HISTORY"
export const ROUTE_REDIRECT = "ROUTE_REDIRECT"
// TODO: define initial state
const initialState = {
  history : undefined,
}

const appReducer = (state = initialState, action) => {
    switch (action.type) {
      case SAVE_ROUTE_HISTORY:
        return Object.assign({}, state, {
          history : action.payload,
        })
      case ROUTE_REDIRECT: 
        return state
      default:
        return state
    }
}

export default appReducer;