import React from 'react';
import { Stage, Layer, Line, Text } from "react-konva";
import Portal from '../Components/Portal/Portal'
//Material-UI
import { withStyles } from '@material-ui/core/styles';
import { Slider,Tooltip,Typography,Dialog,DialogActions,Button,DialogTitle,IconButton} from '@material-ui/core';

import {SpeedDial,SpeedDialIcon,SpeedDialAction} from '@material-ui/lab';

import {Save,Undo,Redo,OpenWith,FiberManualRecord,Title,HighlightOff,Brush,Edit} from '@material-ui/icons';

import {throttle} from 'lodash'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { drawing, saveBoard,clearBoard,undo,redo} from "../redux/actions/SocketAction"
import { styles } from "../UI_Components/UIComponents"
class WhiteBoardMode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userLine : [],
      localLine: [],
      undo : [],
      redo : [],
      tempTextValue: "",
      size: {
        width : 1000,
        height: 1000,
      },
      drawing: false,
      alert : false,
      open: true,
      show: false,
      brushThicknessValue: 2,
      eraserThicknessValue: 10,
      mode: "brush",
      areaPosition:{
        x: 0,
        y: 0
      },
      actions: [
        { icon: <Brush/>,action:() => this.changingBrushMode("brush"), name: 'Brush' },
        { icon: <FiberManualRecord/>,action:() => this.changingBrushMode("eraser"), name: 'Eraser' },
        { icon: <OpenWith/>,action:() => this.changingBrushMode("move"), name: 'Move' },
        { icon: <Title/>,action:() => this.changingBrushMode("text"), name: 'Text' },
      ]
    }
  }
  
  componentDidUpdate(prevProps, prevState){
    if (prevProps.lines !== this.props.lines){
      this.setState({localLine:[]});
      clearInterval(this.interval)
      this.interval = setInterval(() => this.saveBoard(this.props.match.params.roomId, this.props.lines), 180000);
    }
  }
  

 

  changingBrushMode = (mode) => {
    this.setState({
      mode: mode,
      show: mode !== "move",
    })
  }
  componentDidMount() {
    this.handleRenderSpeedial()
    this.checkSize();
    window.addEventListener("resize", this.checkSize);
  }

  handleClickOpen = () => {
    this.setState({alert : true})
  };
  handleClickClose = () => {
    this.setState({alert : false})
  };

  handleOpen = () => {
    const {open} = this.state
    if(open){
      this.setState({ open: false });
    } else {
      this.setState({ open: true });
    }
   
  };

  saveBoard = throttle((roomId, lines) => {
    if (this.props.is_admin){
      this.props.saveBoard(roomId, lines)
    } else {
      return;
    }
  },1000,{trailing: false})

  clearBoard = throttle((roomId) => {
    this.props.clearBoard(roomId)
    this.saveBoard(roomId, [])
    this.setState({locaLine: []})
  },1000,{trailing: false})

  drawingLines = (roomId, line) => {
    this.props.drawing(roomId, line)
  }

  handleSliderChange = (event, value) => {
    const {mode} = this.state
    mode === "eraser" ? (
      this.setState({ eraserThicknessValue: value })
    ):(this.setState({ brushThicknessValue: value }))
  };

  getRelativePointerPosition = (node) =>{
    var transform = node.getAbsoluteTransform().copy();
    transform.invert();
    var pos = node.getStage().getPointerPosition();
    return transform.point(pos);
  }

  getCurrentPosition = () => {
    const stage = this.stageRef.getStage();
    const point = this.getRelativePointerPosition(stage)
    let stageBox = stage.container().getBoundingClientRect()
    this.setState({
      areaPosition : {
        x: point.x + stageBox.left,
        y: point.y + stageBox.top - 50,
      }
    });
  }
  handleKeyPress = (event) => {
    if (event.metaKey || event.ctrlKey){
      if (event.key === "y"){
        this.handleRedo()
      }
      if (event.key === "z"){
        this.handleUndo()
      }
    }  
    if (event.key === "Escape"){
      this.changingBrushMode("default")
    }
  }

  limitUserLineData = (amount) =>{
    const { userLine,undo,redo } = this.state
    if (userLine.length >= amount){
      this.setState({
        userLine : userLine.splice(0,3),
        undo : undo.splice(0,3),
        redo: redo.splice(0,3)
      })
    }
  }
  handleTextDrawing = (e) => {
    if(e.target === "Text"){
      console.log("test")
      return
    }
    const { mode,userLine,localLine,areaPosition } = this.state
    let lastLine = userLine[userLine.length - 1]
    if(lastLine && lastLine.mode === "text" && lastLine.text.length === 0){
      this.setState({
        userLine : userLine.splice(-1,1),
        localLine: localLine.splice(-1,1)
      })
    }
    this.setState({
      userLine : [...userLine,{
        mode: mode,
        text : "",
        position: areaPosition,
        isSelected : false
      }],
      localLine : [...localLine,{
        mode: mode,
        text : "", 
        position: areaPosition,
        isSelected : false
      }],
    });
  }
  handleTextDrawingChange = (event) => {
    let query = event.target.value
    this.setState({
      tempTextValue : query
    })
  }
  handleTextDrawingKeyPressed = (event) => {
    const {userLine,localLine,tempTextValue} = this.state
    const roomId = this.props.match.params.roomId;
    if(event.keyCode === 13 || event.keyCode === 27){
      let lastLine = userLine[userLine.length - 1];
      lastLine.text = tempTextValue
      userLine.splice(userLine.length - 1, 1, lastLine);
      localLine.splice(localLine.length - 1, 1, lastLine);
      this.drawingLines(roomId, lastLine)
      this.setState({
        tempTextValue: "",
        userLine: userLine,
        localLine: localLine
      })
    }
  }
  handleSelectText = (e) => {
  
    const { userLine } = this.state
    let lastLine = userLine[userLine.length - 1];
    console.log(lastLine)
    lastLine.isSelected = true
    userLine.splice(userLine.length - 1, 1, lastLine)
    this.setState({userLine : userLine}) 
    console.log(lastLine)
  }
  handleStartDrawing = (e) => {
    const { mode, brushThicknessValue,eraserThicknessValue,userLine,localLine} = this.state
    let thickness
    mode === "eraser" ? (thickness = eraserThicknessValue):(thickness = brushThicknessValue)
    this.limitUserLineData(10)
    if (mode === "move"){
      return false;
    } else if (mode === "text"){
      this.handleTextDrawing(e)
    } else {
      this.setState({
        drawing: true,
        userLine : [...userLine,{
          mode: mode, // eraser or line
          thickness : thickness,  //
          colour : "red",
          line: []
        }],
        localLine : [...localLine,{
          mode: mode,
          colour : "red",
          thickness : thickness, 
          line: []
        }],
      });
    }
  };
  handleStopDrawing = () => {
    const roomId = this.props.match.params.roomId;
    const { localLine,userLine,mode } = this.state
    if ( mode === "text" || mode === "move") {
      return;
    }
    let lastLine = localLine[localLine.length -1]
    this.drawingLines(roomId, lastLine)
    this.setState({
      drawing: false,
    })
    if(lastLine && lastLine.line.length === 0 && userLine.length > 0){
      let lines2 = userLine
      lines2.pop(userLine.length -1)
      this.setState({
        userLine : lines2,
      })
    }
  };

  handleDrawing = () => {
    const { drawing, userLine,localLine,mode } = this.state
    if (!drawing || mode === "text") {
      return;
    }
    const stage = this.stageRef.getStage();
    const layer = this.layerRef.getLayer();
    const point = this.getRelativePointerPosition(stage)
    let lastLine = userLine[userLine.length - 1];
    lastLine.line = lastLine.line.concat([Math.round(point.x), Math.round(point.y)]);
    userLine.splice(userLine.length - 1, 1, lastLine);
    localLine.splice(localLine.length - 1, 1, lastLine);
    this.setState({
      userLine : userLine,
      localLine : localLine
    })
    layer.batchDraw();
  };

  undo = (roomId,lines) =>{
    this.props.undo(roomId,lines)
  }
  redo = (roomId,lines) =>{
    this.props.redo(roomId,lines)
  }
  handleUndo = () => {
    const {userLine,undo,redo} = this.state
    if (userLine.length !== 0){
      let line = userLine
      let lastLine = line[line.length - 1]
      userLine.pop(lastLine)
      undo.push(lastLine)
      redo.pop(lastLine)
      this.setState({
        userLine : userLine,
        undo : undo,
        redo : redo
      })

      const roomId = this.props.match.params.roomId;
      let lastUndoLine = undo[undo.length - 1]
      this.undo(roomId,lastUndoLine)
    }
    else {
      return;
    }
  }

  handleRedo = () =>{
    const {redo,undo,userLine} = this.state
    if (userLine.length >= 0 && undo.length > 0){
      let undoLine = undo
      let lastLine = undoLine[undoLine.length - 1]
      userLine.push(lastLine)
      undo.pop(lastLine)
      redo.push(lastLine)

      this.setState({
        undo : undo,
        redo : redo,
        userLine : userLine,
      })

      const roomId = this.props.match.params.roomId;
      let lastRedoLine = redo[redo.length - 1]
      this.redo(roomId,lastRedoLine)
    }
    else {
      return;
    }
  }

  handleRenderSpeedial() {
    const { is_admin } = this.props
    const { actions } = this.state
    const roomId = this.props.match.params.roomId;
    if (is_admin) {
      this.setState({
        actions: [...actions,
        { icon: <Save/>,action: () => {this.saveBoard(roomId, this.props.lines)}, name: 'Save and broadcast' },
        { icon: <HighlightOff/>,action: () => {this.handleClickOpen()}, name: 'Clear Board' },]
      })
    } else {
      return;
    }
  }
  handleRenderSlider() {
    const { classes } = this.props
    const { brushThicknessValue,eraserThicknessValue,mode } = this.state
    return (
      <div className={classes.slider} >
        <Typography style = {{textAlign : "left"}} variant="subtitle2">Thickness</Typography>
        <Slider style={{ color: "#4A4A4A" }} value={mode === "eraser" ? (eraserThicknessValue) : (brushThicknessValue)} 
          min={1} max = {mode === "eraser" ? (50) : (15)} valueLabelDisplay="auto" onChange={this.handleSliderChange} 
          />
      </div>
    )
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.checkSize);
    clearInterval(this.interval)
  }

  checkSize = () => {
    const {size} = this.state
    const width = this.container.offsetWidth;
    const height = window.innerHeight - 350;


    this.setState({
      size : {
        width : width,
        height: height,
      }
    });
  };
  renderCursor(mode){
    switch(mode){
      case "brush":
        return "crosshair"
      case "move":
        return "move"
      case "text":
        return "text"
      default:
        return "default"
    }
  }
  render() {
    const { classes, lines, event } = this.props
    const { localLine, open, actions, show, mode,alert,size} = this.state
    return (
      <div tabIndex={1} onKeyDown={this.handleKeyPress}
        ref={node => {
          this.container = node;
        }}
        style={{position:"relative"}}>
        <Dialog
          open={alert}
          onClose={this.handleClickClose}
          PaperProps={{
            style: {
                backgroundColor: "#333333",
            },
          }}>
          <DialogTitle style ={{color :"#edeaea"}}> Are you sure you want to clear this board? This action cannot be undone</DialogTitle>
          <DialogActions>
            <Button onClick={() => {this.handleClickClose();this.clearBoard(this.props.match.params.roomId)}} color="secondary">
              Yes
            </Button>
            <Button onClick={()=>{this.handleClickClose()}} color ="secondary" autoFocus>
              No
            </Button>
          </DialogActions>
        </Dialog>
        <Stage
          className={classes.canvas}
          style ={{cursor : this.renderCursor(mode)}}
          width={size.width}
          height={size.height}
          onContentTouchstart={this.handleStartDrawing}
          onContentTouchmove={this.handleDrawing}
          onContentTouchend={this.handleStopDrawing}
          onContextMenu={(e) => {
            e.evt.preventDefault();
            }
          }
          onMouseMove={this.getCurrentPosition}
          onContentMousedown={this.handleStartDrawing}
          onContentMousemove={this.handleDrawing}
          onContentMouseup={this.handleStopDrawing}

          
          draggable = {mode === "move"}
          ref={node => {
            this.stageRef = node;
          }}>
          <Layer 
          onDblClick={this.handleSelectText}
          ref={node => {
            this.layerRef = node;
          }}
          >
            {lines.map((line, i) => (
              line.mode === "text" ? (
              <Text text={line.text} x={line.position.x } key={i} y={line.position.y - 50} fontSize={20}></Text>
              ) : (
              <Line key={i} points={line.line} stroke={line.colour} strokeWidth={line.thickness}
              globalCompositeOperation={
                line.mode === "eraser" ? "destination-out" : "source-over"
              }/>)
            ))}
            {localLine.map((line, i) => (
              (mode === "text" && line.mode === "text" && line.text.length === 0) || line.isSelected ? (
                <Portal key={i + "portal"} > 
                  <textarea key={i}
                    style={{
                      position: "absolute",
                      top: line.position.y + 'px',
                      left: line.position.x + 'px',
                      border: '0.1px dashed gray ',
                      margin: '0px',
                      padding: '0.3em 0.2em',
                      overflow: 'hidden',
                      outline: 'none',
                      resize: 'none',
                      background: 'none',
                      fontSize: '20px',
                      // width= textNode.width() - textNode.padding() * 2 + 'px',
                      // height= textNode.height() - textNode.padding() * 2 + 5 + 'px'
                    }}
                    defaultValue={line.text}
                    placeholder="Type something here"
                    onChange={this.handleTextDrawingChange}
                    onKeyDown={this.handleTextDrawingKeyPressed}
                    >
                  </textarea>
                </Portal>
              ):(
                line.mode === "text" ? (
                  <Text
                    text={line.text} 
                    key={i} 
                    x={line.position.x } 
                    y={line.position.y - 50} 
                    fontSize={20}>
                  </Text>
                    ) : (
                  <Line key={i} points={line.line} stroke={mode === "eraser" ? ("#dddddd"):(line.colour)} strokeWidth={line.thickness}
              />)
            )))}
          </Layer>
        </Stage>
        <div>
          {event !== "Going away" ? (<SpeedDial
            ariaLabel="Whiteboard Toolbar"
            className={classes.speedDial}
            icon={<SpeedDialIcon open={<Edit/>} />}
            onClick={() => this.handleOpen()}
            open={open}
            direction="up"
            FabProps={{className : classes.speedDialIcon}}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                onClick={() => action.action()}
                tooltipTitle={action.name}/>
            ))}
          </SpeedDial>):(null)
          }
          <div className={classes.undoRedo}>
            <Tooltip title="Undo">
              <IconButton style={{width: "50%", height :"50%"}} onClick={() => {this.handleUndo()}}>
                <Undo></Undo>
              </IconButton>
            </Tooltip>
            <Tooltip title ="Redo">
              <IconButton style={{width: "50%", height :"50%"}} onClick={()=> {this.handleRedo()}}>
                <Redo></Redo>
              </IconButton>
            </Tooltip>
          </div>
          {show ? this.handleRenderSlider() : null}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    is_admin: state.room.is_admin,
    lines: state.room.lines,
    userName: state.user.userName,
    event : state.room.event
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    drawing: (roomId, lines) => {
      return dispatch(drawing(roomId, lines))
    },
    saveBoard: (roomId, lines) => {
      dispatch(saveBoard(roomId, lines))
    },
    clearBoard: (roomId) => {
      dispatch(clearBoard(roomId));
    },
    undo: (roomId,lines) => {
      dispatch(undo(roomId,lines))
    },
    redo: (roomId,lines) => {
      dispatch(redo(roomId,lines))
    }
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(WhiteBoardMode)));