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
      <MainLayout hideSidebar={true}>
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
      <Container fluid className="px-4 py-4">
        <Row>
          {/* Sidebar */}
          <Col md={3}>
            <h5 className="text-uppercase fw-bold mb-3">Chapters</h5>
            <div className="d-flex flex-column gap-2">
              {course.chapters.map((chapter, index) => (
                <Button
                  key={index}
                  variant={selectedChapter === index ? "primary" : "outline-secondary"}
                  onClick={() => handleChapterChange(index)}
                  className="text-start"
                >
                  {`${chapter.chapter_number}. ${chapter.chapter_title}`}
                </Button>
              ))}
            </div>
          </Col>

          {/* Content */}
          <Col md={9}>
            <Card className="shadow-sm p-4">
              <h3 className="fw-bold mb-3">{currentChapter.chapter_title}</h3>

              {isOverview && (
                <>
                  <h5 className="text-secondary">🎯 Learning Objectives</h5>
                  <ul>
                    {currentChapter.learning_objectives.map((obj, idx) => (
                      <li key={idx}>{obj}</li>
                    ))}
                  </ul>

                  <h5 className="text-secondary mt-4">🧠 Key Concepts</h5>
                  <Table bordered responsive>
                    <thead>
                      <tr>
                        <th>Concept</th>
                        <th>Explanation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentChapter.key_concepts.map((c, idx) => (
                        <tr key={idx}>
                          <td>{c.title}</td>
                          <td>{c.explanation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              )}

              {!isOverview && !isSummary && (
                <>
                  {activeVideo && (
                    <>
                      <div className="video-wrapper mb-3">
                        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                          <iframe
                            src={`https://www.youtube.com/embed/${activeVideo.video_id}`}
                            title={activeVideo.video_title}
                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                            frameBorder="0"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>

                      <div className="d-flex flex-wrap gap-2 mb-4">
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
                    </>
                  )}

                  <h5 className="text-secondary">📖 Study Notes</h5>
                  <div
                    className="study-notes"
                    dangerouslySetInnerHTML={{ __html: formatStudyNotes(currentChapter.study_notes) }}
                  />
                </>
              )}

              {isSummary && (
                <>
                  <h5 className="text-secondary">📘 Summary</h5>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatCourseSummary(course.learning_path_summary?.course_summary),
                    }}
                  />

                  <h5 className="text-secondary mt-4">📚 Recommended Links</h5>
                  <ul>
                    {course.learning_path_summary?.recommended_study_links.map((link, idx) => (
                      <li key={idx}>
                        <a href={link} target="_blank" rel="noopener noreferrer">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>

                  <h5 className="text-secondary mt-4">🚀 Next Steps</h5>
                  <ul>
                    {currentChapter.practical_applications.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </MainLayout>
  );
}

const formatStudyNotes = (notes) => {
  if (!notes) return "";
  return notes
    .split(/\n{2,}/)
    .map((p) => `<p>${p.trim()}</p>`)
    .join("")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/<p>- (.*?)<\/p>/g, "<ul><li>$1</li></ul>")
    .replace(/<\/ul><ul>/g, "")
    .replace(/<p>\d+\. (.*?)<\/p>/g, "<ol><li>$1</li></ol>")
    .replace(/<\/ol><ol>/g, "");
};

const formatCourseSummary = (text) => {
  if (!text) return "";
  return text
    .split(/\n{2,}/)
    .map((para) => `<p>${para.trim()}</p>`)
    .join("")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/- (.*?)(?=\n|$)/g, "<li>$1</li>")
    .replace(/<li>/g, "<ul><li>")
    .replace(/<\/li>(?!<li>)/g, "</li></ul>");
};
