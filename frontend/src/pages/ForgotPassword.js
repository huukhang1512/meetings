import { Button, TextField, Typography, withStyles, AppBar, Divider, IconButton, CircularProgress, Link } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { forgotPassword, forgotPasswordConfirm } from "../redux/actions/UserAction";
import React, { Component } from 'react'
import queryString from "query-string"
import { styles } from "../UI_Components/UIComponents"
class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            confirmationCode: "",
            password: "",
            codeSent: false,
            confirmPassword: "",
        }
    }
    handleNameChange = (event) => {
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
        const { email,confirmPassword,confirmationCode } = this.state
        if(confirmationCode){
            this.handleforgotPasswordConfirm(email,confirmPassword,confirmationCode)
        } else {
            this.handleForgotPassword(email);
        }
        event.preventDefault();
    }

    handleForgotPassword = (email) => {
        const {is_loading} = this.props
        this.props.forgotPassword(email)
        is_loading ? this.setState({codeSent : false}) : this.setState({codeSent : true})

    }

    handleforgotPasswordConfirm = (userName,newPassword,confirmationCode) => {
        this.props.forgotPasswordConfirm(userName,newPassword,confirmationCode)
    }

    renderButton = () => {
        const { confirmPassword,password,confirmationCode } = this.state
        const { classes,is_loading } = this.props
        let message = "Send Instruction"
        confirmationCode ? (message = "Confirm change password") : (message = "Send Instruction")
        return (
            <Button className={classes.button}
                disabled = {message === "Confirm change password" && confirmPassword !== password}
                style={{width : "100%", margin : "10px 0px"}}
                type="submit">{is_loading ? (<CircularProgress style={{ color: "#edeaea", width: 30, height: 30 }} />):(message)}
            </Button>
        )
    }
    componentDidMount(){
        const email = queryString.parse(this.props.location.search).email
        const verificationCode = queryString.parse(this.props.location.search).verificationCode
        if(email && verificationCode){
            this.setState({
                email : email,
                confirmationCode: verificationCode
            })
        }
    }
    render() {
        const { classes } = this.props
        const { email, confirmationCode, password,codeSent, confirmPassword } = this.state
        return (
            <div className={classes.root}>
                <AppBar position="fixed" className={classes.appBar} style={{ backgroundColor: "#333333" }}>
                    <div className={classes.headerText}>
                        <img src={process.env.PUBLIC_URL + '/logo2.png'}
                            alt="logo" width="50px" height="50px" style={{ cursor: 'pointer' }} onClick={() => this.props.history.push('/')} />
                        <Divider orientation="vertical" flexItem className={classes.divider} />
                    </div>
                    <div className={classes.headAvatarContainer}>
                        <IconButton style={{ borderRadius: 0, display: "inline" }} onClick={() => this.props.history.push('/signin')}>
                            <Typography variant="body2" className={classes.appBarText} style={{ display: "inline" }}>Sign In</Typography>
                        </IconButton>
                    </div>
                </AppBar>
                <div className={classes.modeContainer}>
                    <form onSubmit={this.handleSubmit} style={{ marginBottom: "5%" }}>
                        <h2 style={{ float: "left" }}>Recover your password</h2>
                        <br />
                        {confirmationCode ? (
                            <div>
                                <TextField
                                    value={password}
                                    type="password"
                                    // error={error.includes("InvalidPasswordException") || error.includes("Invalid length for parameter Password")}
                                    // helperText={error.includes("InvalidPasswordException")  ? ("Password must have a minimum of 6 characters and contaied both uppercase, lowercase letter and number") : (null)}
                                    onChange={this.handlePasswordChange}
                                    className={classes.authenticationTextField}
                                    variant="outlined"
                                    placeholder='New Password'></TextField>
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
                                {this.renderButton()}
                            </div>
                        ) : (
                            codeSent ? (
                                <div>
                                    <Alert className={classes.authenticationTextField} severity="success">An email has been sent to {email} that contain the instruction to reset password</Alert>
                                    <br/>
                                    <Link style= {{color : "#333333", float : "right", cursor : "pointer", margin : "10px 3px"}} onClick={()=> this.handleForgotPassword(email)}>Resend Code</Link>
                                </div>
                            ):(
                                <div>
                                    <TextField
                                        value={email}
                                        onChange={this.handleNameChange}
                                        className={classes.authenticationTextField}
                                        variant="outlined"
                                        placeholder='Enter your email address here'>
                                    </TextField>
                                <br />
                                {this.renderButton()}
                            </div>
                            )
                        )}
                    </form>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        email : state.user.email,
        is_loading : state.user.is_loading
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        forgotPassword: (userName) => {
            dispatch(forgotPassword(userName))
        },
        forgotPasswordConfirm : (userName,newPassword,confirmationCode) => {
            dispatch(forgotPasswordConfirm(userName,newPassword,confirmationCode))
        },
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ForgotPassword)));

