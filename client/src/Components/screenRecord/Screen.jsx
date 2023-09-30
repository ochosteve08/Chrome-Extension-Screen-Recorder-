/* eslint-disable react/no-unescaped-entities */
import { useReactMediaRecorder } from "react-media-recorder";
import { css, keyframes } from "@emotion/css";
import { useState } from "react";

const wrapperStyle = css({
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
});

const bannerStyle = css({
  justifyContent: "space-between",
  alignItems: "center",
  display: "flex",
  padding: 10,
  background: "red",
});

const bannerTextAnimation = keyframes({
  "from, 0%, 60%, to": {
    opacity: 1,
  },
  "40%": {
    opacity: 0.75,
  },
});

const bannerText = css({
  animation: `${bannerTextAnimation} 1.5s ease-in-out infinite`,
  color: "white",
  fontWeight: 500,
});

const contentStyle = css({
  paddingLeft: 8,
  paddingRight: 8,
});

const codeStyle = css({
  background: "#eee",
  padding: 3,
  borderRadius: 2,
  fontSize: "0.85em",
  fontFamily:
    "SFMono-Medium, SF Mono, Segoe UI Mono, Roboto Mono, Ubuntu Mono, Menlo, Consolas, Courier New, monospace",
});

const buttonStyle = css({
  marginBottom: 5,
  "& + &": {
    marginLeft: 5,
    color: "red",
  },
});

const videoStyle = css({
  width: "100%",
  maxWidth: 800,
});

const Screen = () => {
  const [uploaded, setUploaded] = useState(false);
  const [uploadURL, setUploadURL] = useState("");
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ screen: true, video: true });

  const src = mediaBlobUrl || undefined;
  console.log(mediaBlobUrl);

  const recording = status === "recording";
  const stopped = status === "stopped";

  const upload = async () => {
    setUploaded(true);
    if (mediaBlobUrl) {
      const fileName = [...mediaBlobUrl.split("/")].reverse()[0];
      const videoBlob = await fetch(mediaBlobUrl).then((r) => r.blob());
      const formData = new FormData();
      console.log(fileName, videoBlob);
      formData.append("video", videoBlob, `${fileName}.mp4`);
      console.log(formData);

      fetch("https://mediaupload-uk0g.onrender.com/video/upload", {
        method: "POST",
        mode: "cors",
        body: formData,
      })
        .then((res) => res.json())
        .then((r) => {
          //  console.log(r);
          setUploadURL(r.url);
        })
        .catch((e) => console.error(e));
    }
  };

  return (
    <div className={wrapperStyle}>
      {recording && (
        <div className={bannerStyle}>
          <div className={bannerText}>RECORDING IN PROGRESS</div>
          <button onClick={stopRecording}>Stop</button>
        </div>
      )}
      <div className={contentStyle}>
        <h1>Recording screen</h1>
        <p>
          This is an example usage of
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.npmjs.com/package/react-media-recorder"
          >
            <code className={codeStyle}>react-media-recorder</code>
          </a>
          .
        </p>
        <ol>
          <li>
            Click to start recording below, then record your screen and audio
            briefly.
          </li>
          <li>
            When you are done, click "Stop" to preview and optionally upload the
            result.
          </li>
        </ol>

        <div>
          <button
            className={buttonStyle}
            disabled={recording}
            onClick={startRecording}
          >
            Start recording
          </button>
          <button
            className={buttonStyle}
            disabled={!recording}
            onClick={stopRecording}
          >
            Stop
          </button>
        </div>
        {recording && <div>recording in progress...</div>}
        {stopped && (
          <>
            <h2>Preview</h2>
            <video className={videoStyle} src={src} controls />
            <p>
              {uploadURL ? (
                <>
                  Uploaded to
                  <a target="_blank" rel="noreferrer" href={uploadURL}>
                    {uploadURL}
                  </a>
                </>
              ) : (
                <button
                  className={buttonStyle}
                  disabled={uploaded}
                  onClick={() => upload()}
                >
                  {uploaded ? "uploading..." : "upload"}
                </button>
              )}
            </p>
            <button
              onClick={() => {
                setUploadURL("");
                setUploadURL(false);
              }}
            >
              clear url
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Screen;
