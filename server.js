const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const path = require('path').join(__dirname, '/public/uploads')
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const bodyparser = require('body-parser')


// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const category = require('./routes/category');

const auth = require('./routes/auth');
const users = require('./routes/users');

const rating = require('./routes/rating');
const company = require('./routes/company');
const products = require('./routes/product');
const news = require('./routes/news')
const app = express();

// Body parser
app.use('/public/uploads', express.static(path));
app.use(bodyparser.json());

app.use(cors({ rogin : "*" }));
// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());


// Mount routers
app.use('/api/category', category);
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/rating', rating);
app.use('/api/product', products);
app.use('/api/order', require('./routes/order'));
app.use('/api/ui', require('./routes/index'));
app.use('/api/slider', require('./routes/sliderAds'))
app.use('/api/news', news)
app.use('/api/company', company)


app.use(errorHandler);
app.get('/', (req,res)=>{
  res.send("Hello Server")
})
const PORT = 3000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
