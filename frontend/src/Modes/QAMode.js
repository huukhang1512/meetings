import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { withRouter } from "react-router-dom";
import { AvatarGenerator } from 'random-avatar-generator';
// redux
import { connect } from 'react-redux';
import { addQuestion,removeQuestion} from '../redux/actions/SocketAction';
//UI
import {Typography,Avatar,Checkbox,IconButton,Tooltip,Card,CardContent,
CardHeader,Dialog, DialogTitle,DialogActions,Button} from '@material-ui/core';
import {Send,Delete} from '@material-ui/icons/';
import {styles} from "../UI_Components/UIComponents";
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as toxicity from '@tensorflow-models/toxicity';
import {throttle} from "lodash"
class QAMode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      checked : true,
      threshold: 0.7,
      model : null,
      alert: false,
    };
  }

  loadTheModel = async () => {
    const {threshold} = this.state
    await tf.setBackend('webgl')
    await tf.ready();
    let model = await toxicity.load(threshold)
    this.setState({model : model})
  }
  identifyToxic = async (query) => {
    const {model} = this.state
    let toxicIdentified = false
    await model.classify([query]).then(predictions => {
      predictions.forEach((prediction) => {
        if(prediction.results[0].match === true){
          toxicIdentified = true
          this.setState({alert : true})
          setTimeout(() => this.handleClose(),4000)
        } else {
          toxicIdentified = false
          this.setState({alert : false})
        }
      })
    });
    return toxicIdentified
  }
  async componentDidMount(){
    await this.loadTheModel()
  }
  getQuestionsAskedbyId = (question_Id) => {
    this.props.getQuestionsAskedbyId(question_Id)
  } 
  userNameFirstLetterGetter = (userName) => {
    var res = userName.charAt(0)
    return res.toUpperCase()
  }
  handleChange = e => {
    const query = e.target.value;
    this.setState({ query })
  }
  handleCheck = e => {
    this.setState({
      checked : e.target.checked
    }) 
  }
  handleClose = () => {
    this.setState({alert : false})
  }
  handleKeyPress = e => {
    const roomId = this.props.match.params.roomId;
    const {userName} = this.props
    const query = e.target.value
    if(e.keyCode===13 && e.ctrlKey){ 
      if(!query){
      } else {
        this.askQuestion(roomId,query,userName);
      }
    }
  }

  askQuestion = async (roomId, questions) =>{
    let user = "Anonymous"
    const {checked,query} = this.state
    const questionObj = {
      question : questions,
      userName : this.props.userName,
      fullName : this.props.fullName
    }
    let isToxic = await this.identifyToxic(query)
    if(query){
      if(!isToxic){
        if(!checked){
          this.props.addQuestion(roomId, questionObj);
        } else {
          questionObj.fullName = user
          this.props.addQuestion(roomId, questionObj);
        }
        this.setState({query : ""})
      }
    }
   
  }
  getNewAvatar = (name) => {
    const generator = new AvatarGenerator()
    if(name === "Anonymous"){
        return generator.generateRandomAvatar()
    } else {
        return null
    }
}
  
  deleteQuestion = throttle((roomId,question_id)=>{
    this.props.removeQuestion(roomId,question_id)
  },500,{trailing: false})

  render() {
    const { classes, questions,is_admin,questionsAsked } = this.props;
    const { query,checked,alert } = this.state;
    const roomId = this.props.match.params.roomId;
    return (
      <div style={{height:"50%"}}>
      <div className={classes.mappingItemContainer}>
        <div>
          {(questions.length === 0) ? (
            <h1>Raise any question to your room!</h1>
          ) : (
          questions.map((q, i) => (
            <div className={classes.cardContainer} key={i} >
                <Card variant="outlined" className={classes.card}>
                  <CardHeader className={classes.cardHead}
                    avatar={<Avatar className={classes.avatar} src={this.getNewAvatar(q.question.fullName)}>
                      {this.userNameFirstLetterGetter(q.question.fullName)}
                        </Avatar>
                      } title={q.question.fullName} 
                  subheader="" action = {
                    is_admin || questionsAsked.find(questionId => questionId === q.question_id) ?
                    (<Tooltip title="Delete question" placement="left">
                      <IconButton onClick={()=> this.deleteQuestion(roomId,q.question_id)}>
                      <Delete/>
                    </IconButton>
                    </Tooltip>) : null
                  }>
                  </CardHeader>
                  <CardContent style ={{width : "100%"}}>
                    <Typography variant="body1" style={{whiteSpace: 'pre-line'}}>
                      {q.question.question}
                    </Typography>
                  </CardContent>
              </Card>
            </div>
            )))}
          </div>
        </div>
        <div>
          <div className ={classes.checkBoxArea}>
            <div className = {classes.checkBox}>
              <Checkbox
                checked = {checked}
                onChange = {this.handleCheck}
                color = "default"
                style ={{color :"#edeaea"}}/>
                <Typography variant="body2" paragraph style ={{display : 'inline-block'}}>Anonymously</Typography>
              </div>
          </div>
          <div className={classes.quesSend}>
            <TextField className={classes.inputQues} 
              value = {query} 
              onChange ={this.handleChange} 
              variant="standard"
              InputProps={{
                disableUnderline: true,
                className: classes.inputQues
              }}
              placeholder="Type in question here"
              multiline onKeyDown={this.handleKeyPress}/>
            <Send onClick={() => {this.askQuestion(roomId, query)}}
              style={{position: 'absolute', right: 15,top :"25%", width: 25, height: 25, color :"#edeaea",cursor :"pointer"}}/>
          </div>
        </div>
        <Dialog
          open={alert}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: {
                backgroundColor: "#333333",
            },
        }}>
          <DialogTitle style ={{color :"#edeaea"}}>
              Please respect each other in a meeting.
          </DialogTitle>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    connectionStatus : state.room.connectionStatus,
    roomId : state.room.roomId,
    questions: state.room.questions,
    userName : state.user.userName,
    fullName : state.user.fullName,
    questionsAsked : state.user.questionsAsked,
    is_admin: state.room.is_admin,
    members : state.room.members,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
    addQuestion : (roomId, questions ) => {
        return dispatch(addQuestion(roomId, questions))
    },
    removeQuestion: (roomId,questionOwner) => {
      return dispatch(removeQuestion(roomId,questionOwner))
    },
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(QAMode)));
