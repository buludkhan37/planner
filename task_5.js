const tasks = [
  {
    id: 1138465078061,
    completed: false,
    text: "Посмотреть новый урок по JavaScript",
  },
  {
    id: 1138465078062,
    completed: false,
    text: "Выполнить тест после урока",
  },
  {
    id: 1138465078063,
    completed: false,
    text: "Выполнить ДЗ после урока",
  },
];

function createTaskHtml(text, id) {
  const taskItem = document.createElement("div");
  taskItem.className = "task-item";
  taskItem.dataset.taskId = id;

  const taskItemMainContainer = document.createElement("div");
  taskItemMainContainer.className = "task-item__main-container";
  taskItem.append(taskItemMainContainer);

  const taskItemMainContent = document.createElement("div");
  taskItemMainContent.className = "task-item__main-content";
  taskItemMainContainer.append(taskItemMainContent);

  const form = document.createElement("form");
  form.className = "checkbox-form";
  taskItemMainContent.append(form);

  const input = document.createElement("input");
  input.className = "checkbox-form__checkbox";
  input.type = "checkbox";
  input.id = `task-${id}`;
  form.append(input);

  const label = document.createElement("label");
  label.htmlFor = `task-${id}`;
  form.append(label);

  const span = document.createElement("span");
  span.className = "task-item__text";
  span.innerHTML = text;
  taskItemMainContent.append(span);

  const deleteButton = document.createElement("button");
  deleteButton.className =
    "task-item__delete-button default-button delete-button";
  deleteButton.dataset.deleteTaskId = id;
  deleteButton.innerHTML = "Удалить";
  taskItemMainContainer.append(deleteButton);

  return taskItem;
}

const divTasks = document.querySelector(".tasks-list");

const createErrorBlock = (errorMessage) => {
  const errorBlock = document.createElement("span");
  errorBlock.innerHTML = errorMessage;
  errorBlock.className = "error-message-block";
  return errorBlock;
};

const createTaskBlock = document.querySelector(".create-task-block");
createTaskBlock.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = Date.now();
  const text = event.target.elements.taskName.value;
  const newTaskText = (text || "").trim();
  const isTaskExists = tasks.some((task) => task.text === newTaskText);
  const messageBlockFromDOM = document.querySelector(".error-message-block");

  if (!newTaskText) {
    const errorBlock = createErrorBlock(
      "Название задачи не должно быть пустым"
    );
    createTaskBlock.append(errorBlock);
  } else if (isTaskExists) {
    const errorBlock = createErrorBlock(
      "Задача с таким названием уже существует."
    );
    createTaskBlock.append(errorBlock);
  } else if (newTaskText && !isTaskExists) {
    const newTasks = {
      id: id,
      completed: false,
      text: newTaskText,
    };
    tasks.push(newTasks);
    const taskItem = createTaskHtml(newTasks.text, newTasks.id);
    divTasks.append(taskItem);
  }
  if (messageBlockFromDOM) {
    messageBlockFromDOM.remove();
  }
  console.log(tasks);
});

const createDeleteModal = (text) => {
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay modal-overlay_hidden';

  const deleteModal = document.createElement('div');
  deleteModal.className = 'delete-modal';

  modalOverlay.append(deleteModal);

  const deleteModalQuestion = document.createElement('h3');
  deleteModalQuestion.className = 'delete-modal__question';
  deleteModalQuestion.innerHTML = text;

  const deleteModalButtons = document.createElement('div');
  deleteModalButtons.className = 'delete-modal__buttons';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'delete-modal__button delete-modal__cancel-button';
  cancelBtn.innerHTML = 'Отмена';

  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'delete-modal__button delete-modal__confirm-button';
  confirmBtn.innerHTML = 'Удалить';

  deleteModal.append(deleteModalQuestion, deleteModalButtons);
  deleteModalButtons.append(cancelBtn, confirmBtn);

  return {
    modalOverlay,
    deleteModal,
    cancelBtn,
    confirmBtn,
  }
}

let taskToDelete = null;

const {
  modalOverlay, deleteModal, cancelBtn, confirmBtn,
} = createDeleteModal('Вы действительно хотите удалить эту задачу?');

document.body.prepend(modalOverlay);
cancelBtn.addEventListener('click', () => {
  modalOverlay.classList.add('modal-overlay_hidden');
});

confirmBtn.addEventListener('click', () => {
  const deleteIndex = tasks.findIndex((task) => String(task.id) === String(taskToDelete));
  if (deleteIndex >= 0) {
      tasks.splice(deleteIndex, 1);
      const taskItemHTML = document.querySelector(`[data-task-id="${taskToDelete}"]`);
      taskItemHTML.remove();
      modalOverlay.classList.add('modal-overlay_hidden');
  }
});

divTasks.addEventListener('click', (event) => {
  const { target } = event;
  const closestTarget = target.closest('.task-item__delete-button');
  taskToDelete = closestTarget.dataset.deleteTaskId;
  modalOverlay.classList.remove('modal-overlay_hidden');
});

let theme = "light";
const body = document.querySelector("body");
document.addEventListener("keydown", function (event) {
  const taskItem = document.querySelectorAll(".task-item");
  const btn = document.querySelectorAll("button");

  if (event.key === "Tab" && theme === "light") {
    event.preventDefault();
    theme = "dark";
    theme === "light"
      ? (body.style.background = "initial")
      : (body.style.background = "#24292E");

    taskItem.forEach((task) => {
      task.style.color = "#ffffff";
    });

    btn.forEach((button) => {
      button.style.border = "1px solid #ffffff";
    });
  } else if (event.key === "Tab" && theme === "dark") {
    event.preventDefault();
    theme = "light";
    theme === "light"
      ? (body.style.background = "initial")
      : (body.style.background = "#24292E");

    taskItem.forEach((task) => {
      task.style.color = "initial";
    });

    btn.forEach((button) => {
      button.style.border = "none";
    });
  }
});
