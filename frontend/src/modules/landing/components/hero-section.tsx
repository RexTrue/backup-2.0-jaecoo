import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="landing-hero">
      <div className="landing-hero__overlay" />

      <div className="landing-hero__inner">
        <div className="landing-hero__content">
          <div className="landing-hero__logo-wrap">
            <img
              src="/assets/logo-jaecoo-black-large.png"
              alt="JAECOO"
              className="landing-hero__logo"
            />
          </div>

          <div className="landing-hero__text">
            <h1 className="landing-hero__title">
              Service
              <br />
              Management
              <br />
              System
            </h1>
          </div>
        </div>

        <div className="landing-hero__cta">
          <Link to="/login" className="landing-hero__button">
            Masuk
          </Link>
        </div>
      </div>
    </section>
  );
}