import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";

import API from "../services/api";

function Tasks() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [tasks, setTasks] = useState([]);

  const [projects, setProjects] = useState([]);

  const [members, setMembers] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
  });

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const response = await API.get("/tasks/my-tasks");

      setTasks(response.data.tasks);
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH PROJECTS
  const fetchProjects = async () => {
    try {
      const response = await API.get("/projects/all");

      setProjects(response.data.projects);
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH MEMBERS
  const fetchMembers = async () => {
    try {
      const response = await API.get("/projects/members");

      setMembers(response.data.members);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();

    fetchProjects();

    fetchMembers();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // CREATE TASK
  const createTask = async () => {
    try {
      await API.post("/tasks/create", formData);

      alert("Task Created");

      setFormData({
        title: "",
        description: "",
        projectId: "",
        assignedTo: "",
        priority: "medium",
        dueDate: "",
      });

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // UPDATE STATUS
  const updateTaskStatus = async (taskId, currentStatus, newStatus) => {
    // TASK ALREADY DONE
    if (currentStatus === "done") {
      alert("Task already completed. Contact admin.");

      return;
    }

    try {
      await API.put("/tasks/update-status", {
        taskId,
        status: newStatus,
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

        {/* ADMIN TASK FORM */}

        <div className="task-form-container">
          <div className="task-form">
            <input
              type="text"
              name="title"
              placeholder="Task Title"
              value={formData.title}
              onChange={handleChange}
            />

            <input
              type="text"
              name="description"
              placeholder="Task Description"
              value={formData.description}
              onChange={handleChange}
            />

            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
            >
              <option value="">Select Project</option>

              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>

            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
            >
              <option value="">Assign Member</option>

              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>

              <option value="medium">Medium</option>

              <option value="high">High</option>
            </select>

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />

            <button onClick={createTask}>Create Task</button>
          </div>
        </div>

        {/* TASK LIST */}

        <div className="project-list">
          {tasks.map((task) => (
            <div className="project-card" key={task._id}>
              <div>
                <h3>{task.title}</h3>

                <p>{task.description}</p>

                <p>
                  <strong>Project:</strong> {task.project?.title}
                </p>

                <p>
                  <strong>Priority:</strong> {task.priority}
                </p>

                <p>
                  <strong>Status:</strong> {task.status}
                </p>

                <p>
                  <strong>Due Date:</strong>{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>

              {/* MEMBER ACTIONS */}

              {user?.role === "member" && (
                <div className="project-actions">
                  <button
                    className="status-btn"
                    onClick={() =>
                      updateTaskStatus(task._id, task.status, "in-progress")
                    }
                  >
                    In Progress
                  </button>

                  <button
                    className="complete-btn"
                    onClick={() => updateTaskStatus(task._id, task.status, "done")}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tasks;
