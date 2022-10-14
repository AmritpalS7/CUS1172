

document.addEventListener('DOMContentLoaded', function(){
  var forms = document.getElementsByClassName('needs-validation'); //from w3schools, if one of the fields is not entered, prevents submisstion and adds pop up message
  var validation = Array.prototype.filter.call(forms, function(form) {
    form.addEventListener('submit', function(event) {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
        var tag = document.createElement("p");
        var text = document.createTextNode("Please fill out all fields");
        tag.appendChild(text);
        var section = document.getElementById("feedback");
        section.innerHTML = "";
        section.appendChild(tag);
      }
      else{
        addTask(); //if all fields are entered, adds task and changes paragraph under input
        event.preventDefault();
        form.classList.remove('was-validated');
        document.getElementById("myForm").reset();
        var tag = document.createElement("p");
        var text = document.createTextNode("Task successfully added to To-Do List");
        tag.appendChild(text);
        var section = document.getElementById("feedback");
        section.innerHTML = "";
        section.appendChild(tag);
      }

    }, false);
  });


  const tasksToDo = []; //model - array that holds all task objects

  var currentPosInArray = 0;

  function addTask(){ //on successfull entry, adds task to array and creates respective elements on view (controller)

    var task = {
    "positionInArray" : currentPosInArray,
  	"title": document.querySelector("#task-title").value,
    "priority": document.querySelector("#task-priority").value,
    "status" : document.querySelector('input[name="task-status"]:checked').value,
  }

  tasksToDo.push(task); //updates model
  console.log(JSON.stringify(tasksToDo[currentPosInArray]) + "\nAdded to Array");

  var ul = document.getElementById("to-do");
  var li = document.createElement('li');

  const tTitle = document.createElement("h3");
  tTitle.setAttribute('class', 'taskTitle');
  const titleNode = document.createTextNode(task.title);
  tTitle.appendChild(titleNode);

  const tPriority = document.createElement("p");
  const priorityNode = document.createTextNode("Priority: " + task.priority);
  tPriority.appendChild(priorityNode);

  const tStatus = document.createElement("p");
  const statusNode = document.createTextNode("Status: " + task.status);
  tStatus.appendChild(statusNode);


  li.appendChild(tTitle);
  li.appendChild(tPriority);
  li.appendChild(tStatus);



  ul.appendChild(li); //updates view


  if(task.status == "Completed"){//if status is completed, adds task in correct format and button to delete
      tTitle.style.textDecoration = "line-through";

      const tDelete = document.createElement("button");
      tDelete.setAttribute('class', 'delete');
      tDelete.setAttribute('data-answer', currentPosInArray);
      const del = document.createTextNode("Delete");
      tDelete.appendChild(del);

      tDelete.addEventListener('click', function(){
      delete tasksToDo[tDelete.dataset.answer];//deletes from array (updates model)
      tDelete.parentElement.remove();
      console.log("Task updated:\n" + JSON.stringify(tasksToDo[tDelete.dataset.answer]) + "\nAs task has been deleted");
      });


      li.appendChild(tDelete);//updates view
  }
  else{ //if status is not completed, adds task, with buttons to delete and mark as completed
     const tMarkAsDone = document.createElement("button");
     tMarkAsDone.setAttribute('class', 'markDone');
     tMarkAsDone.setAttribute('data-answer', currentPosInArray);
     const mad = document.createTextNode("Mark Completed");
     tMarkAsDone.appendChild(mad);

     tMarkAsDone.addEventListener('click', function(){

     tasksToDo[tMarkAsDone.dataset.answer].status = "Completed";//updates status for object in array(model)
     console.log("Task updated:\n" + JSON.stringify(tasksToDo[tMarkAsDone.dataset.answer]));

     tStatus.removeChild(statusNode);
     const updatedStatusNode = document.createTextNode("Status: Completed");
     tStatus.appendChild(updatedStatusNode);
     mad.parentElement.remove();
     tTitle.style.textDecoration = "line-through";
     }
   );

     const tDelete = document.createElement("button");
     tDelete.setAttribute('class', 'delete');
     tDelete.setAttribute('data-answer', currentPosInArray);
     const del = document.createTextNode("Delete");
     tDelete.appendChild(del);

     tDelete.addEventListener('click', function(){
     delete tasksToDo[tDelete.dataset.answer];//deletes from array
     tDelete.parentElement.remove();
     console.log("Task updated:\n" + JSON.stringify(tasksToDo[currentPosInArray]) + "\nAs task has been deleted");
     });

     li.appendChild(tMarkAsDone);//updates view
     li.appendChild(tDelete);//updates view 
  }

  currentPosInArray++;
  }

});
