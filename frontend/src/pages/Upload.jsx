import { useState } from "react";
import api from "../services/api";

function Upload() {
  const [form, setForm] = useState({
    title: "",
    artist: "",
    album: "",
    uploadedBy: ""
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please choose an audio file.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("audioFile", file);

      // Upload file
      const uploadRes = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      const fileId = uploadRes.data.fileId;

      // Save song metadata
      await api.post("/songs", {
        ...form,
        fileId
      });

      setMessage("✅ Song uploaded successfully!");

      setForm({
        title: "",
        artist: "",
        album: "",
        uploadedBy: ""
      });

      setFile(null);

    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">

      <h1>Upload Songs</h1>

      <form className="upload-form" onSubmit={handleUpload}>

        <input
          name="title"
          placeholder="Song Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          name="artist"
          placeholder="Artist"
          value={form.artist}
          onChange={handleChange}
          required
        />

        <input
          name="album"
          placeholder="Album"
          value={form.album}
          onChange={handleChange}
        />

        <input
          name="uploadedBy"
          placeholder="Uploaded By"
          value={form.uploadedBy}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          accept=".mp3,.wav,.flac"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button disabled={loading}>
          {loading ? "Uploading..." : "Upload Songs"}
        </button>

      </form>

      {message && <p>{message}</p>}

    </div>
  );
}

export default Upload;