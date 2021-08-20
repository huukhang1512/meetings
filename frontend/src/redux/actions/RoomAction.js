import axios from 'axios';
import { redirect } from "./AppAction"
import {BACKEND_API_URL} from "../../config";
import {
  REFRESH_QUESTIONS, REFRESH_QUESTIONS_FAILED, REFRESH_QUESTIONS_DONE,
  REFRESH_QUEUE, REFRESH_QUEUE_FAILED, REFRESH_QUEUE_DONE,
  REFRESH_MEMBERS, REFRESH_MEMBERS_FAILED, REFRESH_MEMBERS_DONE,
  REFRESH_WHITEBOARD,REFRESH_WHITEBOARD_FAILED,REFRESH_WHITEBOARD_DONE,
  CREATE_ROOM_SUCCESS
} from "../reducers/RoomReducer"

export function refreshQuestions(roomId){
  return (dispatch) => {
    dispatch({ type : REFRESH_QUESTIONS })

    axios(`${BACKEND_API_URL}/getquestions/${roomId}`, {
        method: "GET"
    }).then(response => {
      dispatch({ type : REFRESH_QUESTIONS_DONE, payload: response.data });
    }).catch(response => {
        dispatch({ type : REFRESH_QUESTIONS_FAILED, payload: response })
        dispatch(redirect("/notfound"))
      });
  }
}
export function refreshQueues(roomId){
  return (dispatch) => {
    dispatch({ type : REFRESH_QUEUE })

    axios(`${BACKEND_API_URL}/getqueues/${roomId}`, {
        method: "GET"
    }).then(response => {
      dispatch({ type : REFRESH_QUEUE_DONE, payload: response.data });
    }).catch(response => {
        dispatch({ type : REFRESH_QUEUE_FAILED, payload: response })
        dispatch(redirect("/join"))
      });
  }
}

export function getMembers(roomId){
  return (dispatch) => {
    dispatch({ type : REFRESH_MEMBERS})

    axios(`${BACKEND_API_URL}/getmembers/${roomId}`,{
      method: "GET"
    }).then(response => {
      dispatch({ type : REFRESH_MEMBERS_DONE, payload: response.data });
    }).catch(response => {
      dispatch({ type : REFRESH_MEMBERS_FAILED, payload: response })
    });
  }
}
export function getWhiteBoardContent(roomId){
  return (dispatch) => {
    dispatch({ type : REFRESH_WHITEBOARD})

    axios(`${BACKEND_API_URL}/getwhiteboardcontents/${roomId}`,{
      method: "GET"
    }).then(response => {
      dispatch({ type : REFRESH_WHITEBOARD_DONE, payload: response.data });
    }).catch(response => {
      dispatch({ type : REFRESH_WHITEBOARD_FAILED, payload: response })
    });
  }
}

export function createRoom(userName){
  return (dispatch) => {
    axios(`${BACKEND_API_URL}/createroom`, {
        method: 'POST',
        data: {
          userName : userName
        }
      }).then(response => {
          dispatch({ type : CREATE_ROOM_SUCCESS, payload: response })
          dispatch(redirect(`/room/${response.data["roomid"]}`))
      }).catch(err => {
        console.error(err);
      });
  }
}

