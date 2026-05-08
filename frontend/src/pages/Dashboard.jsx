import {
  FaProjectDiagram,
  FaTasks,
  FaClock,
  FaCheckCircle
} from "react-icons/fa";

import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";

import API from "../services/api";

function Dashboard() {

  const user =
    JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0
  });

  // FETCH DATA
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
          (task) => task.status !== "done"
        );

      const completedTasks =
        tasks.filter(
          (task) => task.status === "done"
        );

      setStats({
        totalProjects: projects.length,
        totalTasks: tasks.length,
        pendingTasks:
          pendingTasks.length,
        completedTasks:
          completedTasks.length
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

            <h1>
              Welcome,
              {" "}
              {user?.name}
            </h1>

            <p className="dashboard-subtitle">

              {
                user?.role === "admin"

                  ? "Manage projects and teams"

                  : "Track your assigned tasks"
              }

            </p>

          </div>

        </div>

        <div className="dashboard-cards">

          {/* ADMIN ONLY */}

          {user?.role === "admin" && (

            <div className="card">

              <div className="card-top">

                <FaProjectDiagram
                  className="card-icon blue"
                />

              </div>

              <h3>Total Projects</h3>

              <p>
                {stats.totalProjects}
              </p>

            </div>

          )}

          {/* TOTAL TASKS */}

          <div className="card">

            <div className="card-top">

              <FaTasks
                className="card-icon blue"
              />

            </div>

            <h3>Total Tasks</h3>

            <p>
              {stats.totalTasks}
            </p>

          </div>

          {/* PENDING */}

          <div className="card">

            <div className="card-top">

              <FaClock
                className="card-icon orange"
              />

            </div>

            <h3>Pending Tasks</h3>

            <p>
              {stats.pendingTasks}
            </p>

          </div>

          {/* COMPLETED */}

          <div className="card">

            <div className="card-top">

              <FaCheckCircle
                className="card-icon green"
              />

            </div>

            <h3>Completed Tasks</h3>

            <p>
              {stats.completedTasks}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;