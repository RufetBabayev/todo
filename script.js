// all  selectors
const formContainer = document.querySelector("#formContainer");
const todoInput = document.querySelector("#todoInput");
const allBtn = document.querySelector("#allBtn");
const completedBtn = document.querySelector("#completedBtn");
const pendingBtn = document.querySelector("#pendingBtn");
const todoContainer = document.querySelector("#todoContainer");
const filterBtn = document.querySelectorAll(".filterBtn");

// global variables

let todoValue = "";
let allTodos = [];
let editId = null;

// get values from input func

function getValueFromInput(e) {
  todoValue = {
    id: Math.floor(Math.random() * 100),
    name: e.target.value,
    isDone: false,
  };
}

// submit form

function addTodoArray(e) {
  e.preventDefault();
  if (!editId && todoInput.value.trim() !== "") {
    allTodos.push(todoValue);
  } else {
    editingProcess();
  }
  createUi(allTodos);
  todoInput.value = "";
}

function editingProcess() {
  allTodos = allTodos.map((todo) => {
    if (todo.id === editId) {
      return { ...todo, name: todoInput.value };
    } else {
      return todo;
    }
  });
  editId = null;
}

function createUi(todos) {
  const html = todos
    .map(
      (todo) =>
        `<div class="flex justify-between w-full border border-gray-300 p-2">
            <label class="flex items-center space-x-2">
              <input ${todo.isDone ? "checked" : ""} data-id=${
          todo.id
        } class="checkbox" type="checkbox" /> <span class=${
          todo.isDone ? "line-through" : ""
        }>${todo.name}</span>
            </label>
            <div class="flex items-center space-x-2">
              <button data-id=${todo.id} 
                class="bg-blue-500 border border-gray-500 text-white px-1 rounded-lg editBtn"
              >
                <i class="fa-solid fa-pen"></i>
              </button>
              <button data-id=${todo.id} 
                class="bg-red-500 border border-gray-500 text-white px-1 rounded-lg del"
              >
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>`
    )
    .join("");
  todoContainer.innerHTML = html;
  selectCheckBoxes();
  findDeleteId();
  handleEdit();
}

// select check boxes from html

function selectCheckBoxes() {
  const check = document.querySelectorAll(".checkbox");
  check.forEach((ch) => {
    ch.addEventListener("input", () => {
      const id = +ch.getAttribute("data-id");
      findChecked(id, ch.checked);
    });
  });
}

// find checked todo

function findChecked(id, isChecked) {
  const todo = allTodos.find((t) => t.id === id);
  if (todo) {
    todo.isDone = isChecked;
    createUi(allTodos);
  }
}

// delete todo from ui

function findDeleteId() {
  const delBtn = document.querySelectorAll(".del");
  delBtn.forEach((d) => {
    d.addEventListener("click", () => {
      const id = +d.getAttribute("data-id");
      deleteTodo(id);
    });
  });
}

function deleteTodo(id) {
  const index = allTodos.findIndex((i) => i.id === id);
  allTodos.splice(index, 1);
  createUi(allTodos);
}

//filter todos by compelete status

function findCompeleted() {
  const filtereds = allTodos.filter((t) => t.isDone === true);
  createUi(filtereds);
}

// show all todos

function showAll() {
  createUi(allTodos);
}

//show unchecked todos

function showPendings() {
  const filtereds = allTodos.filter((t) => t.isDone === false);
  createUi(filtereds);
}

// change style of filter buttons

filterBtn.forEach((filterBtn) => {
  filterBtn.addEventListener("click", () => {
    const current = document.querySelector(".filterBtn.active");
    current.className = current.className.replace("active", "");
    filterBtn.className = filterBtn.className.replace(
      "filterBtn",
      "filterBtn active"
    );
  });
});

// edit
function handleEdit() {
  const editBtns = document.querySelectorAll(".editBtn");
  editBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      editId = +btn.getAttribute("data-id");
      const findTodoById = allTodos.find((t) => t.id === editId);
      todoInput.value = findTodoById.name;
    })
  );
}

// global event listeners

todoInput.addEventListener("input", getValueFromInput);
formContainer.addEventListener("submit", addTodoArray);
completedBtn.addEventListener("click", findCompeleted);
allBtn.addEventListener("click", showAll);
pendingBtn.addEventListener("click", showPendings);
