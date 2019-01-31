//   https://www.googleapis.com/youtube/v3/search?q=&key=AIzaSyC-eggb7gTlK5ThaxuAyyXs6jqXZ92fXk0&part=snippet
// `https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&${apiKey}&part=snippet`

function displayvideos(i) {

    $("#recipes").empty();

    var apiKey = "&key=AIzaSyC-eggb7gTlK5ThaxuAyyXs6jqXZ92fXk0";   
    var queryURL =  `https://www.googleapis.com/youtube/v3/search?q=${input}&${apiKey}&maxResults=2&part=snippet`;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {

            var results = response.data;
        
                // create <div>, assign class to hold images

                var displayDiv = $("<div>");
                displayDiv.addClass("holder");

                var videos = $("<video>");
                videos.addClass("col-s12")
                displayDiv.append(videos);

                console.log(response);

                $("#recipes").append(displayDiv);
            

        })
    }


$(document).ready(function () {

    var input = $("#search").val().trim();



      

});