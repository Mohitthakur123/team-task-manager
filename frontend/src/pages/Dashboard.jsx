import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  FaTasks,
  FaClock,
  FaCheckCircle,
  FaProjectDiagram
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";

import API from "../services/api";

function Dashboard() {

  const navigate = useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const [dashboardData, setDashboardData] =
    useState({

      totalProjects: 0,

      totalTasks: 0,

      pendingTasks: 0,

      completedTasks: 0,

      overdueTasks: 0
    });

  /* ================= FETCH DASHBOARD ================= */

  const fetchDashboard = async () => {

    try {

      const response =
        await API.get("/dashboard");

      setDashboardData(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchDashboard();

  }, []);

  /* ================= LOGOUT ================= */

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  };

  return (

    <div className="dashboard-container">

      <Sidebar />

      <div className="dashboard-main">

        {/* HEADER */}

        <div className="dashboard-header">

          <div>

            <h1>
              Welcome, {user?.name}
            </h1>

            <p className="dashboard-subtitle">

              {
                user?.role === "admin"

                ? "Manage projects and teams"

                : "Track your assigned work"
              }

            </p>

          </div>

          {/* LOGOUT BUTTON */}

          <button
            className="logout-btn"
            onClick={handleLogout}
          >

            Logout

          </button>

        </div>

        {/* DASHBOARD CARDS */}

        <div className="dashboard-cards">

          {
            user?.role === "admin"

            &&

            (
              <div className="card">

                <div className="card-top">

                  <FaProjectDiagram
                    className="card-icon blue"
                  />

                </div>

                <h3>Total Projects</h3>

                <p>
                  {
                    dashboardData.totalProjects
                  }
                </p>

              </div>
            )
          }

          <div className="card">

            <div className="card-top">

              <FaTasks
                className="card-icon blue"
              />

            </div>

            <h3>Total Tasks</h3>

            <p>
              {
                dashboardData.totalTasks
              }
            </p>

          </div>

          <div className="card">

            <div className="card-top">

              <FaClock
                className="card-icon orange"
              />

            </div>

            <h3>Pending Tasks</h3>

            <p>
              {
                dashboardData.pendingTasks
              }
            </p>

          </div>

          <div className="card">

            <div className="card-top">

              <FaCheckCircle
                className="card-icon green"
              />

            </div>

            <h3>Completed Tasks</h3>

            <p>
              {
                dashboardData.completedTasks
              }
            </p>

          </div>

          <div className="card">

            <div className="card-top">

              <FaClock
                className="card-icon orange"
              />

            </div>

            <h3>Overdue Tasks</h3>

            <p>
              {
                dashboardData.overdueTasks
              }
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;