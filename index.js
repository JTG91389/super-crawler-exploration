require('dotenv').config();
let express = require('express');
let ejsLayouts = require('express-ejs-layouts');
let db = require('./models');
let moment = require('moment');
let app = express();
const PORT = process.env.PORT || 3000;

// loading corpus on statup
// TODO: clean this up, load up processors on request, just playing around for now
const nlpProcessor = require('./modules/nlp');
const path = require('path');

// TODO: update your pdf file path here, i'll add a webpage to allow uploading of PDfs to scan later
const testPdfPath = path.join(require.main.path, 'testDocuments/extraordinary-claims.pdf');
new nlpProcessor(testPdfPath);

// basic site setup

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(ejsLayouts)
app.use(express.static(__dirname + '/public/'))

// middleware that allows us to access the 'moment' library in every EJS view
app.use((req, res, next) => {
  res.locals.moment = moment;
  next();
});

app.use('/corpus', require('./routes/corpus'));

var server = app.listen(PORT, () => {
    console.log(`listening on PORT: ${PORT}`);
});

module.exports = server
