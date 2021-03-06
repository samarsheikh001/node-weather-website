const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('../src/utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../template/views')
const partialsPath = path.join(__dirname, '../template/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))



app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Samar'
    })
})

app.get('/about', (req, res) => {
    res.render('about', { title: 'About me', name: 'Samar' })
})

app.get('/help', (req, res) => {
    res.render('help', { title: 'Help', helpText: 'This is some helpful text', name: 'Samar' })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({ error: 'Please provide an address' })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                forecast: forecastData,
                location: location,
                address: req.query.address
            })
        })

    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', { errorMessage: 'Help article not found', title: '404', name: 'Samar' })
})

app.get('*', (req, res) => {
    res.render('404', { errorMessage: 'My 404 page', title: '404', name: 'Samar' })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})