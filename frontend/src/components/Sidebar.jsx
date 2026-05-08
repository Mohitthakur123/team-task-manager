import {
  FaClipboardList,
  FaProjectDiagram,
  FaTasks,
  FaSignOutAlt
} from "react-icons/fa";

import {
  useNavigate,
  useLocation
} from "react-router-dom";

function Sidebar() {

  const navigate = useNavigate();

  const location = useLocation();

  const user =
    JSON.parse(localStorage.getItem("user"));

  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  };

  return (

    <div className="sidebar">

      <h2>Team Manager</h2>

      <ul>

        {/* DASHBOARD */}

        <li
          className={
            location.pathname === "/dashboard"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <FaClipboardList className="icon" />
          Dashboard
        </li>

        {/* ADMIN ONLY */}

        {user?.role === "admin" && (

          <li
            className={
              location.pathname === "/projects"
                ? "active"
                : ""
            }
            onClick={() =>
              navigate("/projects")
            }
          >
            <FaProjectDiagram className="icon" />
            Projects
          </li>

        )}

        {/* TASKS */}

        <li
          className={
            location.pathname === "/tasks"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("/tasks")
          }
        >
          <FaTasks className="icon" />
          Tasks
        </li>

        {/* LOGOUT */}

        <li onClick={handleLogout}>
          <FaSignOutAlt className="icon" />
          Logout
        </li>

      </ul>

    </div>
  );
}

export default Sidebar;