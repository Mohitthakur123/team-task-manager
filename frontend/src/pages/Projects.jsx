import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";

import API from "../services/api";

function Projects() {

  const [projects, setProjects] = useState([]);

  const [members, setMembers] = useState([]);

  const [selectedMembers, setSelectedMembers] = useState([]);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

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

    fetchProjects();

    fetchMembers();

  }, []);

  // ADD PROJECT

  const addProject = async () => {

    if(!title || !description) return;

    try {

      await API.post("/projects/create",{
        title,
        description,
        members: selectedMembers
      });

      setTitle("");

      setDescription("");

      setSelectedMembers([]);

      fetchProjects();

    } catch (error) {

      console.log(error);

    }
  };

  // DELETE PROJECT

  const deleteProject = async (id) => {

    try {

      await API.delete(`/projects/delete/${id}`);

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

        <div className="project-form">

          <input
            type="text"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            multiple
            value={selectedMembers}
            onChange={(e) =>
              setSelectedMembers(
                [...e.target.selectedOptions].map(
                  option => option.value
                )
              )
            }
          >

            {
              members.map((member) => (

                <option
                  key={member._id}
                  value={member._id}
                >
                  {member.name}
                </option>

              ))
            }

          </select>

          <button onClick={addProject}>
            Add Project
          </button>

        </div>

        <div className="project-list">

          {
            projects.map((project) => (

              <div className="project-card" key={project._id}>

                <div>

                  <h3>{project.title}</h3>

                  <p>{project.description}</p>

                  <p>
                    <strong>Team Members:</strong>{" "}
                    {
                      project.members
                        .map((member) => member.name)
                        .join(", ")
                    }
                  </p>

                </div>

                <button
                  className="delete-btn"
                  onClick={() => deleteProject(project._id)}
                >
                  Delete
                </button>

              </div>

            ))
          }

        </div>

      </div>

    </div>
  );
}

export default Projects;