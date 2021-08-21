import React from 'react';
import {} from '@material-ui/core';
import QAMode from "../../Modes/QAMode"
export const RightPanel = () => {
    console.log("Right Render");

    return (
        <div>
            <QAMode></QAMode>
            <h1>Right Panel</h1>
        </div>
    )

}