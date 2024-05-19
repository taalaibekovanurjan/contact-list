const API = "http://localhost:8000/todos";

const showButton = document.querySelector(".show_contact");
const saveButton = document.querySelector(".save_contact");
const searchButton = document.querySelector(".search_contact");
const table = document.querySelector("table");
const tbody = document.querySelector("tbody");
const inputs = document.querySelectorAll(".inputs input");

// Show
showButton.addEventListener("click", () => {
  table.style.display = "block";
  readTasks();
});

// Сохранение контакта нового
saveButton.addEventListener("click", () => {
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      alert("Error: Введите данные");
      isValid = false;
      return;
    }
  });

  if (isValid) {
    const newTodo = {
      name: document.querySelector("#name").value,
      fullName: document.querySelector("#full_name").value,
      num: document.querySelector("#number").value,
    };
    createTask(newTodo);

    // Очищение инпута
    inputs.forEach((input) => {
      input.value = "";
    });
  }
});

//? Search contacts сделала для красоты )
// Create a new task
function createTask(newTodo) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(newTodo),
  }).then(() => readTasks());
}

// Read tasks from the server
function readTasks() {
  fetch(API)
    .then((response) => response.json())
    .then((data) => {
      tbody.innerHTML = "";
      data.forEach((todo) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${todo.name}</td>
            <td>${todo.fullName}</td>
            <td>${todo.num}</td>
            <td>
              <button class="edit" data-id="${todo.id}">Edit</button>
              <button class="delete" data-id="${todo.id}">Delete</button>
            </td>
          `;

        tbody.appendChild(row);
      });

      addEventListeners();
    });
}

// события для кнопок удаления и редактира
function addEventListeners() {
  const editButtons = document.querySelectorAll(".edit");
  const deleteButtons = document.querySelectorAll(".delete");

  editButtons.forEach((button) => {
    button.addEventListener("click", handleEdit);
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", handleDelete);
  });
}

// edit
function handleEdit(event) {
  const id = event.target.dataset.id;
  fetch(`${API}/${id}`)
    .then((response) => response.json())
    .then((data) => {
      document.querySelector("#name").value = data.name;
      document.querySelector("#full_name").value = data.fullName;
      document.querySelector("#number").value = data.num;

      saveButton.textContent = "Update";
      saveButton.removeEventListener("click", saveHandler);
      saveButton.addEventListener("click", () => updateTask(id));
    });
}

// Update task
function updateTask(id) {
  const updatedTodo = {
    name: document.querySelector("#name").value,
    fullName: document.querySelector("#full_name").value,
    num: document.querySelector("#number").value,
  };

  fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(updatedTodo),
  }).then(() => {
    readTasks();
    saveButton.textContent = "Save";
    saveButton.removeEventListener("click", updateHandler);
    saveButton.addEventListener("click", saveHandler);
  });
}

function handleDelete(event) {
  const id = event.target.dataset.id;

  fetch(`${API}/${id}`, {
    method: "DELETE",
  }).then(() => readTasks());
}

function saveHandler() {
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      alert("Error: Field cannot be empty");
      isValid = true;
      return;
    }
  });

  if (isValid) {
    const newTodo = {
      name: document.querySelector("#name").value,
      fullName: document.querySelector("#full_name").value,
      num: document.querySelector("#number").value,
    };
    createTask(newTodo);

    // Clear inputs
    inputs.forEach((input) => {
      input.value = "";
    });
  }
}
