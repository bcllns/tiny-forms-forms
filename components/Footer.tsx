interface FooterProps {
  branding?: boolean;
}
export default function Footer({ branding = true }: FooterProps) {
  return (
    <footer className="bg-gray-100 py-6 mt-12">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500">
        {branding && (
          <>
            <p>
              &copy;{new Date().getFullYear()}
              <a href="https://tinyforms.co" target="_blank" rel="noopener noreferrer" className="text-black hover:underline font-sans ml-1">
                Tiny Forms
              </a>
            </p>
            <p className="mt-1">
              <a href="https://tinydev.co" target="_blank" rel="noopener noreferrer" className="text-black hover:underline inline-flex items-center gap-1 justify-center font-sans">
                <span className="font-mono text-primary">&gt;_</span> Tiny Dev Co.
              </a>
            </p>
          </>
        )}
      </div>
    </footer>
  );
}
