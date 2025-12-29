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
    fetch("https://695183cf70e1605a108a3ef6.mockapi.io/todos")
      .then((res) => res.json())
      .then((todos) => {
        setTodos(todos);
        setFilterTodo(todos);
      });
  }, []);
  //client
  let addTodo = (todo) => {
    //server
    fetch("https://695183cf70e1605a108a3ef6.mockapi.io/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    }).then((res) => {
      if (res.ok) {
        setTodos((prevState) => [...prevState, todo]);
      }
    });
  };
  let deleteTodo = (todoId) => {
    //client

    //server
    fetch(`https://695183cf70e1605a108a3ef6.mockapi.io/todos/${todoId}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        setTodos((prevState) => {
          return prevState.filter((todo) => {
            return todo.id !== todoId;
          });
        });
      }
    });
  };
  let updateTodo = (todo) => {
    //client

    fetch(`https://695183cf70e1605a108a3ef6.mockapi.io/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    }).then((res) => {
      if (res.ok) {
        setTodos((prevState) => {
          return prevState.map((t) => {
            if (t.id === todo.id) {
              return todo;
            }
            return t;
          });
        });
      }
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
