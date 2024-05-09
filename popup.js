document.addEventListener('DOMContentLoaded', function () {
  const taskList = document.getElementById('taskList');
  const taskInput = document.getElementById('taskInput');
  const addTaskButton = document.getElementById('addTask');

  // Check if necessary elements are found
  if (!taskList || !taskInput || !addTaskButton) {
    console.error('Error: Unable to find necessary elements in the DOM.');
    return;
  }

  // Load tasks from storage and display them
  chrome.storage.sync.get('tasks', function (data) {
    const tasks = data.tasks || [];
    displayTasks(tasks);
  });

  // Event listener for the "Add Task" button
  addTaskButton.addEventListener('click', function () {
    // Check if taskInput is not null
    if (!taskInput) {
      console.error('Error: Unable to find taskInput element in the DOM.');
      return;
    }

    const taskText = taskInput.value.trim();

    // Check if taskText is empty
    if (taskText === '') {
      console.error('Error: Task text cannot be empty.');
      return;
    }

    // Add the new task to the list with current date and time
    const currentTime = new Date().toLocaleString();
    chrome.storage.sync.get('tasks', function (data) {
      const tasks = data.tasks || [];
      tasks.push({ text: taskText, timestamp: currentTime });
      chrome.storage.sync.set({ tasks: tasks }, function () {
        displayTasks(tasks);
      });
    });

    // Clear the input field
    taskInput.value = '';
  });

  // Event delegation for task removal
  taskList.addEventListener('click', function (event) {
    if (event.target.classList.contains('remove-task')) {
      // Get the index of the task to be removed
      const taskIndex = parseInt(event.target.dataset.index);

      // Check if taskIndex is a valid number
      if (isNaN(taskIndex)) {
        console.error('Error: Invalid task index.');
        return;
      }

      // Remove the task from the list
      chrome.storage.sync.get('tasks', function (data) {
        const tasks = data.tasks || [];
        tasks.splice(taskIndex, 1);
        chrome.storage.sync.set({ tasks: tasks }, function () {
          displayTasks(tasks);
        });
      });
    }
  });

  // Function to display tasks in the popup
  // Function to display tasks in the popup
function displayTasks(tasks) {
  const taskList = document.getElementById('taskList');
  const taskCountElement = document.getElementById('taskCount'); // Get task count element

  if (!taskList || !taskCountElement) {
    console.error('Error: Unable to find necessary elements in the DOM.');
    return;
  }

  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.innerHTML = `
      <strong>${task.text}</strong> (${task.timestamp})
      <button class="remove-task" data-index="${index}">Remove</button>`;
    taskList.appendChild(taskItem);

    // Add spacing between tasks
    taskItem.style.marginBottom = '10px';
  });

  // Update the task count
  taskCountElement.textContent = `Total Tasks: ${tasks.length}`;
}

});
