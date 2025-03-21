import React from "react";
import { Carousel } from "react-bootstrap";

export default function VideoCarousel({ videos }) {
  if (videos.length === 0) return <p>No videos available</p>;

  return (
    <Carousel>
      {videos.map((video, index) => (
        <Carousel.Item key={index}>
          <img src={video.thumbnail} alt={video.video_title} className="d-block w-100" />
          <Carousel.Caption>
            <h5>{video.video_title}</h5>
            <a href={video.video_link} target="_blank" rel="noopener noreferrer">Watch on YouTube</a>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
