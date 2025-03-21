import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import NavbarComponent from "../components/NavbarComponent";
import Sidebar from "../components/Sidebar";
import "../styles/Home.css";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Technical & Programming");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [chapters, setChapters] = useState(3);
  const [toneOutputStyle, setToneOutputStyle] = useState("Educational");

  const navigate = useNavigate();

  const handleSearch = () => {
    if (!topic.trim()) {
      alert("Please enter a topic.");
      return;
    }

    const query = new URLSearchParams({
      topic,
      description,
      category,
      difficulty,
      chapters,
      tone_output_style: toneOutputStyle,
    }).toString();

    navigate(`/course?${query}`);
  };

  return (
    <div className="app-container">
      <NavbarComponent />
      <div className="main-content">
        <Sidebar />
        <div className="form-container">
          <Card className="form-card">
            <Card.Body>
              <h2 className="form-title">📚 LearnHub - AI-Powered Video Courses</h2>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter a topic..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
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

                <Button variant="primary" className="generate-btn" onClick={handleSearch}>
                  Generate Course
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
