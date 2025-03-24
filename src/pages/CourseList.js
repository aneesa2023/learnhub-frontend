import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { Card, Row, Col, Badge, Spinner } from "react-bootstrap";
import { FaBook } from "react-icons/fa";
import "../styles/CourseList.css";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/list-courses/");
        const data = await res.json();

        if (Array.isArray(data.courses)) {
          // Sort by timestamp
          const sorted = [...data.courses].sort((a, b) => {
            const getTimestamp = (filename) => {
              const parts = filename.split("_");
              const lastPart = parts[parts.length - 1];
              return parseInt(lastPart, 10) || 0;
            };
            return getTimestamp(b) - getTimestamp(a);
          });

          // Fetch metadata for each course
          const enrichedCourses = await Promise.all(
            sorted.map(async (courseId) => {
              try {
                const res = await fetch(`http://127.0.0.1:8000/get-course/${courseId}`);
                const courseData = await res.json();
                return {
                  id: courseId,
                  title: decodeURIComponent(courseId)
                    .replace(/_/g, " ")
                    .replace(/\d+$/, "")
                    .trim(),
                  chapters: courseData.chapters?.length || 0,
                  difficulty: courseData.difficulty || "Unknown",
                };
              } catch (e) {
                console.error("Failed to fetch course details:", e);
                return {
                  id: courseId,
                  title: decodeURIComponent(courseId)
                    .replace(/_/g, " ")
                    .replace(/\d+$/, "")
                    .trim(),
                  chapters: 0,
                  difficulty: "Unknown",
                };
              }
            })
          );

          setCourses(enrichedCourses);

          // Auto-redirect if needed
          if (location.state?.openCourseId) {
            navigate(`/course/${location.state.openCourseId}`);
          }
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [location.state, navigate]);

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center p-5">
          <Spinner animation="border" />
          <p>Loading courses...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={{ padding: "30px" }}>
        <h2 className="mb-4">📚 My AI Courses</h2>
        <Row xs={1} md={2} lg={3} className="g-4">
          {courses.map(({ id, title, chapters, difficulty }) => (
            <Col key={id}>
              <Card
                className="course-card"
                onClick={() => navigate(`/course/${id}`)}
                style={{ cursor: "pointer" }}
              >
                <Card.Img
                  variant="top"
                  src="/assets/online_tutorial.png"
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                  }}
                />
                <Card.Body>
                  <Card.Title className="course-title">{title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Development</Card.Subtitle>
                  <div className="d-flex justify-content-between mt-3">
                    <Badge bg="success">
                      <FaBook /> {chapters} Chapters
                    </Badge>
                    <Badge bg="success">{difficulty}</Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </MainLayout>
  );
}

export default CourseList;
