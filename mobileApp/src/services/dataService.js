export default {
  getGraphData
}

const BASE_URL = 'http://localhost:5000/graphql';

function getGraphData(graphString) {
  return fetch(BASE_URL, {
    method: "POST",
    headers: {
      'Content-Type': "application/graphql"
    },
    body: graphString,
  })
    .then(response => response.json())
}