document.addEventListener('DOMContentLoaded', function() {
    var API_Key_Earthquake =  'f6bae715e6msha6463b347ed58d4p1c02a9jsndfe297d44900' //earthquake     
    var API_key = '45c2707f89d16318fbaddd18663434b4'
    
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_Key_Earthquake,
            'X-RapidAPI-Host': 'everyearthquake.p.rapidapi.com'
        }
    }

    $(document).ready(function() {
       
        $('#search_btn').click(function() {
            $('#results').empty()
            var location = document.getElementById('search_input')
            
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
                            var slug = listOfCountryObjects[i]['Slug']
                        }
                    }
                    console.log(slug)
                    fetch(`https://everyearthquake.p.rapidapi.com/latestEarthquakeNearMe?latitude=${locData[0]}&longitude=${locData[1]}`, options)
                        .then(response => response.json())
                        .then(response =>  
                            $('#earthquake_data').text(response.data[0]['title'])
                        )
                        .catch(err => console.error(err));
                    //=========================================================================//
                    // var covid_API_key = 'f6bae715e6msha6463b347ed58d4p1c02a9jsndfe297d44900'
                    // const options = {
                    //     method: 'GET',
                    //     headers: {
                    //         'X-RapidAPI-Key': covid_API_key,
                    //         'X-RapidAPI-Host': 'vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com'
                    //     }
                    // };
                    
                    fetch(`https://restcountries.com/v3.1/alpha?codes=${country}`)
                        .then(response => response.json())
                        .then(response => 
                            // console.log(response)
                            // $('#covid_data').text(response[0]['capital'])
                            showCountryData(response)
                        )
                        .catch(err => console.error(err));
                    

                })
            
            })    
        })
    })
    function showCountryData(response) {
        var source = response[0]['flag']
        console.log(source)
        var flag = $(`<img id="flag" src="${response[0]['flags']['png']}" alt="flag">`)
        $('#country_info').empty()
        $('#country_info').append(flag)
        console.log(response)
        // $('#covid_data').text(response[0]['population'])

    }
})