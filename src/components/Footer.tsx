import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {currentYear} Gerador de Relatórios. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
