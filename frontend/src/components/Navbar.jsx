import { FaMusic } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="navbar">

      <h2>
        <FaMusic /> Quattro Shift
      </h2>

      <input
        type="text"
        placeholder="Search Songs..."
      />

    </nav>
  );
}