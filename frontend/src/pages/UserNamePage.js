import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {Button,TextField,Grow} from "@material-ui/core/";
import { withRouter } from "react-router-dom";
// redux
import { connect } from 'react-redux';
import { RegisterUserName } from '../redux/actions/UserAction';
import {styles} from "../UI_Components/UIComponents"
class UserNamePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
    };
  } 
  handleChange = e => {
    const query = e.target.value
    this.setState({query : query.trimLeft()}) // disable the first space
  }
  
  keyPress = event => {
    if(event.key === "Enter"){
      const query = event.target.value
      this.getName(query.trimRight());
    }
  }

  getName = (userName) => {
    const {query} = this.state
    if (query){
      this.props.RegisterUserName(userName);
      this.props.history.goBack()
    }
  }
  render() {
    const { classes } = this.props;
    const { query } = this.state;
    return (
      <div className={classes.root}>
        <Grow in>
        <div className={classes.inputField}>
          <TextField 
            value={query} 
            onChange={this.handleChange}
            onKeyUp={this.keyPress}
            InputProps={{
              disableUnderline: true,
              className : classes.inputId
            }}
            placeholder='Input your name here...'>
          </TextField>
          <br/>
          <Button className={classes.button} onClick={(event) => {this.getName(query.trimRight()); event.preventDefault()}}>Proceed</Button>
        </div>
        </Grow>
      </div>
      );
    }
  }

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
    RegisterUserName : (userName) =>{
        dispatch(RegisterUserName(userName))
    },
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UserNamePage)));