import {
  CONNECT_TO_ROOM, DISCONNECT_FROM_ROOM, ADD_NEW_QUEUE,
  ROOM_CONNECTION_CONFIRMED, ROOM_CONNECTION_FAILED, ADD_NEW_QUEUE_CONFIRMED,
  ADD_NEW_MEMBER_CONFIRMED, ADD_NEW_QUESTION, ADD_NEW_QUESTION_CONFIRMED,
  STOP_TALKING, DONE_TALKING_CONFIRMED, REMOVE_MEMBER_FROM_ROOM, CHANGING_MODE_CONFIRMED, CHANGING_MODE,
  DRAWING_LINES, DRAWING_LINES_CONFIRMED, SAVE_WHITEBOARD, WHITE_BOARD_SAVED, CLEAR_WHITEBOARD, WHITEBOARD_CLEARED,
  UNDO_ACTION, UNDO_ACTION_DONE, REDO_ACTION, REDO_ACTION_DONE, REMOVE_QUESTION, REMOVE_QUESTION_CONFIRMED,RECONNECT_TO_ROOM
} from "../reducers/RoomReducer"
import { redirect } from './AppAction'
import { getQuestionAsked, setRoomJoined } from './UserAction'
import { refreshQueues, getMembers, refreshQuestions, getWhiteBoardContent } from './RoomAction';
import { WEBSOCKET_URL } from "../../config";

// a single socket object
let socket = undefined;

const socketReply = {
  CONNECTION_CONFIRMED: "CONNECTION_CONFIRMED",
  CONNECTION_FAILED: "CONNCECTION_FAILED",
  CONNECTION_DISCONNECTED: "CONNECTION_DISCONNECTED",
  NEW_RAISE: "NEW_RAISE",
  DONE_TALKING: "DONE_TALKING",
  ADD_MEMBERS: "ADD_MEMBERS",
  REMOVE_MEMBERS: "REMOVE_MEMBERS",
  QUESTION_NEW: "QUESTION_NEW",
  QUESTION_ASKED: "QUESTION_ASKED",
  QUESTION_REMOVED: "QUESTION_REMOVED",
  CHANGING_MODE: "CHANGING_MODE",
  DRAWING: "DRAWING",
  BOARD_SAVED: "BOARD_SAVED",
  BOARD_CLEARED: "BOARD_CLEARED",
  UNDO: "UNDO",
  REDO: "REDO"
}

const socketAction = {
  CONNECT_TO_ROOM: "connecttoroom",
  SEND_QUESTION: "sendquestion",
  DELETE_QUESTION: "deletequestion",
  CHANGE_MODE: "changemode",
  RAISE_HAND: "raisehand",
  SAVE_BOARD: "saveboard",
  CLEAR_BOARD: "clearboard",
  UNDO_LINE: "undoline",
  REDO_LINE: "redoline",
  TALKING_FINISHED: "talkingfinished",
  DRAWING_DETECTED: "drawingdetected"
}

// Connection handler
export function connectToRoom(roomId, userName,fullName) {
  return (dispatch, getState) => {
    dispatch({ type: CONNECT_TO_ROOM })
    dispatch(setRoomJoined(roomId))
    setupRoomSocket(roomId, userName,fullName, dispatch);
  }
}

function reconnectToRoom(message){
  return (dispatch) => {
    dispatch({
      type : RECONNECT_TO_ROOM,
      message : message
    })
  }
}

export function roomConnectionFailed(roomId, error) {
  return {
    type: ROOM_CONNECTION_FAILED,
    roomId: roomId,
    error: error
  }
}

export function confirmRoomConnectionSuccessful(roomId, isAdmin, modeName) {
  return (dispatch) => {
    dispatch({ type: ROOM_CONNECTION_CONFIRMED, roomId: roomId, isAdmin: isAdmin, modeName: modeName })
    if (modeName === "MeetingQueue") {
      dispatch(refreshQueues(roomId))
    } else if (modeName === "QandA") {
      dispatch(refreshQuestions(roomId))
    } else if (modeName === "WhiteBoard") {
      dispatch(getWhiteBoardContent(roomId))
    }
  };
}

export function disconnectFromRoom(message) {
  if (socket) socket.close();
  return {
    type: DISCONNECT_FROM_ROOM,
    message: message,
  }
}
//Adding member

export function addMemberConfirmed(userName, roomId) {
  return (dispatch) => {
    dispatch({
      type: ADD_NEW_MEMBER_CONFIRMED,
      userName: userName,
      roomId: roomId
    })
    dispatch(getMembers(roomId))
  }
}

// Raise Hand + Done talking Handler
export function doneTalking(roomId, userName) {
  return (dispatch) => {
    if (socket) {
      socket.send(JSON.stringify({
        action: socketAction.TALKING_FINISHED,
        roomId: roomId,
        userName: userName
      }))
      dispatch({
        type: STOP_TALKING, payload: {
          action: socketAction.TALKING_FINISHED,
          roomId: roomId,
          userName: userName,
        }
      })
    }
  }
}
export function doneTalkingConfirmed(roomId, userName) {
  return (dispatch) => {
    dispatch({
      type: DONE_TALKING_CONFIRMED,
      roomId: roomId,
      userName: userName
    })
  }
}
export function removeMember(roomId, userName) {
  return (dispatch) => {
    dispatch({
      type: REMOVE_MEMBER_FROM_ROOM,
      roomId: roomId,
      userName: userName
    })
  }
}

// queue
export function raiseHand(roomId, userName) {
  return (dispatch) => {
    if (socket) {
      socket.send(JSON.stringify({
        action: socketAction.RAISE_HAND,
        roomId: roomId,
        userName: userName
      }))
      dispatch({
        type: ADD_NEW_QUEUE, payload: {
          action: socketAction.RAISE_HAND,
          roomId: roomId,
          userName: userName
        }
      })
    }
  }
}

export function receiveNewQueue(roomId, userName) {
  return (dispatch) => {
    dispatch({
      type: ADD_NEW_QUEUE_CONFIRMED,
      roomId: roomId,
      userName: userName
    })
  }
}
//Q&A
export function addQuestion(roomId, question) {
  return (dispatch) => {
    if (socket) {
      socket.send(JSON.stringify({
        action: socketAction.SEND_QUESTION,
        roomId: roomId,
        question: question,
      }))
      dispatch({
        type: ADD_NEW_QUESTION, payload: {
          action: socketAction.SEND_QUESTION,
          roomId: roomId,
          question: question,
        }
      })
    }
  }
}
export function receiveNewQuestion(roomId, question) {
  return (dispatch) => {
    dispatch({
      type: ADD_NEW_QUESTION_CONFIRMED,
      roomId: roomId,
      question: question
    })
  }
}
export function removeQuestion(roomId, question_id) {
  return (dispatch) => {
    if (socket) {
      socket.send(JSON.stringify({
        action: socketAction.DELETE_QUESTION,
        roomId: roomId,
        question_id: question_id
      }))
      dispatch({
        type: REMOVE_QUESTION, payload: {
          action: socketAction.DELETE_QUESTION,
          roomId: roomId,
          question_id: question_id
        }
      })
    }
  }
}
export function removeQuestionConfirmed(roomId, question_id) {
  return (dispatch) => {
    dispatch({
      type: REMOVE_QUESTION_CONFIRMED,
      roomId: roomId,
      question_id: question_id
    })
  }
}
//White Board
export function saveBoard(roomId, lines) {
  return (dispatch) => {
    if (socket) {
      socket.send(JSON.stringify({
        action: socketAction.SAVE_BOARD,
        roomId: roomId,
        lines: lines
      }))
      dispatch({
        type: SAVE_WHITEBOARD, payload: {
          action: socketAction.SAVE_BOARD,
          roomId: roomId,
          lines: lines
        }
      })
    }
  }
}
export function whiteBoardSaved(roomId, lines) {
  return (dispatch) => {
    dispatch({
      type: WHITE_BOARD_SAVED, payload: {
        roomId: roomId,
        lines: lines
      }
    })
  }
}

export function drawing(roomId, lines) {
  return (dispatch) => {
    if (socket && lines ) {
      socket.send(JSON.stringify({
        action: socketAction.DRAWING_DETECTED,
        roomId: roomId,
        lines: lines
      }))
      dispatch({
        type: DRAWING_LINES, payload: {
          action: socketAction.DRAWING_DETECTED,
          roomId: roomId,
          lines: lines
        }
      })
    }
  }
}
export function drawingConfirmed(roomId, lines) {
  return (dispatch) => {
    dispatch({
      type: DRAWING_LINES_CONFIRMED,
      roomId: roomId,
      lines: lines
    })
  }
}
export function clearBoard(roomId) {
  return (dispatch) => {
    if (socket) {
      socket.send(JSON.stringify({
        action: socketAction.CLEAR_BOARD,
        roomId: roomId,
      }))
      dispatch({
        type: CLEAR_WHITEBOARD, payload: {
          action: socketAction.CLEAR_BOARD,
          roomId: roomId,
        }
      })
    }
  }
}
export function boardCleared(roomId, lines) {
  return (dispatch) => {
    dispatch({
      type: WHITEBOARD_CLEARED,
      roomId: roomId,
      lines: lines
    })
  }
}
export function undo(roomId, lines) {
  return (dispatch) => {
    if (socket) {
      socket.send(JSON.stringify({
        action: socketAction.UNDO_LINE,
        roomId: roomId,
        lines: lines,
      }))
      dispatch({
        type: UNDO_ACTION, payload: {
          action: socketAction.UNDO_LINE,
          roomId: roomId,
          lines: lines,
        }
      })
    }
  }
}
function undoDone(roomId, lines) {
  return (dispatch) => {
    dispatch({
      type: UNDO_ACTION_DONE,
      roomId: roomId,
      lines: lines
    })
  }
}
export function redo(roomId, lines) {
  return (dispatch) => {
    if (socket) {
      socket.send(JSON.stringify({
        action: socketAction.REDO_LINE,
        roomId: roomId,
        lines: lines,
      }))
      dispatch({
        type: REDO_ACTION, payload: {
          action: socketAction.REDO_LINE,
          roomId: roomId,
          lines: lines,
        }
      })
    }
  }
}
function redoDone(roomId, lines) {
  return (dispatch) => {
    dispatch({
      type: REDO_ACTION_DONE,
      roomId: roomId,
      lines: lines
    })
  }
}
//Changing Mode 
export function changingMode(roomId, modeName, adminName) {
  return (dispatch) => {
    if (socket) {
      socket.send(JSON.stringify({
        action: socketAction.CHANGE_MODE,
        roomId: roomId,
        adminName: adminName,
        modeName: modeName
      }))
      dispatch({
        type: CHANGING_MODE, payload: {
          action: socketAction.CHANGE_MODE,
          roomId: roomId,
          adminName: adminName,
          modeName: modeName
        }
      })
    }
  }
}
export function changingModeConfirmed(roomId, modeName) {
  return (dispatch) => {
    dispatch({
      type: CHANGING_MODE_CONFIRMED,
      roomId: roomId,
      modeName: modeName
    })
    if (modeName === "QandA") {
      dispatch(refreshQuestions(roomId));
    } else if (modeName === "MeetingQueue") {
      dispatch(refreshQueues(roomId));
    } else if (modeName === "WhiteBoard") {
      dispatch(getWhiteBoardContent(roomId))
    }
  }
}


//Socket
const setupRoomSocket = (roomId, userName,fullName, dispatch) => {
  if (socket) socket.close()
  socket = new WebSocket(WEBSOCKET_URL);

  socket.onopen = function (e) {
    socket.send(JSON.stringify({
      action: socketAction.CONNECT_TO_ROOM,
      roomId: roomId,
      userName: userName,
      fullName: fullName
    }));
  };

  socket.onmessage = (event) => {
    let { action, data } = JSON.parse(event.data);
    switch (action) {
      case socketReply.CONNECTION_CONFIRMED:
        dispatch(confirmRoomConnectionSuccessful(roomId, data.is_admin, data.current_mode))
        break;
      case socketReply.CONNECTION_FAILED:
        dispatch(redirect("/join"))
        break;
      case socketReply.CONNECTION_DISCONNECTED:
        dispatch(disconnectFromRoom(data))
        break;
      case socketReply.NEW_RAISE:
        dispatch(receiveNewQueue(data.roomId, data.queue));
        break;
      case socketReply.DONE_TALKING:
        dispatch(doneTalkingConfirmed(data.roomId, data.userName));
        break;
      case socketReply.QUESTION_NEW:
        dispatch(receiveNewQuestion(data.roomId, data.question));
        break;
      case socketReply.QUESTION_ASKED:
        dispatch(getQuestionAsked(data.question_id.question_id));
        break;
      case socketReply.QUESTION_REMOVED:
        dispatch(removeQuestionConfirmed(data.roomId, data.question_id));
        break;
      case socketReply.CHANGING_MODE:
        dispatch(changingModeConfirmed(data.roomId, data.mode));
        break;
      case socketReply.ADD_MEMBERS:
        dispatch(addMemberConfirmed(data.userName, data.roomId));
        break;
      case socketReply.REMOVE_MEMBERS:
        dispatch(removeMember(data.roomId, data.userName));
        break;
      case socketReply.DRAWING:
        dispatch(drawingConfirmed(data.roomId, data.lines));
        break;
      case socketReply.BOARD_SAVED:
        dispatch(whiteBoardSaved(data.roomId, data.lines));
        break;
      case socketReply.BOARD_CLEARED:
        dispatch(boardCleared(data.roomId, data.lines));
        break;
      case socketReply.UNDO:
        dispatch(undoDone(data.roomId, data.lines));
        break;
      case socketReply.REDO:
        dispatch(redoDone(data.roomId, data.lines));
        break;
      default:
        break;
    }
  };

  socket.onclose = (event) => {
    dispatch(disconnectFromRoom({
      eventCode: event.code,
      eventReason: event.reason
    }))
    if (event.wasClean && event.code === 1001) {
      socket = undefined
      dispatch(reconnectToRoom(event.reason))
    }
  };
  socket.onerror = (error) => {
    console.log(error)
    dispatch(roomConnectionFailed(roomId, error))
  };
}