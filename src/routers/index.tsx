import * as React from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import Register from '@pages/login/register'; // 基础
import Login from '@pages/login'; // 登录

export default class App extends React.Component {
  public render() {
    return (
      <HashRouter>
        <Switch>
          <Redirect from='/' to='/login' exact></Redirect>
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
        </Switch>
      </HashRouter>
    );
  }
}
