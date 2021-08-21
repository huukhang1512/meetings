import React from 'react';
import {Avatar, List, ListItem, ListItemText} from '@material-ui/core';
import { styles } from "../../UI_Components/UIComponents"
import Button from "@material-ui/core/Button";

export const LeftPanel = () => {
    return (
        <div>
            <List>
                <ListItem className={styles.topDrawer}>
                    <div>
                        <span style={{fontSize: "2em"}}><b><u>Group Members</u></b></span>
                        <br />Or "Nearby Attendees" or some similar thing...
                    </div>
                </ListItem>
                <ListItem className={styles.topDrawer}>
                    <Avatar>A</Avatar>
                    <ListItemText primary={"Person A"} style={{paddingLeft: "10px"}}/>
                </ListItem>
                <ListItem className={styles.topDrawer}>
                    <Avatar>B</Avatar>
                    <ListItemText primary={"Person B"} style={{paddingLeft: "10px"}}/>
                </ListItem>
                <ListItem className={styles.topDrawer}>
                    <Avatar>C</Avatar>
                    <ListItemText primary={"Person C"} style={{paddingLeft: "10px"}}/>
                </ListItem>
            </List>
            <hr />
            <List>
                <ListItem class={styles.topDrawer}>
                    <Button variant="primary"  color="primary">Create New Group</Button>
                    <Button variant="primary"  color="primary">Switch Groups</Button>
                    <Button variant="danger" color="danger">Leave Group</Button>
                </ListItem>
                <ListItem class={styles.topDrawer}>
                    <b>Your Group ID: &lt;GROUP_ID&gt;</b>
                </ListItem>
            </List>
            <hr />
            <List>
                <Button>👍</Button>
                <Button>👎</Button>
                <Button>Too Fast!</Button>
                <Button>Too Slow!</Button>
                <Button>Intersting</Button>
                <Button>Boring</Button>
                <Button>&lt;Heart&gt;</Button>
            </List>
        </div>
    )

}