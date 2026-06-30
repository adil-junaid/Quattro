import { FaMusic } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const query = search.trim();

      if (query) {
        navigate(`/songs?search=${encodeURIComponent(query)}`);
      } else {
        navigate("/songs");
      }
    }
  };

  return (
    <nav className="navbar">
      <h2>
        <FaMusic /> Quattro Shift
      </h2>

      <input
        type="text"
        placeholder="Search Songs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearch}
      />
    </nav>
  );
}