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
  TouchableHighlight,
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

  getGraphData() {
    this.resetData();
    const query = `
      query AllFilms($characterCount: Int!) {
        allFilms{
          title,
          description,
          director,
          characters(first: $characterCount) {
            name
          }
        }
      }`;

    const graphQuery = {
      query,
      variables: {
        characterCount: 3
      }
    }

    DataService.getGraphData(JSON.stringify(graphQuery))
      .then(result => this.setGraphData(result))
      .catch(error => this.handleError(error))
    ;
  }

  getApiData() {
    this.resetData();
    DataService.getApiData()
      .then(result => this.setApiData(result))
      .catch(error => this.handleError(error))
    ;
  }

  resetData() {
    this.setState({films: []});
  }

  setGraphData(result) {
    this.setState({
      films: result.data.allFilms,
      isLoading: false,
    })
  }

  setApiData(result) {
    const preparedData = result.map(film => {
      return {...film, description: film.opening_crawl}
    });

    this.setState({
      films: preparedData,
      isLoading: false
    });
  }

  handleError(error) {
    console.error(error);
    this.setState({
      isLoading: false,
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={{flex: 1}}>
          {this.renderButtons()}
          <View style={styles.films}>
            <ActivityIndicator animating={this.state.isLoading} size="large" />
            {this.state.films.map((film, index) => this.renderFilm(film, index))}
          </View>
        </ScrollView>
      </View>
    );
  }

  renderFilm(film, index) {
    const characterNames = film.characters.map(char => char.name);
    return (
      <View style={styles.film} key={index}>
        <View><Text style={styles.filmTitle}>{film.title}</Text></View>
        <View><Text style={styles.filmDesc}>{film.description}</Text></View>
        <View>
          <Text style={styles.filmCharacters}>
            3 Characters: {characterNames.join(', ')}
          </Text>
        </View>
      </View>
    )
  }

  renderButtons() {
    return (
      <View style={styles.buttonContainer}>
        <TouchableHighlight style={styles.button} onPress={this.getGraphData.bind(this)}>
          <Text>Get data from GraphQL</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button} onPress={this.getApiData.bind(this)}>
          <Text>Get data from API</Text>
        </TouchableHighlight>
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
  films: {
    marginTop: 20,
  },
  filmTitle: {
    fontSize: 21,
  },
  filmDesc: {
    fontSize: 12
  },
  filmCharacters: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#ccc',
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
  },
});
