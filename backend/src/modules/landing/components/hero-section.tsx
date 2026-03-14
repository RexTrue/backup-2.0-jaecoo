import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "calc(100vh - 200px)",
        backgroundImage: 'url("/assets/landing-hero.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(255,255,255,0.75)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1360px",
          margin: "0 auto",
          minHeight: "calc(100vh - 200px)",
          padding: "40px 36px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            alignItems: "center",
            columnGap: "40px",
          }}
        >
          {/* logo */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="/assets/logo-jaecoo-black-large.png"
              alt="JAECOO"
              style={{
                width: "100%",
                maxWidth: "600px",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </div>

          {/* text */}
          <div>
            <h1
              style={{
                margin: 0,
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "64px",
                lineHeight: 1.1,
                fontWeight: 700,
                color: "#000",
              }}
            >
              Service
              <br />
              Management
              <br />
              System
            </h1>
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: "50px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Link
            to="/login"
            style={{
              width: "220px",
              height: "58px",
              borderRadius: "14px",
              border: "2px solid #5d82e8",
              backgroundColor: "#5d82e8",
              color: "#fff",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "22px",
              fontWeight: 700,
            }}
          >
            Masuk
          </Link>
        </div>
      </div>
    </section>
  );
}