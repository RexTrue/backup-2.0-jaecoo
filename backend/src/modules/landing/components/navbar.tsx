import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        backgroundColor: "rgba(245, 245, 245, 0.92)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        padding: "28px 36px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1360px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <img
            src="/assets/logo-jaecoo-black.png"
            alt="JAECOO"
            style={{
              height: "30px",
              width: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
          <span
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "22px",
              color: "#111111",
              fontWeight: 400,
            }}
          >
            | Yogyakarta
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: "14px",
            alignItems: "center",
          }}
        >

          <Link
            to="/login"
            style={{
              width: "145px",
              height: "42px",
              borderRadius: "12px",
              border: "2px solid #5d82e8",
              backgroundColor: "#5d82e8",
              color: "#ffffff",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            Masuk
          </Link>
        </div>
      </div>
    </header>
  );
}