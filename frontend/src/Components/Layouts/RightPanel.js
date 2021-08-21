import React, { Fragment } from 'react';
import QAMode from '../../Modes/QAMode';
import MeetingQueueMode from '../../Modes/MeetingQueueMode';

export const RightPanel = () => {
  return (
    <Fragment>
      <QAMode />
      <MeetingQueueMode />
    </Fragment>
  );
};
