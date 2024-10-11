const ioClient = require('socket.io-client');


// Configure the number of clients and the server URL
const SOCKET_SERVER_URL = "https://chat-websocket.test.tap2crack.com/";
const CLIENT_COUNT = 50;  // Number of clients you want to simulate
function generateRandomString() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
let jsonObject = {
    "attributes": {
        "display_name": "",
        "avatar" : "https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg",
    },
    "entityReferenceNumber": "LCRN717275489718Y7L8",
    "userReferenceNumber": "",
    "role": "user",
    "duration" : 180,
    "scope": [
        "SEND_MESSAGE",
        "DELETE_MESSAGE",
        "VIEW_POLL_REPORT",
        "SEND_POLL_REPORT"
    ]
  };
  let userTokens = [];

  // Create an array of promises for the fetch calls
  let fetchPromises = [];
for (let i = 0; i < CLIENT_COUNT; i++) {
    jsonObject.attributes.display_name = `USER ${i}`;
    jsonObject.userReferenceNumber = "USRN"+generateRandomString();
    let fetchPromise = fetch('http://websocket.test.tap2crack.com/api/v1/jwt/token', {
        method: 'POST', // Set the HTTP method to POST
        headers: {
            'x-request-id': '141734367222',
            'Content-Type': 'application/json', // Specify the content type as JSON
            'Accept': 'application/json'
        },
        body: JSON.stringify(jsonObject) // Convert the JSON object to a string and pass it in the body
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse the JSON response
    })
    .then(data => {
        userTokens.push(data.data.token);
    })
    .catch(error => {
        console.error('Error:', error);
    });

    fetchPromises.push(fetchPromise); 
    // console.log('response', response);
    
    // 
}
Promise.all(fetchPromises).then(() => {
    console.log('userTokens:', userTokens);  // Log the tokens after all fetches are done

    userTokens.forEach((eachToken, index) => {
    // const socket = ioClient(SOCKET_SERVER_URL);

    const socket = ioClient('https://chat-websocket.test.tap2crack.com/', {
        query: { token: eachToken },
        transports: ['websocket'],
    });

    socket.emit('joinRoom');

    // Simulate random messages after connection
    setInterval(() => {
        socket.emit('sendMessage', { text: `Message from client ${index}` });
    }, 5000);  // Every 5 seconds
    });
});

// console.log('userTokens', userTokens);
