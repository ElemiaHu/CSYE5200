import { useEffect, useReducer } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  fetchLogin,
  fetchSession,
  fetchLogout,
} from './services';
import reducer, { initialState } from './appReducer';
import { ACTIONS, ERROR, LOGIN_STATUS } from './constants';

import Login from './Login';
import Home from './Home';

function App() {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  function onLogin(username) {
    fetchLogin(username).then(response => {
      dispatch({ type: ACTIONS.LOG_IN, userId: response.userId, username: response.username });
    })
    .catch( error => {
      dispatch({ type: ACTIONS.REPORT_ERROR, error: error.error });
    });
  }

  function onLogout() {
    fetchLogout().then( () => {
      dispatch({ type: ACTIONS.LOG_OUT });
    })
    .catch( error => {
      if(error.error === ERROR.AUTH_MISSING) dispatch({ type: ACTIONS.LOG_OUT });
      else dispatch({ type: ACTIONS.REPORT_ERROR, error: error.error });
    })
  }

  function checkForSession() {
    fetchSession().then( response => {
      dispatch({ type: ACTIONS.LOG_IN, userId: response.userId, username: response.username });
    })
    .catch( error => {
      if(error.error === ERROR.AUTH_MISSING) dispatch({ type: ACTIONS.LOG_OUT });
      else dispatch({ type: ACTIONS.REPORT_ERROR, error: error.error });
    });
  }

  useEffect( () => {
    checkForSession();
  }, []);


  return (
    <div className='App'>
      {state.loginStatus === LOGIN_STATUS.NOT_LOGGED_IN && <Login onLogin={onLogin} error={state.error}/>}
      { state.loginStatus === LOGIN_STATUS.IS_LOGGED_IN &&  <Home onLogout={onLogout} userId={state.userId} username={state.username}/>}
    </div>
  )
}

export default App;
