import {
  //Unregister user function
  NAME_REGISTER,
  GET_QUESTION_ASKED, GET_QUESTION_ASKED_CONFIRMED,
  //Registered user functions
  GET_USER_INFO,GET_USER_INFO_SUCCESS, GET_USER_INFO_FAILED, 
  GET_QUESTION_ASKED_BY_USER, GET_QUESTION_ASKED_BY_USER_CONFIRMED, GET_QUESTION_ASKED_BY_USER_FAILED,
  GET_ROOM_JOINED_BY_USER,GET_ROOM_JOINED_BY_USER_CONFIRMED,GET_ROOM_JOINED_BY_USER_FAILED,
  REFRESH_TOKEN, REFRESH_TOKEN_FAILED, REFRESH_TOKEN_SUCCESS,
  FORGOT_PASSWORD, FORGOT_PASSWORD_SUCCESS ,FORGOT_PASSWORD_FAILED,
  CONFIRM_FORGOT_PASSWORD,CONFIRM_FORGOT_PASSWORD_SUCCESS,CONFIRM_FORGOT_PASSWORD_FAILED,
  RESEND_CODE, RESEND_CODE_FAILED , RESEND_CODE_SUCCESS,
  LOGIN, LOGIN_SUCCESS, LOGIN_FAILED,SET_ROOM_JOINED,SET_ROOM_JOINED_SUCCESS,
  SIGNUP, SIGNUP_SUCCESS, SIGNUP_FAILED,
  CONFIRM_ACCOUNT, CONFIRM_ACCOUNT_SUCCESS, CONFIRM_ACCOUNT_FAILED,
  LOGOUT, SET_ERRORS
} from "../reducers/UserReducer"
import axios from "axios"
import { redirect } from "./AppAction"
import { BACKEND_API_URL } from "../../config";
import Cookies from "js-cookie"
import { v4 as uuidv4 } from 'uuid';

export function setRoomJoined(roomId){
  return (dispatch) => {
    dispatch({ type: SET_ROOM_JOINED })
    dispatch({ type: SET_ROOM_JOINED_SUCCESS, payload: roomId })
  }
}

export function setError(){
  return (dispatch) => {
    dispatch({ type: SET_ERRORS })
  }
}
export function RegisterUserName(fullName) {
  const uuid = uuidv4()
  return (dispatch) => {
    dispatch({
      type: NAME_REGISTER, payload: {
        fullName: fullName,
        userName: uuid
      }
    })
  }
}

export function getQuestionAsked(question_id) {
  return (dispatch) => {
    dispatch({ type: GET_QUESTION_ASKED })
    dispatch({ type: GET_QUESTION_ASKED_CONFIRMED, payload: question_id })
  }
}

export function refreshToken() {
  return (dispatch) => {
    dispatch({ type: REFRESH_TOKEN })

    axios(`${BACKEND_API_URL}/refreshtoken`, {
      method: "POST",
      withCredentials : true,
    }).then(response => {
      dispatch({ type: REFRESH_TOKEN_SUCCESS })
      const exp = response.data.AuthenticationResult.ExpiresIn * 1000

      Cookies.set("exp", new Date().getTime() + exp - 1000000)

    }).catch(response => {
      dispatch({ type: REFRESH_TOKEN_FAILED})
      console.log(response)
      dispatch(redirect('/signin'))
    })
  }
}
export function signin(userName, password) {
  return (dispatch) => {
    dispatch({type : LOGIN})
    axios(`${BACKEND_API_URL}/signin`, {
      method: "POST",
      withCredentials : true,
      data: {
        username: userName,
        password: password
      }
    }).then(response => {
        dispatch({type : LOGIN_SUCCESS})
        const exp = response.data.AuthenticationResult.ExpiresIn * 1000
        Cookies.set("exp", new Date().getTime() + exp - 1000000)
        dispatch(setupUserAccount())
        dispatch(redirect('/'))
        Cookies.set("userEmail", userName)
    }).catch(e => {
      dispatch({type : LOGIN_FAILED,payload : e.response.data})
      dispatch(redirect('/signin'))
    })
  }
}
export function signup(email, password, firstName, lastName) {
  return (dispatch) => {
    dispatch({type: SIGNUP})
    axios(`${BACKEND_API_URL}/signup`, {
      method: "POST",
      data: {
        email: email,
        password: password,
        given_name: firstName,
        family_name: lastName
      }
    }).then(() => {
      dispatch({type: SIGNUP_SUCCESS})
      Cookies.set("email", email)
      dispatch(redirect("/verification"))
    }).catch(e => {
      dispatch({type: SIGNUP_FAILED, payload : e.response.data})
      dispatch(redirect('/signup'))
    })
  }
}

export function confirm(email, confirmationCode) {
  return (dispatch) => {
    dispatch({type : CONFIRM_ACCOUNT})
    axios(`${BACKEND_API_URL}/confirmsignup`, {
      method: "POST",
      data: {
        email: email,
        confirmationCode: confirmationCode,
      }
    }).then(() => {
      dispatch({type : CONFIRM_ACCOUNT_SUCCESS})
      Cookies.remove("email")
      dispatch(redirect("/signin"))
    }).catch(e => {
      dispatch({type : CONFIRM_ACCOUNT_FAILED, payload : e.response.data})
      console.log(e)
    })
  }
}

export function forgotPassword(userName){
  return (dispatch) =>{
    dispatch({type : FORGOT_PASSWORD})
    axios(`${BACKEND_API_URL}/forgotpassword`,{
      method : "POST",
      data : {
        username : userName,
      }
    }).then(() => {
      dispatch({type : FORGOT_PASSWORD_SUCCESS})
      Cookies.set("email", userName)
    }).catch(e => {
      dispatch({type : FORGOT_PASSWORD_FAILED, payload : e.response.data})
      console.log(e)
    })
  }
}
export function forgotPasswordConfirm(userName,newPassword,confirmationCode){
  return (dispatch) =>{
    dispatch({type : CONFIRM_FORGOT_PASSWORD})
    axios(`${BACKEND_API_URL}/confirmforgotpassword`,{
      method : "POST",
      data : {
        username : userName,
        password : newPassword,
        confirmationCode : confirmationCode
      }
    }).then(() => {
      dispatch({type : CONFIRM_FORGOT_PASSWORD_SUCCESS})
      dispatch(redirect("/signin"))
    }).catch(e => {
      dispatch({type : CONFIRM_FORGOT_PASSWORD_FAILED, payload : e.response.data })
      console.log(e)
    })
  }
}
export function resendCode(userName) {
  return (dispatch) => {
    dispatch({type : RESEND_CODE})
    axios(`${BACKEND_API_URL}/resendverificationcode`, {
      method: "POST",
      data: {
        username: userName,
      }
    }).then(() => {
      dispatch({type : RESEND_CODE_SUCCESS})
      redirect("/verification")
    }).catch(response => {
      dispatch({type : RESEND_CODE_FAILED})
      console.log(response)
    })
  }
}

export function setupUserAccount() {
  return (dispatch) => {
    dispatch({ type: GET_USER_INFO})
    axios(`${BACKEND_API_URL}/getuserinfo`, {
      method: "POST",
      withCredentials: true,
    }).then(response => {
      const userAttributes = response.data.UserAttributes
      dispatch({ type: GET_USER_INFO_SUCCESS, payload: userAttributes })

      Cookies.set("given_name", userAttributes[2].Value)
      Cookies.set("family_name", userAttributes[3].Value)

      dispatch(getQuestionAskedbyUser(userAttributes[0].Value))
      dispatch(getRoomJoinedbyUser(userAttributes[0].Value))
    }).catch(e => {
      dispatch({ type: GET_USER_INFO_FAILED})
      console.log(e.response)
    })
  }
}

export function getQuestionAskedbyUser(userName) {
  return (dispatch) => {
    dispatch({ type: GET_QUESTION_ASKED_BY_USER })
    axios(`${BACKEND_API_URL}/getquestionaskedbyuser`, {
      method: "POST",
      withCredentials : true,
      data: {
        userName: userName
      }
    }).then(response => {
      dispatch({ type: GET_QUESTION_ASKED_BY_USER_CONFIRMED, payload: response.data })
    }).catch(response => {
      dispatch({ type: GET_QUESTION_ASKED_BY_USER_FAILED })
      console.log(response)
    })
  }
}

export function getRoomJoinedbyUser(userName) {
  return (dispatch) => {
    dispatch({ type: GET_ROOM_JOINED_BY_USER })
    axios(`${BACKEND_API_URL}/getroomjoined`, {
      method: "POST",
      withCredentials : true,
      data: {
        userName: userName
      }
    }).then(response => {
      dispatch({ type: GET_ROOM_JOINED_BY_USER_CONFIRMED, payload: response.data })
    }).catch(response => {
      dispatch({ type: GET_ROOM_JOINED_BY_USER_FAILED })
      console.log(response)
    })
  }
}

export function logout(){
  return (dispatch) => {
    dispatch({type: LOGOUT})
    Cookies.remove("accessToken")
    Cookies.remove("refreshToken")
    Cookies.remove("exp")
    dispatch(redirect("/"))
  }
}