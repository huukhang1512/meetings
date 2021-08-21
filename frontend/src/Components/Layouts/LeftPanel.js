import React from 'react';
import {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {Avatar, List, ListItem, ListItemText} from '@material-ui/core';
import { styles } from "../../UI_Components/UIComponents"
import Button from "@material-ui/core/Button";
import { AvatarGenerator } from 'random-avatar-generator';
import { sendMessage } from "../../redux/actions/SocketAction"
import ParticleComponent from "../ParticleComponent";
const useStyles = makeStyles(styles)
function LeftPanel(props){
    const [emojiList] = useState(["👍","👎","⏪","⏩","🤔","🥱"])
    const classes = useStyles()
    const { roomId, userName} = props
    const getNewAvatar = () => {
        const generator = new AvatarGenerator()
        return generator.generateRandomAvatar()
    }

    const sendEmoji = (roomId,sender,emoji) => {
        props.sendMessage(roomId, sender, emoji)
    }
    return (
        
        <div style={{height:"100%",position:"relative"}}>
            <List>
                <ListItem className={classes.topDrawer}>
                    <div>
                        <span style={{fontSize: "2em"}}><b><u>Group Members</u></b></span>
                        <br />Or "Nearby Attendees" or some similar thing...
                    </div>
                </ListItem>
                <ListItem className={classes.topDrawer}>
                    <Avatar src={getNewAvatar()}></Avatar>
                    <ListItemText primary={"Person A"} style={{paddingLeft: "10px"}}/>
                </ListItem>
                <ListItem className={classes.topDrawer}>
                    <Avatar src={getNewAvatar()}>B</Avatar>
                    <ListItemText primary={"Person B"} style={{paddingLeft: "10px"}}/>
                </ListItem>
                <ListItem className={classes.topDrawer}>
                    <Avatar src={getNewAvatar()}>C</Avatar>
                    <ListItemText primary={"Person C"} style={{paddingLeft: "10px"}}/>
                </ListItem>
            </List>
            <hr />
            <List>
                <ListItem divider className={classes.topDrawer} style={{display:"flex"}}>
                    <Button variant="contained" color="primary" style={{width:"50%"}}>Create Group</Button>
                    <Button variant="contained" color="primary" style={{width:"50%",marginLeft:"5px"}}>Switch Group</Button>
                </ListItem>
                <ListItem divider className={classes.topDrawer} style={{display:"flex"}}>
                    <Button variant="contained" color="secondary" style={{width:"100%"}}>Leave Group</Button>
                </ListItem>
                <ListItem className={classes.topDrawer} style={{justifyContent : "center"}}>
                    <b>Your Group ID: &lt;GROUP_ID&gt;</b>
                </ListItem>
            </List>
            <hr />
            <div className={classes.bottomNav}>
                <h2>Reaction</h2>
                <List>
                    {emojiList.map((emoji,i) => (
                        <Button key={i} onClick={() => sendEmoji(roomId,userName,emoji)} style={{fontSize:25}}>{emoji}</Button>
                    ))}
                </List>
                <Button onClick={() => sendEmoji(roomId,userName,"❤️")} style={{width: "100%",fontSize:25}}>❤️</Button>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        roomId: state.room.roomId,
        userName: state.user.userName,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        sendMessage: (roomId, sender, message) => {
            dispatch(sendMessage(roomId, sender, message))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LeftPanel)