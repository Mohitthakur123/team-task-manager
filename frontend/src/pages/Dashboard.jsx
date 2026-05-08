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

  const [stats, setStats] =
    useState({
      totalProjects: 0,
      totalTasks: 0,
      pendingTasks: 0,
      completedTasks: 0,
      overdueTasksCount: 0,
      overdueTasks: []
    });

  // FETCH DASHBOARD DATA

  const fetchDashboardData =
    async () => {

      try {

        const response =
          await API.get(
            "/dashboard"
          );

        setStats(
          response.data.dashboard
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

        {/* HEADER */}

        <div className="dashboard-header">

          <div>

            <h1>
              Welcome,
              {" "}
              {user?.name}
            </h1>

            <p className="dashboard-subtitle">

              Manage projects,
              tasks and teams

            </p>

          </div>

        </div>

        {/* DASHBOARD CARDS */}

        <div className="dashboard-cards">

          {/* PROJECTS */}

          <div className="card">

            <div className="card-top">

              <FaProjectDiagram
                className="card-icon blue"
              />

            </div>

            <h3>
              Total Projects
            </h3>

            <p>
              {stats.totalProjects}
            </p>

          </div>

          {/* TOTAL TASKS */}

          <div className="card">

            <div className="card-top">

              <FaTasks
                className="card-icon blue"
              />

            </div>

            <h3>
              Total Tasks
            </h3>

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

            <h3>
              Pending Tasks
            </h3>

            <p>
              {stats.pendingTasks}
            </p>

          </div>

          {/* OVERDUE */}

          <div className="card">

            <div className="card-top">

              <FaClock
                className="card-icon orange"
              />

            </div>

            <h3>
              Overdue Tasks
            </h3>

            <p>
              {stats.overdueTasksCount}
            </p>

          </div>

          {/* COMPLETED */}

          <div className="card">

            <div className="card-top">

              <FaCheckCircle
                className="card-icon green"
              />

            </div>

            <h3>
              Completed Tasks
            </h3>

            <p>
              {stats.completedTasks}
            </p>

          </div>

        </div>

        {/* OVERDUE TASKS */}

        {
          stats.overdueTasks?.length > 0 && (

            <div
              style={{
                marginTop: "40px"
              }}
            >

              <h2
                style={{
                  marginBottom: "20px"
                }}
              >
                Overdue Tasks
              </h2>

              <div className="project-list">

                {
                  stats.overdueTasks.map(
                    (task) => (

                      <div
                        className="project-card"
                        key={task._id}
                      >

                        <div>

                          <h3>
                            {task.title}
                          </h3>

                          <p>
                            {task.description}
                          </p>

                          <p>
                            <strong>
                              Project:
                            </strong>
                            {" "}
                            {
                              task.project?.title
                            }
                          </p>

                          <p>
                            <strong>
                              Due Date:
                            </strong>
                            {" "}
                            {
                              new Date(
                                task.dueDate
                              ).toLocaleDateString()
                            }
                          </p>

                          <p>
                            <strong>
                              Assigned Members:
                            </strong>
                          </p>

                          <div>

                            {
                              task.assignedTo?.map(
                                (member) => (

                                  <span
                                    key={member._id}
                                    className="member-badge"
                                  >
                                    {member.name}
                                  </span>

                                )
                              )
                            }

                          </div>

                        </div>

                      </div>

                    )
                  )
                }

              </div>

            </div>

          )
        }

      </div>

    </div>
  );
}

export default Dashboard;