import React from 'react';

//Material-UI
import { withStyles } from '@material-ui/core/styles';
import { Divider, IconButton,AppBar,Tooltip,Typography,Grow ,Button,
    ListItemText,ListItem,Drawer,Container,Link} from "@material-ui/core";
import { Menu, Close, LinkedIn,Mail } from '@material-ui/icons/';
import { withRouter } from 'react-router-dom';
import { createRoom } from '../redux/actions/RoomAction';

import { RegisterUserName } from '../redux/actions/UserAction';
import { connect } from 'react-redux';
import { styles } from "../UI_Components/UIComponents"


class LandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            up : false,
            items : ["Feature","About"]
        }
        this.top = React.createRef();
        this.feature = React.createRef();
        this.about = React.createRef();
    }
    handleOnClickScroll = (content) => {
        if (content === "Feature"){
            this.feature.current.scrollIntoView({ 
                behavior: "smooth",
            });
        } else if (content === "About"){
            this.about.current.scrollIntoView({ 
                behavior: "smooth",
            });
        } else if (content === "Top"){
            this.top.current.scrollIntoView({ 
                behavior: "smooth",
            });
        }
    }
    componentDidMount() {
        const { userName } = this.props;
        if (userName !== " " && window.location.pathname !== "/index") {
            this.props.history.push('/app')
        }
    }
    toggleDrawer = open => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        this.setState({ up: open });
      };
    renderButton(){
        const { classes,userName } = this.props;
        let title = "Get started"
        let handler = () => {this.props.history.push("/register")}
        if(userName !== " "){
            title = "Go to the application"
            handler = () => {this.props.history.push("/app")}
        } 
        return(
            <Button className={classes.redirectButton} variant ="contained" onClick={handler}>
                <Typography variant="subtitle2">{title}</Typography>
            </Button>
        )
    }
    render() {
        const { classes,userName } = this.props;
        const { up,items } = this.state;
        return (
            <div className={classes.root} style={{ position: "absolute" }}>
                <AppBar position="fixed" className = {classes.appBar} style = {{backgroundColor : "#333333"}}>
                <Drawer anchor="top" open = {up} onClose={this.toggleDrawer(false)} style ={{color: "#333333"}}
                classes={{ paper: classes.drawer }}>
                    <ListItem className={classes.topDrawer}>
                    <ListItemText primary = {<Typography variant="h5">Navigation</Typography>} style={{fontWeight :"bold"}}></ListItemText>
                    <Tooltip title = "Close" arrow>
                        <IconButton onClick={this.toggleDrawer(false)}>
                            <Close style ={{color : "#edeaea"}}/>
                        </IconButton>
                    </Tooltip>
                    </ListItem>
                    {items.map((f,i)=>(
                        <ListItem button className={classes.members} key={i} style={{paddingRight : 40}} onClick={()=>this.handleOnClickScroll(f)}>
                            <ListItemText primary = {<Typography variant="subtitle1">{f}</Typography>}>
                            </ListItemText>
                        </ListItem>
                    ))}
                    {userName === " " ? (
                            <ListItem button className={classes.members} style={{paddingRight : 40}} onClick={()=>this.props.history.push('/register')}>
                               <ListItemText primary = {<Typography variant="subtitle1">Get started</Typography>}>
                               </ListItemText>
                           </ListItem>
                        ) : (
                            <ListItem button className={classes.members} style={{paddingRight : 40}} onClick={()=>this.props.history.push('/app')}>
                                <ListItemText primary = {<Typography variant="subtitle1">Go to application</Typography>}>
                                </ListItemText>
                            </ListItem>
                        )}
                    </Drawer>

                    <div className = {classes.headerText}>
                        <img src={process.env.PUBLIC_URL + '/logo2.png'} 
                        alt ="logo" width = "50px" height = "50px" style={{cursor : 'pointer'}} onClick ={() => this.handleOnClickScroll("Top")}/>
                        <Divider orientation="vertical" flexItem className={classes.divider} />
                        {items.map((f,i)=>(
                            <IconButton style={{borderRadius : 0}} key ={i} onClick={()=>this.handleOnClickScroll(f)}>
                                <Typography variant="body2" className ={classes.appBarText}>{f}</Typography>
                            </IconButton>
                        ))}
                    </div>
                    <div className ={classes.headAvatarContainer} style = {{}}>
                        {/* {!isLoggedin? (
                        <React.Fragment>
                            <IconButton style={{borderRadius : 0}} onClick={() => this.props.history.push('/signin')}>
                                <Typography variant="body2" className ={classes.appBarText} >Sign In</Typography>
                            </IconButton>
                            <IconButton style={{borderRadius : 0}} onClick={() => this.props.history.push('/signup')}>
                                <Typography variant="body2" className ={classes.appBarText} >Sign Up</Typography>
                            </IconButton></React.Fragment>): ( */}
                            {/* <IconButton style={{borderRadius : 0}} onClick={()=>this.props.history.push('/app')}>
                                <Typography variant="body2" className ={classes.appBarText}>Go to application</Typography>
                            </IconButton> */}
                            {/* )} */}
                        <IconButton onClick={this.toggleDrawer(true)} className ={classes.menuButton}>
                            <Menu/>
                        </IconButton>
                    </div>
                </AppBar>
                <div >
                    <Grow in >
                    <Container className={classes.container} ref = {this.top}>
                        <Typography className={classes.headingText} style = {{textAlign : "center"}}variant ="h3">Host better meetings.</Typography>
                        <br/>
                        <Typography variant ="subtitle1">The platform to support the physical and remote meetings with different modes</Typography>
                        <br/>
                        {this.renderButton()}
                    </Container>
                    </Grow>
                    <div className={classes.featureContainer} ref={this.feature}>
                        <Grow in timeout={1000} >
                            <div className={classes.introMode}>
                                <div className={classes.introModeChild}>
                                    <Typography className={classes.headingText} align="left"variant ="h5">Take turns when speaking</Typography>
                                    <br/>
                                    <Typography variant ="subtitle1" align="justify" paragraph>
                                    This mode would organize participants to take turns when talking, whoever hit button raise first will speak first. To get started with this mode, create a room, and choose "Speak in queue" mode.
                                    </Typography>
                                </div>
                                <div>
                                    <video className={classes.modeDemo} src="https://res.cloudinary.com/huukhang1512/video/upload/v1614820926/Meetings_-_Host_better_meetings_fivncy.mp4" autoPlay loop muted></video>
                                </div>
                            <br/>
                            </div>
                        </Grow>
                        <Grow in timeout={2000}>
                            <div className={classes.introMode}>
                                <div className={classes.introModeChild}>
                                    <Typography className={classes.headingText} align="left" variant ="h5">Q&A section with ease</Typography>
                                    <br/>
                                    <Typography variant ="subtitle1" paragraph align="justify">
                                    Organize a Q&A section where everyone have a chance to ask without worries, with their name attached or totally anonymously. To get started with this mode, create a room, and choose "Q&A" mode.
                                    </Typography>
                                </div>
                                <div>
                                    <video className={classes.modeDemo} src="https://res.cloudinary.com/huukhang1512/video/upload/v1614820927/Meetings_-_Host_better_meetings_3_dxtxvv.mp4" autoPlay loop muted></video>
                                </div>
                            <br/>
                            </div>
                        </Grow>
                        <Grow in timeout={2500}>
                            <div className={classes.introMode}>
                                <div className={classes.introModeChild}>
                                    <Typography className={classes.headingText} align="left"variant ="h5">Interactive real-time whiteboard - better brainstorming</Typography>
                                    <br/>
                                    <Typography variant ="subtitle1" paragraph align="justify">
                                    Missing the whiteboard on your company? We here to provide a collaborative real-time whiteboard for your better brainstroming section! Choosing whiteboard mode after the room created to get started.
                                    </Typography>
                                </div>
                                <div >
                                    <video className={classes.modeDemo} src="https://res.cloudinary.com/huukhang1512/video/upload/v1614820927/Meetings_-_Host_better_meetings_2_flwj2g.mp4" autoPlay loop muted></video>
                                </div>
                            <br/>
                            </div>
                        </Grow>
                    </div>
                    <div className={classes.aboutContainer} ref={this.about}>
                        <div className={classes.about}>
                            <Typography align="left" variant ="h5">About this page</Typography>
                            <br/>
                            <Divider/>
                            <Typography align="left" variant ="subtitle1">
                                Author : Huu Khang Nguyen 
                                <span>
                                    <IconButton>
                                        <Link href="https://www.linkedin.com/in/huukhang1512/">
                                            <LinkedIn></LinkedIn>
                                        </Link> 
                                    </IconButton>
                                    <IconButton>
                                        <Link href="mailto:huukhang1512@gmail.com">
                                            <Mail>
                                            </Mail>
                                        </Link>
                                    </IconButton>
                                </span>
                            </Typography>
                            <Typography align="left" variant ="subtitle1">Advisors & Supporter : Vy Vy, Thanh Nhan Pham, Huu Tri Nguyen</Typography>
                            <Typography align="left" variant ="subtitle2">Special thanks to my advisors and supporters, without you this app may not be completed.</Typography>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        userName: state.user.userName,
        isLoggedin : state.user.isLoggedin
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        createRoom: (userName) => {
            dispatch(createRoom(userName));
        },
        RegisterUserName: (userName) => {
            dispatch(RegisterUserName(userName))
        },
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LandingPage)));
