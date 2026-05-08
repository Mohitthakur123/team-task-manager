import {
  FaProjectDiagram,
  FaClock,
  FaCheckCircle,
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
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
  });

  const [user, setUser] = useState(null);

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const fetchDashboardData = async () => {

    try {

      const dashboardResponse =
        await API.get("/dashboard");

      const profileResponse =
        await API.get("/auth/profile");

      setUser(profileResponse.data.user);

      setStats(
        dashboardResponse.data.dashboard
      );

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
              Welcome back, {user?.name || "User"}
            </p>

          </div>

          <button onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>

        </div>

        <div className="dashboard-cards">

          <div className="card">

            <div className="card-top">
              <FaProjectDiagram className="card-icon blue" />
            </div>

            <h3>Total Projects</h3>

            <p>{stats.totalProjects}</p>

          </div>

          <div className="card">

            <div className="card-top">
              <FaProjectDiagram className="card-icon blue" />
            </div>

            <h3>Total Tasks</h3>

            <p>{stats.totalTasks}</p>

          </div>

          <div className="card">

            <div className="card-top">
              <FaClock className="card-icon orange" />
            </div>

            <h3>Pending Tasks</h3>

            <p>{stats.pendingTasks}</p>

          </div>

          <div className="card">

            <div className="card-top">
              <FaClock className="card-icon orange" />
            </div>

            <h3>In Progress</h3>

            <p>{stats.inProgressTasks}</p>

          </div>

          <div className="card">

            <div className="card-top">
              <FaCheckCircle className="card-icon green" />
            </div>

            <h3>Completed Tasks</h3>

            <p>{stats.completedTasks}</p>

          </div>

          <div className="card">

            <div className="card-top">
              <FaClock className="card-icon red" />
            </div>

            <h3>Overdue Tasks</h3>

            <p>{stats.overdueTasks}</p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;