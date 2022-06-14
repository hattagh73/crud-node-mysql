require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const { logger } = require('./middleware/log_events');
const { globalToken } = require('./middleware/global_token');
const HOST = process.env.SERVER_HOST;
const PORT = process.env.SERVER_PORT;

/* START Custom middleware logger */ 
app.use(logger);
// app.use(globalToken);

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
        message: "Something went rely wrong",
    });
});
/* END */ 

/* START Run Server */
app.listen(PORT, HOST, (err) => {
    // If no error 
    if(!err) {
        console.log(`Server is running. Port::: ${PORT} & Host::: ${HOST}`);
        // const date1 = new Date("2022-06-13");
        // console.log(`date 1: ${date1}`);

        // const date2 = new Date(99, 06 , 11, 12, 32, 23, 23);
        // console.log(`date 2: ${date2}`);

        // const date3 = new Date();
        // console.log(`date 3: ${date3}`);

        // const date4 = new Date();
        // console.log(`date 4: ` + date4.getUTCHours());
        // console.log(`date 4.1: ` + date4.toString());

        // const date5 = new Date();
        // console.log(`date 5 is MY: ` + date5.toLocaleString("en-MY"));

        // const date6 = new Date();
        // console.log(`date 6 is US: ` + date6.toLocaleString("en-MY", {
        //     timeZone: "Africa/Khartoum"
        // }));

        // const date7 = new Date();
        // console.log(`date 7 is London: ` + date6.toLocaleString("en-MY", {
        //     timeZone: "Europe/London"
        // }));

        // let list = [];
        // let input = ["John","Hari","James"]
        // let myJson;

        // list = input.reduce((accumulator, currentValue, index, array) => {
        // accumulator.push({"name" : currentValue});
        // return accumulator;
        // },[])

        // console.log(list)
        // let input = [
        //     {"name":"Sam","age":29,"gender":"male"},
        //     {"name":"Josh","age":29,"gender":"male"},
        //     {"name":"Simon","age":29,"gender":"male"},
        //     {"name":"Timon","age":29,"gender":"male"},
        //   ];
        //   // Reduce the input to get only the name key
        //   let output = input.reduce((accumulator, currentValue) => {
        //     accumulator.push({"name" : currentValue.name});
        //     return accumulator;
        //   },[]);
          
        //   console.log(output)
        const arr1 = ['name', 'age', 'country'];
        const arr2 = ['Tom', 30, 'Chile'];

        const obj = {};

        arr1.forEach((element, index) => {
        obj[element] = arr2[index];
        });

        // 👉️ {name: 'Tom', age: 30, country: 'Chile'}
        console.log(obj);
        return 
    }
    
    // If failed shows error
    if (err) return console.log(`Server has failed to start. ${err}`);
});
/* END */

// Add line A - by hattagh73two