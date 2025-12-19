const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t mt-auto bg-primary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="text-sm font-medium">
            <p>© {currentYear} Page Builder. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
