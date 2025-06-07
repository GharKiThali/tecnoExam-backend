
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const userRoutes = require('./routes/user.routes')
const bodyParser = require('body-parser');
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser"); 

app.use(morgan("tiny")); 
const allowedOrigins = [
  'http://localhost:5173',
  'https://lakshyamca-nimcet.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); 
app.use(bodyParser.json());



app.use('/api/auth', userRoutes);


module.exports = app;
