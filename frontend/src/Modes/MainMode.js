import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { throttle } from "lodash";

// redux
import { connect } from 'react-redux';
import { changingMode } from '../redux/actions/SocketAction';
//UI
import { Paper, Grid, Typography, Tooltip, Grow } from '@material-ui/core';
import { BorderColor, FormatListBulleted, QuestionAnswer } from '@material-ui/icons/';
import { styles } from "../UI_Components/UIComponents"
import WhiteBoardMode from "./WhiteBoardMode";
import {LeftPanel} from "../Components/Layouts/LeftPanel";
import {RightPanel} from "../Components/Layouts/RightPanel";
import {MiddlePanel} from "../Components/Layouts/MiddlePanel";

class ModeChoosing extends React.Component {

  constructor(props) {
    super(props);
    // So we took too long and failed to migrate our Serverless instance to Azure, so we didn't have time to implement the new features in the backend, so these do nothing.
    this.state={
      gridItems:[
        {
          id:1,
          name: "LeftPane",
          width:"15vw",
          height:"95vh",
          component: <LeftPanel />
        },
        {
          id:2,
          width:"54vw",
          name: "MainPane",
          height:"95vh",
          component: <MiddlePanel /> /* <WhiteBoardMode /> */
        },
        {
          id:3,
          width:"29vw",
          name: "RightPane",
          height:"95vh",
          component: <RightPanel />
        },
      ]
    }
  } 

  modeChange = throttle((roomId, mode, adminName) => {
    this.props.changingMode(roomId, mode, adminName)
  }, 1000, { trailing: false })


  render() {
    const { classes, is_admin, userName } = this.props;
    const { gridItems } =this.state
    const roomId = this.props.match.params.roomId;
    return (
      <div style={{"width" : "100vw", height:"100vh"}}>
      <Grid container className={classes.root} >
        <Grid item>
          <Grid container justify="space-around">
            {gridItems.map((value) => (
              <Grid key={value.id} item>
                <Paper style={{width:value.width, height:value.height}}>
                  {value.component}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
        </Grid>
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
