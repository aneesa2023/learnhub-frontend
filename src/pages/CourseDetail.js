import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner, Alert, Row, Col, Button } from "react-bootstrap";
import MainLayout from "../components/MainLayout";
import "../styles/Course.css";

export default function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

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
    setActiveVideoIndex(0); // Reset to first video on chapter switch
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

  if (!course || !course.chapters) {
    return (
      <MainLayout>
        <Container className="text-center mt-4">
          <p>No course data found.</p>
        </Container>
      </MainLayout>
    );
  }

  const currentChapter = course.chapters[selectedChapter];
  const videos = currentChapter?.videos?.videos || [];
  const activeVideo = videos[activeVideoIndex];

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
            <h3 className="chapter-title">{currentChapter.chapter_title}</h3>

            {videos.length > 0 && (
              <div className="video-player-section mb-4">
                <h5 className="mb-3">🎥 {currentChapter.chapter_title}</h5>

                <div className="video-responsive mb-3" style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideo.video_id}`}
                    title={activeVideo.video_title}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="mb-2">
                  <h6>{activeVideo.video_title}</h6>
                  <p className="text-muted mb-1">{activeVideo.channel_name}</p>
                </div>

                <div className="d-flex flex-wrap gap-2 mb-3">
                  {videos.map((_, index) => (
                    <Button
                      key={index}
                      variant={index === activeVideoIndex ? "primary" : "outline-primary"}
                      onClick={() => setActiveVideoIndex(index)}
                    >
                      Video {index + 1}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="study-notes">
              <h4>📖 Study Notes:</h4>
              <div
                dangerouslySetInnerHTML={{
                  __html: formatStudyNotes(currentChapter.study_notes),
                }}
              />
            </div>
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
