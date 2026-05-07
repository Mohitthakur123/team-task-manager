import {
  FaClipboardList,
  FaProjectDiagram,
  FaTasks,
  FaSignOutAlt
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

function Sidebar() {

  const navigate = useNavigate();

  // LOGOUT

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/login");
  };


  return (

    <div className="sidebar">

      <h2>Team Manager</h2>

      <ul>

        <li onClick={() => navigate("/dashboard")}>
          <FaClipboardList className="icon" />
          Dashboard
        </li>

        <li onClick={() => navigate("/projects")}>
          <FaProjectDiagram className="icon" />
          Projects
        </li>

        <li onClick={() => navigate("/tasks")}>
          <FaTasks className="icon" />
          Tasks
        </li>

        <li onClick={handleLogout}>
          <FaSignOutAlt className="icon" />
          Logout
        </li>

      </ul>

    </div>
  );
}

export default Sidebar;