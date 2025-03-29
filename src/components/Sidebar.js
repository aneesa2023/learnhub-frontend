import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <Nav className="flex-column">
        <Nav.Link
          as={NavLink}
          to="/"
          className="sidebar-link"
        >
          🏠 Home
        </Nav.Link>
        
        <Nav.Link
          as={NavLink}
          to="/create"
          className="sidebar-link"
        >
          ✍️ Create
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/courses"
          className="sidebar-link"
        >
          📚 Courses
        </Nav.Link>
      </Nav>
    </div>
  );
}
