import { Card, Button } from "react-bootstrap";

export default function CourseCard({ video }) {
  return (
    <Card className="video-card">
      <Card.Img variant="top" src={video.thumbnail} />
      <Card.Body>
        <Card.Title>{video.video_title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{video.channel_name}</Card.Subtitle>
        <Button variant="primary" href={video.video_link} target="_blank">Watch on YouTube</Button>
      </Card.Body>
    </Card>
  );
}
