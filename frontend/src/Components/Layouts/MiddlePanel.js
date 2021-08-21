import React from 'react';
import {} from '@material-ui/core';
import WhiteBoardMode from '../../Modes/WhiteBoardMode';
import { connect } from 'react-redux';
import ParticleComponent from "../ParticleComponent";
const MiddlePanel = (props) => {
    console.log("Middle Render");
    const { emojis } = props
    return (
        <div style={{position:"relative"}}>
            <WhiteBoardMode></WhiteBoardMode>

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