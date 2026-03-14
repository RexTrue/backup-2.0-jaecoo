import Footer from "../../landing/components/footer";
import LoginForm from "../components/login-form";

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-page__hero">
        <div className="login-page__pattern" />

        <div className="login-page__card fade-card">
          <img
            src="/assets/logo-jaecoo-white.png"
            alt="JAECOO"
            className="login-page__logo"
          />

          <p className="login-page__subtitle">
            <strong>Yogyakarta</strong> | Service Management System
          </p>

          <LoginForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
