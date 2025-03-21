import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Spinner, Alert, Row, Col, Button, Card } from "react-bootstrap";
import "../styles/Course.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function Course() {
  const [searchParams] = useSearchParams();
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

        const requestData = {
          topic: searchParams.get("topic") || "flutter",
          description: searchParams.get("description") || "state management",
          category: searchParams.get("category") || "Technical & Programming",
          difficulty: searchParams.get("difficulty") || "Beginner",
          chapters: parseInt(searchParams.get("chapters") || 3),
          tone_output_style: searchParams.get("tone_output_style") || "Educational",
        };

        console.log("🟢 Sending API request:", requestData);
        const res = await axios.post("http://127.0.0.1:8000/generate-learning-path/", requestData);
        console.log("🟢 API Response:", res.data);

        if (res.data) {
          setCourse(res.data);
        } else {
          setError("No course data found. Try a different topic.");
        }
      } catch (error) {
        console.error("🔴 API Error:", error);
        setError("Failed to fetch course data.");
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [searchParams]);

  if (loading) {
    return (
      <Container className="text-center mt-4">
        <Spinner animation="border" />
        <p>Generating course...</p>
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
      {/* Back Button */}
      <Button variant="secondary" className="mb-3 back-button" onClick={() => navigate("/")}>
        ⬅️ Back to Home
      </Button>

      {/* Course Header */}
      <h2 className="course-title">{course.course_title}</h2>
      <p className="course-description">{course.description}</p>

      {/* Sidebar & Content Layout */}
      <Row>
        {/* Sidebar Navigation */}
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

        {/* Main Content */}
        <Col md={9} className="content-area">
          {course.chapters.length > 0 && (
            <>
              {/* Chapter Title */}
              <h3 className="chapter-title">{course.chapters[selectedChapter].chapter_title}</h3>

              {/* Video Carousel */}
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

              {/* Study Notes - Improved Formatting */}
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

// ✅ Function to Format Study Notes
const formatStudyNotes = (notes) => {
  return notes
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold **text**
    .replace(/\n\s*-\s*(.*?)(?=\n|$)/g, "<li>$1</li>") // Bullet List
    .replace(/\n\s*\d+\.\s*(.*?)(?=\n|$)/g, "<li>$1</li>") // Numbered List
    .replace(/`([^`]+)`/g, "<code>$1</code>") // Inline Code
    .replace(/\n/g, "<br/>"); // Preserve Line Breaks
};
