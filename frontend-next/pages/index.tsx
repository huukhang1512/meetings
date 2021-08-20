import Head from 'next/head';
import { useRouter } from 'next/router'
import Link from 'next/link';
import React from 'react';
import axios from 'axios';
import styles from '@styles/Home.module.css';
import { StylesProvider } from "@material-ui/core/styles";
import AppBar from "@components/AppBar";
import { Button } from '@material-ui/core'
import { BACKEND_API_URL } from 'utils/config';

export default function Home() {

  const router = useRouter()

  const createRoom = async () => {
    const res = await axios.post(`${BACKEND_API_URL}/createroom`, {userName: "test"})
    router.push(`/room/${res.data.roomid}`)
  }

  return (
    <StylesProvider injectFirst>
      <div className={styles.container}>
        <Head>
          <title>Meetings - Host a better meetings</title>
          <meta name="description" content="Meetings - Host a better meetings" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+Tamma+2&display=swap"></link>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <AppBar></AppBar>
        <main className={styles.main}>
          <div>
            <h1>Host a better meeting</h1>
            <p>Meetings is a free platform that helps to boost the productivity of both online and offline meetings</p>
            <div className={styles.buttonContainer}>
              <Button 
                onClick={createRoom} 
                variant="contained" 
                className={styles.mainButton}>
                Create room
              </Button>
              <p style={{margin: "0 1rem"}}>/</p>
              <Button onClick={() => {router.push("room/139924")}} variant="text" className={styles.secondaryButton}>Join Room</Button>
            </div>
          </div>
        </main>
      </div>
    </StylesProvider>
  )
}
