import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white/50 backdrop-blur-sm">
      <div className="container py-2 sm:py-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {/* Company Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Image
                src="/logo.png"
                alt="Logo"
                width={16}
                height={16}
                className="rounded-sm"
              />
              <span className="text-[8px] sm:text-[10px] font-semibold text-gray-900">ImagePro</span>
            </div>
            <p className="text-[7px] sm:text-[8px] text-gray-500 max-w-[120px] sm:max-w-[140px] leading-tight">
              Professional AI image processing tools for designers and creators.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-0.5">
            <h3 className="text-[8px] sm:text-[10px] font-medium text-gray-900">Quick Links</h3>
            <ul className="space-y-0.5">
              <li>
                <Link href="/tools" className="text-[7px] sm:text-[8px] text-gray-500 hover:text-gray-900 transition-colors">
                  Tools
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-[7px] sm:text-[8px] text-gray-500 hover:text-gray-900 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[7px] sm:text-[8px] text-gray-500 hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-0.5">
            <h3 className="text-[8px] sm:text-[10px] font-medium text-gray-900">Resources</h3>
            <ul className="space-y-0.5">
              <li>
                <Link href="/blog" className="text-[7px] sm:text-[8px] text-gray-500 hover:text-gray-900 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-[7px] sm:text-[8px] text-gray-500 hover:text-gray-900 transition-colors">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[7px] sm:text-[8px] text-gray-500 hover:text-gray-900 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-0.5">
            <h3 className="text-[8px] sm:text-[10px] font-medium text-gray-900">Legal</h3>
            <ul className="space-y-0.5">
              <li>
                <Link href="/privacy" className="text-[7px] sm:text-[8px] text-gray-500 hover:text-gray-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[7px] sm:text-[8px] text-gray-500 hover:text-gray-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-[7px] sm:text-[8px] text-gray-500 hover:text-gray-900 transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-0">
            <p className="text-[7px] sm:text-[8px] text-gray-500">
              © {new Date().getFullYear()} ImagePro. All rights reserved.
            </p>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="https://twitter.com" className="text-[7px] sm:text-[8px] text-gray-500 hover:text-gray-900 transition-colors">
                Twitter
              </Link>
              <Link href="https://github.com" className="text-[7px] sm:text-[8px] text-gray-500 hover:text-gray-900 transition-colors">
                GitHub
              </Link>
              <Link href="https://linkedin.com" className="text-[7px] sm:text-[8px] text-gray-500 hover:text-gray-900 transition-colors">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 