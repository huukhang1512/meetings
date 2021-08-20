import React from 'react';
import { Router,Switch,Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import { connect } from 'react-redux';
import { saveRouteHistory } from './redux/actions/AppAction';

import Cookies from 'js-cookie'
import { refreshToken, setupUserAccount, setError } from "./redux/actions/UserAction"
import Home from "./pages/Home";
import Room from "./pages/Room";
import NotFound from "./pages/NotFound";
// import SignIn from "./pages/SignIn";
// import SignUp from "./pages/SignUp";
// import ConfirmSignUp from "./pages/ConfirmSignUp"
// import ForgotPassword from "./pages/ForgotPassword"
import LandingPage from "./pages/LandingPage";
import RoomIdInput from "./pages/RoomIdInput"
import UserNamePage from "./pages/UserNamePage"
import './css/App.css';

const customHistory = createBrowserHistory();

class App extends React.Component {
  checkAuth = () => {
    if (!this.props.isLoggedin) {
      return;
    }
    try {
      const exp = Cookies.get("exp")
      if (exp < new Date().getTime() - 1000000) {
        this.props.refreshToken()
        this.props.setupUserAccount()
      } else {
        // console.log("Not yet to update the token")
      }
    } catch (e) {
      // console.log(e)
      return;
    }
    this.props.setupUserAccount()
  }

  componentDidMount(){
    this.props.saveRouteHistory(customHistory);
    this.props.setError()
    setInterval(() => this.checkAuth(),400000)
  }

  render(){
    return (
      <div className="App">
        <Router history={customHistory}> 
          <div>
            <Switch>
              <Route exact path="/room/:roomId">
                <Room></Room>
              </Route>
              <Route exact path="/app">
                <Home></Home>
              </Route>
              <Route exact path="/">
                <LandingPage></LandingPage>
              </Route>
              <Route exact path="/index">
                <LandingPage></LandingPage>
              </Route>
              <Route exact path="/join">
                <RoomIdInput></RoomIdInput>
              </Route>
              <Route exact path="/register">
                <UserNamePage></UserNamePage>
              </Route>
              {/* <Route exact path="/signin">
                <SignIn></SignIn>
              </Route>
              <Route exact path="/signup">
                <SignUp></SignUp>
              </Route>
              <Route exact path="/verification">
                <ConfirmSignUp></ConfirmSignUp>
              </Route>
              <Route path="/forgotpassword/">
                <ForgotPassword></ForgotPassword>
              </Route> */}
              <Route>
                <NotFound></NotFound>
                </Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isLoggedin : state.user.isLoggedin
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		saveRouteHistory : (history) => {
			dispatch(saveRouteHistory(history));
    },
    refreshToken : (token) => {
			dispatch(refreshToken(token));
    },
    setupUserAccount : (accessToken) => {
			dispatch(setupUserAccount(accessToken));
    },
    setError: () =>{
      dispatch(setError());
    }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
