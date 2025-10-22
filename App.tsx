
import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Class, AttendanceReport } from './types';
import HomePage from './components/HomePage';
import ClassManager from './components/ClassManager';
import AttendanceScanner from './components/AttendanceScanner';
import ReportViewer from './components/ReportViewer';
import { ArrowLeftIcon } from './components/icons';

export type View =
  | { name: 'home' }
  | { name: 'classList' }
  | { name: 'createClass' }
  | { name: 'editClass'; classId: string }
  | { name: 'scanClassList' }
  | { name: 'scanClassSession'; classId: string }
  | { name: 'reportList' };

const App: React.FC = () => {
  const [view, setView] = useState<View>({ name: 'home' });
  const [classes, setClasses] = useLocalStorage<Class[]>('classes', []);
  const [reports, setReports] = useLocalStorage<AttendanceReport[]>('reports', []);

  const saveClass = (classData: Class) => {
    setClasses(prevClasses => {
      const existing = prevClasses.find(c => c.id === classData.id);
      if (existing) {
        return prevClasses.map(c => c.id === classData.id ? classData : c);
      }
      return [...prevClasses, classData];
    });
  };
  
  const deleteClass = (classId: string) => {
    setClasses(prev => prev.filter(c => c.id !== classId));
  };
  
  const saveReport = (report: AttendanceReport) => {
    setReports(prev => [...prev, report]);
  };
  
  const deleteReport = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
  }

  const renderContent = () => {
    switch (view.name) {
      case 'home':
        return <HomePage setView={setView} />;
      case 'classList':
      case 'createClass':
      case 'editClass':
        return <ClassManager view={view} setView={setView} classes={classes} saveClass={saveClass} deleteClass={deleteClass}/>;
      case 'scanClassList':
        return <ClassSelector classes={classes} setView={setView} />;
      case 'scanClassSession':
        const classToScan = classes.find(c => c.id === view.classId);
        if (!classToScan) {
            setView({ name: 'scanClassList' });
            return <div>Class not found!</div>
        }
        return <AttendanceScanner classToScan={classToScan} setView={setView} saveReport={saveReport} />;
      case 'reportList':
        return <ReportViewer reports={reports} setView={setView} deleteReport={deleteReport} />;
      default:
        return <HomePage setView={setView} />;
    }
  };

  return <div className="w-full max-w-2xl mx-auto">{renderContent()}</div>;
};

const ClassSelector: React.FC<{ classes: Class[], setView: (view: View) => void }> = ({ classes, setView }) => (
  <div className="p-4 min-h-screen bg-slate-900">
    <header className="flex items-center mb-6">
      <button onClick={() => setView({ name: 'home' })} className="p-2 rounded-full hover:bg-slate-700 mr-4">
        <ArrowLeftIcon />
      </button>
      <h1 className="text-3xl font-bold text-cyan-400">Select Class to Scan</h1>
    </header>
    <div className="space-y-4">
      {classes.length === 0 ? (
        <p className="text-center text-slate-400 mt-8">No classes available to scan. Please create a class first.</p>
      ) : (
        classes.map(c => (
          <button
            key={c.id}
            onClick={() => setView({ name: 'scanClassSession', classId: c.id })}
            className="w-full text-left bg-slate-800 p-4 rounded-lg hover:bg-slate-700/50 hover:ring-2 hover:ring-cyan-500 transition-all duration-200"
            disabled={c.students.length === 0}
          >
            <h2 className="font-bold text-lg">{c.name}</h2>
            <p className="text-sm text-slate-400">{c.subject} - {c.students.length} students</p>
             {c.students.length === 0 && <p className="text-xs text-yellow-400 mt-1">No students in this class. Add students to scan.</p>}
          </button>
        ))
      )}
    </div>
  </div>
);

export default App;
