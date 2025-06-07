const app = require('./src/app.js');
const connect = require('./src/db/db');
connect();

const port = process.env.PORT || 3000
const dotenv = require('dotenv');
app.listen(port,()=>{
    console.log(`server is running on port: ${port}`);
})