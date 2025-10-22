
import React, { useState, useEffect } from 'react';
import type { View } from '../App';
import type { Class, Student } from '../types';
import { ArrowLeftIcon, PlusIcon, TrashIcon, UsersIcon, EditIcon } from './icons';

interface ClassManagerProps {
  view: View;
  setView: (view: View) => void;
  classes: Class[];
  saveClass: (classData: Class) => void;
  deleteClass: (classId: string) => void;
}

const ClassManager: React.FC<ClassManagerProps> = ({ view, setView, classes, saveClass, deleteClass }) => {
  if (view.name === 'classList') {
    return <ClassList classes={classes} setView={setView} deleteClass={deleteClass} />;
  }
  if (view.name === 'createClass' || view.name === 'editClass') {
    const existingClass = view.name === 'editClass' ? classes.find(c => c.id === view.classId) : undefined;
    return <ClassForm existingClass={existingClass} saveClass={saveClass} setView={setView} />;
  }
  return null;
};

// Sub-component for listing classes
const ClassList: React.FC<{ classes: Class[], setView: (view: View) => void, deleteClass: (classId: string) => void }> = ({ classes, setView, deleteClass }) => (
  <div className="p-4 min-h-screen bg-slate-900">
    <header className="flex items-center mb-6">
      <button onClick={() => setView({ name: 'home' })} className="p-2 rounded-full hover:bg-slate-700 mr-4">
        <ArrowLeftIcon />
      </button>
      <h1 className="text-3xl font-bold text-cyan-400">Existing Classes</h1>
    </header>
    <div className="space-y-4">
      {classes.length === 0 ? (
        <div className="text-center py-10 bg-slate-800 rounded-lg">
          <UsersIcon className="mx-auto w-12 h-12 text-slate-500" />
          <p className="mt-4 text-slate-400">No classes found.</p>
          <button onClick={() => setView({ name: 'createClass' })} className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition">
            Create a Class
          </button>
        </div>
      ) : (
        classes.map(c => (
          <div key={c.id} className="bg-slate-800 p-4 rounded-lg flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg">{c.name}</h2>
              <p className="text-sm text-slate-400">{c.subject} - {c.branch} ({c.year})</p>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setView({ name: 'editClass', classId: c.id })} className="p-2 rounded-full hover:bg-slate-700 text-cyan-400"><EditIcon /></button>
              <button onClick={() => window.confirm('Are you sure you want to delete this class?') && deleteClass(c.id)} className="p-2 rounded-full hover:bg-slate-700 text-red-400"><TrashIcon /></button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

// Sub-component for class form
const ClassForm: React.FC<{ existingClass?: Class, saveClass: (c: Class) => void, setView: (v: View) => void }> = ({ existingClass, saveClass, setView }) => {
    const [classData, setClassData] = useState<Omit<Class, 'id'>>(() => existingClass || { name: '', venue: '', date: '', startTime: '', endTime: '', lecturerName: '', subject: '', branch: '', year: '', section: '', students: [] });
    const [studentForm, setStudentForm] = useState<Omit<Student, 'id'>>({ name: '', rollNumber: '', branch: '', year: '', section: '', photo: '' });
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

    useEffect(() => {
        if(existingClass) setClassData(existingClass);
    }, [existingClass]);

    const handleClassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClassData({ ...classData, [e.target.name]: e.target.value });
    };
    
    const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    setStudentForm({ ...studentForm, photo: event.target.result });
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const openStudentModalForEdit = (student: Student) => {
      setEditingStudentId(student.id);
      setStudentForm(student);
      setShowStudentModal(true);
    }
    
    const handleSaveStudent = () => {
        if (editingStudentId) {
            // Update existing student
            const updatedStudents = classData.students.map(s => s.id === editingStudentId ? {...studentForm, id: editingStudentId} : s);
            setClassData({...classData, students: updatedStudents});
        } else {
             // Add new student
            const newStudent: Student = { ...studentForm, id: crypto.randomUUID() };
            setClassData({ ...classData, students: [...classData.students, newStudent] });
        }
        resetStudentForm();
    };

    const resetStudentForm = () => {
        setStudentForm({ name: '', rollNumber: '', branch: '', year: '', section: '', photo: '' });
        setShowStudentModal(false);
        setEditingStudentId(null);
    }

    const removeStudent = (studentId: string) => {
        setClassData({ ...classData, students: classData.students.filter(s => s.id !== studentId) });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveClass({ ...classData, id: existingClass?.id || crypto.randomUUID() });
        setView({ name: 'classList' });
    };

    const formFields = [
        { name: 'name', label: 'Class Name', type: 'text' },
        { name: 'subject', label: 'Subject', type: 'text' },
        { name: 'lecturerName', label: 'Lecturer Name', type: 'text' },
        { name: 'venue', label: 'Venue', type: 'text' },
        { name: 'branch', label: 'Branch', type: 'text' },
        { name: 'year', label: 'Year', type: 'text' },
        { name: 'section', label: 'Section', type: 'text' },
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'startTime', label: 'Start Time', type: 'time' },
        { name: 'endTime', label: 'End Time', type: 'time' },
    ] as const;

    return (
        <div className="p-4 min-h-screen bg-slate-900">
            <header className="flex items-center mb-6">
                <button onClick={() => setView({ name: 'classList' })} className="p-2 rounded-full hover:bg-slate-700 mr-4">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-3xl font-bold text-cyan-400">{existingClass ? 'Edit Class' : 'Create New Class'}</h1>
            </header>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-slate-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-slate-300">Class Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formFields.map(field => (
                            <div key={field.name}>
                                <label htmlFor={field.name} className="block text-sm font-medium text-slate-400">{field.label}</label>
                                <input
                                    type={field.type}
                                    id={field.name}
                                    name={field.name}
                                    value={classData[field.name]}
                                    onChange={handleClassChange}
                                    className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white p-2"
                                    required
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-800 p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-slate-300">Students ({classData.students.length})</h2>
                        <button type="button" onClick={() => setShowStudentModal(true)} className="flex items-center px-3 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition">
                            <PlusIcon className="w-5 h-5 mr-1" /> Add Student
                        </button>
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {classData.students.map(s => (
                            <div key={s.id} className="flex items-center justify-between bg-slate-700 p-3 rounded-md">
                                <div className="flex items-center space-x-3">
                                    <img src={s.photo} alt={s.name} className="w-10 h-10 rounded-full object-cover bg-slate-600"/>
                                    <div>
                                        <p className="font-medium text-white">{s.name}</p>
                                        <p className="text-xs text-slate-400">{s.rollNumber}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <button type="button" onClick={() => openStudentModalForEdit(s)} className="p-2 rounded-full hover:bg-slate-600 text-cyan-400"><EditIcon className="w-5 h-5"/></button>
                                    <button type="button" onClick={() => removeStudent(s.id)} className="p-2 rounded-full hover:bg-slate-600 text-red-400"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                            </div>
                        ))}
                         {classData.students.length === 0 && <p className="text-center text-slate-500 py-4">No students added yet.</p>}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition">Save Class</button>
                </div>
            </form>

            {showStudentModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md space-y-4">
                        <h3 className="text-lg font-medium leading-6 text-white">{editingStudentId ? "Edit Student" : "Add New Student"}</h3>
                        <div className="grid grid-cols-1 gap-4">
                             <input type="text" name="name" placeholder="Name" value={studentForm.name} onChange={handleStudentChange} className="w-full bg-slate-700 rounded p-2 text-white" required />
                             <input type="text" name="rollNumber" placeholder="Roll Number" value={studentForm.rollNumber} onChange={handleStudentChange} className="w-full bg-slate-700 rounded p-2 text-white" required />
                             <input type="text" name="branch" placeholder="Branch" value={studentForm.branch} onChange={handleStudentChange} className="w-full bg-slate-700 rounded p-2 text-white" required />
                             <input type="text" name="year" placeholder="Year" value={studentForm.year} onChange={handleStudentChange} className="w-full bg-slate-700 rounded p-2 text-white" required />
                             <input type="text" name="section" placeholder="Section" value={studentForm.section} onChange={handleStudentChange} className="w-full bg-slate-700 rounded p-2 text-white" required />
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Student Photo</label>
                                <input type="file" accept="image/*" onChange={handlePhotoChange} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"/>
                                {studentForm.photo && <img src={studentForm.photo} alt="Preview" className="mt-2 w-20 h-20 rounded-full object-cover"/>}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-4">
                            <button type="button" onClick={resetStudentForm} className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700">Cancel</button>
                            <button type="button" onClick={handleSaveStudent} className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700">Save Student</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassManager;
