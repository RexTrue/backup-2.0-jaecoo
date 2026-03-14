export default function Footer() {
  return (
    <footer
      style={{
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        zIndex: 1000,
        backgroundColor: "rgba(5, 8, 15, 0.96)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        color: "#ffffff",
        padding: "24px 46px 22px 46px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1360px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1fr",
          alignItems: "center",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              maxWidth: "520px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "18px",
              lineHeight: 1.35,
              color: "#e7e7e7",
            }}
          >
            JAECOO Service Management System adalah prototipe sistem manajemen
            internal yang sedang dikerjakan oleh mahasiswa magang Program Studi
            Informatika UPN “Veteran” Yogyakarta pada bulan Maret tahun 2026.
            <br />
            Sistem ini masih dalam tahap pengembangan, EXPECT BUG.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src="/assets/logo-jaecoo-white.png"
            alt="JAECOO"
            style={{
              width: "200px",
              height: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "26px",
            alignItems: "center",
          }}
        >
          <a
            href="#"
            style={{
              color: "#ffffff",
              fontSize: "34px",
              textDecoration: "none",
              lineHeight: 1,
            }}
          >
            ○
          </a>
          <a
            href="#"
            style={{
              color: "#ffffff",
              fontSize: "34px",
              textDecoration: "none",
              lineHeight: 1,
            }}
          >
            f
          </a>
          <a
            href="#"
            style={{
              color: "#ffffff",
              fontSize: "34px",
              textDecoration: "none",
              lineHeight: 1,
            }}
          >
            ♪
          </a>
        </div>
      </div>
    </footer>
  );
}