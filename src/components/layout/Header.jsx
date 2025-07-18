import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">IndussPress</h1>
          </div>
          <nav className="hidden md:flex items-center justify-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 text-sm font-medium">Home</Link>
            <Link to="/login" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm">Login</Link>
          </nav>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-700 p-2 rounded-md">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-2">
            <Link to="/" onClick={toggleMenu} className="block text-gray-700 px-3 py-2 text-base">Home</Link>
            <Link to="/login" onClick={toggleMenu} className="block bg-blue-600 text-white px-3 py-2 rounded-md">Login</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;