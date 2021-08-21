export const styles = theme => ({
    root: {
      background : "#edeaea",
      fontFamily: "Baloo Tamma 2",
      width:"100vw",
      height:"100vh",
      display : "flex",
      flexDirection: "column",
      position : "fixed",
      overflowX : "hidden",
    },
    inputField: {
        height: '100vh',  
        width: '100vw',
        position: "fixed",
        alignItems: 'center',
        top : "40%",
        [theme.breakpoints.down('sm')]: {
          top : "35%",
        },
    },
    inputId: {
        height : 57,
        borderRadius : 25,
        fontWeight: "bolder",
        background : "#f9f9f9",
        padding : "0 15px",
        boxShadow: '5px 5px 5px 0 rgba(0,0,0,.3)',
        justifyContent : "center",
        width : 450,
        [theme.breakpoints.down('sm')]: {
          width : 300,
        },
        [theme.breakpoints.down('md')]: {
          width : 350,
        },
      },
    Typography:{
      textAlign : "left",
      [theme.breakpoints.down('sm')]: {
        textAlign : "center",
      },
    },
    clashes:{
      margin : "0 3%",
    },
    card:{
      backgroundColor : "#f9f7f7",
      paddingRight: "10px",
      textAlign : "left",
    },
    avatar:{
      color: "#333333",
      cursor : "pointer"
    },
    drawer:{
      display : "flex",
      flexDirection: "column",
      justifyContent : "center",
      textAlign : "center",
      background : "#333333",
      color : "#edeaea",
    },
    topDrawer:{
      height : "80px"
    },
    bottomDrawer:{
      bottom : 0,
      position : "fixed",
    },
    mappingItemContainer:{
      margin : "auto",
      overflowY: "auto",
      paddingRight : 9,
      paddingTop : 12,
      display : "flex",
      flexDirection: "column",
      position :"relative",
      height : "40vh",
      width: "100%",
    },
    roomJoinedContainer:{
      margin : "auto",
      overflowY: "auto",
      padding : "3%",
      display : "flex",
      flexDirection: "column",
      borderRadius : "1em",
      background : "#DEDBDC",
      height : "65vh",
      width: "55vw",
      [theme.breakpoints.down('md')]: {
        width : "94vw",
        height : "69.5vh",
      },
      [theme.breakpoints.down('sm')]: {
        marginTop : "10%",
      },
    },
    header: {
      display : "inline",
      justifyContent: "center",
      backgroundColor: "#edeaea",
      width : "100%",
    },
    headAvatar:{
      color : "#333333",
      cursor : "pointer"
    },
    headAvatarContainer:{
      height : 46,
      margin: theme.spacing(1.6),
      display : "flex",
      flexDirection : "row",
      float : "right"
    },
    logo :{
      marginRight : "5px",
      float : "left",
      cursor : "pointer",
      display : "inline-block",
    },
    headerText :{
      height : 46,
      position : "relative",
      margin : theme.spacing(1.5),
      display : "flex",
      flexDirection : "row",
      float : "left",
    },
    shareIcon: {
      cursor : "pointer",
      float : "left",
      display : "inline-block",
    },
    members : {
      height : "60px"
    },
    bottomNav: {
      bottom : 0,
      left : 0,
      right : 0,
      position : "fixed",
    },
    button: {
      background: 'linear-gradient(45deg, #545454 30%, #333333 90%)',
      border: 0,
      borderRadius: 10,
      color: '#edeaea',
      height: 45,
      fontWeight: "bolder",
      width: 190,
      padding: '0 25px',
      margin : "20px 60px",
      '&:hover' : {
        boxShadow: '5px 5px 5px 0 rgba(0,0,0,.3)',
      },
      [theme.breakpoints.down('sm')]: {
        margin : 20
      },
    },
    cardModeIcon:{
      width : "100px",
      height : "100px",
      cursor : "pointer",
      [theme.breakpoints.down('sm')]: {
        width : "65px",
        height : "65px"
      },
    },
    cardMode:{
      display: "inline-block",
      position: "relative",
      minHeight : "200px",
      maxHeight : "250px",
      minWidth : "200px",
      maxWidth : "250px",
      '&:hover' : {
        boxShadow: '5px 5px 5px 0 rgba(0,0,0,.3)',
      },
      fontWeight: "bolder",
      borderRadius : "1em",
      margin : "5%",
      cursor : "pointer",
      [theme.breakpoints.down('sm')]: {
        minHeight : "150px",
        maxHeight : "200px",
        minWidth : "150px",
        maxWidth : "200px",
      },
    },
    cardModeContent:{
      marginTop : "15%",
      [theme.breakpoints.down('sm')]: {
        fontSize : "1rem"
      },
    },
    modeContainer:{
      display : "flex",
      flexDirection : "row",
      alignItems: "center",
      justifyContent: "center",
      position :"fixed",
      overflowX : "auto",
      height : "90vh",
      width: "100%",
      [theme.breakpoints.down('sm')]: {
        flexDirection : "column",
      },
    },
    speedDial: {
      height: "90vh",
      position: "absolute",
      bottom: theme.spacing(3),
      right: theme.spacing(1),
    },
    speedDialIcon:{
      background : 'linear-gradient(45deg, #545454 30%, #333333 90%)' 
    },
    slider:{
      position: 'absolute',
      width : "35vw",
      alignItems : "center",
      bottom : "1%",
      right : "30%",
      [theme.breakpoints.down('sm')]: {
        alignItems : "left",
        left : "10%",
      },
    },
    inputName:{
      color : "white",
      borderColor: '#edeaea',
    },
    undoRedo:{
      display : "inline",
      backgroundColor : "#FFFFFF",
      alignItems : "left",
      position: 'absolute',
      bottom : theme.spacing(4),
      borderRadius : 25,
      width : 100,
      boxShadow: '2px 2px 2px 0 rgba(0,0,0,.3)',
      right : theme.spacing(11),
    },
    bottomButton: {
      background: 'linear-gradient(45deg, #545454 30%, #333333 90%)',
      color: 'white',
      fontWeight: "bolder",
      width: "100%",
      height : "55px",
    },
    loader:{
      color : "#333333"
    },
    loaderContainer:{
      backgroundColor : "#edeaea",
      alignItems: "center",
      justifyContent: "center",
      height : "100vh",
      width : "100vw",
      display : "flex",
      flexDirection: "column",
    },
    //Q&A
    checkBoxArea:{
      borderRadius : "1em 0em 0em 0em",
      position : "relative",
      height : 40,
      padding : "0px 10px 0px 10px",
      color : "#edeaea",
      float : "right",
      backgroundColor : "#545454",
      borderBottom : "0.5px solid #edeaea"
    },
    checkBox:{
      position : "relative",
    },
    quesSend:{
      display: 'flex',
      flexDirection: "collumn",
      alignItems: "center",
      backgroundColor : "#545454",
      position : "relative",
      width : "100%",
      },
    inputQues:{
      width : "95%",
      color : "white",

      justifyContent : "center",
      overflowX : "hidden",
      maxHeight: "30vh",
      padding : "0.5em",

    },
    cardHead:{
        borderBottom: "1px solid #edeaea"
      },
    cardContainer:{
      overflowX : "hidden",
      marginBottom : 15,

      borderRadius : "1em",
      boxShadow: '4px 4px 4px 0 rgba(0,0,0,.3)',
    },
    appBar: {
      textAlign : "right",
      position: "sticky",
      display : "inline",
      justifyContent: "center",
      backgroundColor: "#edeaea",
      width : "100%",
    },
    name:{
      display : "inline-block",
      color : "#333333",
      margin : "14px 0px 17px 0px",
      width : "80vw",
    },
    //canvas Mode
    canvas : {
      bottom : 0,
      backgroundColor: "#FFFFFF",
      display : "block",
      overflow : "auto",
    },
    appBarButton: {
      margin : "10px",
      color : "#333333",
      float : "right",
    },
    homeLogo :{
      marginRight : 38,
    },
    roomButtonContainer :{
      width : '50%',
      justifyContent : "center",
      textAlign : "left",
      position: "absolute",
      [theme.breakpoints.down('sm')]: {
        width : '83%',
        textAlign : "center",
      },
      [theme.breakpoints.down('xs')]: {
        marginBottom : "2%"
      },
    },
    appBarText:{
      margin : "0 12px",
      cursor : "pointer", 
      color : "#848484",
      '&:hover' : {
        color : "#edeaea"
      },
      [theme.breakpoints.down('sm')]: {
        display : "none" 
      },
    },
    redirectButton:{
      borderRadius :"25em",
      padding :"10px 40px",
      marginTop : "3em",
      color : "#edeaea",
      background : 'linear-gradient(45deg, #545454 30%, #333333 90%)',
    },
    container:{
      padding: "7em 0",
      [theme.breakpoints.down('sm')]: {
        padding: "5em 0",
      },
    },
    introMode:{
      margin : "4%",
      display : "flex",
      flexDirection: "row",
      [theme.breakpoints.down('md')]: {
        flexDirection: "column",
        margin : 0,
      },
    },
    introModeChild:{
      margin : "5%",
      marginTop : "10%",
      width : "35%",
      [theme.breakpoints.down('sm')]: {
        width : "93vw",
        margin : "auto",
      },
      [theme.breakpoints.down('md')]: {
        marginTop : "5%",
        width : "85vw",
      },
    },
    modeDemo:{
      width : "45vw",
      float : "right",
      borderRadius : "1em",
      [theme.breakpoints.down('md')]: {
        width : "90vw",
        float : "none"
      },
      [theme.breakpoints.down('sm')]: {
        width : "85vw",
        float : "none",
      },
    },
    headingText:{
      color : "#535353",
      fontWeight: "bold",
      textAlign : "left",
      [theme.breakpoints.down('sm')]: {
        textAlign : "center"
      },
    },
    featureContainer:{
      position : "relative",
      padding : 10,
      background : "#DEDBDC",
    },
    menuButton:{
      display : "none",
      color : "#edeaea",
      [theme.breakpoints.down('sm')]: {
        display : "inline"
      },
    },
    divider:{
      color : "#edeaea",
      [theme.breakpoints.down('sm')]: {
        display : "none"
      },
    },
    aboutContainer:{
      color : "#edeaea",
      bottom : 0,
      width : "100vw",
      flewGrow: 1,
      left : 0,
      background : "#333333",
    },
    about :{
      padding : "2em"
    },
    alert :{
      position : "relative",
      margin : 15,
      zIndex: 1000,
      boxShadow: '5px 5px 5px 0 rgba(0,0,0,.3)',
      borderRadius : "1em"
    },

    //Authentication style
    authenticationTextField : {
      width : "40vw",
      [theme.breakpoints.down('sm')]: {
        width : "70vw",
      },
    },
  });