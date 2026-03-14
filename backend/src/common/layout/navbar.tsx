export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 40px",
        background: "#ffffff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
        JAECOO <span style={{ color: "gray" }}>| Yogyakarta</span>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          style={{
            padding: "8px 20px",
            border: "1px solid #2563eb",
            background: "white",
            color: "#2563eb",
            borderRadius: "6px",
          }}
        >
          Masuk
        </button>

        <button
          style={{
            padding: "8px 20px",
            border: "none",
            background: "#2563eb",
            color: "white",
            borderRadius: "6px",
          }}
        >
          Daftar
        </button>
      </div>
    </nav>
  );
}