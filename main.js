'use strict'

let todos = []

let newTodo = document.querySelector('#new-todo')
let addTodoButton = document.querySelector('#add-todo')

addTodoButton.addEventListener('click', () => addTodo(newTodo.value))

async function getTodos() {
  const result = await fetch('http://localhost:3000/tasks/', {
    method: 'GET',
  })
  todos = await result.json()
}

async function addTodo(name) {
  const result = await fetch('http://localhost:3000/tasks/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  })
  let todo = await result.json()
  todos.push(todo)
  renderTodos()
}

async function editTodo(id, name) {
  if (!name) {
    alert('enter a name dinugs')
    throw new Error('enter a name')
  }
  const body = JSON.stringify({ name })
  const response = await fetch(`http://localhost:3000/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
  let result = await response.json()
  let todoIndex = todos.findIndex(todo => todo._id === id)
  todos[todoIndex] = result
  renderTodos()
}

async function changeStatus(id, checked) {
  let status
  checked ? (status = 'completed') : (status = 'pending')
  const response = await fetch(`http://localhost:3000/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })
  let result = await response.json()
  let todoIndex = todos.findIndex(todo => todo._id === id)
  todos[todoIndex] = result
  renderTodos()
}

async function deleteTodo(id) {
  const result = await fetch('http://localhost:3000/tasks/' + id, {
    method: 'DELETE',
  })
  const deletedTodo = await result.json()
  console.log(deletedTodo)

  todos = todos.filter(todo => todo._id !== id)
  renderTodos()
}

const renderTodos = () => {
  document.querySelector('#todos').innerHTML = ''
  todos.forEach(todo => {
    const id = `${todo._id}`
    const todoDiv = document.createElement('div')
    todoDiv.classList.add('todo')

    todoDiv.innerHTML = `
    <div class="todo-title">
      <h3>${todo.name}</h3>
    </div>
    
    <div class="todo-status">
      <input type="checkbox" id="checkbox-${id}">
      <p>${todo.status}</p>
      <p>${todo.Created_date}</p>
    </div>

    <input type="text" id="edit-input-${id}" placeholder="name">

    <div class="todo-buttons my-2">
      <button class="btn btn-primary" id="edit-${id}">Edit</button>
      <button class="btn btn-danger" id="del-${id}">Delete</button>
    </div>
    
    <hr />
    `

    document.querySelector('#todos').appendChild(todoDiv)

    let checkbox = document.querySelector(`#checkbox-${id}`)
    checkbox.checked = todo.status[0] === 'completed'
    checkbox.addEventListener('change', () =>
      changeStatus(id, checkbox.checked)
    )

    let nameInput = document.querySelector(`#edit-input-${id}`)
    document
      .querySelector(`#edit-${id}`)
      .addEventListener('click', () => editTodo(id, nameInput.value))

    document
      .querySelector(`#del-${id}`)
      .addEventListener('click', () => deleteTodo(id))
  })
}

async function init() {
  await getTodos()
  renderTodos()
}

init()
