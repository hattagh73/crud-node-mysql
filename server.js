require('dotenv').config();
const cors = require('cors');
var bodyParser = require('body-parser');
const express = require('express');
const app = express();
const { logger } = require('./middleware/log_events');
const { globalToken } = require('./middleware/global_token');
const HOST = process.env.SERVER_HOST;
const PORT = process.env.SERVER_PORT;

// Custom middleware logger
app.use(logger);
app.use(globalToken);
// Cross Origin Resource Sharing
// const whitelist = ['http://localhost:3000']
// const corsOptions = {
//     origin: (origin, callback) => {
//         if (whitelist.indexOf(origin) !== -1 || !origin) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     optionSuccessStatus: 200,
//  }
// app.use(cors(corsOptions));
app.use(
    cors({
        origin: 'http://localhost:3000'
    })
);
// Middleware
app.use(express.urlencoded({ extended: false }));
// will active before all the http method will also supply to all routes
// kalau takda tak boleh submit form
app.use(express.json()); 

// Routes
app.use("/api/v1/user",  require("./routes/userRoutes"));

// Global Error Handler
app.use((err, req, res, next) => {
    console.log(err.stack);
    console.log(err.name);
    console.log(err.code);

    return res.status(500).json({
        message: "Something went rely wrong",
    });
});

// Running Server 
app.listen(PORT,HOST, (err) => {
    // If no error 
    if(!err) return console.log(`Server is running. Port: ${PORT} & Host ${HOST}`);
    // If failed shows error
    if (err) return console.log(`Server has failed to start. Add One lah ${err}`);
});
Add one lah
Add two lah