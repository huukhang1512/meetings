// TODO: define actions
export const NAME_REGISTER = "NAME_REGISTER"
export const GET_QUESTION_ASKED = "GET_QUESTION_ASKED"
export const GET_QUESTION_ASKED_CONFIRMED = "GET_QUESTION_ASKED_CONFIRMED"
export const SET_ERRORS = "SET_ERRORS"
// Registered user functions
export const GET_QUESTION_ASKED_BY_USER = "GET_QUESTION_ASKED_BY_USER"
export const GET_QUESTION_ASKED_BY_USER_CONFIRMED = "GET_QUESTION_ASKED_BY_USER_CONFIRMED"
export const GET_QUESTION_ASKED_BY_USER_FAILED = "GET_QUESTION_ASKED_BY_USER_FAILED"

export const GET_ROOM_JOINED_BY_USER = "GET_ROOM_JOINED_BY_USER"
export const GET_ROOM_JOINED_BY_USER_CONFIRMED = "GET_ROOM_JOINED_BY_USER_CONFIRMED"
export const GET_ROOM_JOINED_BY_USER_FAILED = "GET_ROOM_JOINED_BY_USER_FAILED"

export const SET_ROOM_JOINED = "SET_ROOM_JOINED"
export const SET_ROOM_JOINED_SUCCESS = "SET_ROOM_JOINED_SUCCESS"
export const REFRESH_TOKEN = "REFRESH_TOKEN"
export const REFRESH_TOKEN_SUCCESS = "REFRESH_TOKEN_SUCCESS"
export const REFRESH_TOKEN_FAILED = "REFRESH_TOKEN_FAILED"

export const LOGIN = "LOGIN"
export const LOGIN_SUCCESS = "LOGIN_SUCCESS"
export const LOGIN_FAILED = "LOGIN_FAILED"

export const SIGNUP = "SIGNUP"
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS"
export const SIGNUP_FAILED = "SIGNUP_FAILED"

export const LOGOUT = "LOGOUT"

export const GET_USER_INFO = "GET_USER_INFO"
export const GET_USER_INFO_SUCCESS = "GET_USER_INFO_SUCCESS"
export const GET_USER_INFO_FAILED = "GET_USER_INFO_FAILED"

export const FORGOT_PASSWORD = "FORGOT_PASSWORD"
export const FORGOT_PASSWORD_SUCCESS = "FORGOT_PASSWORD_SUCCESS"
export const FORGOT_PASSWORD_FAILED = "FORGOT_PASSWORD_FAILED"

export const CONFIRM_ACCOUNT = "CONFIRM_ACCOUNT_PASSWORD"
export const CONFIRM_ACCOUNT_SUCCESS = "CONFIRM_ACCOUNT_SUCCESS"
export const CONFIRM_ACCOUNT_FAILED = "CONFIRM_ACCOUNT_FAILED"

export const CONFIRM_FORGOT_PASSWORD = "CONFIRM_FORGOT_PASSWORD"
export const CONFIRM_FORGOT_PASSWORD_SUCCESS = "CONFIRM_FORGOT_PASSWORD_SUCCESS"
export const CONFIRM_FORGOT_PASSWORD_FAILED = "CONFIRM_FORGOT_PASSWORD_FAILED"

export const RESEND_CODE = "RESEND_CODE"
export const RESEND_CODE_SUCCESS = "RESEND_CODE_SUCCESS"
export const RESEND_CODE_FAILED = "RESEND_CODE_FAILED"
// TODO: define initial state
const initialState = {
  userName : " ", //=> for dynamodb to accept the value
  fullName : " ",
  questionsAsked: [],
  room_joined: [],
  error: "",
  isLoggedin : false,
  is_loading : false,
  codeSent : false,
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_ERRORS:
        return Object.assign({},state,{
          error : "",
          is_loading : false,
          codeSent : false
        })
      case NAME_REGISTER:
        return Object.assign({},state,{
          fullName : action.payload.fullName,
          userName : action.payload.userName,
        })
      case SIGNUP:
        return Object.assign({},state,{
          error : "",
          is_loading : true,
        })
      case SIGNUP_SUCCESS:
        return Object.assign({},state,{
          error : "",
          is_loading : false,
        })
      case SIGNUP_FAILED:
        return Object.assign({},state,{
          error : action.payload,
          is_loading : false,
        })
      case LOGIN:
        return Object.assign({},state,{
          error : "",
          is_loading : true,
        })
      case LOGIN_SUCCESS:
        return Object.assign({},state,{
          error : "",
          isLoggedin : true,
          is_loading : false,
        })
      case LOGIN_FAILED:
        return Object.assign({},state,{
          error : action.payload,
          is_loading : false,
        })
      case CONFIRM_ACCOUNT:
        return Object.assign({},state,{
          error : "",
          is_loading : true,
        })
      case CONFIRM_ACCOUNT_SUCCESS:
        return Object.assign({},state,{
          error : "",
          isLoggedin : true,
          is_loading : false,
        })
      case CONFIRM_ACCOUNT_FAILED:
        return Object.assign({},state,{
          error : action.payload,
          is_loading : false,
        })
      case FORGOT_PASSWORD:
        return Object.assign({},state,{
          error : "",
          is_loading : true,
        })
      case FORGOT_PASSWORD_SUCCESS:
        return Object.assign({},state,{
          error : "",
          codeSent: true,
          is_loading : false,
        })
      case FORGOT_PASSWORD_FAILED:
        return Object.assign({},state,{
          error : action.payload,
          is_loading : false,
        })
      case CONFIRM_FORGOT_PASSWORD:
        return Object.assign({},state,{
          error : "",
          is_loading : true,
        })
      case CONFIRM_FORGOT_PASSWORD_SUCCESS:
        return Object.assign({},state,{
          error : "",
          codeSent: true,
          is_loading : false,
        })
      case CONFIRM_FORGOT_PASSWORD_FAILED:
        return Object.assign({},state,{
          error : action.payload,
          is_loading : false,
        })
      case GET_QUESTION_ASKED:
        return state
      case GET_QUESTION_ASKED_CONFIRMED:
        let question = [...state.questionsAsked]
        question.push(action.payload)
        return Object.assign({},state,{
          questionsAsked : question
        })
      case GET_QUESTION_ASKED_BY_USER:
        return state
      case GET_QUESTION_ASKED_BY_USER_CONFIRMED:
        return Object.assign({},state,{
          questionsAsked : action.payload
        })
      case GET_QUESTION_ASKED_BY_USER_FAILED:
        return state
      case GET_ROOM_JOINED_BY_USER:
        return state
      case GET_ROOM_JOINED_BY_USER_CONFIRMED:
        const roomJoined = action.payload;
        roomJoined.reverse()
        return Object.assign({},state,{
          room_joined : roomJoined
        })
      case GET_ROOM_JOINED_BY_USER_FAILED:
        return state
      case REFRESH_TOKEN:
        return state
      case REFRESH_TOKEN_SUCCESS:
        return state
      case REFRESH_TOKEN_FAILED:
        return state
      case GET_USER_INFO:
        return state
      case GET_USER_INFO_SUCCESS:
        return Object.assign({},state,{
          userName : action.payload[0].Value,
          fullName : `${action.payload[2].Value} ${action.payload[3].Value}`
        })
      case GET_USER_INFO_FAILED:
        return state
      case SET_ROOM_JOINED:
        return state
      case SET_ROOM_JOINED_SUCCESS:
        let room_joined = [...state.room_joined];
        if(!state.room_joined.some((room) => room === action.payload)){
          room_joined.push(action.payload)
          room_joined.reverse()
          return Object.assign({}, state, {
            room_joined : room_joined
          })
        } else {
          return state;
        }
      case LOGOUT:
        return initialState
      default:
        return state
    }
}

export default userReducer;