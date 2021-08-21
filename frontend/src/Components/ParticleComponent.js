import React from "react";

export class ParticleComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emoji: "",
            x: 0,
            y: 0
        };
        setInterval(this.tick, 10)
    }

    render() {
        this.state.setState({x: this.state.x + 1})
        return <div style={{display: "fixed", left: this.state.x, bottom: this.state.y}}>{this.state.emoji}</div>;
    }

    tick() {
        this.state.setState({ y: this.state.y + 1});
        if (this.state.y > 640) {
            this.componentWillUnmount();
        }
    }
}