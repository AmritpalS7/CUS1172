//Amritpal Singh
//CUS 1172
//Project 3 - JS file

//global variables used in JS file
var amountCorrect = 0;//keeps track of number correct -> to keep track of the score
var quizSelection;//keeps track of which quiz the user chose
var quizSize;//keeps track of the number of questions in the quiz that is chosen <- we could just have this hardcoded to 20 questions, but allows for more/less questions
var pastQ = [];//array which keeps track of past questions and whether or not you got them right (for tracker use)
var userName;//keeps track of student name
var startTime;//keeps track of the time the user started the quiz
var elapsedTimeIntervalRef;//keeps track of the elapsed time interval
var totalTime;//holds the current elapsed time


// appState, keep information about the State of the application
const appState = {
    current_view : "#intro_view",
    current_question : -1,
    current_model : {}
}



document.addEventListener('DOMContentLoaded', () => {

//
//Code for the switch on the top right to change the color of the page
//
  var checkbox = document.querySelector("#colorSwitch");

  checkbox.addEventListener('change', function() {
    if (this.checked) {
      var r = document.querySelector(':root');
      r.style.setProperty('--primaryColor', '#333');
      r.style.setProperty('--secondaryColor', 'rgb(47,47,47)');
      r.style.setProperty('--tertiaryColor', '#292929');
      r.style.setProperty('--accentColor', 'Aquamarine');
      r.style.setProperty('--textColor', 'White');
      r.style.setProperty('--hoverColor', '#222');
      r.style.setProperty('--progressColor', '#292929');
      }
     else {
        var r = document.querySelector(':root');
         r.style.setProperty('--primaryColor', 'AliceBlue');
         r.style.setProperty('--secondaryColor', '#C4E2E6');
         r.style.setProperty('--tertiaryColor', '#BAD7DF');
         r.style.setProperty('--accentColor', '#3B585B');
         r.style.setProperty('--textColor', '#5A707A');
         r.style.setProperty('--hoverColor', '#BAD7DF');
         r.style.setProperty('--progressColor', "#3B585B");
      }
    });



  // Set the state at startup to intro view
  appState.current_view =  "#intro_view";
  appState.current_model = {
    action : "start_app"
  }
  update_view(appState);



  //
  // EventDelegation - handle all events of the widget
  //
  document.querySelector("#widget_view").onclick = (e) => {
      handle_widget_event(e)
  }
});



//
//Calculates the elapsed time from the difference from the start time in the correct format ex hours:minutes:seconds - from w3schools
//

var timeAndDateHandling = {
    getElapsedTime: function (startTime) {

        let endTime = new Date();//records time now

        let timeDiff = endTime.getTime() - startTime.getTime(); //Gets the elapsed time in Date format by subtracting endTime from startTime

        timeDiff = timeDiff / 1000;// Convert time difference from milliseconds to seconds

        let seconds = Math.floor(timeDiff % 60); //Finds extra seconds that don't fit into a full minute

        let secondsAsString = seconds < 10 ? "0" + seconds : seconds + "";//if seconds are less than 10, adds a 0 so formatting looks correct ex 10:01

        timeDiff = Math.floor(timeDiff / 60);//Find number of full minutes

        let minutes = timeDiff % 60; //Find extra minutes that don't fit into an hour

        let minutesAsString = minutes < 10 ? "0" + minutes : minutes + "";//if minutes are less than 10, adds a 0 so formatting looks correct ex 01:10

        timeDiff = Math.floor(timeDiff / 60);//find number of full hours

        let hours = timeDiff % 24; //Finds extra hoyrs that don't fit into a full day

        timeDiff = Math.floor(timeDiff / 24);//Find number of full days

        // The rest of timeDiff is number of days
        let days = timeDiff;

        let totalHours = hours + (days * 24); // add days to hours
        let totalHoursAsString = totalHours < 10 ? "0" + totalHours : totalHours + "";

        if (totalHoursAsString === "00") {
            return minutesAsString + ":" + secondsAsString;//if 0 hours returns as minutes:seconds
        } else {
            return totalHoursAsString + ":" + minutesAsString + ":" + secondsAsString; //if more than 59 minutes and 59 seconds return as hour:minutes:seconds
        }
    }
}


//
//Handles clicks that occur in the widget view div
//
function handle_widget_event(e) {

  if (appState.current_view == "#intro_view"){
    pastQ = [];//sets all var values to zero whenever we return back to the landing page
    amountCorrect=0;
    appState.current_question = 0;


    if (e.target.dataset.action == "start_app") { //once the user clicks on a quiz
      var forms = document.getElementsByClassName('needs-validation'); //from w3schools, if one of the fields is not entered, prevents submisstion and adds pop up message - requires student name
      var validation = Array.prototype.filter.call(forms, function(form) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            form.classList.add('was-validated');
            var tag = document.createElement("p");
            var text = document.createTextNode("Please fill out all fields");
            tag.appendChild(text);
            var section = document.getElementById("feedback");
            }
          else{
            userName = document.querySelector("#user_name").value;
            event.preventDefault();
            form.classList.remove('was-validated');
            document.getElementById("myForm").reset();

            pastQ = [];
            amountCorrect=0;
            appState.current_question = 0;


        if(e.target.id == "htmlstartbutton"){//if the user clicks on the htmlstartbutton, loads that quiz from the correct api
            var r = document.querySelector(':root'); //just some image sizing to make it look nicer depending on quiz
            r.style.setProperty('--imageWidth', '350px');
            quizSelection = "html";
            fetch('https://my-json-server.typicode.com/AmritpalS7/HtmlQuestions/htmlQuestions').then(//simply finds the amount of questions in that quiz, this is not neccessary, we could just hardcode 20
              (response) => {
                return response.json();
              }
            ).then(
              (data) =>{
                quizSize = data.length;
              }
            ).catch(
              (err) => {
                console.error(err);
              }
            );



              fetch(`https://my-json-server.typicode.com/AmritpalS7/HtmlQuestions/htmlQuestions/${appState.current_question+1}`).then(//updates the view and model to the first question
              (response) => {
                return response.json();
              }
            ).then(
              (data) =>{
                 appState.current_model = data;
                  // process the appState, based on question type update appState.current_view
                  setQuestionView(appState);
                  // Now that the state is updated, update the view.
                  update_view(appState);
              }
            ).catch(
              (err) => {
                console.error(err);
              })


        }

        else if (e.target.id == "javastartbutton"){//same thing except for java quiz
          var r = document.querySelector(':root');
          r.style.setProperty('--imageWidth', '800px');
          quizSelection = "java";
            fetch('https://my-json-server.typicode.com/AmritpalS7/JavaQuestions/javaQuestions').then(
              (response) => {
                return response.json();
              }
            ).then(
              (data) =>{
                quizSize = data.length;
              }
            ).catch(
              (err) => {
                console.error(err);
              }
            );



              fetch(`https://my-json-server.typicode.com/AmritpalS7/JavaQuestions/javaQuestions/${appState.current_question+1}`).then(
              (response) => {
                return response.json();
              }
            ).then(
              (data) =>{
                 appState.current_model = data;
                  setQuestionView(appState);
                  update_view(appState);
              }
            ).catch(
              (err) => {
                console.error(err);
              })

        }
            startTime = new Date();//onclick also sets the startTime so we can calculate elapsed time from it
          }})}}


  //
  // Handle the answer event.
  //

  //Handle answer event for true false questions
  if (appState.current_view == "#question_view_true_false") {
    if (e.target.dataset.action == "answer") {
       // Controller - implement logic.
         check_user_response(e.target.dataset.answer, appState.current_model);
     }
   }

   // Handle answer event for text questions.
   if (appState.current_view == "#question_view_text_input") {
       if (e.target.dataset.action == "submitAnswer") {
           user_response = document.querySelector("#textAnswer").value;
           check_user_response(user_response, appState.current_model);
       }
    }

    // Handle answer event for multiple choice questions.
    if(appState.current_view == "#question_view_multiple_choice"){
        if(e.target.dataset.action == "submitAnswer"){
           var checkRadio = document.querySelector('input[name="multipleChoiceAnswer"]:checked');
             if(checkRadio != null) {
                 check_user_response(checkRadio.value, appState.current_model);
             }
         }
     }

     // Handle answer event for image then answer questions.
    if(appState.current_view == "#question_view_image"){
        if(e.target.dataset.action == "submitAnswer"){
           var checkRadio = document.querySelector('input[name="imageTextAnswer"]:checked');
             if(checkRadio != null) {
                check_user_response(checkRadio.value, appState.current_model);
               }
           }
         }

    // Handle answer event for image as answer questions.
    if(appState.current_view == "#question_view_imageAnswer"){
       if(e.target.dataset.action == "submitAnswer"){
           var checkRadio = document.querySelector('input[name="imageAnswer"]:checked');
             if(checkRadio != null) {
                check_user_response(checkRadio.value, appState.current_model);
               }
           }
         }


    // Handle answer event for the end view
    if (appState.current_view == "#end_view") {
        if (e.target.dataset.action == "start_again") {//if we click start again returns to the landinf page
          appState.current_view =  "#intro_view";
          appState.current_model = {
            action : "start_app"
          }
          update_view(appState);
        }
        if (e.target.dataset.action == "retake_quiz") {//if we click retake, resets all variables, and loads the first question again
          appState.current_question = 0;
          pastQ = [];
          amountCorrect=0;

          if(quizSelection=="html"){//if quiz selection is html, sets to first html question
          fetch(`https://my-json-server.typicode.com/AmritpalS7/HtmlQuestions/htmlQuestions/${appState.current_question+1}`).then(
          (response) => {
            return response.json();
          }
        ).then(
          (data) =>{
            appState.current_model = data;
              setQuestionView(appState);
              startTime = new Date();
              update_view(appState);
          }
        ).catch(
          (err) => {
            console.error(err);
          })}

          else if(quizSelection=="java"){//same thing except for java quiz
            fetch(`https://my-json-server.typicode.com/AmritpalS7/JavaQuestions/javaQuestions/${appState.current_question+1}`).then(
            (response) => {
              return response.json();
            }
          ).then(
            (data) =>{
              appState.current_model = data;
                setQuestionView(appState);
                  startTime = new Date();
                update_view(appState);
            }
          ).catch(
            (err) => {
              console.error(err);
            })}
          }}

    // Handle answer event for incorrect answer
    if(appState.current_view == "#feedback_view_incorrect"){
       if(e.target.dataset.action == "submit"){
          updateQuestion(appState);
          setQuestionView(appState);
          update_view(appState);
      }
    }


 } // end of hadnle_widget_event

//
//if the user clicks on the return to menu button on the tracker, creates an alert
//
function returnToStart(){
     if (confirm("Are you sure you want to return to the start menu? All current progress will be lost!")) {
         appState.current_view  = "#intro_view";
         appState.current_model = {
           action : "start_app"
         }
         update_view(appState);
     }
}

//
//code to check whether the users answer choice matches what's in the json object from the api, also pushes to pastQ so we can know if the past answer was correct or incorrect
//
function check_user_response(user_answer, model) {
  if (user_answer == model.correctAnswer) {
    var question = {
      "questionNum" : appState.current_question+1,
      "status": "correct",
    }
    pastQ.push(question);
      handleResponse(appState, true);
  }
  else{
    var question = {
      "questionNum" : appState.current_question+1,
      "status": "incorrect",
  }
    pastQ.push(question);
    handleResponse(appState, false);
    }
}

//
//handles the respsponse (whether correct or not) - if correct, waits one second and moves to the next question else just switches to incorrect and waits for button press
//
function handleResponse(appState, response){
  if(response){
    appState.current_view = "#feedback_view_correct";
    amountCorrect ++;
    update_view(appState);
    setTimeout(function(){
      updateQuestion(appState);
      setQuestionView(appState);
      update_view(appState);
    },1000);  }
  else{
    appState.current_view = "#feedback_view_incorrect";
    update_view(appState);
  }
}


//
// updates the question
//
function updateQuestion(appState) {
    if (appState.current_question < quizSize-1) {
      appState.current_question =   appState.current_question + 1;
      if(quizSelection == "html"){ //if html, sets question view to next question for the html quiz and updates it
      fetch(`https://my-json-server.typicode.com/AmritpalS7/HtmlQuestions/htmlQuestions/${appState.current_question+1}`).then(
      (response) => {
        return response.json();
      }
    ).then(
      (data) =>{
        appState.current_model = data;
          setQuestionView(appState);
          update_view(appState);
      }
    ).catch(
      (err) => {
        console.error(err);
      })}
      else if (quizSelection == "java"){//same thing except for java quiz
        fetch(`https://my-json-server.typicode.com/AmritpalS7/JavaQuestions/javaQuestions/${appState.current_question+1}`).then(
        (response) => {
          return response.json();
        }
      ).then(
        (data) =>{
          appState.current_model = data;
            setQuestionView(appState);
            update_view(appState);
        }
      ).catch(
        (err) => {
          console.error(err);
        })
      }
    }
    else { //if on last question, sets current question to negative one, so we can go to endview
      appState.current_question = -1;
      appState.current_model = {};
    }
  }



//
//Updates the current view depending on what type the question is from the api
//
function setQuestionView(appState) {
  if (appState.current_question == -1) {
      appState.current_view  = "#end_view";
    return
  }
  if (appState.current_model.qType == "tf")
    appState.current_view = "#question_view_true_false";
  else if (appState.current_model.qType == "ti") {
    appState.current_view = "#question_view_text_input";
  }
  else if(appState.current_model.qType=="mc"){
    appState.current_view = "#question_view_multiple_choice";
  }
  else if(appState.current_model.qType=="ita"){
    appState.current_view = "#question_view_image";
  }
  else if(appState.current_model.qType=="iaa"){
    appState.current_view = "#question_view_imageAnswer";
  }

}


//
// Updates the view(what we see)
//
function update_view(appState) {
  if (appState.current_view != "#intro_view" && appState.current_view != "#end_view" &&  appState.current_view != "#feedback_view_correct" &&  appState.current_view != "#feedback_view_incorrect" ){
     var html_element = render_widget(appState.current_model, "#tracker") //renders tracker only if we are in the questions
     html_element += render_widget(appState.current_model, appState.current_view)
  }
  else{
  var html_element = render_widget(appState.current_model, appState.current_view)
  }
  document.querySelector("#widget_view").innerHTML = html_element;

  if(appState.current_view == "#end_view"){//sets some variables and the display depending on the score
      var finalScore = ((amountCorrect/pastQ.length)*100).toFixed(2);
      var html_element = render_widget(appState.current_model, appState.current_view);
      totalTime = timeAndDateHandling.getElapsedTime(startTime);

      if(finalScore>=80){
            document.querySelector("#currScore").innerHTML=`<br><h4 style="color:white; text-align:center">Congratulations ${userName}! You passed!</h4><h5>Your Final Score was: ${finalScore}%</h5><h6>The quiz took a total of: ${totalTime}`;
      }
      else if(finalScore<80){
        document.querySelector("#currScore").innerHTML=`<br><h4 style="color:white; text-align:center">Sorry ${userName}, you failed.</h4><h5>Your Final Score was: ${finalScore}%</h5><h6>The quiz took a total of: ${totalTime}`;
      }

    }

  if (appState.current_view != "#intro_view" && appState.current_view != "#end_view" &&  appState.current_view != "#feedback_view_correct" &&  appState.current_view != "#feedback_view_incorrect" ){//sets variables in the trcker if on question view depending on current question and past answers
      if(appState.current_question==0){
         document.querySelector("#currScore").innerHTML= "0.00%";
         document.querySelector("#pValue").innerHTML="Progress: 0%";
      }
      else{
         document.querySelector("#currScore").innerHTML=((amountCorrect/appState.current_question)*100).toFixed(2) + "%";
         document.querySelector("#pValue").innerHTML="Progress: " + (appState.current_question)*(100/quizSize) + "%";
      }
      document.getElementById("pBar").style=`width: ${(appState.current_question)*(100/quizSize)}%`;
      var elapsedTimeText = document.getElementsByClassName("elapsed-time-text")[0];
      elapsedTimeIntervalRef = setInterval(() => {
        elapsedTimeText.innerText = timeAndDateHandling.getElapsedTime(startTime);}, 1000);

      let list = document.getElementById("pastQuestions");


      //iterates through past questions array and adds them to the left side of the tracker
      pastQ.forEach((item)=>{
        let li = document.createElement("li");
        if(item.status=="correct"){
            li.innerHTML = ` <div class="row"> <div class="col-7"> <p>Question ${item.questionNum}</p></div> <div class="col-5"> <svg xmlns='https://www.w3.org/2000/svg' width="16" height="16" fill="#5cb85c" class="bi bi-check-circle-fill" viewBox="0 0 16 16" style="align:right;">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </svg> </div> </div>`;
        }
        if(item.status=="incorrect"){
          li.innerHTML = ` <div class="row"> <div class="col-7"> <p>Question ${item.questionNum}</p></div> <div class="col-5"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#d9534f" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
            </svg> </div> </div>`;
        }
        list.appendChild(li);

      })

        //adds the current question with a clock to the bottom of the tracker to indicate that you are currently doing that question
        let li = document.createElement("li");
        li.innerHTML = `<div class="row"> <div class="col-7"> <p>Question ${pastQ.length+1}</p></div> <div class="col-5"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f0ad4e" class="bi bi-clock-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
          </svg> </div> </div>`;
        list.appendChild(li);

        var questionContainer = document.getElementById("qContainer");
        questionContainer.scrollTop = questionContainer.scrollHeight;
      }

}

//
//Renders widget from handlebars
//
const render_widget = (model,view) => {
  // Get the template HTML
  template_source = document.querySelector(view).innerHTML
  // Handlebars compiles the above source into a template
  var template = Handlebars.compile(template_source);

  // apply the model to the template.
  var html_widget_element = template({...model,...appState})

  return html_widget_element
}
