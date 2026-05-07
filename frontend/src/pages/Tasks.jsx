import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";

import API from "../services/api";

function Tasks() {

  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");

  // FETCH TASKS

  const fetchTasks = async () => {

    try {

      const response = await API.get("/tasks");

      setTasks(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    fetchTasks();

  }, []);

  // ADD TASK

  const addTask = async () => {

    if(!title) return;

    try {

      await API.post("/tasks", {
        title,
        status: "Pending"
      });

      setTitle("");

      fetchTasks();

    } catch (error) {

      console.log(error);

    }
  };

  // DELETE TASK

  const deleteTask = async (id) => {

    try {

      await API.delete(`/tasks/${id}`);

      fetchTasks();

    } catch (error) {

      console.log(error);

    }
  };

  // UPDATE STATUS

  const updateTask = async (task) => {

    try {

      const updatedStatus =
        task.status === "Pending"
          ? "Completed"
          : "Pending";

      await API.put(`/tasks/${task._id}`, {
        ...task,
        status: updatedStatus
      });

      fetchTasks();

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div className="dashboard-container">

      <Sidebar />

      <div className="projects-page">

        <div className="project-header">
          <h1>Tasks</h1>
        </div>

        <div className="project-form">

          <input
            type="text"
            placeholder="Enter Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button onClick={addTask}>
            Add Task
          </button>

        </div>

        <div className="project-list">

          {
            tasks.map((task) => (

              <div className="project-card" key={task._id}>

                <div>

                  <h3>{task.title}</h3>

                  <p>
                    Status: {task.status}
                  </p>

                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px"
                  }}
                >

                  <button
                    onClick={() => updateTask(task)}
                    style={{
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      padding: "10px 15px",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                  >
                    Update
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task._id)}
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))
          }

        </div>

      </div>

    </div>
  );
}

export default Tasks;