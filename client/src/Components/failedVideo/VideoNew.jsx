import { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

function VideoNew() {
  const webcamRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [uploadUrl, setUploadUrl] = useState('');

  const handleStartRecording = () => {
    setRecording(true);
    webcamRef.current.getScreenshot();
  };

  const handleStopRecording = async () => {
    setRecording(false);
    const recordedBlob = await webcamRef.current.stopAndCleanup();
    const videoBlob = new Blob(recordedBlob, { type: "video/webm" });
    setRecordedChunks(videoBlob);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", recordedChunks, "recordedVideo.mp4");
    console.log(formData);
    try {
      const response = await axios.post(
        "https://root-grizzled-philodendron.glitch.me/upload",
        formData
      );
      setUploadUrl(response.data.url)
      console.log("Video uploaded!", response.data);
    } catch (error) {
      console.error("Failed to upload video:", error);
    }
  };

  return (
    <div>
      <Webcam audio={true} ref={webcamRef} mirrored={true} />
      {recording ? (
        <button onClick={handleStopRecording}>Stop Recording</button>
      ) : (
        <button onClick={handleStartRecording}>Start Recording</button>
      )}
      <button onClick={handleUpload}>Upload Recording</button>
      <p className="cursor-pointer">{uploadUrl}</p>
    </div>
  );
}

export default VideoNew;
