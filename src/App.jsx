import React, { useState, useEffect, useMemo } from 'react';
import { Users, LayoutDashboard, Plus, Edit, Trash, Search, MapPin } from 'lucide-react';

const initialStudents = [
  { id: '1', studentId: '65001', name: 'สมชาย ใจดี', grade: 'ม.4/1', status: 'ปกติ', address: '123 ถ.สุขุมวิท กรุงเทพฯ' },
  { id: '2', studentId: '65002', name: 'สมหญิง รักเรียน', grade: 'ม.4/1', status: 'ปกติ', address: '456 ถ.พหลโยธิน กรุงเทพฯ' },
  { id: '3', studentId: '65003', name: 'มานะ ขยัน', grade: 'ม.5/2', status: 'ลาพัก', address: '789 ถ.ลาดพร้าว กรุงเทพฯ' },
  { id: '4', studentId: '65004', name: 'ปิติ เรียนเก่ง', grade: 'ม.6/3', status: 'ปกติ', address: '321 จ.เชียงใหม่' },
];

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menu = [
    { id: 'dashboard', label: 'ภาพรวม (Dashboard)', icon: <LayoutDashboard size={20} /> },
    { id: 'students', label: 'รายชื่อนักเรียน (Students)', icon: <Users size={20} /> },
  ];

  return (
    <div className="w-64 glass border-r border-slate-700 min-h-screen p-4 flex flex-col gap-2">
      <div className="text-xl font-bold text-white mb-8 px-2 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
          <Users size={20} />
        </div>
        ClassManager
      </div>
      {menu.map(item => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === item.id ? 'bg-primary/20 text-primary border border-primary/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
        >
          {item.icon}
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

const Dashboard = ({ students }) => {
  const total = students.length;
  const active = students.filter(s => s.status === 'ปกติ').length;
  const addressSummary = useMemo(() => {
    return students.filter(s => s.address).length;
  }, [students]);

  return (
    <div className="p-8 animate-fadeIn">
      <h1 className="text-3xl font-bold text-white mb-8">ภาพรวมระบบ (Dashboard)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300 border-l-4 border-l-primary">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 mb-1">นักเรียนทั้งหมด</p>
              <h2 className="text-4xl font-bold text-white">{total}</h2>
            </div>
            <div className="p-3 bg-primary/20 rounded-xl text-primary"><Users size={24} /></div>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300 border-l-4 border-l-secondary">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 mb-1">สถานะปกติ</p>
              <h2 className="text-4xl font-bold text-white">{active}</h2>
            </div>
            <div className="p-3 bg-secondary/20 rounded-xl text-secondary"><Users size={24} /></div>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300 border-l-4 border-l-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 mb-1">มีข้อมูลที่อยู่</p>
              <h2 className="text-4xl font-bold text-white">{addressSummary}</h2>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400"><MapPin size={24} /></div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-4">ข้อมูลที่อยู่ล่าสุด</h2>
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-slate-300 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">ชื่อ-นามสกุล</th>
                <th className="px-6 py-4 font-medium">รหัสประจำตัว</th>
                <th className="px-6 py-4 font-medium">ที่อยู่</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {students.slice(0,5).map(student => (
                <tr key={student.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-white">{student.name}</td>
                  <td className="px-6 py-4 text-slate-400">{student.studentId}</td>
                  <td className="px-6 py-4 text-slate-400 truncate max-w-xs">{student.address || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StudentModal = ({ isOpen, onClose, onSave, student }) => {
  const [formData, setFormData] = useState({
    studentId: '', name: '', grade: 'ม.4/1', status: 'ปกติ', address: ''
  });

  useEffect(() => {
    if (student) setFormData(student);
    else setFormData({ studentId: '', name: '', grade: 'ม.4/1', status: 'ปกติ', address: '' });
  }, [student, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-darkCard border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-slideUp">
        <h2 className="text-2xl font-bold text-white mb-6">
          {student ? 'แก้ไขข้อมูลนักเรียน' : 'เพิ่มนักเรียนใหม่'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">รหัสนักเรียน</label>
              <input required type="text" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="เช่น 65001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">ระดับชั้น</label>
              <select value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                <option>ม.4/1</option>
                <option>ม.4/2</option>
                <option>ม.5/1</option>
                <option>ม.5/2</option>
                <option>ม.6/1</option>
                <option>ม.6/2</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">ชื่อ-นามสกุล</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="ชื่อ นามสกุล" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">ที่อยู่</label>
            <textarea rows="2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="รายละเอียดที่อยู่"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">สถานะ</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
              <option>ปกติ</option>
              <option>ลาพัก</option>
              <option>พ้นสภาพ</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-700">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:bg-slate-800 transition-colors">ยกเลิก</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl font-medium bg-primary text-white hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20">บันทึกข้อมูล</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Students = ({ students, setStudents }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const filteredStudents = students.filter(s => 
    s.name.includes(search) || 
    s.studentId.includes(search) ||
    (s.address && s.address.includes(search))
  );

  const handleSave = (studentData) => {
    if (studentData.id) {
      setStudents(students.map(s => s.id === studentData.id ? studentData : s));
    } else {
      setStudents([...students, { ...studentData, id: Date.now().toString() }]);
    }
  };

  const handleDelete = (id) => {
    if(confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนักเรียนคนนี้?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  return (
    <div className="p-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white">จัดการรายชื่อนักเรียน</h1>
        <button onClick={() => { setEditingStudent(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5">
          <Plus size={20} /> เพิ่มนักเรียน
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-700/50 flex gap-4 bg-slate-800/30">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="ค้นหาชื่อ, รหัส หรือที่อยู่..." 
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-slate-300 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">รหัส</th>
                <th className="px-6 py-4 font-medium">ชื่อ-นามสกุล</th>
                <th className="px-6 py-4 font-medium">ระดับชั้น</th>
                <th className="px-6 py-4 font-medium">ที่อยู่</th>
                <th className="px-6 py-4 font-medium">สถานะ</th>
                <th className="px-6 py-4 font-medium text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredStudents.length === 0 && (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500">ไม่พบข้อมูลนักเรียน</td></tr>
              )}
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="px-6 py-4 text-slate-400 font-medium">{student.studentId}</td>
                  <td className="px-6 py-4 text-white font-medium">{student.name}</td>
                  <td className="px-6 py-4 text-slate-300">
                    <span className="bg-slate-800 px-2.5 py-1 rounded-lg text-sm border border-slate-700">{student.grade}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 max-w-[200px] truncate" title={student.address}>{student.address || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-sm font-medium ${student.status === 'ปกติ' ? 'bg-secondary/20 text-secondary border border-secondary/20' : 'bg-red-500/20 text-red-400 border border-red-500/20'}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingStudent(student); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="แก้ไข">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(student.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="ลบ">
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <StudentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave}
        student={editingStudent}
      />
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState(initialStudents);

  return (
    <div className="flex min-h-screen bg-dark text-slate-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 max-h-screen overflow-y-auto">
        {activeTab === 'dashboard' && <Dashboard students={students} />}
        {activeTab === 'students' && <Students students={students} setStudents={setStudents} />}
      </main>
    </div>
  );
}
