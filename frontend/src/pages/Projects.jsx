import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";

import API from "../services/api";

function Projects() {

  const user =
    JSON.parse(localStorage.getItem("user"));

  const [projects, setProjects] =
    useState([]);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  // FETCH PROJECTS
  const fetchProjects = async () => {

    try {

      const response =
        await API.get("/projects/all");

      setProjects(response.data.projects);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchProjects();

  }, []);

  // CREATE PROJECT
  const createProject = async () => {

    try {

      await API.post(
        "/projects/create",
        {
          title,
          description
        }
      );

      alert("Project Created");

      setTitle("");

      setDescription("");

      fetchProjects();

    } catch (error) {

      console.log(error);
    }
  };

  // MARK COMPLETE
  const markCompleted = async (id) => {

    try {

      await API.put(
        `/projects/${id}`,
        {
          status: "Completed"
        }
      );

      fetchProjects();

    } catch (error) {

      console.log(error);
    }
  };

  // DELETE PROJECT
  const deleteProject = async (id) => {

    try {

      await API.delete(
        `/projects/${id}`
      );

      fetchProjects();

    } catch (error) {

      console.log(error);
    }
  };

  return (

    <div className="dashboard-container">

      <Sidebar />

      <div className="projects-page">

        <div className="project-header">

          <h1>
            Projects
          </h1>

        </div>

        {/* ADMIN ONLY */}

        {
          user?.role === "admin" && (

            <div className="project-form">

              <input
                type="text"
                placeholder="Project Title"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
              />

              <input
                type="text"
                placeholder="Project Description"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
              />

              <button
                onClick={createProject}
              >
                Create Project
              </button>

            </div>

          )
        }

        {/* PROJECT LIST */}

        <div className="project-list">

          {
            projects.map((project) => (

              <div
                className="project-card"
                key={project._id}
              >

                <div>

                  <h3>
                    {project.title}
                  </h3>

                  <p>
                    {project.description}
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>
                    {" "}
                    {project.status}
                  </p>

                  <p>
                    <strong>
                      Created:
                    </strong>
                    {" "}
                    {
                      new Date(
                        project.createdAt
                      ).toLocaleDateString()
                    }
                  </p>

                </div>

                {/* ADMIN ACTIONS */}

                {
                  user?.role === "admin" && (

                    <div
                      className="project-actions"
                    >

                      {
                        project.status !==
                        "Completed" && (

                          <button
                            className="complete-btn"
                            onClick={() =>
                              markCompleted(
                                project._id
                              )
                            }
                          >
                            Complete
                          </button>

                        )
                      }

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteProject(
                            project._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  )
                }

              </div>

            ))
          }

        </div>

      </div>

    </div>
  );
}

export default Projects;