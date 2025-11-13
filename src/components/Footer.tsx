const Footer = () => {
  const footerText = localStorage.getItem("library_footer_text") || "Powered by INLISLite Perpusnas";
  
  return (
    <footer className="bg-muted/30 border-t border-border mt-auto py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground">{footerText}</p>
      </div>
    </footer>
  );
};

export default Footer;
