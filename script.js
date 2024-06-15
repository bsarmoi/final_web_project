document.addEventListener('DOMContentLoaded', function () {
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskModal = document.getElementById('task-modal');
    const closeBtn = document.querySelector('.close-btn');
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    document.body.appendChild(notification);

    async function fetchTasks() {
        try {
            const response = await fetch('http://localhost:3000/tasks');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const tasks = await response.json();
            return tasks;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            return [];
        }
    }

    async function renderTasks() {
        const tasks = await fetchTasks();
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `
                <span>${task.title}</span>
                <div class="actions">
                    <button class="complete-btn" data-id="${task.id}">Complete</button>
                    <button class="edit-btn" data-id="${task.id}">Edit</button>
                    <button class="delete-btn" data-id="${task.id}">Delete</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
        addTaskEventListeners();
    }

    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('visible');
        setTimeout(() => {
            notification.classList.remove('visible');
        }, 2000);
    }

    function addTaskEventListeners() {
        document.querySelectorAll('.complete-btn').forEach(button => {
            button.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                completeTask(id);
            });
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                editTask(id);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                deleteTask(id);
            });
        });
    }

    async function completeTask(id) {
        try {
            const response = await fetch(`http://localhost:3000/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'Completed' })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            renderTasks();
        } catch (error) {
            console.error('Error completing task:', error);
        }
    }

    async function editTask(id) {
        try {
            const response = await fetch(`http://localhost:3000/tasks/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const task = await response.json();
            taskForm.title.value = task.title;
            taskForm.description.value = task.description;
            taskForm['due-date'].value = task.dueDate.split('T')[0];
            taskForm.priority.value = task.priority;

            taskModal.style.display = 'flex';
            taskForm.removeEventListener('submit', addTask);
            taskForm.addEventListener('submit', async function updateTask(e) {
                e.preventDefault();
                try {
                    const updateResponse = await fetch(`http://localhost:3000/tasks/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            title: taskForm.title.value,
                            description: taskForm.description.value,
                            dueDate: taskForm['due-date'].value,
                            priority: taskForm.priority.value
                        })
                    });
                    if (!updateResponse.ok) {
                        throw new Error(`HTTP error! Status: ${updateResponse.status}`);
                    }
                    taskModal.style.display = 'none';
                    renderTasks();
                    taskForm.reset();
                    showNotification('Task updated successfully!');
                    taskForm.removeEventListener('submit', updateTask);
                    taskForm.addEventListener('submit', addTask);
                } catch (error) {
                    console.error('Error updating task:', error);
                }
            });
        } catch (error) {
            console.error('Error fetching task:', error);
        }
    }

    async function deleteTask(id) {
        try {
            const response = await fetch(`http://localhost:3000/tasks/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            renderTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    async function addTask(e) {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: taskForm.title.value,
                    description: taskForm.description.value,
                    dueDate: taskForm['due-date'].value,
                    priority: taskForm.priority.value
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            renderTasks();
            taskModal.style.display = 'none';
            taskForm.reset();
            showNotification('Task added successfully!');
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    addTaskBtn.addEventListener('click', () => {
        taskModal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        taskModal.style.display = 'none';
    });

    taskForm.addEventListener('submit', addTask);

    renderTasks();
});
