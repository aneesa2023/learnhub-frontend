import React from "react";
import { ListGroup } from "react-bootstrap";

export default function CourseSidebar({ chapters, onSelect }) {
  return (
    <ListGroup>
      {chapters.map((chapter, index) => (
        <ListGroup.Item
          key={index}
          action
          onClick={() => onSelect(index)}
        >
          {`Chapter ${index + 1}: ${chapter.chapter_title}`}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
