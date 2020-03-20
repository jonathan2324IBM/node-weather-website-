const request = require('request')


const forecast = (longitude, latitude, callback) => {
    const url = `https://api.darksky.net/forecast/209d314456e3ea066144f3651f08f7c0/${latitude},${longitude}`

    request({ url, json: true }, (error, { body }) => { //destructured response.body to just be body

        if (error) {
            callback('Unable to connect to weather service.', undefined)
        } else if (body.error) {
            console.log('Unable to find location with coordinates provided.', undefined)
        } else {

            callback(undefined, {
                currentTemp: body.currently.temperature,
                precipProbability: body.currently.precipProbability,
                dailyData: body.daily.data[0]
            })

        }
    
    })

}





module.exports = forecast