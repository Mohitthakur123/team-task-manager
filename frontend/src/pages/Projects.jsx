import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";

import API from "../services/api";

function Projects() {

  const user =
    JSON.parse(localStorage.getItem("user"));

  const [projects, setProjects] = useState([]);

  const [members, setMembers] = useState([]);

  const [selectedMember, setSelectedMember] =
    useState("");

  const [selectedProject, setSelectedProject] =
    useState("");

  const [title, setTitle] = useState("");

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

  // FETCH MEMBERS
  const fetchMembers = async () => {

    try {

      const response =
        await API.get("/projects/members");

      setMembers(response.data.members);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchProjects();

    if (user?.role === "admin") {
      fetchMembers();
    }

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

      setTitle("");
      setDescription("");

      fetchProjects();

    } catch (error) {

      console.log(error);
    }
  };

  // ADD MEMBER
  const addMember = async () => {

    try {

      await API.put(
        "/projects/add-member",
        {
          projectId: selectedProject,
          userId: selectedMember
        }
      );

      alert("Member Added");

      setSelectedMember("");
      setSelectedProject("");

      fetchProjects();

    } catch (error) {

      console.log(error);
    }
  };

  // UPDATE STATUS
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
          <h1>Projects</h1>
        </div>

        {/* ADMIN ONLY */}

        {user?.role === "admin" && (

          <>

            {/* CREATE PROJECT */}

            <div className="project-form">

              <input
                type="text"
                placeholder="Project Title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Project Description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />

              <button onClick={createProject}>
                Create Project
              </button>

            </div>

            {/* ADD TEAM MEMBER */}

            <div className="project-form">

              <select
                value={selectedProject}
                onChange={(e) =>
                  setSelectedProject(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Select Project
                </option>

                {projects.map((project) => (

                  <option
                    key={project._id}
                    value={project._id}
                  >
                    {project.title}
                  </option>

                ))}

              </select>

              <select
                value={selectedMember}
                onChange={(e) =>
                  setSelectedMember(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Select Member
                </option>

                {members.map((member) => (

                  <option
                    key={member._id}
                    value={member._id}
                  >
                    {member.name}
                  </option>

                ))}

              </select>

              <button onClick={addMember}>
                Add Member
              </button>

            </div>

          </>

        )}

        {/* PROJECT LIST */}

        <div className="project-list">

          {projects.map((project) => (

            <div
              className="project-card"
              key={project._id}
            >

              <div>

                <h3>{project.title}</h3>

                <p>{project.description}</p>

                <p>
                  <strong>Status:</strong>
                  {" "}
                  {project.status}
                </p>

                <p>
                  <strong>Team Members:</strong>
                </p>

                <ul>

                  {project.members?.map(
                    (member) => (

                      <li key={member._id}>
                        {member.name}
                      </li>

                    )
                  )}

                </ul>

              </div>

              {/* ADMIN ACTIONS */}

              {user?.role === "admin" && (

                <div
                  className="project-actions"
                >

                  {project.status !==
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

                  )}

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

              )}

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default Projects;