require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');

const db = require('./models');
const moment = require('moment');
const { Worker } = require('worker_threads');
const app = express();
const PORT = process.env.PORT || 3000;
let workDir = __dirname+"/workers/dbWorker.js";
const SECRET_SESSION = process.env.SECRET_SESSION;


// EXPRESS Server setup

// basic site setup

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public/'));
app.use(cookieParser(SECRET_SESSION));
app.use(session({
  secret : SECRET_SESSION,
  cookie: { maxAge: 60000 },
  resave: true,
  saveUninitialized: true
}));
app.use(flash());
// middleware that allows us to access the 'moment' library in every EJS view
app.use((req, res, next) => {
  res.locals.moment = moment;
  res.locals.alerts = req.flash();
  next();
});


// upload files to the crawler to be processed with nlp
app.use('/corpus', require('./routes/corpus'));
app.use('/manual', require('./routes/manual'));
app.use('/source', require('./routes/source'));
app.use('/event', require('./routes/event'));
app.use('/record', require('./routes/record'));
app.use('/util', require('./routes/util'));

// WORKER Setup testing

// const arbitrager = require('./modules/arbitrager');

// const arbitrage = new arbitrager(workDir);

// arbitrage.start();

// loading corpus on statup
// TODO: clean this up, load up processors on request, just playing around for now
// const nlpProcessor = require('./modules/nlp');
// const path = require('path');

// TODO: update your pdf file path here, i'll add a webpage to allow uploading of PDfs to scan later
// const testPdfPath = path.join(require.main.path, 'testDocuments/extraordinary-claims.pdf');
// new nlpProcessor(testPdfPath);


app.get('*', (req, res) => {
  res.status(404).render('404');
});

var server = app.listen(PORT, () => {
    console.log(`listening on PORT: ${PORT}`);
});

module.exports = server
