const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const accountSid = 'ACabd722a3a18badaa5eb1dd9f77893fae';
const authToken = '0672f17ef3dfc4cc9669317c3e5ab390';

const client = new twilio(accountSid, authToken);

const app = express();

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './views');

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const data = {
        person: {
            firstName: 'Brandon',
            lastName: 'Benoit',
        }
    }
    res.render('index', data);
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.post('/thanks', (req, res) => {
    client.messages.create({
        body: req.body.firstName + ' ' + req.body.lastName + ' has viewed your portfolio, and wants to talk to you. Please contact them at ' + req.body.email + '.',
        to: '+18582487569',
        from: '+18582484410'
    })
    .then((message) => console.log(message.sid))
    .then(res.render('thanks', { contact: req.body }))
});

app.listen(process.env.PORT || 8080, () => {
    console.log('listening at http://localhost:' + process.env.PORT);
});