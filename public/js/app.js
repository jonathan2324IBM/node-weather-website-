console.log('Client side javascript file is loaded')


const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1') 
const messageTwo = document.querySelector('#message-2')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const location = search.value

    messageOne.textContent = 'Loading...'
    messageTwo.textContent = ''

    //the response is the json from the back end api that was fetched. from app.js in src. 
    //
    fetch(`/weather?address=${location}`).then((response) => {
        response.json().then((data) => {
            if(data.error){
                messageOne.textContent = data.error
                
            } else {
                messageOne.textContent = data.location
                messageTwo.textContent = `In ${data.location}, the forecast shows ${data.forecast.toLowerCase()} The high temperature is 
                ${data.tempHigh} degrees and the low temperature is ${data.tempLow} degrees. The current temperature is ${data.currentTemp} degress.`
            }
        
        })
    })
    

     
})
