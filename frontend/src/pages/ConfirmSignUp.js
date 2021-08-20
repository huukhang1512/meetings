import { Button, TextField, Typography, withStyles, AppBar, IconButton, Divider, Link, Collapse, CircularProgress } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { confirm, resendCode } from '../redux/actions/UserAction';
import Cookies from "js-cookie"
import React, { Component } from 'react'
import { styles } from "../UI_Components/UIComponents"
class ConfirmSignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: Cookies.get("email"),
            verfificationCode: "",
            sent: false,
        }
    }
    handleNameChange = (event) => {
        const query = event.target.value
        this.setState({ email: query.trimLeft() })
    }
    handleCodeChange = (event) => {
        const query = event.target.value
        this.setState({ verfificationCode: query.trimLeft() })
    }

    handleSubmit = (event) => {
        const { email, verfificationCode } = this.state
        this.handleConfirm(email, verfificationCode);
        event.preventDefault();
    }

    handleResend = (email) => {
        this.props.resendCode(email)
        this.setState({ sent: true})
    }
    handleConfirm = (email, verfificationCode) => {
        this.props.confirm(email, verfificationCode)
    }

    render() {
        const { classes,is_loading, error } = this.props
        const { email, verfificationCode,sent } = this.state
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
                        <h2 style={{ float: "left" }}>Confirm your account</h2>
                        <br />
                        <TextField
                            value={email}
                            onChange={this.handleNameChange}
                            className={classes.authenticationTextField}
                            variant="outlined"
                            placeholder='Email address'></TextField>
                        <br />
                        <TextField
                            value={verfificationCode}
                            className={classes.authenticationTextField}
                            onChange={this.handleCodeChange}
                            variant="outlined"
                            //CodeMismatchException
                            error = {error.includes("CodeMismatchException") || error.includes("ExpiredCodeException")}
                            helperText= {error.includes("CodeMismatchException") || error.includes("ExpiredCodeException") ? ("Wrong verification code or code expired") : (null)}
                            placeholder='Verfification code'></TextField>
                        <br />
                        <Link style={{ color: "#333333", float: "right", cursor: "pointer", margin: "15px 3px" }} onClick={() => this.handleResend(email)}>Resend Verification Code</Link>
                        <br />
                        <Button className={classes.button}
                            disabled={is_loading}
                            style={{ width: "100%", height: 50, margin: "0px" }}
                            type="submit">
                            {is_loading ? (<CircularProgress style={{ color: "#edeaea", width: 30, height: 30 }} />) : ("Verify")}</Button>
                    </form>
                </div>
                <div className={classes.bottomNav}>
                    <Collapse in={sent}>
                        <Alert className={classes.alert} severity="success"
                            action={
                                <Button onClick={() => this.handleResend(email)} variant ="text">
                                    <Typography variant="subtitle1">Resend</Typography>
                                </Button>
                            }>
                            <Typography>We have resend the verification code to your email</Typography>
                        </Alert>
                    </Collapse>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        error : state.user.error,
        is_loading: state.user.is_loading
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        confirm: (email, code) => {
            dispatch(confirm(email, code));
        },
        resendCode: (userName) => {
            dispatch(resendCode(userName));
        }
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ConfirmSignUp)));


