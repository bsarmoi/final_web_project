document.addEventListener('DOMContentLoaded', function () {
    const addTaskBtn = document.getElementById('add-task-btn');
    const addLessonPlanBtn = document.getElementById('add-lesson-plan-btn'); // New button for lesson plans
    const taskModal = document.getElementById('task-modal');
    const lessonPlanModal = document.getElementById('lesson-plan-modal'); // New modal for lesson plans
    const closeBtn = document.querySelector('.close-btn');
    const closeLessonPlanBtn = document.querySelector('.close-lesson-plan-btn'); // New close button for lesson plans
    const taskForm = document.getElementById('task-form');
    const lessonPlanForm = document.getElementById('lesson-plan-form'); // New form for lesson plans
    const taskList = document.getElementById('task-list');
    const lessonPlanList = document.getElementById('lesson-plan-list'); // New list for lesson plans
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

    async function fetchLessonPlans() {
        try {
            const response = await fetch('http://localhost:3000/lesson_plans');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const lessonPlans = await response.json();
            return lessonPlans;
        } catch (error) {
            console.error('Error fetching lesson plans:', error);
            return [];
        }
    }

    async function renderTasks() {
        const tasks = await fetchTasks();
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const taskItem = createTaskElement(task);
            taskList.appendChild(taskItem);
        });
        addTaskEventListeners();
    }

    async function renderLessonPlans() {
        const lessonPlans = await fetchLessonPlans();
        lessonPlanList.innerHTML = '';
        lessonPlans.forEach(lessonPlan => {
            const lessonPlanItem = createLessonPlanElement(lessonPlan);
            lessonPlanList.appendChild(lessonPlanItem);
        });
        addLessonPlanEventListeners();
    }

    function createTaskElement(task) {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <span>${task.title}</span>
            <div class="actions">
                <button class="complete-btn" data-id="${task.id}">Complete</button>
                <button class="edit-task-btn" data-id="${task.id}">Edit</button>
                <button class="delete-task-btn" data-id="${task.id}">Delete</button>
            `;
        return taskItem;
    }

    function createLessonPlanElement(lessonPlan) {
        const lessonPlanItem = document.createElement('li');
        lessonPlanItem.innerHTML = `
            <span>${lessonPlan.topic}</span>
            <div class="actions">
                <button class="edit-lesson-plan-btn" data-id="${lessonPlan.id}">Edit</button>
                <button class="delete-lesson-plan-btn" data-id="${lessonPlan.id}">Delete</button>
            `;
        return lessonPlanItem;
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

        document.querySelectorAll('.edit-task-btn').forEach(button => {
            button.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                editTask(id);
            });
        });

        document.querySelectorAll('.delete-task-btn').forEach(button => {
            button.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                deleteTask(id);
            });
        });
    }

    function addLessonPlanEventListeners() {
        document.querySelectorAll('.edit-lesson-plan-btn').forEach(button => {
            button.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                editLessonPlan(id);
            });
        });

        document.querySelectorAll('.delete-lesson-plan-btn').forEach(button => {
            button.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                deleteLessonPlan(id);
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

    async function editLessonPlan(id) {
        try {
            const response = await fetch(`http://localhost:3000/lesson_plans/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const lessonPlan = await response.json();
            lessonPlanForm.topic.value = lessonPlan.topic;
            lessonPlanForm.objectives.value = lessonPlan.objectives;
            lessonPlanForm.resources.value = lessonPlan.resources;
            lessonPlanForm.activities.value = lessonPlan.activities;
            lessonPlanForm.assessment.value = lessonPlan.assessment;

            lessonPlanModal.style.display = 'flex';
            lessonPlanForm.removeEventListener('submit', addLessonPlan);
            lessonPlanForm.addEventListener('submit', async function updateLessonPlan(e) {
                e.preventDefault();
                try {
                    const updateResponse = await fetch(`http://localhost:3000/lesson_plans/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            topic: lessonPlanForm.topic.value,
                            objectives: lessonPlanForm.objectives.value,
                            resources: lessonPlanForm.resources.value,
                            activities: lessonPlanForm.activities.value,
                            assessment: lessonPlanForm.assessment.value
                        })
                    });
                    if (!updateResponse.ok) {
                       
                        throw new Error(`HTTP error! Status: ${updateResponse.status}`);
                    }
                    lessonPlanModal.style.display = 'none';
                    renderLessonPlans();
                    lessonPlanForm.reset();
                    showNotification('Lesson plan updated successfully!');
                    lessonPlanForm.removeEventListener('submit', updateLessonPlan);
                    lessonPlanForm.addEventListener('submit', addLessonPlan);
                } catch (error) {
                    console.error('Error updating lesson plan:', error);
                }
            });
        } catch (error) {
            console.error('Error fetching lesson plan:', error);
        }
    }

    async function deleteLessonPlan(id) {
        try {
            const response = await fetch(`http://localhost:3000/lesson_plans/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            renderLessonPlans();
        } catch (error) {
            console.error('Error deleting lesson plan:', error);
        }
    }

    async function addLessonPlan(e) {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/lesson_plans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    topic: lessonPlanForm.topic.value,
                    objectives: lessonPlanForm.objectives.value,
                    resources: lessonPlanForm.resources.value,
                    activities: lessonPlanForm.activities.value,
                    assessment: lessonPlanForm.assessment.value
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            renderLessonPlans();
            lessonPlanModal.style.display = 'none';
            lessonPlanForm.reset();
            showNotification('Lesson plan added successfully!');
        } catch (error) {
            console.error('Error adding lesson plan:', error);
        }
    }

    addTaskBtn.addEventListener('click', () => {
        taskModal.style.display = 'flex';
    });

    addLessonPlanBtn.addEventListener('click', () => {
        lessonPlanModal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        taskModal.style.display = 'none';
    });

    closeLessonPlanBtn.addEventListener('click', () => {
        lessonPlanModal.style.display = 'none';
    });

    taskForm.addEventListener('submit', addTask);
    lessonPlanForm.addEventListener('submit', addLessonPlan);

    renderTasks();
    renderLessonPlans();
});
