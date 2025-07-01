const predictionDiv = document.getElementById('prediction');

const ws = new WebSocket('ws://' + window.location.host);

ws.onopen = () => {
  console.log('WebSocket connection opened');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  predictionDiv.innerHTML = `
    <p><strong>Flight Number:</strong> ${data.flightNumber}</p>
    <p><strong>Predicted Delay:</strong> ${data.delay} minutes</p>
    <p><em>Updated at: ${new Date(data.timestamp).toLocaleTimeString()}</em></p>
  `;
};

ws.onclose = () => {
  console.log('WebSocket connection closed');
  predictionDiv.innerHTML = '<p>Connection closed. Please refresh the page.</p>';
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
  predictionDiv.innerHTML = '<p>Error occurred. Please try again later.</p>';
};
