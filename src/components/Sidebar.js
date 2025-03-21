import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/">🏠 Home</Nav.Link>
        <Nav.Link as={Link} to="/courses">📚 Courses</Nav.Link>
      </Nav>
    </div>
  );
}
