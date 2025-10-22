import React from 'react';
import type { View } from '../App';
import type { AttendanceReport, Student } from '../types';
import { ArrowLeftIcon, DocumentReportIcon, TrashIcon, DownloadIcon } from './icons';

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
    const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);
    const presentCount = report.records.filter(r => r.status === 'present').length;
    const totalCount = report.records.length;

    const handleExportCSV = () => {
        const headers = "Roll Number,Name,Status,Timestamp\n";
        const rows = report.records.map(r => {
            const timestamp = r.timestamp ? new Date(r.timestamp).toLocaleString() : 'N/A';
            return `${r.student.rollNumber},"${r.student.name}",${r.status},"${timestamp}"`;
        }).join('\n');

        const csvContent = headers + rows;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `Attendance-Report-${report.className.replace(/\s+/g, '_')}-${report.date}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <>
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
                           <div className="flex items-center space-x-1">
                                <button onClick={(e) => { e.stopPropagation(); handleExportCSV(); }} title="Export as CSV" className="p-2 rounded-full hover:bg-slate-700 text-cyan-400"><DownloadIcon className="w-5 h-5"/></button>
                                <button onClick={(e) => { e.stopPropagation(); window.confirm('Are you sure you want to delete this report?') && deleteReport(report.id); }} title="Delete Report" className="p-2 rounded-full hover:bg-slate-700 text-red-400"><TrashIcon className="w-5 h-5"/></button>
                           </div>
                        </div>
                        <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {report.records.map(({ student, status, timestamp }) => (
                                <li key={student.id} onClick={() => setSelectedStudent(student)} className="flex items-center justify-between bg-slate-700 p-2 rounded cursor-pointer hover:bg-slate-600/50 transition-colors">
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

            {selectedStudent && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={() => setSelectedStudent(null)}>
                    <div className="bg-slate-800 rounded-lg p-6 w-full max-w-sm space-y-4 shadow-xl transform transition-all" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start">
                             <h3 className="text-xl font-bold text-white">{selectedStudent.name}</h3>
                             <button onClick={() => setSelectedStudent(null)} className="text-2xl font-bold text-slate-400 hover:text-white">&times;</button>
                        </div>
                        <img src={selectedStudent.photo} alt={selectedStudent.name} className="w-32 h-32 rounded-full object-cover mx-auto ring-4 ring-cyan-500/50" />
                        <div className="space-y-2 text-center text-slate-300">
                            <p><strong>Roll Number:</strong> {selectedStudent.rollNumber}</p>
                            <p><strong>Branch:</strong> {selectedStudent.branch}</p>
                            <p><strong>Year:</strong> {selectedStudent.year}</p>
                            <p><strong>Section:</strong> {selectedStudent.section}</p>
                        </div>
                         <button onClick={() => setSelectedStudent(null)} className="w-full mt-4 px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500">Close</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default ReportViewer;