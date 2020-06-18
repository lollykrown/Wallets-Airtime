const express = require('express')
const morgan = require('morgan'); //logger
const bodyParser = require('body-parser')
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, '/public/')));
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('tiny'))

const recharge = require('./routes/rechargeRoute')()

app.use('/recharge', recharge);

app.get('/', (req, res) => {
  res.render('index')
});

port = 4000
app.listen(port, function () {
  console.log(`Listening on port ${port}...`)
})