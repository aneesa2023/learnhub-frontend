import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import Home from "./pages/Home";
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import Course from "./pages/Course";
import CreateCourse from './pages/CreateCourse';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/course" element={<Course />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/create" element={<CreateCourse />} />

      </Routes>
    </Router>
  );
}

export default App;
