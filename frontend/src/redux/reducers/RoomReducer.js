export const CREATE_ROOM_SUCCESS = "CREATE_ROOM_SUCCESS"
// connection 
export const CONNECT_TO_ROOM = "CONNECT_TO_ROOM"
export const CONNECTION_DISCONNECTED = "CONNECTION_DISCONNECTED"
export const DISCONNECT_FROM_ROOM = "DISCONNECT_FROM_ROOM"
export const ROOM_CONNECTION_CONFIRMED = "ROOM_CONNECTION_CONFIRMED"
export const ROOM_CONNECTION_FAILED = "ROOM_CONNECTION_FAILED"
export const RECONNECT_TO_ROOM = "RECONNECT_TO_ROOM"
//Meeting Queue
export const ADD_NEW_QUEUE = "ADD_NEW_QUEUE"
export const ADD_NEW_QUEUE_CONFIRMED = "ADD_NEW_QUEUE_CONFIRMED"
export const REFRESH_QUEUE = "REFRESH_QUEUE"
export const REFRESH_QUEUE_FAILED = "REFRESH_QUEUE_FAILED"
export const REFRESH_QUEUE_DONE = "REFRESH_QUEUE_DONE"
export const STOP_TALKING = "STOP_TALKING"
export const DONE_TALKING_CONFIRMED = "DONE_TALKING_CONFIRMED"
//Q&A
export const ADD_NEW_QUESTION = "ADD_NEW_QUESTION"
export const ADD_NEW_QUESTION_CONFIRMED = "ADD_NEW_QUESTION_CONFIRMED"
export const REFRESH_QUESTIONS = "REFRESH_QUESTIONS"
export const REFRESH_QUESTIONS_FAILED = "REFRESH_QUESTIONS_FAILED"
export const REFRESH_QUESTIONS_DONE = "REFRESH_QUESTIONS_DONE"
export const REMOVE_QUESTION = "REMOVE_QUESTION"
export const REMOVE_QUESTION_CONFIRMED = "REMOVE_QUESTION_CONFIRMED"

//Whiteboard
export const WHITE_BOARD_SAVED = "WHITE_BOARD_SAVED"
export const SAVE_WHITEBOARD = "SAVE_WHITEBOARD"
export const DRAWING_LINES = "DRAWING_LINES"
export const DRAWING_LINES_CONFIRMED = "DRAWING_LINES_CONFIRMED"
export const REFRESH_WHITEBOARD = "REFRESH_WHITEBOARD"
export const REFRESH_WHITEBOARD_DONE = "REFRESH_WHITEBOARD_DONE"
export const REFRESH_WHITEBOARD_FAILED = "REFRESH_WHITEBOARD_FAILED"
export const CLEAR_WHITEBOARD = "CLEAR_WHITEBOARD"
export const WHITEBOARD_CLEARED = "WHITEBOARD_CLEARED"

export const UNDO_ACTION = "UNDO_ACTION"
export const UNDO_ACTION_DONE = "UNDO_ACTION_DONE"
export const REDO_ACTION = "REDO_ACTION"
export const REDO_ACTION_DONE = "REDO_ACTION_DONE"

//Share todo action 
export const ADD_NEW_MEMBER_CONFIRMED = "ADD_NEW_MEMBER_CONFIRMED"
export const REFRESH_MEMBERS = "REFRESH_MEMBERS"
export const REFRESH_MEMBERS_DONE = "REFRESH_MEMBERS_DONE"
export const REFRESH_MEMBERS_FAILED = "REFRESH_MEMBERS_FAILED"
export const REMOVE_MEMBER_FROM_ROOM = "REMOVE_MEMBER_FROM_ROOM"

//Admin Function :
export const CHANGING_MODE = "CHANGING_MODE"
export const CHANGING_MODE_CONFIRMED = "CHANGING_MODE_CONFIRMED"

export const ConnectionStatus = {
  disconnected : "disconnected",
  connecting : "connecting",
  connected : "connected",
  failed : "failed",
}

const initialState = {
  connectionStatus : ConnectionStatus.disconnected,
  is_admin : undefined,
  roomId : undefined,
  modeName : undefined,
  event : undefined,
  lines :[],
  queue:[],
  questions:[],
  members: [],
}

const roomReducer = (state = initialState, action) => {
    switch (action.type) {
      //connection
      case CREATE_ROOM_SUCCESS:
        return state
      case CONNECT_TO_ROOM:
        return Object.assign({}, state, {
          connectionStatus : ConnectionStatus.connecting,
          event : undefined
        })
      case DISCONNECT_FROM_ROOM:
        return Object.assign({}, state, {
          connectionStatus : ConnectionStatus.disconnected,
        })
      case REMOVE_MEMBER_FROM_ROOM:
        let member = state.members;
        return Object.assign({}, state, {
          members : member.filter(e => e.userName !== action.userName.userName)
        })
      case ROOM_CONNECTION_FAILED:
        return Object.assign({}, state, {
          connectionStatus : ConnectionStatus.failed,
          roomId : undefined,
        })
      case ROOM_CONNECTION_CONFIRMED:
        return Object.assign({}, state, {
          connectionStatus : ConnectionStatus.connected,
          roomId : action.roomId,
          is_admin : action.isAdmin,
          modeName : action.modeName
        })
      case RECONNECT_TO_ROOM: 
        return Object.assign({}, state, {
          event : action.message
        })
      //Meeting queue
      case ADD_NEW_QUEUE:
        return state
      case ADD_NEW_QUEUE_CONFIRMED:
        let queue = [...state.queue];
        queue.push(action.userName);
        return Object.assign({}, state, {
          queue : queue
        })
      case REFRESH_QUEUE:
      case REFRESH_QUEUE_FAILED:
        return state
      case REFRESH_QUEUE_DONE:
        return Object.assign({}, state, {
          queue : action.payload
        })
      case STOP_TALKING:
        return state
      case DONE_TALKING_CONFIRMED:
        let queue2 = [...state.queue];
        return Object.assign({},state,{
          queue : queue2.filter(e => e.userName !== action.userName)
        })
      //Questions
      case ADD_NEW_QUESTION:
        return state
      case ADD_NEW_QUESTION_CONFIRMED:
        let questions = [...state.questions];
        questions.push(action.question);
        return Object.assign({}, state, {
          questions : questions
        })
      case REFRESH_QUESTIONS:
      case REFRESH_QUESTIONS_FAILED:
        return state
      case REFRESH_QUESTIONS_DONE:
        return Object.assign({}, state, {
          questions : action.payload
        })
      case REMOVE_QUESTION:
        return state
      case REMOVE_QUESTION_CONFIRMED:
        let questions1 = state.questions
        return Object.assign({}, state, {
          questions : questions1.filter(e => e.question_id !== action.question_id)
        })
      case DRAWING_LINES: 
        return state
      case DRAWING_LINES_CONFIRMED:
        let lines = state.lines
        let newLine = action.lines
        return Object.assign({}, state, {
          lines : lines.concat(newLine),
        })
      case REFRESH_WHITEBOARD:
      case REFRESH_WHITEBOARD_FAILED:
        return state
      case REFRESH_WHITEBOARD_DONE:
        return Object.assign({},state, {
          lines : [].concat.apply([],action.payload)
        })
      //Share Functions
      case SAVE_WHITEBOARD:
        return state
      case WHITE_BOARD_SAVED:
        return Object.assign({},state, {
          lines : action.payload.lines
        })
      case CLEAR_WHITEBOARD:
        return state
      case WHITEBOARD_CLEARED:
        return Object.assign({},state, {
          lines : action.lines,
        })
      case UNDO_ACTION:
        return state
      case UNDO_ACTION_DONE:
        let lines2 = [...state.lines]
        lines2.pop(action.lines)
        return Object.assign({},state, {
          lines : lines2
        })
      case REDO_ACTION: 
        return state
      case REDO_ACTION_DONE:
        let lines3 = [...state.lines]
        lines3.push(action.lines);
        return Object.assign({},state, {
          lines : lines3
        })
      case ADD_NEW_MEMBER_CONFIRMED:
        let members = [...state.members];
        members.push(action.userName);
        return Object.assign({}, state, {
          members : members
        })
      case REFRESH_MEMBERS :
      case REFRESH_MEMBERS_FAILED:
        return state
      case REFRESH_MEMBERS_DONE:
        return Object.assign({},state, {
          members : action.payload
        })
      //Changing Mode
      case CHANGING_MODE :
        return state
      case CHANGING_MODE_CONFIRMED :
        return Object.assign({},state, {
          modeName : action.modeName
        })
      default:
        return state
    }
}

export default roomReducer;