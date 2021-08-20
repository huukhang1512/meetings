import { Button, TextField, Typography, withStyles, AppBar, Divider, IconButton, CircularProgress } from '@material-ui/core';
// import { InfoOutlined } from '@material-ui/icons';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { signup } from '../redux/actions/UserAction'
import React, { Component } from 'react'
import { styles } from "../UI_Components/UIComponents"
// import Cookies from "js-cookie"
class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
        }
    }

    // Handle Text Field Change
    handleFirstNameChange = (event) => {
        const query = event.target.value
        this.setState({ firstName: query.trimLeft() })
    }
    handleLastNameChange = (event) => {
        const query = event.target.value
        this.setState({ lastName: query.trimLeft() })
    }
    handleEmailChange = (event) => {
        const query = event.target.value
        this.setState({ email: query.trimLeft() })
    }
    handlePasswordChange = (event) => {
        const query = event.target.value
        this.setState({ password: query.trimLeft() })
    }
    handleConfirmPasswordChange = (event) => {
        const query = event.target.value
        this.setState({ confirmPassword: query.trimLeft() })
    }

    handleSubmit = (event) => {
        const { email, firstName, lastName, confirmPassword, password } = this.state
        if (confirmPassword === password) {
            try {
                this.handleSignUp(email, confirmPassword, firstName, lastName)
                event.preventDefault();
            } catch {
                return;
            }
        }
    }

    handleSignUp = (email, password, firstName, lastName) => {
        this.props.signup(email, password, firstName, lastName)
    }

    render() {
        const { classes, error, is_loading } = this.props
        const { email, firstName, lastName, password, confirmPassword } = this.state
        return (
            <div className={classes.root}>
                <AppBar position="fixed" className={classes.appBar} style={{ backgroundColor: "#333333" }}>
                    <div className={classes.headerText}>
                        <img src={process.env.PUBLIC_URL + '/logo2.png'}
                            alt="logo" width="50px" height="50px" style={{ cursor: 'pointer' }} onClick={() => this.props.history.push('/')} />
                        <Divider orientation="vertical" flexItem className={classes.divider} />
                    </div>
                    <div className={classes.headAvatarContainer}>
                        <IconButton style={{ borderRadius: 0 }} onClick={() => this.props.history.push('/signin')}>
                            <Typography variant="body2" className={classes.appBarText} style={{ display: "inline" }}>Sign in</Typography>
                        </IconButton>
                    </div>
                </AppBar>
                <div className={classes.modeContainer}>
                    <form onSubmit={this.handleSubmit} style={{ marginBottom: "5%" }}>
                        <h1 style={{ float: "left" }}>Sign Up</h1>
                        <br />
                        <TextField
                            value={firstName}
                            onChange={this.handleFirstNameChange}
                            className={classes.authenticationTextField}
                            variant="outlined"
                            placeholder="First Name"
                        ></TextField>
                        <br />
                        <TextField
                            value={lastName}
                            onChange={this.handleLastNameChange}
                            className={classes.authenticationTextField}
                            variant="outlined"
                            placeholder='Last Name'></TextField>
                        <br />
                        <TextField
                            value={email}
                            error={error.includes("UsernameExistsException") || error.includes("InvalidParameterException")}
                            helperText={error.includes("UsernameExistsException") || error.includes("InvalidParameterException") ? ("Invalid email address") : (null)}
                            onChange={this.handleEmailChange}
                            className={classes.authenticationTextField}
                            variant="outlined"
                            placeholder='Email'></TextField>
                        <br />
                        <TextField
                            value={password}
                            type="password"
                            error={error.includes("InvalidPasswordException") || error.includes("Invalid length for parameter Password")}
                            helperText={error.includes("InvalidPasswordException")  ? ("Password must have a minimum of 8 characters and contaied both uppercase, lowercase letter and number") : (null)}
                            onChange={this.handlePasswordChange}
                            className={classes.authenticationTextField}
                            variant="outlined"
                            placeholder='Password'></TextField>
                        <br />
                        <TextField
                            value={confirmPassword}
                            error={confirmPassword !== password}
                            helperText={confirmPassword !== password ? ("Password not matched") : (null)}
                            type="password"
                            onChange={this.handleConfirmPasswordChange}
                            className={classes.authenticationTextField}
                            variant="outlined"
                            placeholder='Confirm Password'></TextField>
                        <br />
                        <br />
                        <Button className={classes.button}
                            disabled={is_loading || confirmPassword !== password}
                            style={{ width: "100%", height: 50, margin: "0px" }}
                            type="submit">
                            {is_loading ? (<CircularProgress style={{ color: "#edeaea", width: 30, height: 30 }} />) : ("Sign Up")}</Button>
                    </form>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        error: state.user.error,
        is_loading: state.user.is_loading
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        signup: (email, password, firstName, lastName) => {
            dispatch(signup(email, password, firstName, lastName));
        },
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SignUp)));


