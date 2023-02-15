document.addEventListener('DOMContentLoaded', function() {
    var API_Key_Earthquake =  'f6bae715e6msha6463b347ed58d4p1c02a9jsndfe297d44900' //earthquake     
    var API_key = '45c2707f89d16318fbaddd18663434b4' // openweather

    $(document).ready(function() {
        
        displayHistory()

        $('#history_btn').click(function() {
            localStorage.clear()
            displayHistory()
        })

        $('#lucky').click(function() {
            showRandomEntry()
        })

        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
            })

        $('#search_btn').click(function() {
            $('#results').empty()
            var location = document.getElementById('inputField')
            
            // requests the coordinates of a city typed in by user
            $.get(`https://api.openweathermap.org/geo/1.0/direct?q=${location.value}&limit=5&appid=${API_key}`, function(data, status) {
            // if no result returned notifies user 
            if (data.length == 0) {
                var noResults = $('<div class="red">No result!</div>')
                $('#results').append(noResults) 
            }
            // displays options returned by request (up to 5)
            console.log(data)
            for (var i = 0; i < data.length; i++) {
                    var item = $(`<div class="result" data-country="${data[i].country}" data-name="${data[i].name}" data-location='["${data[i].lat}", "${data[i].lon}", "${data[i].name}"]'></div>`).text(`${data[i].name}, ${data[i].country}, ${data[i].state}`)
                    $('#results').append(item)
                }
                // specifies what happens when user clicks on one of the options
                $('.result').click(function() {
                    location.value = "" // clears input field
                    var locData = $(this).data('location')
                    var name = $(this).data('name')
                    var country = $(this).data('country')
                    console.log(locData)
                    console.log(name)
                    console.log(country)
                    $('#results').empty()
                    for (var i = 0; i < listOfCountryObjects.length; i++) {
                        if (listOfCountryObjects[i]['ISO2'] == country) {
                            var countryName = listOfCountryObjects[i]['Country']
                        }
                    }

                    document.getElementById('earthquake').scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
                    fetchEarthquakeInfo(locData[0], locData[1], countryName, name)
                    fetchCountryInfo(country, countryName, name)
                    saveToLocalStorage(locData[0], locData[1], name, countryName, country)
                    displayHistory()
                    displayMap(locData[0], locData[1])
                })
            
            })    
        })
    })

    function showCountryData(response, countryName, name) {
        var flag = $(`<img id="flag" src="${response[0]['flags']['png']}" alt="flag">`)
        $('#country_info').empty()
        $('#country_info').append(flag)
        var string_to_display = `${name} is a city in ${countryName} which is a country in ${response[0]['continents'][0]} that has borders with ${response[0]['borders']}. ${countryName} covers the area of ${response[0]['area']} square kilometers, its capital is ${response[0]['capital']} and is home to ${response[0]['population']} people.`
        $('#country_info').append(string_to_display)
    }

    function displayMap(lat, lon) {
        $('#map').empty()
        var mapToDisplay =  `<iframe width="100%" height="100%" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/view?key=AIzaSyB3QTuugkMPxf0T9jl4um4NovYGsnTO2lM&center=${lat},${lon}&zoom=6" allowfullscreen></iframe>`
        $('#map').append(mapToDisplay)
        }

        function fetchEarthquakeInfo(lat, lon, countryName, name) {
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': API_Key_Earthquake,
                'X-RapidAPI-Host': 'everyearthquake.p.rapidapi.com'
            }
        }
        fetch(`https://everyearthquake.p.rapidapi.com/latestEarthquakeNearMe?latitude=${lat}&longitude=${lon}`, options)
            .then(response => response.json())
            .then(response => 
                showEarthQuakeData(response, countryName, name)
                // console.log(response['data'][0]['date']) 
                // $('#earthquake_results').text(response.data[0]['title'])
            )
            .catch(err => console.error(err));
    }

    function fetchCountryInfo(country, countryName, name) {
        fetch(`https://restcountries.com/v3.1/alpha?codes=${country}`)
            .then(response => response.json())
            .then(response => 
                // console.log(response)
                // $('#covid_data').text(response[0]['capital'])
                showCountryData(response, countryName, name)
            )
            .catch(err => console.error(err))
    }

    function showEarthQuakeData(response, countryName, name) {
        $('#earthquake_data').empty()
        var last_earthquake = `<p>The last earthquake close to ${name} happened on ${response['data'][0]['date']}.</p>`
        console.log(last_earthquake)
        $('#earthquake_data').append(last_earthquake)
        var text_string = response['data'][0]['title']
        var magnitude = text_string.slice(2, 5)
        var earhquake_location = text_string.slice(8, text_string.length)
        var earthquake_magnitude = `<p>It had a magnitude of ${magnitude} and occured ${earhquake_location}</p>`
        $('#earthquake_data').append(earthquake_magnitude)
        console.log('hello', response)
    }

    // ========== localStorage ==========
    // saves searched city to local storage
    function saveToLocalStorage(latitude, longitude, city, countryName, country) {
        if (window.localStorage.getItem("cityObj") == null) {
            var cityObj = {}
            window.localStorage.setItem('cityObj', JSON.stringify(cityObj))
        }
        var cityObj = window.localStorage.getItem("cityObj")
        cityObj = JSON.parse(cityObj)
        var coordinates = [latitude, longitude, countryName, country]
        cityObj[city] = coordinates
        window.localStorage.setItem('cityObj', JSON.stringify(cityObj))    
    }

    // displays cities saved in local storage
    function displayHistory() {
        $('#previousSearch').empty()
        if (window.localStorage.getItem("cityObj") != null) {
            var myObj = window.localStorage.getItem("cityObj")
            myObj = JSON.parse(myObj)
            for (var i in myObj) {
                var button = $(`<button class="historyBtn" data-lat="${myObj[i][0]}" data-lon="${myObj[i][1]}" data-countryName="${myObj[i][2]}" data-country="${myObj[i][3]}" data-name="${i}"></button>`).text(i)
                $('#previousSearch').prepend(button)
            }   
        }
        clickHistory()
    }

    // enables clicking on history entries and shows data of that entry
    function clickHistory() {
        $('.historyBtn').click(function() {
            var lat = $(this).data('lat')
            var lon = $(this).data('lon')
            var coName = $(this).data('countryname')
            var count = $(this).data('country')
            var nam = $(this).data('name')

            fetchCountryInfo(count, coName, nam)
            fetchEarthquakeInfo(lat, lon, coName, nam)
            displayMap(lat, lon)
        })
    }

    function showRandomEntry() {
        x = Math.floor(Math.random() * cities.length)
        console.log(cities[x])
        var lat = cities[x]['CapitalLatitude']
        var lon = cities[x]['CapitalLongitude']
        var capitalName = cities[x]['CapitalName']
        var countryName = cities[x]['CountryName']
        var countryCode = cities[x]['CountryCode']
        fetchCountryInfo(countryCode, countryName, capitalName)
        fetchEarthquakeInfo(lat, lon, countryName, capitalName)
        displayMap(lat, lon)
    }
})