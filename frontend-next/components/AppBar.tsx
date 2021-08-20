import Link from 'next/link'
import React from 'react';
import styles from '@styles/Home.module.css'
import { Avatar,Typography } from '@material-ui/core'
interface props {
    roomId?: Number
}
const AppBar = (props:props) => {
    const getFirstLetterInName = (name) =>{
        return name.charAt(0).toUpperCase()
    }
    return (
        <div className={styles.appBar}>
            <Link href="/">
                <div className={styles.headerText}>
                    <img 
                        src='/logo2.png'
                        alt ="logo" width = "47px" height = "47px"/>
                    <Typography style ={{margin : "14px 4px",fontWeight: "bolder"}}>{props.roomId}</Typography>
                </div>
            </Link>
            <Avatar className={styles.headAvatar}>{getFirstLetterInName("test")}</Avatar>
        </div>
    )
}
export default AppBar