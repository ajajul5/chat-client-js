const fs = require('fs');
const ioClient = require('socket.io-client');

// Configure the number of clients and the server URL
const SOCKET_SERVER_URL = "https://chat-websocket.test.tap2crack.com/";
// const SOCKET_SERVER_URL = "https://chat-websocket.test.tap2crack.com/";
const CLIENT_COUNT = 150;  // Number of clients to simulate
const EMIT_INTERVAL = 2000;  // Emit every 1 second
const EMIT_DURATION = 1 * 60 * 1000;  // Duration to emit in milliseconds (e.g., 5 minutes)
// const EMIT_DURATION = 15000;  // Duration to emit in milliseconds (e.g., 5 minutes)
const logFilePath = 'messageLog.txt';
function generateRandomString() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
let entityReferenceNumber = ['CLRNNNYIWZL43FE6K3WV',  'CLRNHM3FBMG0DYA8OJKV', 'CLRNBRLX47F0NLOR2R2W']
let jsonObject = {
    "attributes": {
        "display_name": "",
        "avatar": "https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg",
    },
    "entityReferenceNumber": "CLRN05X5FGL8A2GR9M8Z",
    "userReferenceNumber": "",
    "role": "user",
    "duration": 180,
    "scope": [
        "SEND_MESSAGE",
        "DELETE_MESSAGE",
        "VIEW_POLL_REPORT",
        "SEND_POLL_REPORT"
    ]
};
let userTokens = [];

// First names and last names
const firstNames = [
    "Aarav", "Aditya", "Arjun", "Arnav", "Aryan", "Ayush", "Dhruv", "Ishaan", "Kabir", "Krishna",
    "Lakshay", "Mohammed", "Pranav", "Rehan", "Rishi", "Rohan", "Shiv", "Vihaan", "Virat", "Yash",
    "Aanya", "Advika", "Ananya", "Avni", "Diya", "Ishita", "Kiara", "Myra", "Nisha", "Pari",
    "Prisha", "Riya", "Saanvi", "Sarah", "Siya", "Tara", "Vanya", "Zara", "Zuber", "Sonam",
    "Raj", "Rahul", "Amit", "Vikram", "Suresh", "Pradeep", "Deepak", "Rajesh", "Sanjay", "Vinod",
    "Neha", "Pooja", "Priya", "Sneha", "Swati", "Anjali", "Kavita", "Preeti", "Radha", "Shweta"
];
const lastNames = [
    "Patel", "Kumar", "Singh", "Shah", "Sharma", "Verma", "Gupta", "Kapoor", "Khan", "Joshi",
    "Malhotra", "Chopra", "Mehta", "Agarwal", "Reddy", "Nair", "Rao", "Chauhan", "Yadav", "Ansari",
    "Iyer", "Srinivasan", "Desai", "Patil", "Chatterjee", "Mukherjee", "Banerjee", "Das", "Bose", "Roy"
];

// Simulate fetching tokens for clients
let fetchPromises = [];
for (let i = 0; i < CLIENT_COUNT; i++) {
    jsonObject.attributes.display_name = `${firstNames[Math.floor(Math.random() * 60)]} ${lastNames[Math.floor(Math.random() * 40)]}`;
    jsonObject.userReferenceNumber = "USRN" + generateRandomString();
    // if(i<80) {
    //     jsonObject.entityReferenceNumber = entityReferenceNumber[0];
    // } else if(i<160) {
    //     jsonObject.entityReferenceNumber =entityReferenceNumber[1];
    // } else {
    //     jsonObject.entityReferenceNumber =entityReferenceNumber[2];
    // }

    let fetchPromise = fetch('http://websocket.test.tap2crack.com/api/v1/jwt/token', {
        method: 'POST',
        headers: {
            'x-request-id': '141734367222',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(jsonObject)
    })
    .then(response => response.json())
    .then(data => {
        userTokens.push(data.data.token);
    })
    .catch(error => console.error('Error:', error));

    fetchPromises.push(fetchPromise);
}

Promise.all(fetchPromises).then(() => {
    console.log('userTokens:', userTokens);

    userTokens.forEach((eachToken, index) => {
        const socket = ioClient(SOCKET_SERVER_URL, {
            query: { token: eachToken },
            transports: ['websocket'],
        });

        socket.emit('joinRoom');

        // Start emitting messages at intervals
        // const messageInterval = setInterval(() => {
        //     const message = `Message from client ${index}`;
        //     socket.emit('sendMessage', { text: message });
        //     // Log the message to a file
        //     fs.appendFile(logFilePath, `${new Date().toISOString()} - ${message}\n`, (err) => {
        //         if (err) {
        //             console.error('Error writing to log file:', err);
        //         }
        //     });
        // }, EMIT_INTERVAL);

        // // Stop emitting after EMIT_DURATION (e.g., 5 minutes)
        // setTimeout(() => {
        //     clearInterval(messageInterval);
        //     console.log(`Stopped message emission for client ${index} after ${EMIT_DURATION / 1000} seconds`);
        // }, EMIT_DURATION);
    });
});