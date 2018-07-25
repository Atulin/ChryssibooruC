/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
isFullscreen = false;

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

app.initialize();

// GLOBAL VARIABLES
storage = window.localStorage;

// LOAD SETTINGS
$("#token").val(storage.getItem("token"));

document.addEventListener("backbutton", function(e){
    if(isFullscreen){
        e.preventDefault();
        navigator.app.backHistory();
    } else {
        e.preventDefault();
        navigator.app.exitApp();
    }
}, false);


// API VARIABLES
const url = "https://derpibooru.org/search.json?q=";
const webm = "img/webm.png";
let tags;
page = 1;
images = [];
index = 0;

// SEARCH FOR QUERY
$("#search").click(function(){
    loadImages()
});

// Load images
function loadImages(){
    tags = $("#searchbar").val();
    tags = tags.replace(/ /g, "+").replace(/,/g, "%2C");
    var token = storage.getItem("token");
    let query = url
        + tags
        + "&page=" + page
        + "&key=" + token;

    $.ajax({
        url: query,
        success: handleResult
    });

    function handleResult(result){
        let i;
        let type;
        let full;
        for (i = 0; i < result.search.length; i++) {
            let img = result.search[i];
            let thumb = "https:" + img.representations.thumb;
            type = img.mime_type;
            full = "https:" + img.representations.medium;

            images.push(img);

            if (type === "video/webm") {
                $(".content").append("<div class='image-container'><img class='image' src='" + webm  + "' onclick='openFullscreen(\"" + i + "\")'></div>")
            } else {
                $(".content").append("<div class='image-container'><img class='image' src='" + thumb + "' onclick='openFullscreen(\"" + i + "\")'></div>")
            }
        }
    }

    page += 1;

}

// FULLSCREEN IMAGE
function openFullscreen(id) {
    id = parseInt(id);
    index = Math.max(0, id);

    $(".fullscreen").addClass("enabled");

    let img = images[id];

    var full = "https:" + img.representations.medium;
    var type = img.mime_type;

    var html;
    if (type === "video/webm") {
        html = "<video class='full-image' src='" + full + "' controls loop autoplay>"
    } else {
        html = "<img class='full-image' src='" + full + "'>"
    }

    $("#fullscreenImg").html(html);

    if (id > images.length - 5) {
        loadImages()
    }
}

function closeFullscreen() {
    $(".fullscreen").removeClass("enabled");
    $("#fullscreenImg").html("");
}

function nextImage() {
    openFullscreen(index+1)
}

function prevImage() {
    openFullscreen(index-1)
}

// SIDEBAR
function openSidebar() {
    $(".sidebar").addClass("enabled");
}

function closeSidebar() {
    $(".sidebar").removeClass("enabled");
}

// SAVE TOKEN
$("#saveToken").click(function () {
    let token = $("#token").val();
    storage.setItem("token", token)
});