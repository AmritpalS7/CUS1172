

// appState, keep information about the State of the application.
const appState = {
    current_view : "#intro_view",
    current_question : -1,
    current_model : {}
}


//
// start_app: begin the applications.
//
var amountCorrect = 0;
var quizSelection;
var quizSize;
var pastQ = [];
var userName;
var startTime;
var elapsedTimeIntervalRef;
var totalTime;


document.addEventListener('DOMContentLoaded', () => {
  // Set the state
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

});

var timeAndDateHandling = {
    /** Computes the elapsed time since the moment the function is called in the format mm:ss or hh:mm:ss
     * @param {String} startTime - start time to compute the elapsed time since
     * @returns {String} elapsed time in mm:ss format or hh:mm:ss format if elapsed hours are 0.
     */
    getElapsedTime: function (startTime) {

        // Record end time
        let endTime = new Date();

        // Compute time difference in milliseconds
        let timeDiff = endTime.getTime() - startTime.getTime();

        // Convert time difference from milliseconds to seconds
        timeDiff = timeDiff / 1000;

        // Extract integer seconds that dont form a minute using %
        let seconds = Math.floor(timeDiff % 60); //ignoring uncomplete seconds (floor)

        // Pad seconds with a zero if neccessary
        let secondsAsString = seconds < 10 ? "0" + seconds : seconds + "";

        // Convert time difference from seconds to minutes using %
        timeDiff = Math.floor(timeDiff / 60);

        // Extract integer minutes that don't form an hour using %
        let minutes = timeDiff % 60; //no need to floor possible incomplete minutes, becase they've been handled as seconds

        // Pad minutes with a zero if neccessary
        let minutesAsString = minutes < 10 ? "0" + minutes : minutes + "";

        // Convert time difference from minutes to hours
        timeDiff = Math.floor(timeDiff / 60);

        // Extract integer hours that don't form a day using %
        let hours = timeDiff % 24; //no need to floor possible incomplete hours, becase they've been handled as seconds

        // Convert time difference from hours to days
        timeDiff = Math.floor(timeDiff / 24);

        // The rest of timeDiff is number of days
        let days = timeDiff;

        let totalHours = hours + (days * 24); // add days to hours
        let totalHoursAsString = totalHours < 10 ? "0" + totalHours : totalHours + "";

        if (totalHoursAsString === "00") {
            return minutesAsString + ":" + secondsAsString;
        } else {
            return totalHoursAsString + ":" + minutesAsString + ":" + secondsAsString;
        }
    }
}

function handle_widget_event(e) {

  if (appState.current_view == "#intro_view"){
    pastQ = [];
    amountCorrect=0;
    appState.current_question = 0;
    if (e.target.dataset.action == "start_app") {

      var forms = document.getElementsByClassName('needs-validation'); //from w3schools, if one of the fields is not entered, prevents submisstion and adds pop up message
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
            appState.current_question = 0
        // Update State (current model + state variables)
        if(e.target.id == "htmlstartbutton"){
            var r = document.querySelector(':root');
            r.style.setProperty('--imageWidth', '350px');
          quizSelection = "html";
            fetch('https://my-json-server.typicode.com/AmritpalS7/HtmlQuestions/htmlQuestions').then(//when arrives
              (response) => {
                return response.json();//another promise takes time to parse
              }
            ).then(//once parses
              (data) =>{
                quizSize = data.length;
              }
            ).catch(
              (err) => {
                console.error(err);
              }
            );



              fetch(`https://my-json-server.typicode.com/AmritpalS7/HtmlQuestions/htmlQuestions/${appState.current_question+1}`).then(//when arrives
              (response) => {
                return response.json();//another promise takes time to parse
              }
            ).then(//once parses
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

        else if (e.target.id == "javastartbutton"){
          var r = document.querySelector(':root');
          r.style.setProperty('--imageWidth', '800px');
          quizSelection = "java";
            fetch('https://my-json-server.typicode.com/AmritpalS7/JavaQuestions/javaQuestions').then(//when arrives
              (response) => {
                return response.json();//another promise takes time to parse
              }
            ).then(//once parses
              (data) =>{
                quizSize = data.length;
              }
            ).catch(
              (err) => {
                console.error(err);
              }
            );



              fetch(`https://my-json-server.typicode.com/AmritpalS7/JavaQuestions/javaQuestions/${appState.current_question+1}`).then(//when arrives
              (response) => {
                return response.json();//another promise takes time to parse
              }
            ).then(//once parses
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
            startTime = new Date();
          }})}}



  // Handle the answer event.
  if (appState.current_view == "#question_view_true_false") {
    if (e.target.dataset.action == "answer") {
       // Controller - implement logic.
         check_user_response(e.target.dataset.answer, appState.current_model);
     }
   }

   // Handle answer event for  text questions.
   if (appState.current_view == "#question_view_text_input") {
       if (e.target.dataset.action == "submitAnswer") {
           user_response = document.querySelector("#textAnswer").value;
           check_user_response(user_response, appState.current_model);
       }
    }

     if(appState.current_view == "#question_view_multiple_choice"){
          if(e.target.dataset.action == "submitAnswer"){
           var checkRadio = document.querySelector('input[name="multipleChoiceAnswer"]:checked');
             if(checkRadio != null) {
                 check_user_response(checkRadio.value, appState.current_model);
             }
         }
     }


         if(appState.current_view == "#question_view_image"){
           if(e.target.dataset.action == "submitAnswer"){
             var checkRadio = document.querySelector('input[name="imageTextAnswer"]:checked');
               if(checkRadio != null) {
                   check_user_response(checkRadio.value, appState.current_model);
               }
           }
         }

         if(appState.current_view == "#question_view_imageAnswer"){
           if(e.target.dataset.action == "submitAnswer"){
             var checkRadio = document.querySelector('input[name="imageAnswer"]:checked');
               if(checkRadio != null) {
                   check_user_response(checkRadio.value, appState.current_model);
               }
           }
         }



    // Handle answer event for  text questions.
    if (appState.current_view == "#end_view") {
        if (e.target.dataset.action == "start_again") {
          appState.current_view =  "#intro_view";
          appState.current_model = {
            action : "start_app"
          }
          update_view(appState);
        }
        if (e.target.dataset.action == "retake_quiz") {
          appState.current_question = 0;
          pastQ = [];
          amountCorrect=0;
          if(quizSelection=="html"){
          fetch(`https://my-json-server.typicode.com/AmritpalS7/HtmlQuestions/htmlQuestions/${appState.current_question+1}`).then(//when arrives
          (response) => {
            return response.json();//another promise takes time to parse
          }
        ).then(//once parses
          (data) =>{
            appState.current_model = data;
              // process the appState, based on question type update appState.current_view
              setQuestionView(appState);
              startTime = new Date();
              // Now that the state is updated, update the view.
              update_view(appState);
          }
        ).catch(
          (err) => {
            console.error(err);
          })}
          else if(quizSelection=="java"){
            fetch(`https://my-json-server.typicode.com/AmritpalS7/JavaQuestions/javaQuestions/${appState.current_question+1}`).then(//when arrives
            (response) => {
              return response.json();//another promise takes time to parse
            }
          ).then(//once parses
            (data) =>{
              appState.current_model = data;
                // process the appState, based on question type update appState.current_view
                setQuestionView(appState);
                  startTime = new Date();
                // Now that the state is updated, update the view.
                update_view(appState);
            }
          ).catch(
            (err) => {
              console.error(err);
            })}
          }}


    if(appState.current_view == "#feedback_view_incorrect"){
       if(e.target.dataset.action == "submit"){
          updateQuestion(appState);
          setQuestionView(appState);
          update_view(appState);
      }
    }


 } // end of hadnle_widget_event


function returnToStart(){
     if (confirm("Are you sure you want to return to the start menu? All current progress will be lost!")) {
         appState.current_view  = "#intro_view";
         appState.current_model = {
           action : "start_app"
         }
         update_view(appState);
     }
}
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


function updateQuestion(appState) {

    if (appState.current_question < quizSize-1) {
      appState.current_question =   appState.current_question + 1;
      if(quizSelection == "html"){
      fetch(`https://my-json-server.typicode.com/AmritpalS7/HtmlQuestions/htmlQuestions/${appState.current_question+1}`).then(//when arrives
      (response) => {
        return response.json();//another promise takes time to parse
      }
    ).then(//once parses
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
      })}
      else if (quizSelection == "java"){
        fetch(`https://my-json-server.typicode.com/AmritpalS7/JavaQuestions/javaQuestions/${appState.current_question+1}`).then(//when arrives
        (response) => {
          return response.json();//another promise takes time to parse
        }
      ).then(//once parses
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
    }
    else {
      appState.current_question = -1;
      appState.current_model = {};
    }
  }


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



function update_view(appState) {

  if (appState.current_view != "#intro_view" && appState.current_view != "#end_view" &&  appState.current_view != "#feedback_view_correct" &&  appState.current_view != "#feedback_view_incorrect" ){
     var html_element = render_widget(appState.current_model, "#tracker")
     html_element += render_widget(appState.current_model, appState.current_view)
  }
  else{
  var html_element = render_widget(appState.current_model, appState.current_view)
  }
  document.querySelector("#widget_view").innerHTML = html_element;

  if(appState.current_view == "#end_view"){
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

  if (appState.current_view != "#intro_view" && appState.current_view != "#end_view" &&  appState.current_view != "#feedback_view_correct" &&  appState.current_view != "#feedback_view_incorrect" ){
      document.querySelector("#currScore").innerHTML=((amountCorrect/appState.current_question)*100).toFixed(2) + "%";
      document.getElementById("pBar").style=`width: ${(appState.current_question)*(100/quizSize)}%`;
      document.querySelector("#pValue").innerHTML="Progress: " + (appState.current_question)*(100/quizSize) + "%";
      var elapsedTimeText = document.getElementsByClassName("elapsed-time-text")[0];
      elapsedTimeIntervalRef = setInterval(() => {
        elapsedTimeText.innerText = timeAndDateHandling.getElapsedTime(startTime);}, 1000);

      let list = document.getElementById("pastQuestions");



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

const render_widget = (model,view) => {
  // Get the template HTML
  template_source = document.querySelector(view).innerHTML
  // Handlebars compiles the above source into a template
  var template = Handlebars.compile(template_source);

  // apply the model to the template.
  var html_widget_element = template({...model,...appState})

  return html_widget_element
}
