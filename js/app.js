// https://developers.google.com/youtube/iframe_api_reference

// https://developers.google.com/youtube/v3/docs/search#resource
function loadPlayer() {
    window.onYouTubePlayerAPIReady = function () {
        onYouTubePlayer();
    };
}
// this function takes the zip code and changes it to longitutde and lattitdue for resurant search

// function lngLat (){
//     $.ajax({
//        url : "https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:" + zip + "&sensor=false&key=AIzaSyA6N-1it5aWPiccey5v0jP30BI9HAlZVME",
//        method: "GET",
//     }).then(function(data){
//            latitude = data.results[0].geometry.location.lat;
//            longitude= data.results[0].geometry.location.lng;
       
//     }
//     )};

function lonlat() {
    var input = $("#zip").val();
    
    var xhr = $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + zip + "&key=AIzaSyA6N-1it5aWPiccey5v0jP30BI9HAlZVME");

    xhr.done(function(data) {
        latitude = data.results[0].geometry.location.lat;
        longitude = data.results[0].geometry.location.lng;

    });
    
}

//Set then firebase configuration

var config = {
    apiKey: "AIzaSyAyTbXmD3Afa1S6ZUFFXm-vnkSegSEFNcQ",
    authDomain: "krave-project-1.firebaseapp.com",
    databaseURL: "https://krave-project-1.firebaseio.com",
    projectId: "krave-project-1",
    storageBucket: "krave-project-1.appspot.com",
    messagingSenderId: "833313290365",
  };
firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

var recentSearch = {
    search: search,
    zip: zip,
};


database.ref().push(recentSearch);

console.log(recentSearch.search);
console.log(recentSearch.zip);

$("input").val("");

database.ref().on("child_added", function (childSnapshot) {

    console.log("Search Term: " + childSnapshot.val().search);
    console.log("Zip: " + childSnapshot.val().zip);

    $("#search").append(

        "<tr class='search'><td id='recentSearch'> " + childSnapshot.val().search +
        " </td><td id='zip'> " + childSnapshot.val().zip 
    )


    database.ref("/recipes").on("child_added", function (childSnapshot) {
        // log the values
        console.log("Search Term: " + childSnapshot.val().search);
        console.log("Zip: " + childSnapshot.val().zip);

        $("#resultsTable").append(
            `<tr><th scope="row">${childSnapshot.val().search}</th>`
        );
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    $("#submit").on("click", function (event) {
        event.preventDefault();
        var search = $("#search").val().trim();
        var zip = $("#zip").val();
        var latitude = 0;
        var longitude = 0;

        
        // create a temporary object for holding the new train data
        var recentSearch = {
            search: search,
            zip: zip
            
        };
        
        console.log(`Hey ${recentSearch.zip}`)
        // upload the new train data to the database
        database.ref("/recipes").push(recentSearch);
        // console log the values that were just pushed to the database
        console.log(recentSearch.search);
        console.log(recentSearch.zip);
        // clear the form values after values have been stored
        wait()
        // create a firebase event for adding the data from the new trains and then populating them in the DOM.
        lngLat();
        console.log(zip);
        console.log("alex" + latitude)
        console.log("alex" + longitude)
        restaurant();
        console.log(latitude)
        console.log(longitude)
    });





    // function to load videos
    function wait() {
        $("#recipes").empty();
        loadPlayer();
        var input = $("#search").val().trim() + " recipe";
        console.log(input);
        var apiKey = "&key=AIzaSyC-eggb7gTlK5ThaxuAyyXs6jqXZ92fXk0";
        var queryURL = `https://www.googleapis.com/youtube/v3/search?q=${input}&${apiKey}&maxResults=1&part=snippet`;
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            // function that executes to display videos on the page
            onYouTubeIframeAPIReady(response.items[0].id.videoId, "recipes")
        })
    }

        //THis function creates a youtube object
        function onYouTubeIframeAPIReady(vidId, spot) {
            player = new YT.Player(spot, {
                height: '390',
                width: '640',
                videoId: vidId,
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange,
                }
            });
        }

        // 4. The API will call this function when the video player is ready.
        function onPlayerReady(event) {
            event.target.playVideo();
        }

        // 5. The API calls this function when the player's state changes.
        //    The function indicates that when playing a video (state=1),
        //    the player should play for six seconds and then stop.
        var done = false;
        function onPlayerStateChange(event) {
            if (event.data == YT.PlayerState.PLAYING && !done) {
                setTimeout(stopVideo, 1000);
                done = true;
            }
        };

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        event.target.playVideo();
    }

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    var done = false;
    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
            setTimeout(stopVideo, 1000);
            done = true;
        }
    }
    function stopVideo() {
        player.stopVideo();
        resetForm();
    }

        // Start of resturant search and display
function restaurant(){
// call google api to search for resturants
$("#restaurants").empty();
        var input = $("#search").val().trim();
        console.log(input);
        var apiKey = "&key=AIzaSyC-eggb7gTlK5ThaxuAyyXs6jqXZ92fXk0";
        var queryURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=restaurant&keyword="+ input + apiKey +"&location=" + latitude +","+ longitude +"&radius=2000"
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            // function that executes to display videos on the page
            $("#restaurants").text(response[0].name)
        })
     

}
});
