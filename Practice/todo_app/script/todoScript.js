const todoForm = document.getElementById("todoImageForm")


const submitTodoNode = document.getElementById("submitTodo");
const InputNode = document.getElementById("userInput");
const prioritySelector = document.getElementById("prioritySelector");
const taskPic = document.getElementById("taskpic");
const todoListNode = document.getElementById("todo-item");


submitTodoNode.addEventListener("click", function (event) {
  event.preventDefault();
  const InputValue = InputNode.value;
  const priority = prioritySelector.value;
  const pic =  taskPic.files[0];

  // Check for empty InputValue and priority
  if (!InputValue || !priority) {
    alert("Please enter value");
    return;
  }

  const id = Date.now();
  
  // const todo = {
  //   id: uniqueId,
  //   InputValue,
  //   priority,
  // };

  const todo = new FormData();
  todo.append("id", id);
  todo.append("InputValue", InputValue);
  todo.append("priority", priority);
  todo.append("pic", pic);



  fetch("/todo", {
    method: "POST",
    body: todo,
  }).then(function (response) {
    if (response.ok) { 
      // Parse the response as JSON to get the newTodo object
      return response.json();
    } else if (response.status === 401) {
      window.location.href = "/login";
    } else {
      throw new Error("Something went wrong");
    }
  }).then(function (newTodo) { 
    // Display todo in UI using the newTodo object
  showTodoInUI(newTodo);
  InputNode.value = "";
}).catch(function (error) {
  // Handle any errors that occurred during the request
  alert("An error occurred while saving the todo.");
  console.error(error);
})
});

function showTodoInUI(todo) {
  console.log(todo)
  const todoContainer = document.createElement("div");
  todoContainer.style.marginBottom = "60px"; 
  const todoTextNode = document.createElement("span");
  todoTextNode.innerText = `Task: ${todo.InputValue}`;
  if (todo.completed) {    //if todo already marked true in local storage 
    todoTextNode.style.textDecoration = "line-through";
  }

  const priorityNode = document.createElement("span");
  priorityNode.innerText = `Priority: ${todo.priority}`;

  const taskImage = document.createElement("img");
  taskImage.src = todo.pic; 
  taskImage.style.width = "100px"; // Set the desired fixed width for the image
  taskImage.style.height = "100px";

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "❌";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;   //if todo already present in local storage mark it checked 

  checkbox.addEventListener("change", function () {
    const completed = this.checked;   //changeing the value 
    // Send a request to mark the task as completed or not completed
    
    fetch(`/todo/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: completed }),   //sending the updation
    }).then(function (response) {
      if (response.status ===  200) {
        todoTextNode.style.textDecoration = completed ? "line-through" : "none";   
        // Save the checkbox state in Local Storage
        localStorage.setItem(`todo_${todo.id}_completed`, completed);  //setting in local storage 
      } else if (response.status === 401) {
        window.location.href = "/login";
      } else {
        alert("Something went wrong while updating the task.");
      }
    });
  });

  deleteButton.addEventListener("click", function () {
    // Send a request to delete the task
    fetch(`/todo/${todo.id}`, {
      method: "DELETE",
    }).then(function (response) {
      if (response.status === 200) {
        // Remove the task container from the UI
        todoContainer.remove();
        // Remove the checkbox state from Local Storage
        localStorage.removeItem(`todo_${todo.id}_completed`);
      } else if (response.status === 401) {
        window.location.href = "/login";
      } else {
        alert("Something went wrong while deleting the task.");
      }
    });
  });

  


  todoContainer.appendChild(checkbox);
  todoContainer.appendChild(todoTextNode);
  todoContainer.appendChild(priorityNode);
  todoContainer.appendChild(deleteButton);
  todoContainer.appendChild(taskImage);
  

  todoListNode.appendChild(todoContainer);
}


fetch("/todo-data")    // getting todo with picture path ,(Picture)
  .then(function (response) {
    if (response.status === 200) {
      return response.json();
    } else if (response.status === 401) {
      window.location.href = "/login";
    } else {
      alert("something weird happened");
    }
  })
  .then(function (todos) {
    
    todos.forEach(function (todo) {
      
      const completed = localStorage.getItem(`todo_${todo.id}_completed`);
      console.log(todo.completed)
      todo.completed = completed === "true"; 
      showTodoInUI(todo);
    });
  });
