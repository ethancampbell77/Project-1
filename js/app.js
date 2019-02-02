// https://developers.google.com/youtube/iframe_api_reference

// https://developers.google.com/youtube/v3/docs/search#resource
function loadPlayer() {
    window.onYouTubePlayerAPIReady = function () {
        onYouTubePlayer();
    };
}

//Set then firebase configuration

//Set your db variable

//Function that sends stuff to firebase
// function sendToFirebase(ref, obj){
//     db.ref(ref).push(obj)
// }
var config = {
    apiKey: "AIzaSyAyTbXmD3Afa1S6ZUFFXm-vnkSegSEFNcQ",
    authDomain: "krave-project-1.firebaseapp.com",
    databaseURL: "https://krave-project-1.firebaseio.com",
    projectId: "krave-project-1",
    storageBucket: "krave-project-1.appspot.com",
    messagingSenderId: "833313290365"
  };
firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

var search = $("#search").val().trim();
var zip = $("zip").val().trim();


var recentSearch = {
    search: search,
    zip: zip
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


},
    function (errorObject) {

        console.log("Errors handled: " + errorObject.code);
    }
)





var player;

$(document).ready(function () {

    // function to load videos

    $("#submit").on("click", function () {

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

        //THis function creates a youtube object
        function onYouTubeIframeAPIReady(vidId, spot) {
            player = new YT.Player(spot, {
                height: '390',
                width: '640',
                videoId: vidId,
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
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
        }
        function stopVideo() {
            player.stopVideo();
            resetForm();
        }

        player.destroy();

        //Resets the input once the player is loaded

        function resetForm() {
            document.getElementById("search").value = "";
            document.getElementById("zip").value = "";
        }



    })

});
