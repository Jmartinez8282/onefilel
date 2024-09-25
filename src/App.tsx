//interface to shape the data

import { useEffect, useState } from "react";

interface Task {
  id: number;
  text: string;
  complete: boolean;
}

//key for our localstorage save to a variable
const storagekey = "Tasks";

const App = () => {
  ///State for mananagin tasks, input, and edit mode
  const [task, setTask] = useState<Task[]>(() => {
    const storedTask = localStorage.getItem(storagekey);
    return storedTask ? JSON.parse(storedTask): [];
  });
  
  
  const [input, setInput] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);

  //Load Tasks from localstorage on mount
//useEffect will run what is inside as soon as App compoenent loads
  useEffect(() => {
    const storedTasks = localStorage.getItem(storagekey);

    if (storedTasks) {
      setTask(JSON.parse(storedTasks));
    }
  }, []);

  //Save tasks to localStorage whenever tasks change

useEffect(() => {
  
  localStorage.setItem(storagekey,JSON.stringify(task));
  
}, [task])



  ///functions will go below..............

  ///function to add or updatea task

  const addTask = () => {

    //editing

    if(input === "") return;

    if(editingId !== null) {

      const updateTasks = task.map((task)=> (
        task.id === editingId ? {...task, text: input} : task
      ));
      setTask(updateTasks);
      setEditingId(null);
      setInput("");

    } else {
      ///adding

      const newTask: Task = {
        id:Date.now(),
        text:input,
        complete: false
      }
      setTask([newTask, ...task]);
      setInput('');
    }

  };

  ///function to start editing a task
  const startEditing = (id: number,text: string) => {
    setEditingId(id);
    setInput(text);
  }

  //function to cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setInput("");
  }

  ///function to delete a task

  const deleteTask = (id: number) => {
    const deletedItem = task.filter((task) => task.id !== id);
    setTask(deletedItem);
  }


  //function to toggle a task complete status
  const toggleComplete = (id: number) => {
    const updateTasks = task.map((task) => task.id === id ? {...task, complete: !task.complete}: task)
    setTask(updateTasks);
  }


  return (
    <>
    <div className="container">
      <h1>One file App Task</h1>
      <div className="row">
        <div className="col">
          <input 
          type="text" 
          className="form-control" 
          placeholder="Add a Task"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="col">
          <button className="btn btn-primary" onClick={addTask}>{editingId !== null ? "Update" :"Add"}Task</button>
        </div>
        {editingId !== null && 
          <div className="col">
            <button className="btn btn-secondary" onClick={cancelEdit}>Cancel Edit</button>
          </div>
        }
      </div>

      <ul className="list-group mt-4" data-bs-theme="dark">
          {task.map((task) => (
            <li className={`list-group-item d-flex justify-content-between ${task.complete ? "complete": ""}` }key={task.id}>
              <div>
                <input 
                type="checkbox" 
                className="form-check-input me-2" 
                checked={task.complete}
                onChange={() => toggleComplete(task.id)}
                />
              </div>
              <span style={{textDecoration: task.complete ? "line-through": "none", color: task.complete ? "gray": "black", }}>
              {task.text}
              </span>
              <div>
                <button className="btn btn-info mx-2" onClick={() => startEditing(task.id, task.text) }>Edit</button>
                <button className="btn btn-danger mx-3" onClick={() => deleteTask(task.id)}>Delete</button>
              </div>

             </li>
          ))}
      </ul>


    </div>


      {/* map through our data and display in containers row, col , ul, li, tr */}



    </>
  );
};

export default App;
