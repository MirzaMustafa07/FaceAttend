
import React from 'react';
import type { View } from '../App';
import { UsersIcon, PlusIcon, CameraIcon, DocumentReportIcon } from './icons';

interface HomePageProps {
  setView: (view: View) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setView }) => {
  return (
    <div className="p-4 md:p-6 min-h-screen flex flex-col bg-slate-900">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-400">Attendance System</h1>
        <p className="text-slate-400 mt-2">Offline Face Recognition Attendance Management</p>
      </header>
      
      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <HomeButton
          title="Create New Class"
          description="Set up a new class and add students"
          icon={<PlusIcon className="w-8 h-8" />}
          onClick={() => setView({ name: 'createClass' })}
        />
        <HomeButton
          title="Existing Classes"
          description="View, edit, or delete existing classes"
          icon={<UsersIcon className="w-8 h-8" />}
          onClick={() => setView({ name: 'classList' })}
        />
        <HomeButton
          title="Scan Class"
          description="Take attendance using face recognition"
          icon={<CameraIcon className="w-8 h-8" />}
          onClick={() => setView({ name: 'scanClassList' })}
        />
        <HomeButton
          title="View Reports"
          description="Check generated attendance reports"
          icon={<DocumentReportIcon className="w-8 h-8" />}
          onClick={() => setView({ name: 'reportList' })}
        />
      </main>
      <footer className="text-center text-slate-500 mt-8 text-sm">
        <p>&copy; {new Date().getFullYear()} All data is stored on your device.</p>
      </footer>
    </div>
  );
};


interface HomeButtonProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
}

const HomeButton: React.FC<HomeButtonProps> = ({ title, description, icon, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="bg-slate-800 p-6 rounded-lg text-left flex items-center space-x-6 hover:bg-slate-700/50 hover:ring-2 hover:ring-cyan-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
            <div className="text-cyan-400">{icon}</div>
            <div>
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                <p className="text-slate-400 text-sm mt-1">{description}</p>
            </div>
        </button>
    )
}


export default HomePage;
