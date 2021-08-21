import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import Tooltip from '@material-ui/core/Tooltip';

const MeetingQueueListItem = (props) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  return (
    <Card
      variant="outlined"
      {...(isSpeaking && { style: { backgroundColor: '#c4f2f2' } })}
    >
      <ListItem>
        <ListItemAvatar>
          <Avatar className={props.classes.avatar}>
            {props.userNameFirstLetter}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={props.userName}
          secondary={isSpeaking ? 'Speaking' : ' '}
        />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => setIsSpeaking((prevState) => !prevState)}
          >
            {isSpeaking ? (
              <Tooltip title="Press to mute">
                <MicIcon />
              </Tooltip>
            ) : (
              <Tooltip title="Press to unmute">
                <MicOffIcon />
              </Tooltip>
            )}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </Card>
  );
};

export default MeetingQueueListItem;
