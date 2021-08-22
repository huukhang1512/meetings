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
            <div style={{height:"65vh"}}>
                <WhiteBoardMode></WhiteBoardMode>
            </div>
            <div style={{height:"25vh",width:"100%",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between" ,background:"black"}}>
                <video loop autoPlay muted style={{width:"24%",height:"100%",objectFit:"cover",margin:1}} src="https://res.cloudinary.com/huukhang1512/video/upload/v1629609102/2021-08-22_15-10-29_oxtmsi.mp4" ></video>
                <video loop autoPlay muted style={{width:"24%",height:"100%",objectFit:"cover",margin:1}} src="https://res.cloudinary.com/huukhang1512/video/upload/v1629610551/video_oraf8e.mp4"></video>
                <video loop autoPlay muted style={{width:"24%",height:"100%",objectFit:"cover",margin:1}} src="https://res.cloudinary.com/huukhang1512/video/upload/v1629609860/LT-Zoom-43s_cuppkt.mp4"></video>
                <video autoPlay muted style={{width:"24%",height:"100%",objectFit:"cover",margin:1}} ref={videoRef}/>
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