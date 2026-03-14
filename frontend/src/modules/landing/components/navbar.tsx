import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="landing-navbar">
      <div className="landing-navbar__inner">
        <div className="landing-navbar__brand">
          <img
            src="/assets/logo-jaecoo-black.png"
            alt="JAECOO"
            className="landing-navbar__logo"
          />
          <span className="landing-navbar__city">| Yogyakarta</span>
        </div>

        <div className="landing-navbar__actions">
          <Link to="/login" className="landing-navbar__button">
            Masuk
          </Link>
        </div>
      </div>
    </header>
  );
}