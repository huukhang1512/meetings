import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react';
import styles from '@styles/Home.module.css'
import AppBar from "@components/AppBar"
import { StylesProvider } from "@material-ui/core/styles";
import axios from 'axios';
import { BACKEND_API_URL } from 'utils/config';
import { Button } from '@material-ui/core'
import { NextPage } from 'next'
type Question = {
    question : QuestionContent,
    question_id : String | Number,
}
type QuestionContent = {
    question : String,
    fullName : String,
    userName : String,
}
interface Props {
    questions : Question[]
}
const Room = (props:Props) => {
    const router = useRouter()
    let roomId:Number =  Number(router.query.roomid)

    return (
        <StylesProvider injectFirst>
            <div className={styles.container}>
                <Head>
                    <title>Meetings - Room {roomId}</title>
                    <meta name="description" content="Meetings - Host a better meetings" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+Tamma+2&display=swap"></link>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <AppBar roomId={roomId}></AppBar>
                <main className={styles.main}>
                    <div>
                        {props.questions.map((q) => {
                            return (
                                <div key={q.question_id}>
                                    <p>{q.question.fullName}</p>
                                    <p>{q.question.question}</p>
                                </div>
                            )
                        })}
                    </div>
                </main>
            </div>
        </StylesProvider>
    )
}
export async function getServerSideProps(context){
    const roomId = context.params.roomid
    let questions = []
    const res = await axios.get(`${BACKEND_API_URL}/getquestions/${roomId}`)
    questions = await res.data

    return {
        props: {
            questions: questions
        }
    }
  }
export default Room