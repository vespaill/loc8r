const mongoose = require('mongoose');

// local database URI
let dbURI = 'mongodb://localhost/Loc8r';

/* Gets overwritten if we're in heroku, so that it uses the live database URI
   instead. */
if (process.env.NODE_ENV === 'production') {
    // dbURI = 'mongodb://User1:Deadlocked96@ds253428.mlab.com:53428/heroku_sv1fxxrf';
    dbURI = process.env.MONGODB_URI;
}

// Connect to database.
mongoose.connect(dbURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
});


/*******************************************************************************
    Listen for Mongoose connection events and output statuses to the console.
*******************************************************************************/

// Monitor for a successful connection through Mongoose.
mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${dbURI}`);
});

// Check for a connection error.
mongoose.connection.on('error', err => {
    console.log(`Mongoose connection error: ${err}`);
});

// Checks for a disconnection event.
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});


/*******************************************************************************
    Listen to Node processes for termination or restart signals and call the
    gracefulShutdown function when appropriate, passing a continuation callback.
*******************************************************************************/

// Reusable function to close the Mongoose connection.
const gracefulShutdown = (msg, callback) => {
    /* Close the Mongoose connection and pass an anonymous function to run when
       it's closed. */
    mongoose.connection.close(() => {
        /* Output a message and call a callback when the Mongoose connection is
           closed. */
        console.log(`Mongoose disconnected through ${msg}`);
        callback();
    });
};

// Listens for SIGUSR2, which is what nodemon uses.
process.once('SIGUSR2', () => {
    /* Send a message to gracefulShutdown and a callback to kill the process,
      emitting SIGUSR2 again. */
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// Listening for SIGINT on Windows.
const readLine = require('readline');
if (process.platform === 'win32') {
    const rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on('SIGINT', () => {
        process.emit("SIGINT");
    });
}

// Listen for SIGINT to be emitted upon application termination.
process.on('SIGINT', () => {
    /* Sends a message to gracefulShutdown and a callback to exit the Node
      process. */
    gracefulShutdown('app termination', () => {
        process.exit(0);
    });
});

// Listens for SIGTERM to be emitted when Heroku shuts down the process.
process.on('SIGTERM', () => {
    /* Sends a message to gracefulShutdown and a callback to exit the Node
       process. */
    gracefulShutdown('Heroku app shutdown', () => {
        process.exit(0);
    });
});

require('./locations');