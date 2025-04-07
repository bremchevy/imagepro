import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white/50 backdrop-blur-sm">
      <div className="container px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {/* Company Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Logo"
                width={24}
                height={24}
                className="rounded-sm"
              />
              <span className="text-sm sm:text-base font-semibold text-gray-900">ImagePro</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 max-w-[200px] sm:max-w-none leading-relaxed">
              Professional AI image processing tools for designers and creators.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tools" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Tools
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <p className="text-xs sm:text-sm text-gray-500">
              © {new Date().getFullYear()} ImagePro. All rights reserved.
            </p>
            <div className="flex items-center gap-4 sm:gap-6">
              <Link href="https://twitter.com" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Twitter
              </Link>
              <Link href="https://github.com" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors">
                GitHub
              </Link>
              <Link href="https://linkedin.com" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 