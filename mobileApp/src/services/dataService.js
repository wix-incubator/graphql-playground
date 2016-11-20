export default {
  getGraphData,
  getApiData
}

const BASE_URL = 'http://localhost:5000';

function getGraphData(graphString) {
  return fetch(`${BASE_URL}/graphql`, {
    method: "POST",
    headers: {
      'Content-Type': "application/json"
    },
    body: graphString,
  })
    .then(response => response.json())
}

function getApiData() {
  return fetch(`${BASE_URL}/api/allFilms`)
    .then(response => response.json())
}
