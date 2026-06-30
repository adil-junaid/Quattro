import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MusicPlayer from "./components/MusicPlayer";

import Songs from "./pages/Songs";
import Upload from "./pages/Upload";
import Playlists from "./pages/Playlists";
import CreatePlaylists from "./pages/CreatePlaylists";

import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />

      <div className="main-container">
        <Sidebar />

        <div className="content">
          <Routes>
            <Route path="/" element={<Songs />} />
            <Route path="/songs" element={<Songs />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route
              path="/create-playlist"
              element={<CreatePlaylists />}
            />
          </Routes>
        </div>
      </div>

      <MusicPlayer />
    </div>
  );
}

export default App;