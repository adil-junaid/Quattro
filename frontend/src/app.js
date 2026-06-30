import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AudioProvider } from "./context/AudioContext";
import Navbar from "./components/Navbar";
import AudioPlayer from "./components/AudioPlayer";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Playlist from "./pages/Playlist";
import "./App.css";

function App() {
    return (
        <AudioProvider>
            <BrowserRouter>
                <div className="app-container">
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/library" element={<Library />} />
                            <Route path="/playlist/:playlistName" element={<Playlist />} />
                        </Routes>
                    </main>
                    <AudioPlayer />
                </div>
            </BrowserRouter>
        </AudioProvider>
    );
}

export default App;