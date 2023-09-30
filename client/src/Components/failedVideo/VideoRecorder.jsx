// src/components/VideoRecorder.js

import  { useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";

function VideoRecorder() {
  const webcamRef = useRef(null);

//   console.log(webcamRef.current.stopAndCleanup());

  const handleRecord = async () => {
    const videoSrc = webcamRef.current.getScreenshot();
    const videoBlob = await fetch(videoSrc).then((res) => res.blob());

    const formData = new FormData();
    formData.append("video", videoBlob, "recordedVideo.webm");
console.log(formData)
    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData
      );
      console.log("Video uploaded!", response.data);
    } catch (error) {
      console.error("Failed to upload video:", error);
    }
  };

  return (
    <div>
      <Webcam audio={false} ref={webcamRef} />
      {/* <button onClick={handleStopRecording}>Stop Recording</button> */}
      <button onClick={handleRecord}>Record & Upload</button>
    </div>
  );
}

export default VideoRecorder;
