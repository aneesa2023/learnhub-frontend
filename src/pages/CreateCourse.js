import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import MainLayout from "../components/MainLayout";

export default function CreateCourse() {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Technical & Programming");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [chapters, setChapters] = useState(1); // ✅ Default is 1
  const [toneOutputStyle, setToneOutputStyle] = useState("Educational");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const navigate = useNavigate();

  const inputStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#fff",
    padding: "12px",
    fontSize: "15px"
  };

  const handleGenerateCourse = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic.");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/generate-learning-path/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          description,
          category,
          difficulty,
          chapters,
          tone_output_style: toneOutputStyle,
        }),
      });
  
      if (!response.ok) throw new Error("Failed to generate course");
  
      const course = await response.json();
  
      const uploadRes = await fetch("http://127.0.0.1:8000/upload-course-to-s3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_data: course,
          filename: course.course_title.replace(/\s+/g, "_") + "_" + Date.now(),
        }),
      });
  
      if (!uploadRes.ok) throw new Error("Failed to upload course to S3");
  
      const { course_id } = await uploadRes.json();
  
      // 🔥 Immediate navigation to Course Detail
      navigate(`/course/${course_id}`);
    } catch (err) {
      console.error("❌ Error:", err);
      setToastMsg("❌ Something went wrong. Please try again.");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <MainLayout>
      <Container className="py-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-purple">Create Your Learning Path</h2>
          <p className="text-muted">
            Fill in the details below to generate a personalized learning curriculum tailored to your needs.
          </p>
        </div>

        <Card className="mx-auto shadow-sm" style={{ maxWidth: "700px", borderRadius: "16px" }}>
          <Card.Body className="p-4">
            <Form>
              <fieldset disabled={loading}>
                <Form.Group className="mb-4">
                  <Form.Label><strong>📖 Topic</strong></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Machine Learning, Web Development"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    style={inputStyle}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label><strong>📝 Description</strong></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Provide a brief description of what you want to learn..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={inputStyle}
                  />
                </Form.Group>

                <Row className="mb-4">
                  <Col>
                    <Form.Group>
                      <Form.Label><strong>🏷️ Category</strong></Form.Label>
                      <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={inputStyle}
                      >
                        <option>Technical & Programming</option>
                        <option>Mathematics and Algorithms</option>
                        <option>Science & Engineering</option>
                        <option>History & Social Studies</option>
                        <option>Creative Writing & Literature</option>
                        <option>Business & Finance</option>
                        <option>Health & Medicine</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label><strong>⚙️ Difficulty Level</strong></Form.Label>
                      <Form.Select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        style={inputStyle}
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col>
                    <Form.Group>
                      <Form.Label><strong>💬 Tone/Style</strong></Form.Label>
                      <Form.Select
                        value={toneOutputStyle}
                        onChange={(e) => setToneOutputStyle(e.target.value)}
                        style={inputStyle}
                      >
                        <option>Educational</option>
                        <option>Conversational</option>
                        <option>Formal</option>
                        <option>Storytelling</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label><strong>📚 Number of Chapters: {chapters}</strong></Form.Label>
                      <Form.Range
                        min={1}
                        max={10}
                        value={chapters}
                        onChange={(e) => setChapters(parseInt(e.target.value))}
                      />
                      <div className="d-flex justify-content-between text-muted" style={{ fontSize: "0.85rem" }}>
                        <span>1</span>
                        <span>10</span>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </fieldset>

              <div className="d-grid mt-4">
                <Button
                  onClick={handleGenerateCourse}
                  disabled={loading}
                  style={{
                    backgroundColor: 'rgba(122, 44, 191, 0.7) ',
                    border: "none",
                    borderRadius: "10px",
                    padding: "12px 20px",
                    fontWeight: "600"
                  }}
                >
                  {loading ? "Generating..." : "Generate Learning Path"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        <ToastContainer className="p-3" position="bottom-end">
          <Toast show={showToast} onClose={() => setShowToast(false)} delay={3500} autohide bg="light">
            <Toast.Body className="text-dark">{toastMsg}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </MainLayout>
  );
}
