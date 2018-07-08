import React, { Component } from 'react';
import HomeContainer from './HomeContainer';
import { getAuthToken } from '../utils';
import '../styles/main.css';


class AppContainer extends Component {
  componentWillMount = () => {
    const token = getAuthToken();
    if (!token) {
      // window.location = '/';
    }
  };
  render() {
    return (<div>
      <HomeContainer />
    </div>);
  }
}

export default AppContainer;
