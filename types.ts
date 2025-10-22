
export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  branch: string;
  year: string;
  section: string;
  photo: string; // Base64 encoded image string
}

export interface Class {
  id: string;
  name: string;
  venue: string;
  date: string;
  startTime: string;
  endTime: string;
  lecturerName: string;
  subject: string;
  branch: string;
  year: string;
  section: string;
  students: Student[];
}

export type AttendanceStatus = 'present' | 'absent';

export interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  timestamp: string | null;
}

export interface AttendanceReport {
  id: string;
  classId: string;
  className: string;
  date: string;
  records: {
    student: Student;
    status: AttendanceStatus;
    timestamp: string | null;
  }[];
  generatedAt: string;
}
