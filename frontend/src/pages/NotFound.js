import React from 'react';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
const styles = theme => ({
    root: {
        alignItems: "center",
        justifyContent: "center",
        height : "100vh",
        width : "100vw",
        display : "flex",
        background : "#edeaea",
        flexDirection: "column",
    },
    button: {
        background: 'linear-gradient(45deg, #545454 30%, #333333 90%)',
        border: 0,
        margin : 40,
        borderRadius: 10,
        color: '#edeaea',
        height: 50,
        fontWeight: "bolder",
        width: 200,
        padding: '0 25px',
        '&:hover' : {
            boxShadow: '5px 5px 5px 0 rgba(0,0,0,.3)',
        },
    },
})
class NotFound extends React.Component {
    goHome(){
        this.props.history.push('/app')
    }
    render(){
        const { classes } = this.props;
        return(
            <div className={classes.root}>
            <h4>Oops... An error occured or <br/> room not found (404)</h4>
            <Button className={classes.button} onClick={() => this.goHome()}>Home site</Button>
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(NotFound))