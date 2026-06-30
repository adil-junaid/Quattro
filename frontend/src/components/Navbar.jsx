import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/clerk-react";

const HAS_CLERK = !!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function Navbar() {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="nav-logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                </svg>
                Quattro Shift
            </div>
            <div className="nav-links">
                <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
                    Home
                </Link>
                <Link to="/library" className={`nav-link ${location.pathname === "/library" ? "active" : ""}`}>
                    Library
                </Link>
                {HAS_CLERK ? (
                    <>
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="btn btn-secondary">Sign In</button>
                            </SignInButton>
                        </SignedOut>
                    </>
                ) : (
                    <div style={{
                        padding: "6px 12px",
                        background: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "8px",
                        fontSize: "13px",
                        color: "var(--accent-orange)",
                        border: "1px solid rgba(255, 122, 0, 0.2)",
                        fontWeight: 600
                    }}>
                        Guest Mode
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
