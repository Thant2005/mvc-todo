import "./reset.css";
import "./App.css";
import TodoForm from "./components/TodoForm.js";
import TodoList from "./components/TodoList.js";
import CheckAllAndRemaining from "./components/CheckAllAndRemaining.js";
import TodoFilters from "./components/TodoFilters.js";
import ClearCompleted from "./components/ClearCompleted.js";
import { useCallback, useEffect, useState } from "react";
function App() {
  let [todos, setTodos] = useState([]);
  let [filterTodo, setFilterTodo] = useState(todos);
  useEffect(() => {
    fetch("http://localhost:5000/todos")
      .then((res) => res.json())
      .then((todos) => {
        setTodos(todos);
        setFilterTodo(todos);
      });
  }, []);
  //client
  let addTodo = (todo) => {
    setTodos((prevState) => [...prevState, todo]);
    //server
    fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
  };
  let deleteTodo = (todoId) => {
    //client
    setTodos((prevState) => {
      return prevState.filter((todo) => {
        return todo.id !== todoId;
      });
    });
    //server
    fetch(`http://localhost:5000/todos/${todoId}`, { method: "DELETE" });
  };
  let updateTodo = (todo) => {
    //client
    setTodos((prevState) => {
      return prevState.map((t) => {
        if (t.id === todo.id) {
          return todo;
        }
        return t;
      });
    });
    fetch(`http://localhost:5000/todos/${todo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
  };
  let remaintinCount = todos.filter((t) => !t.completed).length;
  let checkAll = () => {
    todos.forEach((t) => {
      t.completed = true;
      updateTodo(t);
    });
    setTodos((prev) =>
      prev.map((t) => {
        return {
          ...t,
          completed: true,
        };
      })
    );
  };
  let clearComplete = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
    todos.forEach((t) => {
      if (t.completed) {
        deleteTodo(t.id);
      }
    });
  };
  let filterBy = useCallback(
    (filter) => {
      if (filter === "All") {
        setFilterTodo(todos);
      }
      if (filter === "Active") {
        setFilterTodo(todos.filter((atodo) => !atodo.completed));
      }
      if (filter === "Completed") {
        setFilterTodo(todos.filter((ctodo) => ctodo.completed));
      }
    },
    [todos]
  );

  return (
    <div className="todo-app-container">
      <div className="todo-app">
        <h2>Todo App</h2>

        <TodoForm addTodo={addTodo} />

        <TodoList
          todos={filterTodo}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
        />

        <CheckAllAndRemaining
          remainingCount={remaintinCount}
          checkAll={checkAll}
        />

        <div className="other-buttons-container">
          <TodoFilters filterBy={filterBy} />
          <ClearCompleted clearComplete={clearComplete} />
        </div>
      </div>
    </div>
  );
}

export default App;
