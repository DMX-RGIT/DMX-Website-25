import Link from "next/link";
import { MapPin, Mail } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { DMXLogo } from "./DMXLogo";

const quickLinks = [
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/projects", label: "Projects" },
  { href: "/team", label: "Team" },
  { href: "/gallery", label: "Gallery" },
];

const socialLinks = [
  { href: "https://github.com/dmx-rgit", icon: FaGithub, label: "GitHub" },
  { href: "https://linkedin.com/company/dmx-rgit", icon: FaLinkedin, label: "LinkedIn" },
  { href: "https://instagram.com/dmx.rgit", icon: FaInstagram, label: "Instagram" },
  { href: "https://twitter.com/dmx_rgit", icon: FaXTwitter, label: "Twitter" },
];

export function Footer() {
  return (
    <footer className="border-t border-border-subtle">
      {/* Two-tone X divider */}
      <div className="x-divider" style={{ padding: "0" }}>
        <div className="line-navy" />
        <div className="line-teal" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 items-start">
          {/* About */}
          <div className="space-y-6 lg:col-span-2">
            <DMXLogo className="h-16 w-auto" animated={true} />
            <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
              RGIT Mumbai&apos;s student-run AI &amp; Machine Learning research
              community. Building the future of intelligent systems, one project
              at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-primary tracking-wide uppercase">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-brand-teal transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-primary tracking-wide uppercase">
              Connect
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-text-secondary hover:text-brand-teal hover:bg-bg-surface transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
            <a
              href="mailto:dmx@rgit.ac.in"
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-brand-teal transition-colors"
            >
              <Mail size={14} />
              dmx@rgit.ac.in
            </a>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-primary tracking-wide uppercase">
              Location
            </h3>
            <div className="flex items-start gap-2 text-sm text-text-secondary">
              <MapPin size={14} className="mt-1 shrink-0" />
              <p>
                MCT&apos;s Rajiv Gandhi Institute of Technology,
                <br />
                Versova, Andheri (W),
                <br />
                Mumbai 400053
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            Made with intent by DMX, RGIT Mumbai
          </p>
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} DataMatrix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
