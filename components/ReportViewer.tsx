
import React from 'react';
import type { View } from '../App';
import type { AttendanceReport } from '../types';
import { ArrowLeftIcon, DocumentReportIcon, TrashIcon } from './icons';

interface ReportViewerProps {
  reports: AttendanceReport[];
  setView: (view: View) => void;
  deleteReport: (reportId: string) => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ reports, setView, deleteReport }) => {
  return (
    <div className="p-4 min-h-screen bg-slate-900">
      <header className="flex items-center mb-6">
        <button onClick={() => setView({ name: 'home' })} className="p-2 rounded-full hover:bg-slate-700 mr-4">
          <ArrowLeftIcon />
        </button>
        <h1 className="text-3xl font-bold text-cyan-400">Attendance Reports</h1>
      </header>
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="text-center py-10 bg-slate-800 rounded-lg">
            <DocumentReportIcon className="mx-auto w-12 h-12 text-slate-500" />
            <p className="mt-4 text-slate-400">No reports generated yet.</p>
          </div>
        ) : (
          [...reports].reverse().map(report => <ReportCard key={report.id} report={report} deleteReport={deleteReport} />)
        )}
      </div>
    </div>
  );
};

const ReportCard: React.FC<{ report: AttendanceReport, deleteReport: (reportId: string) => void }> = ({ report, deleteReport }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const presentCount = report.records.filter(r => r.status === 'present').length;
    const totalCount = report.records.length;

    return (
        <div className="bg-slate-800 p-4 rounded-lg">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div>
                    <h2 className="font-bold text-lg text-white">{report.className}</h2>
                    <p className="text-sm text-slate-400">
                        {new Date(report.generatedAt).toLocaleString()}
                    </p>
                </div>
                <div className="text-right">
                    <p className={`font-bold text-lg ${presentCount > totalCount / 2 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {presentCount}/{totalCount}
                    </p>
                    <p className="text-sm text-slate-400">Present</p>
                </div>
            </div>
            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-md font-semibold text-slate-300">Details</h3>
                       <button onClick={(e) => { e.stopPropagation(); window.confirm('Are you sure you want to delete this report?') && deleteReport(report.id); }} className="p-2 rounded-full hover:bg-slate-700 text-red-400"><TrashIcon className="w-5 h-5"/></button>
                    </div>
                    <ul className="space-y-2">
                        {report.records.map(({ student, status, timestamp }) => (
                            <li key={student.id} className="flex items-center justify-between bg-slate-700 p-2 rounded">
                                <div className="flex items-center space-x-3">
                                    <img src={student.photo} alt={student.name} className="w-8 h-8 rounded-full object-cover" />
                                    <span className="text-white">{student.name}</span>
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${status === 'present' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                        {status}
                                    </span>
                                    {status === 'present' && timestamp && (
                                        <p className="text-xs text-slate-400 mt-1">{new Date(timestamp).toLocaleTimeString()}</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default ReportViewer;
