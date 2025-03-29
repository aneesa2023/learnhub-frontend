import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { Card, Row, Col, Badge, Spinner, Button, InputGroup, FormControl } from "react-bootstrap";
import { FaBook, FaSearch } from "react-icons/fa";
import "../styles/CourseList.css";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/list-courses/");
        const data = await res.json();

        const sorted = [...data.courses].sort((a, b) => {
          const getTimestamp = (filename) => parseInt(filename.split("_").pop(), 10) || 0;
          return getTimestamp(b) - getTimestamp(a);
        });

        const enrichedCourses = await Promise.all(
          sorted.map(async (id) => {
            try {
              const res = await fetch(`http://127.0.0.1:8000/get-course/${id}`);
              const courseData = await res.json();
              return {
                id,
                title: courseData.course_title,
                description: courseData.description || "No description provided.",
                difficulty: courseData.difficulty || "Unknown",
                category: courseData.category || "General",
                chapters: courseData.chapters?.length || 0,
                createdAt: new Date(courseData.metadata?.generated_at || Date.now()),
              };
            } catch {
              return null;
            }
          })
        );

        setCourses(enrichedCourses.filter(Boolean));
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">Explore Learning Paths</h2>
            <p className="text-muted">Browse and discover learning paths covering a wide range of topics and difficulty levels.</p>
          </div>
          <Button variant="outline-dark" onClick={() => navigate("/create")}>Create New</Button>
        </div>

        <InputGroup className="mb-4 shadow-sm">
          <InputGroup.Text><FaSearch /></InputGroup.Text>
          <FormControl
            placeholder="Search by topic, description or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" />
            <p>Loading courses...</p>
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {filteredCourses.map(({ id, title, description, chapters, difficulty, category, createdAt }) => (
              <Col key={id}>
                <Card className="shadow-sm h-100 border-0" style={{ borderRadius: "12px" }}>
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <Badge bg="info" className="text-uppercase">{category || "General"}</Badge>
                      <Badge bg="light" text="dark" className="border">{difficulty}</Badge>
                    </div>
                    <Card.Title className="fw-bold text-capitalize">{title}</Card.Title>
                    <Card.Text className="text-muted mb-2" style={{ fontSize: "0.95rem" }}>
                      {description}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <small className="text-muted"><FaBook /> {chapters} Chapters</small>
                      <small className="text-muted">{createdAt.toLocaleDateString()}</small>
                    </div>
                    <Button
                      variant="primary"
                      className="w-100 mt-3"
                      onClick={() => navigate(`/course/${id}`)}
                    >
                      View Course
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </MainLayout>
  );
}

export default CourseList;
