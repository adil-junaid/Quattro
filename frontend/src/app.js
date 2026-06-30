import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Library from "./pages/Library";
import Playlist from "./pages/Playlist";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/library" element={<Library />} />
                <Route path="/playlist/:playlistName" element={<Playlist />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;