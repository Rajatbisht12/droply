"use client";

import { useClerk, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { CloudUpload, ChevronDown, User, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import "./Navbar.css";

interface SerializedUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  username?: string | null;
  emailAddress?: string | null;
}

interface NavbarProps {
  user?: SerializedUser | null;
}

export default function Navbar({ user }: NavbarProps) {
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if we're on the dashboard page
  const isOnDashboard =
    pathname === "/dashboard" || pathname?.startsWith("/dashboard/");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Handle clicks outside the mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        // Check if the click is not on the menu button (which has its own handler)
        const target = event.target as HTMLElement;
        if (!target.closest('[data-menu-button="true"]')) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Handle clicks outside the dropdown menu
  useEffect(() => {
    const handleDropdownOutside = (event: MouseEvent) => {
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDropdownOutside);
    return () => {
      document.removeEventListener("mousedown", handleDropdownOutside);
    };
  }, [isDropdownOpen]);

  const handleSignOut = () => {
    signOut(() => {
      router.push("/");
    });
  };

  // Process user data with defaults if not provided
  const userDetails = {
    fullName: user
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : "",
    initials: user
      ? `${user.firstName || ""} ${user.lastName || ""}`
          .trim()
          .split(" ")
          .map((name) => name?.[0] || "")
          .join("")
          .toUpperCase() || "U"
      : "U",
    displayName: user
      ? user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || user.username || user.emailAddress || "User"
      : "User",
    email: user?.emailAddress || "",
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link href="/" className="logo-link">
          <CloudUpload className="logo-icon" />
          <h1 className="logo-text">Droply</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-nav">
          {/* Show these buttons when user is signed out */}
          <SignedOut>
            <Link href="/sign-in" className="btn btn-primary-flat">
              Sign In
            </Link>
            <Link href="/sign-up" className="btn btn-primary-solid">
              Sign Up
            </Link>
          </SignedOut>

          {/* Show these when user is signed in */}
          <SignedIn>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {!isOnDashboard && (
                <Link href="/dashboard" className="btn btn-primary-flat">
                  Dashboard
                </Link>
              )}
              <div className={`dropdown ${isDropdownOpen ? "open" : ""}`} ref={dropdownRef}>
                <button
                  className="dropdown-trigger"
                  onClick={toggleDropdown}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="avatar">
                      {user?.imageUrl ? (
                        <img src={user.imageUrl} alt={userDetails.displayName} />
                      ) : (
                        userDetails.initials
                      )}
                    </div>
                    <span className="user-name-desktop">{userDetails.displayName}</span>
                  </div>
                  <ChevronDown className="chevron-icon" />
                </button>
                <div className="dropdown-menu" aria-label="User actions">
                  <div 
                    className="dropdown-item"
                    onClick={() => {
                      router.push("/dashboard?tab=profile");
                      setIsDropdownOpen(false);
                    }}
                  >
                    <div className="dropdown-item-title">Profile</div>
                    <div className="dropdown-item-description">{userDetails.email || "View your profile"}</div>
                  </div>
                  <div 
                    className="dropdown-item"
                    onClick={() => {
                      router.push("/dashboard");
                      setIsDropdownOpen(false);
                    }}
                  >
                    <div className="dropdown-item-title">My Files</div>
                    <div className="dropdown-item-description">Manage your files</div>
                  </div>
                  <div 
                    className="dropdown-item danger"
                    onClick={() => {
                      handleSignOut();
                      setIsDropdownOpen(false);
                    }}
                  >
                    <div className="dropdown-item-title">Sign Out</div>
                    <div className="dropdown-item-description">Sign out of your account</div>
                  </div>
                </div>
              </div>
            </div>
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <div className="mobile-menu-container">
          <SignedIn>
            <div className="avatar">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt={userDetails.displayName} />
              ) : (
                userDetails.initials
              )}
            </div>
          </SignedIn>
          <button
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            data-menu-button="true"
          >
            {isMobileMenuOpen ? (
              <X className="mobile-menu-icon" />
            ) : (
              <Menu className="mobile-menu-icon" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`mobile-menu-overlay ${isMobileMenuOpen ? "active" : ""}`} 
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}
        >
          <SignedOut>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <Link
                href="/sign-in"
                className="btn btn-primary-flat"
                style={{ width: '100%' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="btn btn-primary-solid"
                style={{ width: '100%' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="mobile-user-info">
              <div className="avatar avatar-md">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt={userDetails.displayName} />
                ) : (
                  userDetails.initials
                )}
              </div>
              <div>
                <p className="mobile-user-name">{userDetails.displayName}</p>
                <p className="mobile-user-email">{userDetails.email}</p>
              </div>
            </div>

            {/* Navigation links */}
            <div className="mobile-nav-list">
              {!isOnDashboard && (
                <Link
                  href="/dashboard"
                  className="mobile-nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <Link
                href="/dashboard?tab=profile"
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                className="mobile-nav-button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleSignOut();
                }}
              >
                Sign Out
              </button>
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}