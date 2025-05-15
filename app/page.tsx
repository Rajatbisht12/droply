import { Button } from "@heroui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Card, CardBody } from "@heroui/card";
import {
  CloudUpload,
  Shield,
  Folder,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import "./home.css";

export default function Home() {
  return (
    <div className="app-container">
      {/* Use the unified Navbar component */}
      <Navbar />

      {/* Main content */}
      <main className="main-content">
        {/* Hero section */}
        <section className="hero-section">
          <div className="container">
            <div className="hero-grid">
              <div className="hero-content">
                <div>
                  <h1 className="hero-title">
                    Store your <span className="accent">images</span> with
                    ease
                  </h1>
                  <p className="hero-subtitle">
                    Simple. Secure. Fast.
                  </p>
                </div>

                <div className="button-group">
                  <SignedOut>
                    <Link href="/sign-up">
                      <Button size="lg" variant="solid" color="primary" className="primary-button">
                        Get Started
                      </Button>
                    </Link>
                    <Link href="/sign-in">
                      <Button size="lg" variant="flat" color="primary" className="secondary-button">
                        Sign In
                      </Button>
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <Link href="/dashboard">
                      <Button
                        size="lg"
                        variant="solid"
                        color="primary"
                        endContent={<ArrowRight className="icon-small" />}
                        className="primary-button"
                      >
                        Go to Dashboard
                      </Button>
                    </Link>
                  </SignedIn>
                </div>
              </div>

              <div className="hero-image">
                <div className="image-glow"></div>
                <div className="image-container">
                  <ImageIcon className="hero-icon" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="features-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">What You Get</h2>
            </div>

            <div className="features-grid">
              <Card className="feature-card">
                <CardBody className="card-body">
                  <CloudUpload className="feature-icon" />
                  <h3 className="feature-title">Quick Uploads</h3>
                  <p className="feature-description">Drag, drop, done.</p>
                </CardBody>
              </Card>

              <Card className="feature-card">
                <CardBody className="card-body">
                  <Folder className="feature-icon" />
                  <h3 className="feature-title">Smart Organization</h3>
                  <p className="feature-description">
                    Keep it tidy, find it fast.
                  </p>
                </CardBody>
              </Card>

              <Card className="feature-card">
                <CardBody className="card-body">
                  <Shield className="feature-icon" />
                  <h3 className="feature-title">Locked Down</h3>
                  <p className="feature-description">
                    Your images, your eyes only.
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="cta-section">
          <div className="container">
            <h2 className="section-title">Ready?</h2>
            <SignedOut>
              <div className="cta-buttons">
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    variant="solid"
                    color="primary"
                    endContent={<ArrowRight className="icon-small" />}
                    className="primary-button"
                  >
                    Let's Go
                  </Button>
                </Link>
              </div>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="solid"
                  color="primary"
                  endContent={<ArrowRight className="icon-small" />}
                  className="primary-button"
                >
                  Dashboard
                </Button>
              </Link>
            </SignedIn>
          </div>
        </section>
      </main>

      {/* Simple footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <CloudUpload className="logo-icon" />
              <h2 className="logo-text">Droply</h2>
            </div>
            <p className="copyright">
              &copy; {new Date().getFullYear()} Droply
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}