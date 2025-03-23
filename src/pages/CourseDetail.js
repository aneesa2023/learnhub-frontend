import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner, Alert, Row, Col, Button, Card } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import MainLayout from "../components/MainLayout";
import "../styles/Course.css";

export default function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedChapter, setSelectedChapter] = useState(0);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await fetch(`http://localhost:8000/get-course/${courseId}`);
        if (!res.ok) throw new Error("Course not found");
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [courseId]);

  const handleChapterChange = (index) => {
    setSelectedChapter(index);
  };

  if (loading) {
    return (
      <MainLayout>
        <Container className="text-center mt-4">
          <Spinner animation="border" />
          <p>Loading course...</p>
        </Container>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Alert variant="danger" className="m-4">{error}</Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container fluid className="course-container">
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
                          <Button
                            variant="primary"
                            href={video.video_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
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
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatStudyNotes(course.chapters[selectedChapter].study_notes),
                    }}
                  />
                </div>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </MainLayout>
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