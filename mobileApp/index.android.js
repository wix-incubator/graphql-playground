/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import IndexScreen from './src/screens/IndexScreen';

export default class mobileApp extends Component {
  render() {
    return (
      <IndexScreen />
    );
  }
}

AppRegistry.registerComponent('mobileApp', () => mobileApp);
