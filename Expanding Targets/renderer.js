// Tips and hints are provided throughout, make sure to read them!
const app = require('electron').remote.app;
const fileDir = app.getPath('desktop');
const path = require("path");

var pausePlay = document.getElementById("player-button");
var music = document.getElementById("music-player");
var display = document.getElementById("volume-display");
var target = document.getElementById("volume-target");
var counter = document.getElementById("counter");

var fs = require('fs');

// this will hold all the data we need
var dataLog = "";

// this will count how many clicks have occured
var trial = -1;
var clicks = 0;

var count = 0;

// max number of trials to run 
var maxTrials = 6;

var numIcons = 6;

var maxCalls = maxTrials/numIcons;

var iconsCalled = new Array(6).fill(0);

// reference our start button
var startButton = document.getElementById("start-button");

// display how many tasks a user has completed (choose the correct HTML element)
// var counterDisplay = document.getElementById("counter");

// display the target icon to click (find the element with this HTML tag)
// var indicator = document.getElementById("indicator")


// element that holds all your icons 
var parent = document.getElementById("volume-bar")


// array of all icons (hint: use the parent var to reference its children icons)
var buttons = parent.children;
var b1 = buttons[0];
var b2 = buttons[1];
var b3 = buttons[2];
var b4 = buttons[3];
var b5 = buttons[4];
var b6 = buttons[5];

parent.appendChild(b1);
parent.appendChild(b2);
parent.appendChild(b3);
parent.appendChild(b4);
parent.appendChild(b5);
parent.appendChild(b6);





/////////////////////////////////////////////////////////////////////////////////////
// TODO: Set the filepath so you know where the .csv file is going! 
/////////////////////////////////////////////////////////////////////////////////////

function save()
{
  // change the filepath in the writeFile() function
  fs.writeFile( path.resolve(fileDir, "ExpandingTargets"+trial+".csv"), dataLog, (err)=> {
    if (err) alert(err);
    alert("all tasks are done");
  });
}

/////////////////////////////////////////////
// TODO: Complete the randomIcon function! //
/////////////////////////////////////////////

function randomIcon()
{
  var iconIndex = Math.floor(Math.random()*6);
  while (iconsCalled[iconIndex] >= maxCalls){
    iconIndex = Math.floor(Math.random()*6);
  }

  return iconIndex;
}

pausePlay.onclick = function(){
  if (music.paused == true){
    music.play();
    pausePlay.src = "https://cmps-people.ok.ubc.ca/bowenhui/341/2020/project/a8assets/pause.png";
    display.innerHTML = "Current Volume: " + (music.volume*100);
  } else {
    music.pause();
    pausePlay.src = "https://people.ok.ubc.ca/bowenhui/341/2020/project/a8assets/play.png";
    display.innerHTML = "Music Paused";
  }
}

/////////////////////////////////////////////
// TODO: Complete the timedClick function! //
/////////////////////////////////////////////
var timedClick = function()
{
  // disables the start button so user can't press it twice 
  startButton.onclick = function(){};
  startButton.style.display = "none";

  // call randomIcon function to get random index and the matching icon
  var targetIndex = randomIcon();
  // frequency[targetIndex]++;
  // while (frequency[targetIndex] > numIcons){
  //   targetIndex = randomIcon();
  // }
  var targetVolume = buttons[targetIndex].getAttribute('data-volume');
  counter.style.display = "none";
  target.style.display = "block";
  target.innerHTML = "Set the volume to " + targetVolume;


  // indicator.src = targetIcon.src;

  var startTime = performance.now();
  
  // this is where we are going to start watching for clicks on icons
  // this loop will add an onclick function to each icon
  for(var i=0; i < buttons.length; i++)
  {
    buttons[i].onclick = function()
    {
      // everything in here will occur when an icon is pressed

      var endTime = performance.now();
      var totalTime = endTime - startTime;
      totalTime = Math.round(totalTime);
      alert("You took " + totalTime + " ms!");


      
      
      // record the time and positions of the target icon and the icon the user actually pressed
      // this is to be stored in a new line in the 'dataLog' variable
      // append to the 'dataLog' variable, a line like 'timeTaken','targetIndex','iconClicked'
      // to save you some headache, we define iconClicked for you
      var volume = this.dataset.volume; // INCLUDE THIS
      var iconClicked = volume/20;
      iconsCalled[targetIndex]++;
      display.innerHTML = "Current Volume: " + volume;
      music.volume = volume /100;

      counter.innerHTML = "Trials completed: " + (count+1);
      counter.style.display = "block";
      count++;
      target.style.display = "none";




      // now add to the end of the 'dataLog' variable as explained above

      clicks++;
      // counterDisplay.innerHTML = clicks + " out of " + maxTrials + " completed.";
      dataLog = dataLog +clicks+", "+targetVolume+", "+  volume+", "+totalTime+ "\n";
      
      if (clicks==maxTrials){
        trial++;
        save();
        count=0;
        clicks=0;
        dataLog="";
        iconsCalled = new Array(6).fill(0);
        
      }
      // modify the innerHTML property of counterDisplay
      // it should show the user how many clicks have currently been completed

      // if maxTrials is reached, then data collection is over, so call save and reset 'clicks' and 'dataLog'
      for(var j=0; j < buttons.length; j++){
        buttons[j].onclick = function(){};
      }
      // reactivate the start button by changing the onclick function from nothing back to starting the trial
      startButton.innerHTML = "Start Next Trial";
      startButton.style.display = "block";
      startButton.onclick = timedClick;
      
    }
  }
}


var expandingTargets = function(e)
{
    //coords of mouse
    var x2 = e.clientX;
    var y2 = e.clientY;
    //display coords
    // var coords = document.getElementById("location");
    // coords.innerHTML = "You are at: (" + x2 + "," + y2 + ")";
    //loops through every icon to apply function
    for (var i = 0; i < buttons.length; i++){
      //gets bounding box of given icon
      var imgBoundingBox = buttons[i].getBoundingClientRect();
      
      //coords of icon[i], centered
      var x1 = imgBoundingBox.left + buttons[i].width/2;
      var y1 = imgBoundingBox.top + buttons[i].height/2;

      //difference between mouse and icon coords
      var deltaX = x2 - x1;
      var deltaY = y2 - y1; 

      //use distance formula to calculate the distance between the mouse and icon
      var distance = Math.sqrt(Math.pow(deltaX, 2)+Math.pow(deltaY, 2));

      //use distance to dynamically change icon width and height between 3x and normal
      buttons[i].style.width =  100 - distance + 'px';
      buttons[i].style.height = 100 - distance + 'px';
      buttons[i].style.minHeight =  50 + 'px';
      buttons[i].style.minWidth = 50 + 'px';

    }
}

window.onload = function() 
{ 
  // majority of the work will be done in timedClick
  
  document.onmousemove = expandingTargets;
  startButton.onclick = timedClick;
}
