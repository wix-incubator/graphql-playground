/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator
} from 'react-native';

import DataService from '../services/dataService';

export default class IndexScreen extends Component {
  constructor() {
    super();
    this.state = {
      films: [],
      isLoading: false,
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    this.setState({
      isLoading: true,
    });

    DataService.getGraphData("{allFilms{title}}")
      .then(result => this.setNewData(result))
      .catch(error => this.handleApiError(error))
  }

  setNewData(result) {
    this.setState({
      films: result.data.allFilms,
      isLoading: false,
    })
  }

  handleApiError(error) {
    console.error(error);
    this.setState({
      isLoading: false,
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={{flex: 1}}>
          <Text style={styles.welcome}>
            Welcome to React Native!
          </Text>
          <Text style={styles.instructions}>
            To get started, edit src/screens/IndexScreen.js
          </Text>
          <View style={styles.films}>
            <ActivityIndicator animating={this.state.isLoading} size="large" />
            {this.state.films.map((film, index) => this.renderFilm(film, index))}
          </View>
        </ScrollView>
      </View>
    );
  }

  renderFilm(film, index) {
    return (
      <View key={index}>
        <Text style={styles.instructions}>{film.title}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginTop: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  films: {
    marginTop: 20,
  }
});
