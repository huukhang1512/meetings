import React, { useState, useEffect,useRef } from 'react';
import {} from '@material-ui/core';
import WhiteBoardMode from '../../Modes/WhiteBoardMode';
import { connect } from 'react-redux';
import ParticleComponent from "../ParticleComponent";
const MiddlePanel = (props) => {
    const videoRef = useRef(null);

    const getVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: { width: 300 } })
        .then(stream => {
          let video = videoRef.current;
          video.srcObject = stream;
          video.play();
        })
        .catch(err => {
          console.error("error:", err);
        });
    };
    useEffect(() => {
        getVideo()
    })
    const { emojis } = props
    return (
        <div style={{position:"relative"}}>
            <div style={{height:"75vh"}}>
                <WhiteBoardMode></WhiteBoardMode>
            </div>
            <div style={{height:"20vh",width:"100%",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between" ,background:"black"}}>
                <video autoPlay muted style={{width:"25%",height:"90%"}} src="https://res.cloudinary.com/huukhang1512/video/upload/v1614820927/Meetings_-_Host_better_meetings_3_dxtxvv.mp4" ></video>
                <video autoPlay muted style={{width:"25%",height:"90%"}} src="https://res.cloudinary.com/huukhang1512/video/upload/v1614820927/Meetings_-_Host_better_meetings_3_dxtxvv.mp4"></video>
                <video autoPlay muted style={{width:"25%",height:"90%"}} src="https://res.cloudinary.com/huukhang1512/video/upload/v1614820927/Meetings_-_Host_better_meetings_3_dxtxvv.mp4"></video>
                <video autoPlay muted style={{width:"25%",height:"90%",objectFit:"cover"}} ref={videoRef}/>
            </div>
            {emojis.map((emoji,index) => (
                <ParticleComponent emoji={emoji.content.message} key={index}/>
            ))}
        </div>
    )

}

const mapStateToProps = (state) => {
    return {
        emojis: state.room.messages
    }
}
export default connect(mapStateToProps)(MiddlePanel)