import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import MainLayout from '../components/MainLayout';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/list-courses/");
        const data = await res.json();

        if (Array.isArray(data.courses)) {
          setCourses(data.courses);

          // ✅ Redirect to course detail if `openCourseId` is passed from Home
          if (location.state?.openCourseId) {
            navigate(`/course/${location.state.openCourseId}`);
          }
        } else {
          console.error("Expected array but got:", data);
          setCourses([]);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCourses([]);
      }
    };

    fetchCourses();
  }, [location.state, navigate]);

  useEffect(() => {
    if (location.state?.openCourseId) {
      navigate(`/course/${location.state.openCourseId}`);
    }
  }, [location, navigate]);

  return (
    <MainLayout>
        <div style={{ padding: "20px" }}>
      <h2>📘 All Saved Courses</h2>
      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <ul>
          {courses.map((courseId) => (
            <li key={courseId}>
              <Link to={`/course/${encodeURIComponent(courseId)}`}>
                {decodeURIComponent(courseId).replace(/_/g, " ")}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
    </MainLayout>
  
  );
}

export default CourseList;
