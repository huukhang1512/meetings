import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { throttle } from "lodash";

// redux
import { connect } from 'react-redux';
import { changingMode } from '../redux/actions/SocketAction';
//UI
import { Paper, Typography, Tooltip, Grow } from '@material-ui/core';
import { BorderColor, FormatListBulleted, QuestionAnswer } from '@material-ui/icons/';
import { styles } from "../UI_Components/UIComponents"

class ModeChoosing extends React.Component {

  //Card header action

  modeChange = throttle((roomId, mode, adminName) => {
    this.props.changingMode(roomId, mode, adminName)
  }, 1000, { trailing: false })


  render() {
    const { classes, is_admin, userName } = this.props;
    const roomId = this.props.match.params.roomId;
    return (
      <div>
        {is_admin ? (
          <div>
          <Grow in>
              <div className={classes.modeContainer}>
                <Tooltip style={{ width: 100 }} title={
                  <React.Fragment>
                    <Typography align="justify">Speak in queue</Typography>
                    {<Typography variant="subtitle2" align="justify">"A mode that required participant to take turns when speaking, prevent them speaking all at once"</Typography>}
                  </React.Fragment>}>
                  <Paper className={classes.cardMode} elevation={3} style={{ opacity: 0.75 }} onClick={() => this.modeChange(roomId, "MeetingQueue", userName)}>
                    <div className={classes.cardModeContent}>
                      <FormatListBulleted className={classes.cardModeIcon} />
                      <br />
                      <Typography variant="subtitle1">Queue</Typography>
                    </div>
                  </Paper>
                </Tooltip>
                <Tooltip title={
                  <React.Fragment>
                    <Typography align="justify">Questions and Answer</Typography>
                    {<Typography variant="subtitle2" align="left">"Host a Q&A section more effectively by allow participants to ask the presenter anonymously or with their name attached"</Typography>}
                  </React.Fragment>}>
                  <Paper className={classes.cardMode} elevation={3} style={{ opacity: 0.75 }} onClick={() => this.modeChange(roomId, "QandA", userName)}>
                    <div className={classes.cardModeContent}>
                      <QuestionAnswer className={classes.cardModeIcon} />
                      <br />
                      <Typography variant="subtitle1">Q&A</Typography>
                    </div>
                  </Paper>
                </Tooltip>
                <Tooltip title={
                  <React.Fragment>
                    <Typography align="justify">Whiteboard</Typography>
                    {<Typography variant="subtitle2" align="left">"A real-time interactive whiteboard to elevate your brainstorming section"</Typography>}
                  </React.Fragment>}>
                  <Paper className={classes.cardMode} elevation={3} style={{ opacity: 0.75 }} onClick={() => this.modeChange(roomId, "WhiteBoard", userName)}>
                    <div className={classes.cardModeContent}>
                      <BorderColor className={classes.cardModeIcon} />
                      <br />
                      <Typography variant="subtitle1">Whiteboard</Typography>
                    </div>
                  </Paper>
                </Tooltip>
              </div>
          </Grow>
          </div>
        ) : (
            <h1>Wait for admin to choose mode.</h1>
          )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    roomId: state.room.roomId,
    is_admin: state.room.is_admin,
    modeName: state.room.modeName,
    userName: state.user.userName
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changingMode: (roomId, mode, adminName) => {
      dispatch(changingMode(roomId, mode, adminName))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ModeChoosing)));
