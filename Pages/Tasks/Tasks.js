// Select HTML elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Event Listener for Adding Task
addTaskBtn.addEventListener("click", addTask);

// Add Task Function
function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  // Create list item
  const li = document.createElement("li");
  li.className = "task-item";

  // Create span for task text
  const span = document.createElement("span");
  span.textContent = taskText;

// Actions container
const actions = document.createElement('div');
actions.className = 'task-actions';

// Complete button
const completeBtn = document.createElement('button');
completeBtn.textContent = 'Completed';
completeBtn.className = 'complete-btn';
completeBtn.onclick = () => {
  completeBtn.disabled = true; // Disable after marking complete
  completeBtn.style.backgroundColor = '#1976D2'; // Darker blue
  completeBtn.textContent = 'Done';
};

// Delete button
const deleteBtn = document.createElement('button');
deleteBtn.textContent = 'Delete';
deleteBtn.className = 'delete-btn';
deleteBtn.onclick = () => li.remove();

actions.appendChild(completeBtn);
actions.appendChild(deleteBtn);

li.appendChild(span);
li.appendChild(actions);
taskList.prepend(li);

taskInput.value = '';


fetch('/tasks', { // Fetch updated task list from server
  headers: { 'Authorization': localStorage.getItem('token') }
})
.then(res => res.json())
.then(tasks => {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerHTML = `
      <span>${task.title}</span>
      <div class="task-actions">
        <button class="complete-btn" onclick="markComplete(${task.id})">Complete</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
});

}

function logout() {
  localStorage.removeItem('token');
  window.location.href = "Login.html";
}

function tasks() {
  localStorage.removeItem('token');
  window.location.href = "Tasks.html"
}

function home() {
  localStorage.removeItem('token');
  window.location.href = "Home.html";
}
  