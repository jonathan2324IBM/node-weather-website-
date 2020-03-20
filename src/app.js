const path = require('path')//-> path is a native node module
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

//setup express.js
const app = express()

//dynamic port based on environment setting
const port = process.env.PORT || 3000

//Define paths for Express config
//path join joins the path to both variables input
//__dirname gets the current directory of whichever file you are in.
//in this case, __dirname gets us to the /src directory but we need to go out a folder into public so we use ../public to get into that folder.
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars and views location.
app.set('view engine', 'hbs') //this renders .hbs files when res.render is called
//setting up view path for express.js-> these are the pages for each link in the website.
app.set('views', viewsPath)
//This registers the partials so they can be used in our views
hbs.registerPartials(partialsPath) //register partials 


//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

//start page render-> we set the initial page to have no extension on the url so 
//if the user visits the home page, they are ready to interact with the UI
//the callback is called once the url matches the string value of the get method
//this responds with a req or res variable which stand for request vs response
//if there is a req-> this represents an HTTP request
//res-> reprensets an HTTP response
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
    //if the user does not input an addrss, send an error message.
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
                //this is the json data being sent to client side when we visit /weather?address=someaddress
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

