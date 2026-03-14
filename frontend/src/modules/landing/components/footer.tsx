export default function Footer() {
  return (
    <footer className="landing-footer">
      <div className="landing-footer__inner">
        <div className="landing-footer__text-wrap">
          <p className="landing-footer__text">
            JAECOO Service Management System adalah prototipe sistem manajemen
            internal yang sedang dikerjakan oleh mahasiswa magang Program Studi
            Informatika UPN “Veteran” Yogyakarta pada bulan Maret tahun 2026.
            <br />
            Sistem ini masih dalam tahap pengembangan, EXPECT BUG.
          </p>
        </div>

        <div className="landing-footer__logo-wrap">
          <img
            src="/assets/logo-jaecoo-white.png"
            alt="JAECOO"
            className="landing-footer__logo"
          />
        </div>

        <div className="landing-footer__socials">
          <a href="#" className="landing-footer__social">
            ○
          </a>
          <a href="#" className="landing-footer__social">
            f
          </a>
          <a href="#" className="landing-footer__social">
            ♪
          </a>
        </div>
      </div>
    </footer>
  );
}