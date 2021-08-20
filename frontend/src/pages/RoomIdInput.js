import React  from 'react';

//Material-UI
import { withStyles } from '@material-ui/core/styles';
import {Button,TextField,Grow} from '@material-ui/core';

import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import {styles} from "../UI_Components/UIComponents"
class RoomIdInput extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      query : "",
      disabled : false, //Use to disable the join button in case the input field is empty
    }
  }
  handleChange = event => {
    const query = event.target.value;
    if (!query){
      this.setState({query, disabled : false})
    } else {
      this.setState({ query, disabled : true })
    }  
  }
  keyPress = event => {
    const query = event.target.value
    if(event.keyCode === 13){
      if(!query){
        this.setState({disabled : false});
      } else {
          this.setState({disabled : false});
          this.joinRoom(query);
        }
      }
   }
  joinRoom(roomid){
    const {disabled} = this.state
    if(disabled){
      this.props.history.push(`/room/${roomid}`)
    }
  }
  render(){
    const { classes } = this.props;
    const { query } = this.state;
    return (
      <div className={classes.root}>
        <Grow in>
        <div className={classes.inputField}>
          <TextField 
            value={query} 
            onChange={this.handleChange}
            onKeyDown = {this.keyPress}
            InputProps={{
              disableUnderline: true,
              className : classes.inputId
            }}
            placeholder='Enter Room ID here...'>
          </TextField>
          <br/>
          <div>
            <Button variant = "text" className={classes.button} onClick={() => {this.joinRoom(query)}}>Join</Button>
          </div>
        </div>
        </Grow>
        <div>
          <div className={classes.bottomNav}>
            <img onClick={()=> this.props.history.push('/')} 
              className = {classes.idInputLogo} 
              src={process.env.PUBLIC_URL + '/logo1.png'} 
              alt ="logo" width = "50px"/>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userName : state.user.userName,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
	}
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(RoomIdInput)));
