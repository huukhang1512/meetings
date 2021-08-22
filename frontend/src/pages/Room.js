import React from "react";
import { withRouter } from "react-router-dom";
// import MeetingQueueMode from "../Modes/MeetingQueueMode";
// import QAMode from "../Modes/QAMode"
// import WhiteBoardMode from "../Modes/WhiteBoardMode"
import MainMode from "../Modes/MainMode"
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {throttle} from "lodash";
import { changingMode } from '../redux/actions/SocketAction';

// import {subscribeToRoom} from "../WebNotifiation"

// redux
import { connect } from 'react-redux';
import { connectToRoom, disconnectFromRoom } from '../redux/actions/SocketAction';
import { ConnectionStatus } from '../redux/reducers/RoomReducer';

//UI
import {Dialog,DialogActions,DialogTitle,Button,Tooltip,Typography,IconButton,
  CircularProgress,Avatar,ListItemText,ListItem,Drawer,Divider,Collapse} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { withStyles } from "@material-ui/core/styles";
import {Close,Share,FileCopyOutlined, Refresh} from '@material-ui/icons';
import { styles } from "../UI_Components/UIComponents"
class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      right: false,
      instruction : false,
      open: false,
      alert : false,
      isAway : false,
      alertMessage : ""
    };
    props.connectToRoom(this.props.match.params.roomId, this.props.userName, this.props.fullName);
  }

  componentDidMount() {
    const roomId = this.props.match.params.roomId;
    // subscribeToRoom(roomId);
    this.authenticationHandler()
    document.title = `Meetings - Room ${roomId}`
  }
  componentDidUpdate(prevProps){
    if (prevProps.event !== this.props.event && this.props.event === "Going away"){
      this.setState({isAway : true})
    }
  }
  authenticationHandler = () => {
    const { userName } = this.props
    if (userName === " ") {
      this.props.history.push("/register")
    }
  }

  modeChange= throttle((roomId, mode,adminName)=>{
    this.props.changingMode(roomId, mode,adminName)
    this.setState({right : false})
  },1000,{trailing :false})

  userNameFirstLetterGetter = (userName) => {
    var res = userName.charAt(0)
    return res.toUpperCase()
  }

  share = () => {
    if(navigator.share){
      navigator.share({
        url : window.location.href
      })
    } else {
      this.renderAlert("share")
    }
  }
  renderAlert = (type) =>{
    if (type === "share"){
      this.setState({alertMessage: "Please copy to clipboard"})
    } else {
      this.setState({alertMessage: "copied!"})
    }
    this.setState({
      open : true,
    },() => {setTimeout(()=>{
      this.setState({open : false})
    },2000)
    })
  }
  renderShareButton = () => {
    const { classes } = this.props;
    return(
      <div>
        <Tooltip title = "Share" arrow>
          <IconButton onClick={()=>{this.share()}}>
            <Share className ={classes.shareIcon}/>
          </IconButton>
        </Tooltip>
        <Tooltip title = "Copy URL to clipboard" arrow>
          <CopyToClipboard text={window.location.href}>
            <IconButton onClick={()=>{this.renderAlert("copy")}}>
          <FileCopyOutlined/>
            </IconButton>
          </CopyToClipboard>
        </Tooltip>
        <Tooltip title = "Close" arrow>
            <IconButton onClick={this.toggleDrawer(false,"right")}>
          <Close/>
            </IconButton>
        </Tooltip>
      </div>
    )
  }

  toggleDrawer = (open,type) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    type ===  "right" ? (this.setState({ right: open })):(this.setState({instruction: open}))
  };

  componentWillUnmount() {
    const roomId = this.props.match.params.roomId;
    this.props.disconnectFromRoom(roomId);
  }

  handleClickOpen = () => {
    this.setState({alert : true})
  };
  handleClose = () => {
    this.setState({alert : false})
  };


  renderDrawerButton(){
    const { classes, is_admin,modeName,userName } = this.props;
    const roomId = this.props.match.params.roomId;
    let mode = "Default Mode"
    if (modeName !== "Default Mode"){
      mode = "Default Mode"
    }
    return (
    <div>
      {is_admin && modeName !=="Default Mode"? (
        <ListItem button className={classes.bottomDrawer} style ={{justifyContent : "center"}}>
          <ListItemText primary = "Change Mode" onClick={() => {this.modeChange(roomId, mode,userName)}}></ListItemText>
        </ListItem>
        ):( null
    )}</div>)
  }
  render() {
    const { classes, connectionStatus, modeName,fullName, members,is_admin,event } = this.props;
    const { right,open,alertMessage,alert,isAway } = this.state
    const roomId = this.props.match.params.roomId;
    return (
      <div>
        {connectionStatus !== ConnectionStatus.connected && event !== "Going away" ? (
        <div className={classes.loaderContainer}>
          <CircularProgress className={classes.loader} />
        </div>
        ) : (
          <div className={classes.root} style={{position : modeName ==="QandA" || modeName ==="MeetingQueue" ? ("absolute"):("fixed")}}>
            <Dialog
              open={alert}
              onClose={this.handleClose}
              PaperProps={{
                style: {
                    backgroundColor: "#333333",
                },
             }}>
              <DialogTitle style ={{color :"#edeaea"}}> Are you sure you want to leave this room ?</DialogTitle>
              <DialogActions>
                <Button onClick={() => {this.handleClose();this.props.history.push('/')}} color="secondary">
                  Yes
                </Button>
                <Button onClick={()=>{this.handleClose()}} color ="secondary" autoFocus>
                  No
                </Button>
              </DialogActions></Dialog>
            {/* <Drawer anchor="right" open = {instruction} onClose={this.toggleDrawer(false,"instruction")} >
              <ListItem className={classes.topDrawer}>
                <ListItemText primary = {<Typography variant="h5">Instruction</Typography>} style={{fontWeight :"bold"}}></ListItemText>
                <Tooltip title = "Close" arrow>
                  <IconButton onClick={this.toggleDrawer(false,"instruction")}>
                    <Close/>
                  </IconButton>
                </Tooltip>
              </ListItem>
              <Divider></Divider>
            </Drawer> */}
            <Drawer anchor="right" open = {right} onClose={this.toggleDrawer(false,"right")} >
              <ListItem className={classes.topDrawer}>
                <Avatar className={classes.headAvatar} style ={{margin : "10px"}}>
                  {this.userNameFirstLetterGetter(fullName)}
                </Avatar>
                <ListItemText primary = {fullName}></ListItemText>
               {this.renderShareButton()}
              </ListItem>
              {open ? (<Alert severity={alertMessage === "Copied!" ?("success"):("error")}>{alertMessage}</Alert>):(null)}
              <Divider></Divider>
              {members.map((m,i)=>(
                <div key ={i}>
                  <ListItem button className={classes.members}>
                    <Avatar className={classes.headAvatar} style ={{margin : "10px"}}>
                    {this.userNameFirstLetterGetter(m.fullName)}
                    </Avatar>
                    <ListItemText primary = {m.fullName}></ListItemText>
                  </ListItem>
                </div>
              ))}
              <div className={classes.bottomDrawer}>
                {this.renderDrawerButton()}
              </div>
            </Drawer>
          <div className={classes.header}>
            <div className={classes.headerText}>
              <Tooltip title = "Leave room" arrow>
                  <img 
                    style={{objectFit:'contain'}}
                    className = {classes.logo} 
                    onClick={()=> this.handleClickOpen()}
                    src={process.env.PUBLIC_URL + '/logo1.png'} 
                    alt ="logo" width = "47px"/>
              </Tooltip>
              <Divider orientation="vertical" flexItem/>
                <Typography style ={{margin : 12,color : "#545454",fontWeight: "bolder",}}>{roomId}</Typography>
              </div>
            <div className ={classes.headAvatarContainer}>
              {/* <Tooltip title = "Instruction" arrow>
                <IconButton style ={{width :"40px" ,height :"40px", marginRight : 10}} onClick={this.toggleDrawer(true,"instruction")}>
                  <HelpOutline/>
                </IconButton>
              </Tooltip> */}
              <Tooltip title ={is_admin ? ("View member & Change mode") : ("View member")} arrow>
                <Avatar className={classes.headAvatar} onClick={this.toggleDrawer(true,"right")}>
                  {this.userNameFirstLetterGetter(fullName)}
                </Avatar>
              </Tooltip>
            </div>
          </div>
          <MainMode/>
          <div className = {classes.bottomNav}>
            <Collapse in= {isAway}>
              <Alert className = {classes.alert}severity="error" icon={false}
              action={
                <Tooltip title = "Refresh" arrow>
                  <IconButton onClick={() => window.location.reload()}>
                    <Refresh/>
                  </IconButton>
                </Tooltip>
              }>
                <Typography> You had been disconnected from the room, please refresh the page</Typography>
                </Alert>
              </Collapse>
          </div>
        </div>
      )
    }
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
    is_admin : state.room.is_admin,
    modeName : state.room.modeName,
    event : state.room.event,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    connectToRoom: (roomId, userName,fullName) => {
      dispatch(connectToRoom(roomId, userName,fullName));
    },
    disconnectFromRoom: (message) => {
      dispatch(disconnectFromRoom(message))
    },
    changingMode: (roomId, mode, adminName) => {
      dispatch(changingMode(roomId, mode,adminName))
    },
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Room)));
