import { combineReducers } from "redux";
import room from "./RoomReducer";
import user from "./UserReducer";
import app from "./AppReducer";

export default combineReducers({
    room, user, app
})