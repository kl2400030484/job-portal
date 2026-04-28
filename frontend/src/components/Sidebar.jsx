import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  User as UserIcon, 
  Briefcase, 
  FileText, 
  Users, 
  Ticket,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  if (!user) return null;

  const role = user.role;

  const getNavItems = () => {
    const common = [
      { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
      { name: 'Profile', path: '/profile', icon: <UserIcon size={20} /> }
    ];

    switch (role) {
      case 'CANDIDATE':
        return [
          ...common
        ];
      case 'EMPLOYER':
        return [
          ...common,
          { name: 'Applied Candidates', path: '/applied-candidates', icon: <Users size={20} /> },
          { name: 'Posted Jobs', path: '/posted-jobs', icon: <Briefcase size={20} /> },
          { name: 'Hired Candidates', path: '/hired-candidates', icon: <Users size={20} /> }
        ];
      case 'ADMIN':
      case 'SUPPORT':
        return [
          ...common,
          { name: 'Tickets', path: '/tickets', icon: <Ticket size={20} /> }
        ];
      default:
        return common;
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden p-4 bg-white shadow-sm flex items-center justify-between">
        <span className="font-bold text-xl text-blue-600">Menu</span>
        <button onClick={toggleSidebar} className="text-gray-600 hover:text-blue-600">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Content */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col pt-16 md:pt-0"> {/* added padding top for mobile to avoid overlap with menu button if it was fixed, but it's not fixed here */}
          
          <div className="flex-grow overflow-y-auto mt-4 md:mt-8">
            <nav className="px-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}
                  `}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
