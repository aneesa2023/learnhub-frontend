import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Spinner, Alert } from "react-bootstrap";

export default function ViewCourse() {
  const { courseName } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/get-course/${courseName}`);
        setCourse(res.data);
      } catch (err) {
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [courseName]);

  if (loading) return <Spinner animation="border" className="mt-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container>
      <h2>{course.course_title}</h2>
      <p>{course.description}</p>
      <ul>
        {course.chapters.map((ch, i) => (
          <li key={i}>
            <strong>{ch.chapter_title}</strong> – {ch.learning_objectives?.join(", ")}
          </li>
        ))}
      </ul>
    </Container>
  );
}
