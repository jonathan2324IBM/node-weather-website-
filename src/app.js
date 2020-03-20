const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

//dynamic port
const port = process.env.PORT || 3000

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars and views location.
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

//start page render
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Jonathan Huertas'
    })
})

//about page render
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Jonathan'
    })
})

//help page render
app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'help page',
        title:'Help',
        name: 'Jonathan'
    })
})

//weather page render
app.get('/weather', (req, res) => {

    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address to search.'
        })
    } 

    //need to use default object brackets to prevent crashing cannot get latitude of undefined object even 
    //if no data was provided
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => { //the data object gets destructured 

            if(error) {
                return res.send({
                    error: error
                })
            }
        
            forecast(longitude, latitude, (error, forecastData) => {
                if(error) {
                    return res.send({
                        error: error
                    })
                }
                //this is the data being sent to client side
                res.send({
                    currentTemp: forecastData.currentTemp,
                    forecast: forecastData.dailyData.summary,
                    icon: forecastData.dailyData.icon,
                    tempLow: forecastData.dailyData.temperatureLow,
                    tempHigh: forecastData.dailyData.temperatureHigh,
                    location: location,
                    address: req.query.address,
                    rainProb: forecastData.precipProbability
                })
            })
        })
    

})

//example
app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })
    }

    console.log(req.query.search)

    res.send({
        products: []
    })
})


//
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 Help',
        name: 'Jonathan',
        errorMessage: 'Help article not found'
    })
})

//404 page render-> must be last because express looks for match top to bottom
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Jonathan',
        errorMessage: 'Page not found.'
    })
})

//setting up server on port 3000
app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

