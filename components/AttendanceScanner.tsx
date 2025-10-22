import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { View } from '../App';
import type { Class, Student, AttendanceReport, AttendanceRecord } from '../types';
import { ArrowLeftIcon } from './icons';

interface AttendanceScannerProps {
  classToScan: Class;
  setView: (view: View) => void;
  saveReport: (report: AttendanceReport) => void;
}

const AttendanceScanner: React.FC<AttendanceScannerProps> = ({ classToScan, setView, saveReport }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [attendance, setAttendance] = useState<Map<string, AttendanceRecord>>(new Map(
    classToScan.students.map(s => [s.id, { studentId: s.id, status: 'absent', timestamp: null }])
  ));
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [scanHasBegun, setScanHasBegun] = useState(false);
  const [scanMessage, setScanMessage] = useState("Initializing camera...");
  const [studentInView, setStudentInView] = useState<Student | null>(null);
  
  const attendanceRef = useRef(attendance);
  useEffect(() => {
    attendanceRef.current = attendance;
  }, [attendance]);


  useEffect(() => {
    let stream: MediaStream | null = null;
    const setupCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setScanMessage("Camera ready. Press Start Scanning.");
          setIsCameraReady(true);
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setScanMessage("Could not access camera. Please check permissions.");
        setIsCameraReady(false);
      }
    };
    setupCamera();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const markAttendance = useCallback((studentId: string, status: 'present' | 'absent') => {
    setAttendance(prev => {
      const newAttendance = new Map(prev);
      newAttendance.set(studentId, {
        studentId,
        status,
        timestamp: status === 'present' ? new Date().toISOString() : null
      });
      return newAttendance;
    });
  }, []);
  
  useEffect(() => {
    if (!isScanning || !isCameraReady) {
      return; // Stop if not scanning or camera isn't ready
    }

    const scanInterval = setInterval(() => {
      const currentAttendance = attendanceRef.current;
      const unmarkedStudents = classToScan.students.filter(s => {
          const record = currentAttendance.get(s.id);
          return !record || record.status === 'absent';
      });

      if (unmarkedStudents.length === 0) {
        setScanMessage("All students accounted for.");
        setIsScanning(false);
        setStudentInView(null);
        return;
      }
      
      if (studentInView) {
        const targetStatus = currentAttendance.get(studentInView.id)?.status;

        if (targetStatus === 'present') {
            setScanMessage(`${studentInView.name} marked present. Pause to scan the next student.`);
            return; // Stay on this message until user pauses.
        }

        setScanMessage(`Scanning for ${studentInView.name}...`);
        
        if (Math.random() < 0.4) { // 40% chance of success
          setScanMessage(`Match found: ${studentInView.name}`);
          markAttendance(studentInView.id, 'present');
        } else {
          setScanMessage(`Could not confirm identity of ${studentInView.name}. Retrying...`);
        }
      } else {
        setScanMessage("Searching for student...");
        const nextStudentToScan = unmarkedStudents[Math.floor(Math.random() * unmarkedStudents.length)];
        setStudentInView(nextStudentToScan);
      }
    }, 2500);

    return () => {
      clearInterval(scanInterval);
    };
  }, [isScanning, isCameraReady, classToScan.students, markAttendance, studentInView]);


  const handleFinish = () => {
      const records = Array.from(attendance.values()).map((record: AttendanceRecord) => {
          const student = classToScan.students.find(s => s.id === record.studentId)!;
          return { student, status: record.status, timestamp: record.timestamp };
      });

      const report: AttendanceReport = {
          id: crypto.randomUUID(),
          classId: classToScan.id,
          className: classToScan.name,
          date: classToScan.date,
          records,
          generatedAt: new Date().toISOString()
      };
      saveReport(report);
      setView({name: 'reportList'});
  };

  const toggleScanning = () => {
    if (!isCameraReady) return;
    if (!scanHasBegun) {
      setScanHasBegun(true);
    }
    
    setIsScanning(prevIsScanning => {
      const newIsScanning = !prevIsScanning;
      if (!newIsScanning) { // If we are pausing
        setScanMessage("Scanning paused. Resume to find a new student.");
        setStudentInView(null); // Reset the target student
      }
      return newIsScanning;
    });
  };

  const getButtonText = () => {
    if (!scanHasBegun) return 'Start Scanning';
    return isScanning ? 'Pause Scanning' : 'Resume Scanning';
  };

  return (
    <div className="p-4 min-h-screen bg-slate-900 flex flex-col">
      <header className="flex items-center mb-4 flex-shrink-0">
        <button onClick={() => setView({ name: 'scanClassList' })} className="p-2 rounded-full hover:bg-slate-700 mr-4">
          <ArrowLeftIcon />
        </button>
        <h1 className="text-2xl font-bold text-cyan-400">Scan: {classToScan.name}</h1>
      </header>
      
      <div className="relative w-full max-w-lg mx-auto aspect-square mb-4 rounded-lg overflow-hidden bg-slate-800">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100"></video>
        <div className="absolute inset-0 border-8 border-cyan-500/50 rounded-lg" style={{ clipPath: 'polygon(0% 0%, 0% 100%, 25% 100%, 25% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 100%, 100% 100%, 100% 0%)' }}></div>
        <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white text-center p-2 rounded-md">{scanMessage}</div>
      </div>
       <button
        onClick={toggleScanning}
        disabled={!isCameraReady}
        className={`w-full max-w-lg mx-auto mb-4 py-2 px-4 rounded-md text-white font-semibold transition ${isScanning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'} disabled:bg-slate-600 disabled:cursor-not-allowed`}
       >
        {getButtonText()}
      </button>

      <div className="flex-grow overflow-y-auto bg-slate-800 rounded-lg p-4 space-y-2">
        <h2 className="text-xl font-semibold mb-2 text-slate-300">Student List</h2>
        {classToScan.students.map(student => {
          const record = attendance.get(student.id);
          const isPresent = record?.status === 'present';
          return (
            <div key={student.id} className={`p-2 rounded-md flex items-center justify-between transition ${isPresent ? 'bg-green-500/20' : 'bg-slate-700'}`}>
              <div className="flex items-center space-x-3">
                <img src={student.photo} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-medium text-white">{student.name}</p>
                  <p className="text-xs text-slate-400">{student.rollNumber}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => markAttendance(student.id, 'present')} className={`px-3 py-1 text-xs rounded ${isPresent ? 'bg-green-500 text-white' : 'bg-slate-600 hover:bg-green-600'}`}>Present</button>
                <button onClick={() => markAttendance(student.id, 'absent')} className={`px-3 py-1 text-xs rounded ${!isPresent ? 'bg-red-500 text-white' : 'bg-slate-600 hover:bg-red-600'}`}>Absent</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex-shrink-0">
         <button onClick={handleFinish} className="w-full py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 transition">
            Finish & Generate Report
         </button>
      </div>
    </div>
  );
};

export default AttendanceScanner;