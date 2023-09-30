import axios from "axios";
import { useReactMediaRecorder } from "react-media-recorder";
import { css } from "@emotion/css";
import { useState, useRef } from "react";

const WebcamView = () => {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ video: true });
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const [uploadedUrl, setUploadURL] = useState('')

  const start = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
      }
     
      setStream(userStream);
      startRecording();
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const stop = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop()); // Stop all tracks to release the webcam
      setStream(null);
    }
     if (videoRef.current) {
       videoRef.current.srcObject = null; // Explicitly remove the stream from the video
     }
    stopRecording();
  };
  const videoStyle = css({
    width: "100%",
    maxWidth: 800,
  });
    const src =  mediaBlobUrl;


  const uploadRecording = async () => {
    if (!mediaBlobUrl) return;

    try {
      const fileName = [...mediaBlobUrl.split("/")].reverse()[0];
      const response = await fetch(mediaBlobUrl);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("file", blob, `${fileName}.mp4`);

      const uploadResponse = await axios.post(
        "https://root-grizzled-philodendron.glitch.me/upload",
        formData
      );
      setUploadURL(uploadResponse.data.url);
      console.log("Video uploaded!", uploadResponse.data);
    } catch (error) {
      console.error("Failed to upload video:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <p>{status}</p>

      <video
        className={videoStyle}
        ref={videoRef}
        controls
        autoPlay
        src={src}
        playsInline
      />
      <div className="flex justify-between space-x-6 m-4">
        <button className="bg-green-500 p-2 rounded-md" onClick={start}>
          Start
        </button>
        <button className="bg-red-500 p-2 rounded-md" onClick={stop}>
          Stop{" "}
        </button>
        <button
          className="bg-yellow-500 p-2 rounded-md"
          onClick={uploadRecording}
        >
          Upload
        </button>

        <p>{uploadedUrl}</p>
      </div>
    </div>
  );
};

export default WebcamView;
