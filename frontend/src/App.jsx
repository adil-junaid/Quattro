import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MusicPlayer from "./components/MusicPlayer";

import Home from "./pages/Home";
import Songs from "./pages/Songs";
import Upload from "./pages/Upload";
import Playlists from "./pages/Playlists";
import CreatePlaylists from "./pages/CreatePlaylists";
import Profile from "./pages/Profile";

import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />

      <div className="main-container">
        <Sidebar />

        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/songs" element={<Songs />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route
              path="/create-playlist"
              element={<CreatePlaylists />}
            />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>

      <MusicPlayer />
    </div>
  );
}

export default App;