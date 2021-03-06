require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const { logger } = require('./middleware/log_events');
const { globalToken } = require('./middleware/global_token');

const PORT = process.env.PORT || 2888;

/* START Middleware */ 
app.use(logger); // Middw. logger
app.use(globalToken);

const whitelist = ['http://localhost:3000'] // Cross Origin Resource Sharing
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());  // For form submition
/* END */

/* START Routes - User Route */
app.use('/api/v1/user',  require('./routes/userRoutes'));
/* END */

/* START Global Error Handler */ 
app.use((err, req, res, next) => {
    console.log(err.stack);
    console.log(err.name);
    console.log(err.code);

    return res.status(500).json({
        message: "Something went wrong",
    });
});
/* END */ 

/* START Run Server */
app.listen(PORT, (err) => {
    // If no error 
    if(!err) return console.log(`Server is running. PORT::: ${PORT}`);  
    
    // If failed shows error
    if (err) return console.log(`Server has failed to start. ${err}`);
});
/* END */

// Add line one dev