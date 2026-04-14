'use client'

import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{ background: '#060e33' }} className="border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            {/* Logos */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image src="/images/UMak_Logo__White_R_1.png" alt="UMak Logo" fill className="object-contain" />
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image src="/images/cic_logo.png" alt="CIC Logo" fill className="object-contain" />
              </div>
            </div>
            <p className="text-sm text-white/50 font-metropolis leading-relaxed">
              The Center for Integrated Communications is the University of Makati's primary media and publications arm.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              {/* Facebook */}
              <a
                href="https://umak.edu.ph"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-umak-yellow hover:bg-white/20 transition-all"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              {/* Twitter/X */}
              <a
                href="https://umak.edu.ph"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-umak-yellow hover:bg-white/20 transition-all"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://umak.edu.ph"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-umak-yellow hover:bg-white/20 transition-all"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </a>
            </div>
            <p className="text-xs text-white/30 font-metropolis mt-6">
              University of Makati {currentYear}
            </p>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-xs font-bold font-metropolis text-umak-yellow uppercase tracking-widest mb-4">
              Contact
            </h4>
            <div className="space-y-2 text-sm font-metropolis text-white/50">
              <p>Center for Integrated Communications</p>
              <p>University of Makati</p>
              <p>J.P. Rizal Extension, West Rembo</p>
              <p>Makati City, Metro Manila</p>
              <p className="pt-2">
                <a href="mailto:cic@umak.edu.ph" className="hover:text-umak-yellow transition-colors">
                  cic@umak.edu.ph
                </a>
              </p>
              <p>
                <a href="mailto:info@umak.edu.ph" className="hover:text-umak-yellow transition-colors">
                  info@umak.edu.ph
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-xs font-bold font-metropolis text-umak-yellow uppercase tracking-widest mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm font-metropolis">
              {[
                { label: 'Our Services', href: '#services' },
                { label: 'About CIC', href: '#about' },
                { label: 'Submit Request', href: '#request' },
                { label: 'Guidelines', href: '#guidelines' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-white/50 hover:text-umak-yellow transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-xs font-bold font-metropolis text-umak-yellow uppercase tracking-widest mb-4">
              Resources
            </h4>
            <ul className="space-y-2 text-sm font-metropolis">
              {[
                { label: 'UMak Brand Kit', href: 'https://bit.ly/UMakBrandKit', external: true },
                { label: 'Dashboard', href: '/dashboard', external: false },
                { label: 'UMak Website', href: 'https://umak.edu.ph', external: true },
                { label: 'Our Services', href: '#services', external: false },
              ].map(({ label, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="text-white/50 hover:text-umak-yellow transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/30 font-metropolis text-center md:text-left">
              All rights reserved 1972 – {currentYear} by University of Makati. Created by Center for Integrated Communications.
            </p>
            <div className="flex gap-6 text-xs font-metropolis">
              {[
                { label: 'UMak Website', href: 'https://umak.edu.ph', external: true },
                { label: 'Makati City', href: 'https://makati.gov.ph', external: true },
                { label: 'Privacy Policy', href: '#privacy', external: false },
              ].map(({ label, href, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="text-white/30 hover:text-umak-yellow transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
