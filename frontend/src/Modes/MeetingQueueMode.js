import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import {throttle} from "lodash"

// redux
import { connect } from 'react-redux';
import { raiseHand,doneTalking } from '../redux/actions/SocketAction';

//UI

import {Card,CardHeader,Avatar,Button} from '@material-ui/core';
import {styles} from "../UI_Components/UIComponents"

class MeetingQueueMode extends React.Component {
  constructor(props) {
    super(props);
    this.raise = this.raise.bind(this);
  } 

  raise = throttle((roomId, userName) =>{
    const userObj = {
      userName : userName,
      fullName : this.props.fullName
    }
    this.props.raiseHand(roomId, userObj);
  },1000, {trailing : false})

  finishTalking = throttle((roomId,userName)=>{
    this.props.doneTalking(roomId,userName);
  },1000, {trailing : false})


//Card header action
  userNameFirstLetterGetter = (userName) => {
    var res = userName.charAt(0)
    return res.toUpperCase()
  }

  renderButton = () =>{
    const { classes,userName,queue } = this.props;
    const roomId = this.props.match.params.roomId;
    let buttonLabel = "Raise"
    let handler = () => this.raise(roomId,userName)
    if (queue[0] && queue[0].userName === userName){
      handler = () => this.finishTalking(roomId,userName)
      buttonLabel = "Done"
    } else if(queue.find(u => u.userName === userName)) {
      handler = () => {}
      buttonLabel = "Wait for your turn..."
    }

    return <Button 
      disabled = {buttonLabel === "Wait for your turn..."}
      className = {classes.bottomButton} 
      onClick={handler}>
      {buttonLabel}
    </Button>
  }

  render() {
    const { classes, queue } = this.props;
    return (
      <div>
        <div className={classes.mappingItemContainer}>
          <div>
          {queue.map((q, i) => (
            <div key={i} className={classes.cardContainer}>
              <Card variant="outlined" className={classes.card}>
                <CardHeader className={classes.cardHead} 
                  avatar={<Avatar className={classes.avatar}>{this.userNameFirstLetterGetter(q.fullName)}</Avatar>} 
                  title={q.fullName} 
                  subheader="" >
                </CardHeader>
              </Card>
              <span className={classes.breaker}></span>
            </div>
          ))}
          </div>
        </div>
          <div className ={classes.bottomNav}>
            <div>
              {this.renderButton()}
            </div>
          </div>
      </div>
    );
    }
  }

const mapStateToProps = (state) => {
  return {
	connectionStatus : state.room.connectionStatus,
    roomId : state.room.roomId,
    queue : state.room.queue,
    userName : state.user.userName,
    fullName : state.user.fullName,
    members : state.room.members,
    isAdmin : state.room.isAdmin
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
    raiseHand : (roomId, userName ) => {
      dispatch(raiseHand(roomId, userName))
    },
    doneTalking : (roomId,userName) => {
      dispatch(doneTalking(roomId,userName))
    }
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MeetingQueueMode)));
