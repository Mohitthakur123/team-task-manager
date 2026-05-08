import {
  FaProjectDiagram,
  FaClock,
  FaCheckCircle,
  FaTasks,
  FaExclamationCircle,
  FaSignOutAlt,
} from "react-icons/fa";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import API from "../services/api";

function Dashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
  });

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const fetchDashboardData = async () => {

    try {

      const projectResponse =
        await API.get("/projects/all");

      const taskResponse =
        await API.get("/tasks/my-tasks");

      const projects =
        projectResponse.data.projects || [];

      const tasks =
        taskResponse.data.tasks || [];

      const pendingTasks =
        tasks.filter(
          (task) => task.status === "todo"
        );

      const inProgressTasks =
        tasks.filter(
          (task) =>
            task.status === "in-progress"
        );

      const completedTasks =
        tasks.filter(
          (task) => task.status === "done"
        );

      const overdueTasks =
        tasks.filter(
          (task) =>
            new Date(task.dueDate) <
              new Date() &&
            task.status !== "done"
        );

      setStats({
        totalProjects: projects.length,
        totalTasks: tasks.length,
        pendingTasks: pendingTasks.length,
        inProgressTasks:
          inProgressTasks.length,
        completedTasks:
          completedTasks.length,
        overdueTasks:
          overdueTasks.length,
      });

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchDashboardData();

  }, []);

  return (

    <div className="dashboard-container">

      <Sidebar />

      <div className="dashboard-main">

        <div className="dashboard-header">

          <div>

            <h1>Dashboard</h1>

            <p className="dashboard-subtitle">
              Welcome back
            </p>

          </div>

          <button onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>

        </div>

        <div className="dashboard-cards">

          <div className="card">
            <FaProjectDiagram className="card-icon blue" />
            <h3>Total Projects</h3>
            <p>{stats.totalProjects}</p>
          </div>

          <div className="card">
            <FaTasks className="card-icon blue" />
            <h3>Total Tasks</h3>
            <p>{stats.totalTasks}</p>
          </div>

          <div className="card">
            <FaClock className="card-icon orange" />
            <h3>Pending Tasks</h3>
            <p>{stats.pendingTasks}</p>
          </div>

          <div className="card">
            <FaTasks className="card-icon orange" />
            <h3>In Progress</h3>
            <p>{stats.inProgressTasks}</p>
          </div>

          <div className="card">
            <FaCheckCircle className="card-icon green" />
            <h3>Completed Tasks</h3>
            <p>{stats.completedTasks}</p>
          </div>

          <div className="card">
            <FaExclamationCircle className="card-icon red" />
            <h3>Overdue Tasks</h3>
            <p>{stats.overdueTasks}</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;