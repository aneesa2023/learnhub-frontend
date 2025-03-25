// src/pages/Home.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { FaSearch, FaRobot, FaPlayCircle } from "react-icons/fa";
import MainLayout from "../components/MainLayout";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Technical & Programming");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [chapters, setChapters] = useState(3);
  const [toneOutputStyle, setToneOutputStyle] = useState("Educational");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async () => {
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
          tone_output_style: toneOutputStyle
        }),
      });

      if (!response.ok) throw new Error("Failed to generate course");

      const course = await response.json();

      const uploadRes = await fetch("http://127.0.0.1:8000/upload-course-to-s3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
      });

      if (!uploadRes.ok) throw new Error("Failed to upload course to S3");
      const { s3_uri } = await uploadRes.json();
      const course_id = s3_uri.split("/").pop().replace(".json", "");

      navigate("/courses", { state: { openCourseId: course_id } });
      const query = new URLSearchParams({
        topic,
        description,
        category,
        difficulty,
        chapters: chapters.toString(),
        tone_output_style: toneOutputStyle,
      }).toString();
  
      navigate(`/course?${query}`);
  
      // navigate(`/course/${course_id}`);

    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
       {/* 🧠 How It Works Section */}
       <div className="my-5">
        <h3 className="mb-4 text-center">🚀 How LearnHub Works</h3>
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 text-center p-3 shadow-sm">
              <FaSearch size={40} className="mb-3 text-primary" />
              <Card.Body>
                <Card.Title>1. Enter a Topic</Card.Title>
                <Card.Text>
                  Type in a topic you're curious about. Choose the number of chapters, category, tone, and difficulty level.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 text-center p-3 shadow-sm">
              <FaRobot size={40} className="mb-3 text-success" />
              <Card.Body>
                <Card.Title>2. AI Builds the Course</Card.Title>
                <Card.Text>
                  Our AI generates structured chapters, notes, and finds top YouTube videos related to your topic.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 text-center p-3 shadow-sm">
              <FaPlayCircle size={40} className="mb-3 text-danger" />
              <Card.Body>
                <Card.Title>3. Start Learning</Card.Title>
                <Card.Text>
                  Watch curated videos, read detailed study notes, and explore chapter-wise learning paths—all in one place.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      <Card className="form-card">
        <Card.Body>
          <h2 className="form-title">📚 LearnHub - AI-Powered Video Courses</h2>
          <Form>
            <Form.Group className="mb-3">
            <Form.Label>Topic Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a topic..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Short description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option>Technical & Programming</option>
                <option>Mathematics and Algorithms</option>
                <option>Science & Engineering</option>
                <option>History & Social Studies</option>
                <option>Creative Writing & Literature</option>
                <option>Business & Finance</option>
                <option>Health & Medicine</option>
                <option>General</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Difficulty</Form.Label>
              <Form.Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Number of Chapters</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={chapters}
                onChange={(e) => setChapters(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tone/Output Style</Form.Label>
              <Form.Select value={toneOutputStyle} onChange={(e) => setToneOutputStyle(e.target.value)}>
                <option>Educational</option>
                <option>Conversational</option>
                <option>Formal</option>
                <option>Storytelling</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" onClick={handleSearch} disabled={loading}>
              {loading ? "Generating..." : "Generate Course"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </MainLayout>
  );
}
