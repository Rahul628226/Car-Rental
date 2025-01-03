const express = require("express");
const dotenv = require("dotenv").config();
const cors = require('cors');
const session = require('express-session');
const connectDB = require("./config/dbConnection");

//google login
const passport = require('passport');
require('./Router/Vendor/Passport');

const app = express();
const port =process.env.PORT || 5000;

const fileUpload = require("express-fileupload");



const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5000",
    "http://localhost:5173",
    "http://localhost:5175",
    "http://localhost:5174",
    "https://car-listing-dashboard.netlify.app",
    
];
app.use((req, res, next) => {
    
    next();
});

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Preflight handling
app.options('*', cors()); // Allow all OPTIONS requests




app.use(session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, 
        maxAge: 24 * 60 * 60 * 1000
    }
}));



connectDB();
// middleware
app.use(express.json());
app.use(
    fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 }, // Set file size limit (50 MB in this case)
    })
  );
app.use(express.urlencoded({ extended: true })); 
//custome middleware
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// Initialize passport and connect it to the session
app.use(passport.initialize());
app.use(passport.session());


//Router - Middleware

const PricingRouter = require('./Router/Pricing/Pricing')
app.use('/api/admin',PricingRouter);

// Router - Cardetails

const CarDetailsRouter = require('./Router/CarDetails/CarDetails');
app.use('/api/vendor',CarDetailsRouter)

const CarBrand = require('./Router/CarDetails/CarBrand');
app.use('/api',CarBrand);

const SeateRouter = require('./Router/CarDetails/Seat');
app.use('/api',SeateRouter);

const CarCategoryRouter = require('./Router/CarDetails/CarCategory');
app.use('/api',CarCategoryRouter);

const CarFeatureRouter = require('./Router/CarDetails/Features');
app.use('/api',CarFeatureRouter);

const CarColorRouter = require('./Router/CarDetails/CarColor');
app.use('/api',CarColorRouter);

const FeatureTag =require('./Router/CarDetails/FeatureTag/FeatureTag')
app.use('/api',FeatureTag);



// vendor login
const googleAuth = require('./Router/Vendor/googleAuth');
const vendorReg = require('./Router/Vendor/VendorReg');
const vendorLogin = require('./Router/Vendor/VendorLogin');
const emailRouter = require('./Router/EmailRouter');
const vendorDetails = require('./Router/Vendor/VendorDetails');
const subScriptionRouter = require('./Router/Vendor/Subscription');
const tokenExpire= require('./middleware/TokenExpire');

const chatgpt =require('./Router/OpenAi/Chatgpt')

app.use('/api', vendorLogin);
app.use('/api', vendorReg);
app.use('/api', googleAuth);
app.use('/api', emailRouter);
app.use('/api', vendorDetails);
app.use('/api', subScriptionRouter);
app.use('/api', tokenExpire);
app.use('/api', chatgpt);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});