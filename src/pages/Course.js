import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner, Alert, Row, Col, Button, Card } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "../styles/Course.css";

export default function Course() {
  const { courseId } = useParams(); // Get courseId from route
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedChapter, setSelectedChapter] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCourse() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`http://127.0.0.1:8000/get-course/${courseId}`);
        if (!res.ok) throw new Error("Course not found");

        const data = await res.json();
        setCourse(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Failed to fetch course.");
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <Container className="text-center mt-4">
        <Spinner animation="border" />
        <p>Loading course...</p>
      </Container>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const handleChapterChange = (index) => {
    setSelectedChapter(index);
  };

  return (
    <Container fluid className="course-container">
      <Button variant="secondary" className="mb-3 back-button" onClick={() => navigate("/")}>
        ⬅️ Back to Home
      </Button>

      <h2 className="course-title">{course.course_title}</h2>
      <p className="course-description">{course.description}</p>

      <Row>
        <Col md={3} className="sidebar">
          {course.chapters.map((chapter, index) => (
            <Button
              key={index}
              variant={selectedChapter === index ? "primary" : "light"}
              className={`chapter-btn ${selectedChapter === index ? "active" : ""}`}
              onClick={() => handleChapterChange(index)}
            >
              {`${chapter.chapter_number}. ${chapter.chapter_title}`}
            </Button>
          ))}
        </Col>

        <Col md={9} className="content-area">
          {course.chapters.length > 0 && (
            <>
              <h3 className="chapter-title">{course.chapters[selectedChapter].chapter_title}</h3>

              <div className="video-carousel-container">
                <Button
                  variant="light"
                  className="carousel-arrow left"
                  onClick={() => {
                    document.getElementById("videoScroll").scrollLeft -= 300;
                  }}
                >
                  <FaArrowLeft />
                </Button>

                <div id="videoScroll" className="video-carousel">
                  {course.chapters[selectedChapter].videos?.videos.map((video, index) => (
                    <Card key={index} className="video-card">
                      <Card.Img variant="top" src={video.thumbnail} />
                      <Card.Body>
                        <Card.Title>{video.video_title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{video.channel_name}</Card.Subtitle>
                        <Button variant="primary" href={video.video_link} target="_blank" rel="noopener noreferrer">
                          Watch on YouTube
                        </Button>
                      </Card.Body>
                    </Card>
                  ))}
                </div>

                <Button
                  variant="light"
                  className="carousel-arrow right"
                  onClick={() => {
                    document.getElementById("videoScroll").scrollLeft += 300;
                  }}
                >
                  <FaArrowRight />
                </Button>
              </div>

              <div className="study-notes">
                <h4>📖 Study Notes:</h4>
                <div dangerouslySetInnerHTML={{ __html: formatStudyNotes(course.chapters[selectedChapter].study_notes) }} />
              </div>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

const formatStudyNotes = (notes) => {
  return notes
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\s*-\s*(.*?)(?=\n|$)/g, "<li>$1</li>")
    .replace(/\n\s*\d+\.\s*(.*?)(?=\n|$)/g, "<li>$1</li>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br/>");
};
