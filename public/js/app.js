console.log('Client side javascript file is loaded')

//query into index.hbs form 
const weatherForm = document.querySelector('form')
//query into the index.hbs form input 
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1') 
const messageTwo = document.querySelector('#message-2')

//add event listener to get user input
weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    //gets the actual input from user value
    const location = search.value

    messageOne.textContent = 'Loading...'
    messageTwo.textContent = ''

    //the response is the json from the back end api that was fetched. from app.js in src. 
    //this sends the users input into the url for the browser which then communicates with app.js in src.
    //The /weather?address=somelocation calls /weather router option on src/app.js which then
    //sets the location variable in this file to the req.query.address variable in the src/app.js file
    //this means that the if that is a valid location, the geocode function will execute and then the 
    //forecast function will execute.
    //The next step is that forecast sends the forecastData information to the data variable listed below
    //the variables can now be called off of the data that was sent from the forecast function
    fetch(`/weather?address=${location}`).then((response) => {
        //this data variable that is return represents forecastData from app.js in src
        response.json().then((data) => {
            if(data.error){
                messageOne.textContent = data.error
                
            } else {
                messageOne.textContent = data.location
                messageTwo.textContent = `In ${data.location}, the forecast shows ${data.forecast.toLowerCase()} The high temperature is 
                ${data.tempHigh} degrees and the low temperature is ${data.tempLow} degrees. The current temperature is ${data.currentTemp} degrees with
                 a ${data.rainProb}% chance of rain.`
            }
        
        })
    })
    

     
})
