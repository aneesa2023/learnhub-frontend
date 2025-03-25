import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Spinner,
  Alert,
  Row,
  Col,
  Button,
  Card,
  Table,
} from "react-bootstrap";
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

        const overviewChapter = {
          chapter_number: 0,
          chapter_title: "Course Overview",
          learning_objectives: data.chapters[0]?.learning_objectives || [],
          key_concepts: data.chapters[0]?.key_concepts || [],
          practical_applications: [],
          study_notes: "",
        };

        const summaryChapter = {
          chapter_number: data.chapters.length + 1,
          chapter_title: "Course Summary",
          learning_objectives: [],
          key_concepts: [],
          practical_applications: data.learning_path_summary?.next_steps || [],
          study_notes: data.learning_path_summary?.overview || "",
        };

        setCourse({
          ...data,
          chapters: [overviewChapter, ...data.chapters, summaryChapter],
        });
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
    setActiveVideoIndex(0);
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
        <Alert variant="danger" className="m-4">
          {error}
        </Alert>
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
  const isOverview = selectedChapter === 0;
  const isSummary = selectedChapter === course.chapters.length - 1;

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
                className={`chapter-btn ${
                  selectedChapter === index ? "active" : ""
                }`}
                onClick={() => handleChapterChange(index)}
              >
                {`${chapter.chapter_number}. ${chapter.chapter_title}`}
              </Button>
            ))}
          </Col>

          <Col md={9} className="content-area">
            <h3 className="chapter-title">{currentChapter.chapter_title}</h3>

            {isOverview && (
              <>
                <div className="chapter-section mb-4">
                  <h4>🎯 Learning Objectives</h4>
                  <ul>
                    {currentChapter.learning_objectives?.map((obj, idx) => (
                      <li key={idx}>{obj}</li>
                    ))}
                  </ul>
                </div>

                <div className="chapter-section mb-4">
                  <h4>🧠 Key Concepts</h4>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Concept</th>
                        <th>Explanation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentChapter.key_concepts?.map((concept, idx) => (
                        <tr key={idx}>
                          <td>{concept.title}</td>
                          <td>{concept.explanation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </>
            )}

            {!isOverview && !isSummary && videos.length > 0 && (
              <div className="video-player-section mb-4">
                {/* <h5 className="mb-3">🎥 {currentChapter.chapter_title}</h5> */}

                <div
                  className="video-responsive mb-3"
                  style={{
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                    overflow: "hidden",
                  }}
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideo.video_id}`}
                    title={activeVideo.video_title}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
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
                      variant={
                        index === activeVideoIndex
                          ? "primary"
                          : "outline-primary"
                      }
                      onClick={() => setActiveVideoIndex(index)}
                    >
                      Video {index + 1}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {!isOverview && !isSummary && (
              <Card className="p-3 mt-4 shadow-sm">
                <Card.Title className="mb-3">📖 Study Notes</Card.Title>
                <Card.Text>
                  <div
                    className="study-notes-html"
                    dangerouslySetInnerHTML={{
                      __html: formatStudyNotes(currentChapter.study_notes),
                    }}
                  />
                </Card.Text>
              </Card>
            )}

            {isSummary && (
              <>
                <div className="chapter-section mb-4">
                  {/* <h4>📘 Course Summary</h4> */}
                  <div
                    className="course-summary-html"
                    dangerouslySetInnerHTML={{
                      __html: formatCourseSummary(
                        course.learning_path_summary?.course_summary
                      ),
                    }}
                  />
                </div>

                <div className="chapter-section mb-4">
                  <h4>📚 Recommended Study Links</h4>
                  <ul>
                    {course.learning_path_summary?.recommended_study_links?.map(
                      (link, idx) => (
                        <li key={idx}>
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link}
                          </a>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="chapter-section mb-4">
                  <h4>🚀 Next Steps</h4>
                  <ul>
                    {currentChapter.practical_applications?.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
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
  if (!notes) return "";

  const paragraphs = notes.split(/\n{2,}/).map((p) => `<p>${p.trim()}</p>`);

  return paragraphs
    .join("")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/<p>- (.*?)<\/p>/g, "<ul><li>$1</li></ul>")
    .replace(/<p>\d+\. (.*?)<\/p>/g, "<ol><li>$1</li></ol>")
    .replace(/<\/ul><ul>/g, "")
    .replace(/<\/ol><ol>/g, "");
};

const formatCourseSummary = (text) => {
  if (!text) return "";

  const formatted = text
    .split(/\n{2,}/) // Split by double newlines for paragraphs
    .map((para) => `<p>${para.trim()}</p>`)
    .join("")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold
    .replace(/- (.*?)(?=\n|$)/g, "<li>$1</li>"); // bulleted lines

  return formatted
    .replace(/<li>/g, "<ul><li>")
    .replace(/<\/li>(?!<li>)/g, "</li></ul>");
};
