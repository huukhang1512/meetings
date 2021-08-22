import React  from 'react';

//Material-UI
import { withStyles } from '@material-ui/core/styles';
import { Grow,Button,Avatar, Divider,
  TextField,Dialog,DialogActions,DialogContent,DialogTitle,
   Popover,ListItem,ListItemText,IconButton,Tooltip, Typography, Card, CardHeader} from '@material-ui/core';
import { MeetingRoom } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import {createRoom} from '../redux/actions/RoomAction';
import { RegisterUserName,logout } from '../redux/actions/UserAction';
import { connect } from 'react-redux';
import { styles } from "../UI_Components/UIComponents"

import Cookies from "js-cookie"
class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      query : "",
      alert : null,
      changeNameAlert : null,
      isDialogOpen: false,
      open : false,
    }

  }
  componentDidMount(){
    document.title = "Meetings - Host better meetings"
    if( Cookies.get("userEmail") === null ){
      if(this.props.fullName === " "){
        this.props.history.push("/register")
      }
    }
  }
  handleDialogClickOpen = (event) => {
    this.setState({changeNameAlert : event.currentTarget, isDialogOpen : true})
  };
  handleDialogClose = () => {
    this.setState({changeNameAlert : null, isDialogOpen : false})
  };
  handleClickOpen = (event) => {
    this.setState({alert : event.currentTarget, open : true})
  };
  handleClose = () => {
    this.setState({alert : null, open : false})
  };

  userNameFirstLetterGetter = (userName) => {
    let res = userName.charAt(0)
    return res.toUpperCase()
  }
  createRoom = (userName)=>{
    if (userName === " "){
      this.props.history.push('/register')
    } else {
      this.props.createRoom(userName)
    }
  }

  joinRoom(){
    this.props.history.push('/join')
  }

  handleChange = event => {
    const query = event.target.value;
    this.setState({query : query.trimLeft()})
  }

  keyPress = event => {
    const query = event.target.value
    if(event.keyCode === 13){
      if(query){
        this.getName(query.trimRight())
        this.handleDialogClose()
      }
    }
  }

  getName(userName){
    if(userName){
      this.props.RegisterUserName(userName)
      this.setState({query : ""});
    }
  }
  logout(){
    this.props.logout()
  }
  renderTextField(){
    const { classes,fullName } = this.props;
    const name = this.userNameFirstLetterGetter(fullName)
    return(
      <div className = {classes.headAvatarContainer}>
        <Tooltip title = "Profile and setting" placement="left">
          <Avatar className ={classes.headAvatar}
            onClick={this.handleClickOpen}>
            {name}
          </Avatar> 
        </Tooltip>
      </div>
    )
  }
  renderLogoutButton(){
    const {isLoggedin,classes} = this.props
    let text = "Log out"
    let hanlder = () => this.logout()
    if(!isLoggedin){
      text = "Register for Meetings"
      hanlder = () => this.props.history.push('/signup')
    }
    return(
      <ListItem button className={classes.members} onClick = {hanlder}>
        <ListItemText primary = {text}></ListItemText>
      </ListItem>
    )
  }
  render(){
    const { classes,fullName,userName, room_joined } = this.props;
    const { alert,query,open,isDialogOpen } = this.state;
    return (
      <div className={classes.root} style={{position : "absolute" }}>
        <div className={classes.appBar}>
          <div className={classes.header}>
            <div className={classes.headerText}>
              <Tooltip title = "Home" arrow>
                <img
                  style={{cursor : 'pointer',objectFit:'contain'}}
                  onClick={()=>{this.props.history.push("/")}}
                  src={process.env.PUBLIC_URL + '/logo1.png'} 
                  alt ="logo" width = "47px"/>
              </Tooltip>
            </div>
          {fullName === " " ? ( null
          ):(
            <div>
              {this.renderTextField()}
            </div>)}
          </div>
        </div>
        <Grow in timeout={1000} >
          <div className={classes.introMode}>
              <div className={classes.introModeChild}>
                <h1 className={classes.headingText}>Host better meetings</h1>
                <Typography variant ="subtitle2" className = {classes.Typography} paragraph>
                Meetings is a free platform that helps to boost the productivity of both online and offline meetings
                </Typography>
                <br/>
                <div className = {classes.roomButtonContainer}>
                  <Button className={classes.button} style ={{margin : 0}}onClick={() => this.createRoom(userName)}>Create Room</Button>
                  <span className = {classes.clashes}>/</span>
                  <Button variant = "text" onClick={() => this.joinRoom()}>Join</Button>
                </div>
              </div>
              <br/>
              <div className={classes.roomJoinedContainer}>
                <h3 className={classes.headingText}>Recent joined rooms</h3>
                {room_joined.length === 0 ? (
                  <Typography className = {classes.Typography}>Create or join a room to filled this section !</Typography>
                  ):(
                <div>
                  {room_joined.map((q, i) => (
                    <div key={i} className={classes.cardContainer}>
                      <Card variant="outlined" className={classes.card}>
                        <CardHeader className={classes.cardHead} 
                        subheader={q} action = {
                          <Tooltip title="Join this room" placement="left">
                            <IconButton onClick={()=>this.props.history.push(`/room/${q}`)}>
                            <MeetingRoom/>
                          </IconButton>
                          </Tooltip>
                        }>
                        </CardHeader>
                      </Card>
                      <span className={classes.breaker}></span>
                    </div>
                  ))}
              </div>)}
            </div>
          </div>
      </Grow>
      <Dialog
          open={isDialogOpen}
          onClose={this.handleDialogClose}
          PaperProps={{
            style: {
              backgroundColor: "#333333",
            },
          }}>
          <DialogTitle style ={{color :"#edeaea"}}> Change your name into...</DialogTitle>
            <DialogContent>
              <TextField
                onChange={this.handleChange}
                onKeyDown = {this.keyPress}
                autoFocus
                id="name"
                placeholder={fullName}
                value = {query}
                variant="standard"
                InputProps={{
                  disableUnderline : true,
                  className : classes.inputName
                }}
                fullWidth></TextField>
            </DialogContent>
            <DialogActions>
              <Button style={{fontWeight : "bolder"}} onClick={() => {
                this.handleDialogClose();this.getName(query.trimRight())}
                } color = "secondary" disabled = {query === ""}>
                Apply
              </Button>
              <Button onClick={()=>{this.handleDialogClose()}} color = "secondary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        <Popover
          anchorEl={alert}
          open = {open}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          PaperProps={{
            style: {
              marginTop : "1%",
              width : "250px",
              backgroundColor: "#F9F9F9",
            },
          }}>
            <div>
              <ListItem className={classes.members}>
                <ListItemText primary = {fullName}></ListItemText>
              </ListItem>
              <Divider></Divider>
              <ListItem button className={classes.members} onClick={this.handleDialogClickOpen}>
                <ListItemText primary = "Change your name"></ListItemText>
              </ListItem>
              {/* {this.renderLogoutButton()} */}
            </div>
            {/* <PopoverActions>
              <Button style={{fontWeight : "bolder"}} onClick={() => {
                this.handleClose();this.getName(query.trimRight())}
                } color = "secondary" disabled = {query === ""}>
                Apply
              </Button>
              <Button onClick={()=>{this.handleClose()}} color = "secondary">
                Cancel
              </Button>
            </PopoverActions> */}
          </Popover>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    fullName : state.user.fullName,
    isLoggedin : state.user.isLoggedin,
    userName : state.user.userName,
    room_joined : state.user.room_joined
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		createRoom : (userName) => {
			dispatch(createRoom(userName));
    },
    RegisterUserName : (userName) =>{
      dispatch(RegisterUserName(userName))
    },
    logout : () => {
      dispatch(logout())
    }
	}
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Home)));
