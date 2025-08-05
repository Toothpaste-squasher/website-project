import {priority} from "./data/priorities.js";
import {ToDo, tasks} from "./tasks.js"


// Testing



// Generate all the tasks when page's opened
tasks.tasks.forEach((task) => {
  const todo = new ToDo(task);
  todo.renderNewTask();
});


// Event listener for clicks
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("js-add-todo")) {
    document.body.innerHTML += `
      <div class="new-todo">
        <div class="modal-content">
          <div class="modal-header">
            <input class="new-task-name" value="${createNewName()}"/>
            <button class="priority medium">medium</button>
          </div>
          <div class="modal-body">
            <div class="modal-body-left">
              <label for="taskDescription" class="modal-section-title">Notes (optional):</label>
              <textarea id="taskDescription"></textarea>
            </div>
            <div class="modal-body-right">
              <div class="up-date">
                <div class="modal-section-title">Due date:</div>
                <div>
                  <input type="date" class="date-input">
                  <button class="remove-date-btn">Remove due date</button>
                </div>
              </div>
              <div class="down-group">
                <label for="group" class="modal-section-title">Group: (not working yet)</label>
                <select name="group" id="group" class="group-dropdown">
                  <option value="ungrouped">Ungrouped</option>
                  <option value="hobby">Hobby</option>
                  <option value="school">School</option>
                </select>
              </div>
            </div>
          </div>
          <div class="window-footer">
            <button class="close-window-btn">Cancel</button>
            <button class="save-newTask">Save</button>
          </div>
        </div>
      </div>
    `;
    // Set the default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    document.querySelector(".date-input").value = formattedDate;

    // Remove all fade-in classes from the todo-container
    document.querySelectorAll(".fade-in").forEach((el) => {
      el.classList.remove("fade-in");
    });
  }
  
  // Remove date input
  else if (event.target.classList.contains("remove-date-btn")) {
    const dateInput = document.querySelector(".date-input");
    dateInput.value = "";
    document.querySelector(".remove-date-btn").style.display = "none";
    dateInput.addEventListener("input", () => {
      if (dateInput.value === "") {
        document.querySelector(".remove-date-btn").style.display = "none";
      } else {
        document.querySelector(".remove-date-btn").style.display = "inline-block";
      }
    });
  }

  // Close the modal
  else if (event.target.classList.contains("new-todo") || event.target.classList.contains("close-window-btn")) {
    document.querySelector(".new-todo").remove();
  }

  // Change the priority
  else if (event.target.classList.contains("priority")) {
    changePriority(event); // Only visual change
  }

  // Add new task to list on page 
  else if (event.target.classList.contains("save-newTask")) {
    handleSave();
  }

  else if (event.target.classList.contains("sticker-tab") && !event.target.classList.contains("active")) {
    sideBarSelect(event);
  }

  // complete or uncomplete the task
  else if (event.target.classList.contains("checkbox")) {
    if (event.target.checked) {
      tasks.tasks.forEach((task) => {
        if (task.id === event.target.id.replace("-checkbox", "")) {
          task.status = 1; // 1 for completed
        }
      });
    } else {
      tasks.tasks.forEach((task) => {
        if (task.id === event.target.id.replace("-checkbox", "")) {
          task.status = 0; // 0 for not completed
        }
      });
    }
    saveToLocalStorage();
  }
});


document.addEventListener("keydown", (event) => {
  if (
    event.key === "Enter" &&
    document.querySelector(".new-todo")
  ) {
    handleSave();
  }
})



// functions for eventListeners
function createNewName () {
  let numbers = [];
  let number;
  tasks.tasks.forEach((task) => {
    const parse = parseInt(task.name.replace("Task (", "").replace(")", ""));
    if (!isNaN(parse)) {
      numbers.push(parse);
    }
  });

  numbers = numbers.sort((a, b) => a - b);
  for (let i = 1; i < numbers.length + 10; i++) {
    if (numbers[i] !== numbers[i-1] + 1) {
      number = numbers[i-1] + 1;
      break;
    }
  }
  if (number === Math.max(...numbers)) {
    number = Math.max(...numbers) + 1;
  } else if (!number) {
    number = 1;
  }
  console.log(numbers, number);
  return `Task (${number})`;
}

function saveToLocalStorage() {
  localStorage.setItem(tasks.localStorageKey, JSON.stringify(tasks.tasks));
}

function changePriority (event) {
  priority.forEach((p, i) => {
    if (event.target.classList.contains(p.label)) {
      const changedPriority = priority[i+1] ? priority[i+1] : priority[0];
      const parent = event.target.parentElement

      event.target.remove();

      const newBtn = document.createElement("button");
      newBtn.className = `priority ${changedPriority.label} new-task`;
      newBtn.textContent = changedPriority.label;
      newBtn.style.setProperty("background-color", changedPriority.color);
      parent.appendChild(newBtn);

      // Update the priority in the tasks array
      tasks.tasks.forEach((task) => {
        if (task.id === event.target.id.replace("-priority", "")) {
          task.priority = changedPriority.label;
        }
      });
      saveToLocalStorage();
    }
  });
  refreshTaskList();
}

function handleSave () {
  const taskName = document.querySelector(".new-task-name").value;
  const taskDescription = document.querySelector("#taskDescription").value;
  const dueDate = document.querySelector(".date-input").value || "-";
  const group = document.querySelector("#group").value;
  const dateAdded = dayjs().format("DD-MM-YYYY")
  const priority = document.querySelector(".new-task.priority").innerHTML;
  const id = `Task-${Date.now()}-${Math.floor(Math.random()*10000)}`
  if (taskName === '') {
    alert("Please enter a name...")
  }
  else {
    let newTask = {
      name: taskName,
      id: id,
      description: taskDescription,
      dueDate: dueDate,
      dateAdded: dateAdded,
      group: group,
      priority: priority,
    }

    newTask = new ToDo(newTask);

    newTask.renderNewTask();
    console.log(newTask);
    console.log(id);
    document.getElementById(id + "-container").classList.add("fade-in");
    document.querySelector(".new-todo").remove();

    tasks.addToTasks(newTask);
    console.log(tasks.tasks);
  }
}

function sideBarSelect(event) {
  // Remove active class from all tabs
  document.querySelectorAll(".sticker-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Add active class to clicked tab
  event.target.classList.add("active");

  refreshTaskList();
}

function refreshTaskList() {
  // refresh the task list
  const activeTab = document.querySelector(".sticker-tab.active");
  const todoList = document.querySelector(".js-todo-list");
  todoList.innerHTML = ""; // Clear current list
  tasks.tasks.forEach((task) => {
    if (activeTab.dataset.group === "all") {
      const todo = new ToDo(task);
      todo.renderNewTask();
    }
    else if (activeTab.dataset.group === task.priority) {
      const todo = new ToDo(task);
      todo.renderNewTask();
    }
  });
}