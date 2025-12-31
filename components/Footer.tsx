import { Terminal } from "lucide-react";
export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 mt-12">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Form Monkey</p>
        <p className="mt-1">
          <a
            href="https://tinydev.co"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1 justify-center"
          >
            <Terminal className="w-4 h-4" />Tiny Dev Co.
          </a>
        </p>
      </div>
    </footer>
  );
}
