import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";

import API from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);

  const [members, setMembers] = useState([]);

  const [selectedMember, setSelectedMember] = useState("");

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
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
    if (!title || !description || !selectedMember) return;

    try {
      const projectResponse = await API.post("/projects/create", {
        title,
        description,
      });

      await API.put("/projects/add-member", {
        projectId: projectResponse.data.project._id,
        userId: selectedMember,
      });

      setTitle("");

      setDescription("");

      setSelectedMember("");

      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE PROJECT

  const deleteProject = async (id) => {
    try {
      await API.delete(`/projects/${id}`);

      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

  // MARK PROJECT COMPLETED

  const markAsCompleted = async (projectId) => {
    try {
      await API.put(`/projects/${projectId}`, {
        status: "Completed",
      });

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
        {user?.role === "admin" && (
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

            {/* MEMBER DROPDOWN */}

            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
            >
              <option value="">Select Team Member</option>

              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>

            <button onClick={addProject}>Add Project</button>
          </div>
        )}
        {/* PROJECT LIST */}

        <div className="project-list">
          {projects.map((project) => (
            <div className="project-card" key={project._id}>
              <div>
                <h3>{project.title}</h3>

                <p>{project.description}</p>

                <p>
                  <strong>Assigned To:</strong>{" "}
                  {project.members?.map((member) => member.name).join(", ")}
                </p>

                <p>
                  <strong>Status:</strong> {project.status}
                </p>

                {user?.role === "admin" && project.status !== "Completed" && (
                  <button
                    className="complete-btn"
                    onClick={() => markAsCompleted(project._id)}
                  >
                    Done
                  </button>
                )}
              </div>

              {user?.role === "admin" && (
                <button
                  className="delete-btn"
                  onClick={() => deleteProject(project._id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Projects;
