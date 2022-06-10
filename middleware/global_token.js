require('dotenv').config();
const apiKey = process.env.API_KEY;

const globalToken = (req, res, next) => {
    const apiKeyHeaders = req.query.api_key;
    // console.log(`The api_key is: ${apiKeyHeaders}`);
    if(!apiKeyHeaders) return res.status(403).json({success: false, message: "The api_key is needed"});

    if(apiKeyHeaders === apiKey) {
        next()
    } else {
        return res.status(403).json({success: false, message: "Unauthorized, wrong api_key"});
    }
    // next()
}

// Export the function
module.exports = {
    globalToken
}