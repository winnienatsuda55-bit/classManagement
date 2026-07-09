import React, { useState, useEffect, useMemo } from 'react';
import { Users, LayoutDashboard, Plus, Edit, Trash, Search, MapPin, ClipboardList, RefreshCw } from 'lucide-react';
import { supabase } from './supabaseClient';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menu = [
    { id: 'dashboard', label: 'ภาพรวม (Dashboard)', icon: <LayoutDashboard size={20} /> },
    { id: 'students', label: 'รายชื่อนักเรียน (Students)', icon: <Users size={20} /> },
    { id: 'duty', label: 'เวรประจำวัน (Daily Duty)', icon: <ClipboardList size={20} /> },
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

const Dashboard = ({ students, duties }) => {
  const total = students.length;
  const active = students.filter(s => s.status === 'ปกติ').length;
  const addressSummary = useMemo(() => {
    return students.filter(s => s.address).length;
  }, [students]);

  // หาเวรประจำวันวันนี้
  const daysTh = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  const todayName = daysTh[new Date().getDay()];
  const todayDuties = duties[todayName] || [];

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* เวรประจำวันนี้ */}
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <ClipboardList size={22} className="text-primary" />
            เวรประจำวันนี้ ({todayName})
          </h2>
          {todayDuties.length === 0 ? (
            <p className="text-slate-400 italic">ไม่มีข้อมูลเวรสำหรับวันนี้</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {todayDuties.map(id => {
                const s = students.find(x => x.id === id);
                if (!s) return null;
                return (
                  <div key={id} className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                      {s.name[0]}
                    </div>
                    <div>
                      <p className="text-white font-medium">{s.name}</p>
                      <p className="text-xs text-slate-400">รหัส {s.studentId} • {s.grade}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ข้อมูลที่อยู่ล่าสุด */}
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <MapPin size={22} className="text-purple-400" />
            ข้อมูลที่อยู่ล่าสุด
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/50 text-slate-300 text-sm">
                <tr>
                  <th className="px-4 py-3 font-medium">ชื่อ</th>
                  <th className="px-4 py-3 font-medium">ที่อยู่</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {students.filter(s => s.address).slice(0, 5).map(student => (
                  <tr key={student.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white text-sm">{student.name}</td>
                    <td className="px-4 py-3 text-slate-400 text-sm truncate max-w-xs">{student.address}</td>
                  </tr>
                ))}
                {students.filter(s => s.address).length === 0 && (
                  <tr>
                    <td colSpan="2" className="px-4 py-6 text-center text-slate-500 italic text-sm">ไม่มีข้อมูลที่อยู่</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

const Students = ({ students, onSaveStudent, onDeleteStudent }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const filteredStudents = students.filter(s => 
    s.name.includes(search) || 
    s.studentId.includes(search) ||
    (s.address && s.address.includes(search))
  );

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
                      <button onClick={() => onDeleteStudent(student.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="ลบ">
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
        onSave={onSaveStudent}
        student={editingStudent}
      />
    </div>
  );
};

const DutyEditModal = ({ isOpen, onClose, day, students, assignedIds, onSave }) => {
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    setSelectedIds(assignedIds);
  }, [assignedIds, isOpen]);

  if (!isOpen) return null;

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSave = () => {
    onSave(day, selectedIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-darkCard border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-slideUp">
        <h2 className="text-2xl font-bold text-white mb-2">แก้ไขเวรทำความสะอาด</h2>
        <p className="text-slate-400 mb-6">เลือกนักเรียนประจำวัน{day}</p>
        
        <div className="max-h-60 overflow-y-auto space-y-2 mb-6 pr-2">
          {students.filter(s => s.status === 'ปกติ').map(s => {
            const isChecked = selectedIds.includes(s.id);
            return (
              <div 
                key={s.id} 
                onClick={() => toggleSelect(s.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${isChecked ? 'bg-primary/20 border-primary/40 text-white' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'}`}
              >
                <div>
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-xs text-slate-400">รหัส {s.studentId} • {s.grade}</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={isChecked}
                  onChange={() => {}}
                  className="rounded text-primary focus:ring-primary bg-slate-950 border-slate-700 w-4 h-4 pointer-events-none"
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:bg-slate-800 transition-colors">ยกเลิก</button>
          <button type="button" onClick={handleSave} className="px-5 py-2.5 rounded-xl font-medium bg-primary text-white hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20">บันทึก</button>
        </div>
      </div>
    </div>
  );
};

const DutyManager = ({ students, duties, onSaveDuty, onAutoDistribute, onClearDuties }) => {
  const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'];
  const [editingDay, setEditingDay] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const daysTh = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  const todayName = daysTh[new Date().getDay()];

  const handleOpenEdit = (day) => {
    setEditingDay(day);
    setIsEditOpen(true);
  };

  return (
    <div className="p-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">ระบบเวรประจำวัน</h1>
          <p className="text-slate-400 mt-1">จัดตารางและเวรทำความสะอาดประจำวันของนักเรียน</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onClearDuties} className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-4 py-2.5 rounded-xl font-medium transition-all">
            ล้างตารางเวร
          </button>
          <button onClick={onAutoDistribute} className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5">
            <RefreshCw size={18} /> จัดเวรอัตโนมัติ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
        {days.map(day => {
          const isToday = day === todayName;
          const assignedIds = duties[day] || [];
          return (
            <div key={day} className={`glass rounded-2xl p-5 flex flex-col min-h-[400px] border transition-all duration-300 ${isToday ? 'border-primary shadow-lg shadow-primary/10 -translate-y-1' : 'border-slate-800'}`}>
              <div className="flex justify-between items-center mb-4">
                <span className={`text-lg font-bold ${isToday ? 'text-primary' : 'text-white'}`}>
                  วัน{day} {isToday && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full ml-1 font-normal">วันนี้</span>}
                </span>
                <button onClick={() => handleOpenEdit(day)} className="text-sm font-medium text-slate-400 hover:text-primary transition-colors">
                  แก้ไข
                </button>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto max-h-[300px] pr-1">
                {assignedIds.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 italic py-10">
                    ไม่มีเวรประจำวัน
                  </div>
                ) : (
                  assignedIds.map(id => {
                    const s = students.find(x => x.id === id);
                    if (!s) return null;
                    return (
                      <div key={id} className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-800 text-xs text-white flex items-center justify-center font-bold">
                          {s.name[0]}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-white text-xs font-semibold truncate">{s.name}</p>
                          <p className="text-[10px] text-slate-400">รหัส {s.studentId}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      <DutyEditModal 
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        day={editingDay}
        students={students}
        assignedIds={editingDay ? duties[editingDay] || [] : []}
        onSave={onSaveDuty}
      />
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [duties, setDuties] = useState({
    'จันทร์': [], 'อังคาร': [], 'พุธ': [], 'พฤหัสบดี': [], 'ศุกร์': []
  });
  const [isLoading, setIsLoading] = useState(true);

  // โหลดข้อมูลเริ่มต้นจาก Supabase
  const fetchData = async () => {
    try {
      setIsLoading(true);
      // ดึงข้อมูลนักเรียน
      const { data: studentsData, error: sError } = await supabase
        .from('students')
        .select('*')
        .order('student_id', { ascending: true });

      if (sError) throw sError;

      // ดึงข้อมูลตารางเวรประจำวัน
      const { data: dutyData, error: dError } = await supabase
        .from('duty_assignments')
        .select('*');

      if (dError) throw dError;

      setStudents(studentsData);

      // สร้างตารางเวรรูปแบบใหม่เชื่อมกับ id นักเรียน
      const mappedDuties = {
        'จันทร์': [], 'อังคาร': [], 'พุธ': [], 'พฤหัสบดี': [], 'ศุกร์': []
      };
      dutyData.forEach(item => {
        if (mappedDuties[item.day_of_week]) {
          mappedDuties[item.day_of_week].push(item.student_id);
        }
      });
      setDuties(mappedDuties);
    } catch (e) {
      console.error("Error loading data from Supabase:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // บันทึก/แก้ไขข้อมูลนักเรียน
  const handleSaveStudent = async (studentData) => {
    try {
      if (studentData.id) {
        // อัปเดตข้อมูลนักเรียนเดิม
        const { error } = await supabase
          .from('students')
          .update({
            student_id: studentData.studentId,
            name: studentData.name,
            grade: studentData.grade,
            status: studentData.status,
            address: studentData.address
          })
          .eq('id', studentData.id);
        if (error) throw error;
      } else {
        // เพิ่มนักเรียนคนใหม่
        const { error } = await supabase
          .from('students')
          .insert([{
            student_id: studentData.studentId,
            name: studentData.name,
            grade: studentData.grade,
            status: studentData.status,
            address: studentData.address
          }]);
        if (error) throw error;
      }
      await fetchData();
    } catch (e) {
      alert("ไม่สามารถบันทึกข้อมูลได้: " + e.message);
    }
  };

  // ลบข้อมูลนักเรียน
  const handleDeleteStudent = async (id) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนักเรียนคนนี้? การทำรายการนี้จะลบข้อมูลเวรที่เชื่อมโยงอยู่ด้วย')) return;
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (e) {
      alert("ไม่สามารถลบข้อมูลนักเรียนได้: " + e.message);
    }
  };

  // อัปเดตเวรประจำวันในแต่ละวัน
  const handleSaveDuty = async (day, selectedStudentIds) => {
    try {
      // 1. ลบตารางเวรเก่าในวันนั้นๆ ทั้งหมดก่อน
      const { error: dError } = await supabase
        .from('duty_assignments')
        .delete()
        .eq('day_of_week', day);
      if (dError) throw dError;

      // 2. ถ้ามีนักเรียนถูกเลือก ให้ทำการ Insert รายชื่อใหม่ลงไป
      if (selectedStudentIds.length > 0) {
        const inserts = selectedStudentIds.map(sid => ({
          day_of_week: day,
          student_id: sid
        }));
        const { error: iError } = await supabase
          .from('duty_assignments')
          .insert(inserts);
        if (iError) throw iError;
      }

      await fetchData();
    } catch (e) {
      alert("ไม่สามารถบันทึกตารางเวรได้: " + e.message);
    }
  };

  // เคลียร์ตารางเวรประจำวันทั้งหมด
  const handleClearDuties = async () => {
    if (!confirm("คุณต้องการล้างข้อมูลตารางเวรประจำวันทั้งหมดใช่หรือไม่?")) return;
    try {
      const { error } = await supabase
        .from('duty_assignments')
        .delete()
        .neq('id', 0); // ลบข้อมูลทั้งหมด
      if (error) throw error;
      await fetchData();
    } catch (e) {
      alert("ไม่สามารถล้างข้อมูลตารางเวรได้: " + e.message);
    }
  };

  // ฟังก์ชันจัดเวรอัตโนมัติแบบเฉลี่ยให้เท่ากัน
  const handleAutoDistribute = async () => {
    if (!confirm("ระบบจะล้างตารางเวรเดิมทั้งหมดเพื่อจัดตารางเวรอัตโนมัติ ยืนยันที่จะทำรายการหรือไม่?")) return;
    try {
      // ดึงเฉพาะนักเรียนที่มีสถานะ 'ปกติ'
      const activeStudents = students.filter(s => s.status === 'ปกติ');
      if (activeStudents.length === 0) {
        alert("ไม่มีนักเรียนที่พร้อมสำหรับทำเวร (ต้องมีสถานะ 'ปกติ')");
        return;
      }

      // 1. ล้างเวรทั้งหมดในฐานข้อมูล
      const { error: dError } = await supabase
        .from('duty_assignments')
        .delete()
        .neq('id', 0);
      if (dError) throw dError;

      // 2. ลำดับวันและเฉลี่ยกระจายนักเรียน
      const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'];
      const assignments = [];

      activeStudents.forEach((student, index) => {
        const targetDay = days[index % days.length];
        assignments.push({
          day_of_week: targetDay,
          student_id: student.id
        });
      });

      // 3. บันทึกลง Supabase
      const { error: iError } = await supabase
        .from('duty_assignments')
        .insert(assignments);
      if (iError) throw iError;

      await fetchData();
    } catch (e) {
      alert("ไม่สามารถจัดเวรอัตโนมัติได้: " + e.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark text-slate-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">กำลังโหลดข้อมูลจากฐานข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-dark text-slate-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 max-h-screen overflow-y-auto">
        {activeTab === 'dashboard' && <Dashboard students={students} duties={duties} />}
        {activeTab === 'students' && (
          <Students 
            students={students} 
            onSaveStudent={handleSaveStudent} 
            onDeleteStudent={handleDeleteStudent} 
          />
        )}
        {activeTab === 'duty' && (
          <DutyManager 
            students={students} 
            duties={duties} 
            onSaveDuty={handleSaveDuty}
            onAutoDistribute={handleAutoDistribute}
            onClearDuties={handleClearDuties}
          />
        )}
      </main>
    </div>
  );
}
