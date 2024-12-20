import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-8">
        Welcome to the Student Accreditation App
      </h1>
      <p className="text-lg mb-4">Navigate to a section below:</p>
      <div className="flex space-x-4">
        <Link href="/students" className="btn btn-primary">
          Students
        </Link>
        <Link href="/accreditations" className="btn btn-secondary">
          Accreditations
        </Link>
      </div>
    </div>
  );
}
