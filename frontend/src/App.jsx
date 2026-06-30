import { Routes, Route } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useAuth,
} from "@clerk/clerk-react";

import { useEffect } from "react";
import { setAuthToken } from "./services/api";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MusicPlayer from "./components/MusicPlayer";

import Songs from "./pages/Songs";
import Upload from "./pages/Upload";
import Playlists from "./pages/Playlists";
import CreatePlaylists from "./pages/CreatePlaylists";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

import "./App.css";

function AuthSync() {
  const { getToken } = useAuth();

  useEffect(() => {
    const syncToken = async () => {
      const token = await getToken();
      setAuthToken(token);
    };

    syncToken();
  }, [getToken]);

  return null;
}

function ProtectedApp() {
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

function App() {
  return (
    <Routes>
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />

      <Route
        path="/*"
        element={
          <>
            <SignedIn>
              <AuthSync />
              <ProtectedApp />
            </SignedIn>

            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
    </Routes>
  );
}

export default App;