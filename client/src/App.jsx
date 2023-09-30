import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

import Screen from "./Components/screenRecord/Screen";
import VideoRecorder from "./Components/failedVideo/VideoRecorder";
import VideoNew from "./Components/failedVideo/VideoNew";
import WebcamView from "./Components/web/WebcamView";
import FileUpload from "./pages/FileUpload";

function App() {
  return (
    <Routes>
      <Route index path="/" element={<Home />} />
      <Route path="/profile" element={<FileUpload />} />
      <Route path="/video" element={<WebcamView />} />
      <Route path="/screen" element={<Screen />} />
      <Route path="/record" element={<VideoRecorder />} />
      <Route path="/new" element={<VideoNew />} />
    </Routes>
  );
}

export default App;
