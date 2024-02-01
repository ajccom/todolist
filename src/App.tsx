import React from 'react'
import './App.css'

enum statusMapping {
  active = 'active',
  completed = 'completed'
}

type Todo = {
  id: number
  text: string
  status: statusMapping
  onChange?: (stauts: statusMapping, id: number) => void
}

function TodoItem (props: Todo) {
  const {id, text, status, onChange} = props

  function toggle () {
    try {
      onChange?.(status === statusMapping.active ? statusMapping.completed : statusMapping.active, id)
    } catch (error) {
      console.log(error)
    }
  }

  return <div key={id} className={`todo ${status}`}>
    <span className="icon" onClick={toggle}></span>
    <span className="text">{text}</span>
  </div>
}

function App() {
  const [todoList, setTodoList] = React.useState<Todo[]>([])
  const [newTodoDraft, setNewTodoDraft] = React.useState<Todo>({
    id: Date.now(),
    text: '',
    status: statusMapping.active
  })

  function toggleDraft () {
    setNewTodoDraft({
      ...newTodoDraft,
      status: newTodoDraft.status === statusMapping.active ? statusMapping.completed : statusMapping.active
    })
  }

  function updateDraftText (e: React.ChangeEvent<HTMLInputElement>) {
    setNewTodoDraft({
      ...newTodoDraft,
      text: e.target.value
    })
  }

  function complateAll () {
    if (todoList.length) {
      setTodoList(todoList.map(item => {
        return {
          ...item,
          status: statusMapping.completed
        }
      }))
    }
  }

  function clearAll () {
    if (todoList.length) {
      setTodoList([])
    }
  }

  function addTodo (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (newTodoDraft.text) {
      setTodoList([
        ...todoList,
        {
          id: newTodoDraft.id,
          text: newTodoDraft.text,
          status: newTodoDraft.status
        }
      ])

      setNewTodoDraft({
        id: Date.now(),
        text: '',
        status: statusMapping.active
      })
    }
  }

  const onStatusChange = React.useCallback((status: statusMapping, id: number) => {
    setTodoList(todoList.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status
        }
      }
      return item
    }))
  }, [todoList])

  return (
    <div className="App">
      <h1>TODO</h1>
      <form className={`new-todo ${newTodoDraft.status}`} onSubmit={addTodo}>
        <span className="icon" onClick={toggleDraft}></span>
        <input value={newTodoDraft.text} onInput={updateDraftText} className="ipt" type="text" placeholder="Create a new todo..." />
      </form>
      <div className="todo-list">
        {
          todoList.length ? todoList.map(item => {
            return <TodoItem 
              key={item.id}
              id={item.id}
              text={item.text}
              status={item.status}
              onChange={onStatusChange}
            />
          }) : null
        }
        <div className="status-bar">
          <span>{todoList.length} items left</span>
          <span className="link-btn" onClick={complateAll}>All Active Completed</span>
          <span className="link-btn" onClick={clearAll}>Clear Completed</span>
        </div>
      </div>
    </div>
  );
}

export default App;
