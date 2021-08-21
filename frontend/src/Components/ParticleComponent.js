import React from "react";
import { Fragment } from "react";

class ParticleComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOngoing:true,
            x: 0,
            y: 0
        };
    }
    tick = () => {
        const {y} = this.state
        this.setState({ y: y + 1});
        if (y > 640) {
            this.setState({isOngoing : false})
        }
    }
    componentDidMount(){
        this.setState({x: this.state.x + 1})
        setInterval(this.tick, 10)
        console.log(this.props.emoji)
    }
    render() {
        const { isOngoing } = this.state;
        return (
            <Fragment>
                {(isOngoing) ? (
                    <div style={{zIndex:2000,fontSize: "45px" ,position: "absolute",right: 0, bottom: this.state.y}}>
                        {this.props.emoji}
                    </div> ) : null
                }
            </Fragment>
        );
    }
  
}
export default ParticleComponent