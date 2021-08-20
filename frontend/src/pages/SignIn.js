import { Button, TextField, Typography, withStyles, AppBar, Divider,IconButton,Link,CircularProgress } from '@material-ui/core';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { signin } from '../redux/actions/UserAction'
import React, { Component } from 'react'
import { styles } from "../UI_Components/UIComponents"

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            password: ""
        }
    }
    handleNameChange = (event) => {
        const query = event.target.value
        this.setState({ userName: query.trimLeft() })
    }
    handlePasswordChange = (event) => {
        const query = event.target.value
        this.setState({ password: query.trimLeft() })
    }

    handleSubmit = (event) => {
        const { userName, password } = this.state
        this.handleSignIn(userName, password);
        event.preventDefault();
    }

    handleSignIn = (userName, password) => {
        this.props.signin(userName, password)
    }

    render() {
        const { classes,error,is_loading } = this.props
        const { userName, password } = this.state
        return (
            <div className={classes.root}>
                <AppBar position="fixed" className = {classes.appBar} style = {{backgroundColor : "#333333"}}>
                    <div className = {classes.headerText}>
                        <img src={process.env.PUBLIC_URL + '/logo2.png'} 
                        alt ="logo" width = "50px" height = "50px" style={{cursor : 'pointer'}} onClick ={() => this.props.history.push('/')}/>
                        <Divider orientation="vertical" flexItem className={classes.divider} />
                    </div>
                    <div className ={classes.headAvatarContainer}>
                        <IconButton style={{borderRadius : 0}} onClick={() => this.props.history.push('/signup')}>
                            <Typography variant="body2" className ={classes.appBarText} style={{display : "inline"}}>Sign Up</Typography>
                        </IconButton>
                    </div>
                </AppBar>
                <div className={classes.modeContainer}>
                    <form onSubmit={this.handleSubmit} style={{ marginBottom : "5%"}}>
                        <h1 style={{float : "left"}}>Sign In</h1>
                        <br/>
                        <TextField
                            value={userName}
                            onChange={this.handleNameChange}
                            className={classes.authenticationTextField}
                            variant="outlined"
                            error = {error.includes("Incorrect username or password")}
                            helperText= {error.includes("Incorrect username or password") ? ("Incorrect username or password") : (null)}
                            placeholder='Email address'></TextField>
                        <br />
                        <TextField
                            value={password}
                            type="password"
                            className={classes.authenticationTextField}
                            onChange={this.handlePasswordChange}
                            variant="outlined"
                            error = {error.includes("Incorrect username or password")}
                            helperText= {error.includes("Incorrect username or password") ? ("Incorrect username or password") : (null)}
                            placeholder='Password'></TextField>
                        <br />
                        <Link style= {{color : "#333333", float : "right", cursor : "pointer", margin : "15px 3px"}} onClick={()=> this.props.history.push("/forgotpassword")}>Forgot password ?</Link> 
                        <br />
                        <Button className={classes.button}
                            disabled ={is_loading}
                            style={{width : "100%", height : 50, margin : "0px"}}
                            type="submit">
                            {is_loading ? (<CircularProgress style={{color : "#edeaea", width : 30, height : 30}}/>):("Sign In")}
                        </Button>
                        <br/>
                    </form>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        error : state.user.error,
        is_loading : state.user.is_loading
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        signin: (userName, password) => {
            dispatch(signin(userName, password));
        }
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SignIn)));


