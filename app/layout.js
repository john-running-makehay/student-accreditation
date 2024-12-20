import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        {/* Navigation */}
        <nav className="navbar bg-neutral text-neutral-content p-4">
          <div className="container mx-auto flex justify-between">
            <a href="/" className="text-xl font-bold hover:underline">
              Accreditation App
            </a>
            <div className="space-x-4">
              <a href="/students" className="btn btn-ghost normal-case text-lg">
                Students
              </a>
              <a
                href="/accreditations"
                className="btn btn-ghost normal-case text-lg"
              >
                Accreditations
              </a>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
