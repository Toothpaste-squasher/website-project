// Class for Tasks list
class Tasks {
  localStorageKey;
  tasks;

  constructor (key){
    this.localStorageKey = key;
    this.loadFromLocalStorage();
  }

  loadFromLocalStorage () {
    this.tasks = JSON.parse(localStorage.getItem(this.localStorageKey));
    if (!this.tasks) {
      this.tasks = []
    };
    this.saveToLocalStorage();
  }

  saveToLocalStorage () {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.tasks));
  }

  addToTasks (taskDetails) { // "taskDetails is in a dictionary(?) form"
    this.tasks.push(taskDetails);
    this.saveToLocalStorage();
  }
}


// Class for individual to-do
export class ToDo {
  name;
  id;
  description;
  dueDate;
  dateAdded;
  group;
  priority;
  status;

  constructor(task) {
    this.name = task.name;
    this.id = task.id
    this.description = task.description;
    this.dueDate = task.dueDate;
    this.dateAdded = task.dateAdded;
    this.group = task.group;
    this.priority = task.priority;
    this.status = task.status;
  }

  renderNewTask () {
    const checkboxChecked = this.status === 1 ? "checked" : "";
    document.querySelector(".js-todo-list").innerHTML += `
      <div class="todo-container" id="${this.id}-container">
        <div class="todo-left">
          <input class="checkbox" type="checkbox" id="${this.id}-checkbox" ${checkboxChecked}/>
        </div>
        <div class="todo-mid">
          <div class="task-name js-task-name">${this.name}</div>
          <button class="new-task priority ${this.priority}" id="${this.id}-priority">${this.priority}</button>
        </div>
        <div class="todo-right">
          <div class="task-dueDate js-task-dueDate">${this.dueDate}</div>
        </div>
      </div>
    `
  }
}


export let tasks = new Tasks("tasks");


