import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Printer,
  Download,
  Edit2,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  GraduationCap,
  Award,
  Layers,
  Building,
  UserCheck,
  X,
} from 'lucide-react';
import { JobManualItem, RoleType } from '../types/payroll';
import { USER_ROLES } from '../data/initialData';

interface JobManualModuleProps {
  manualItems: JobManualItem[];
  onSaveManualItem: (item: JobManualItem) => void;
  currentRole: RoleType;
}

export const JobManualModule: React.FC<JobManualModuleProps> = ({
  manualItems,
  onSaveManualItem,
  currentRole,
}) => {
  const [selectedId, setSelectedId] = useState<string>(manualItems[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState<JobManualItem | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const rolePermissions = USER_ROLES[currentRole].permissions;

  const currentItem = manualItems.find((item) => item.id === selectedId) || manualItems[0];

  const handleStartEdit = () => {
    if (currentItem) {
      setEditItem(JSON.parse(JSON.stringify(currentItem)));
      setIsEditing(true);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      onSaveManualItem(editItem);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Add/remove functions in edit mode
  const handleAddFunction = () => {
    if (editItem) {
      setEditItem({
        ...editItem,
        functions: [...editItem.functions, 'Nueva función asignada al cargo'],
      });
    }
  };

  const handleRemoveFunction = (index: number) => {
    if (editItem) {
      setEditItem({
        ...editItem,
        functions: editItem.functions.filter((_, i) => i !== index),
      });
    }
  };

  const handleAddResponsibility = () => {
    if (editItem) {
      setEditItem({
        ...editItem,
        responsibilities: [
          ...editItem.responsibilities,
          'Nueva responsabilidad clave del cargo',
        ],
      });
    }
  };

  const handleRemoveResponsibility = (index: number) => {
    if (editItem) {
      setEditItem({
        ...editItem,
        responsibilities: editItem.responsibilities.filter((_, i) => i !== index),
      });
    }
  };

  // Filter positions by search
  const filteredPositions = manualItems.filter(
    (item) =>
      item.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.objective.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.functions.some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Manual de Funciones, Responsabilidades & Perfiles de Cargo
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Definición formal de actividades, requisitos y competencias para cada posición en la Corporación Social Somos Uno.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Manual actualizado
            </span>
          )}

          {rolePermissions.canEditParameters && !isEditing && (
            <button
              onClick={handleStartEdit}
              className="px-3.5 py-2 border border-slate-300 rounded-lg text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5 text-slate-600" />
              Editar Funciones
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            Descargar en PDF / Imprimir
          </button>
        </div>
      </div>

      {/* Main Grid: Position Selector (Left) & Job Profile View (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Positions Sidebar: 4 cols */}
        <div className="lg:col-span-4 space-y-4 no-print">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar funciones o cargos..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              {filteredPositions.map((item) => {
                const isSelected = selectedId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedId(item.id);
                      setIsEditing(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${
                          isSelected ? 'text-blue-900' : 'text-slate-800'
                        }`}
                      >
                        {item.position}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.department.split(' ')[0]}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {item.objective}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                      <span>{item.functions.length} funciones</span>
                      <span>·</span>
                      <span>{item.responsibilities.length} responsabilidades</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Profile Card View: 8 cols (Printable area) */}
        <div className="lg:col-span-8">
          {currentItem && !isEditing && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:p-0">
              
              {/* Official Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-900 text-white font-black text-sm flex items-center justify-center border border-amber-400/40">
                    SU
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                      CORPORACIÓN SOCIAL SOMOS UNO
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      NIT 901.458.239-1 · Sistema de Gestión de Calidad & Talento Humano
                    </p>
                    <p className="text-xs font-bold text-blue-700 mt-0.5">
                      MANUAL ESPECÍFICO DE FUNCIONES Y COMPETENCIAS LABORALES
                    </p>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-500 font-mono">
                  <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold">
                    CÓD: MF-SU-{currentItem.id.replace('man-', '')}
                  </span>
                  <p className="mt-1">Versión: 2026.1</p>
                  <p>Actualizado: {currentItem.updatedAt}</p>
                </div>
              </div>

              {/* General Position Identification Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Denominación del Cargo:
                  </span>
                  <p className="font-bold text-slate-900 text-sm">{currentItem.position}</p>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Área / Departamento:
                  </span>
                  <p className="font-semibold text-slate-800">{currentItem.department}</p>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Jefe Inmediato:
                  </span>
                  <p className="font-semibold text-slate-800">{currentItem.directBoss}</p>
                </div>
              </div>

              {/* Purpose & Objective */}
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 text-xs">
                <span className="font-bold text-blue-950 uppercase text-[11px] tracking-wider block mb-1">
                  I. Propósito Principal & Objetivo del Cargo
                </span>
                <p className="text-blue-900 leading-relaxed text-xs">
                  {currentItem.objective}
                </p>
              </div>

              {/* Requirements & Competencies */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <GraduationCap className="w-4 h-4 text-blue-700" />
                  II. Requisitos de Perfil & Competencias Exigidas
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-800 block text-[11px] mb-1">
                      Formación Académica:
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {currentItem.requirements.education}
                    </p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-800 block text-[11px] mb-1">
                      Experiencia Laboral Previa:
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {currentItem.requirements.experience}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <span className="font-semibold text-slate-800 block text-[11px] mb-2">
                    Competencias Laborales y Comportamentales:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentItem.requirements.competencies.map((comp, idx) => (
                      <span
                        key={idx}
                        className="bg-white border border-slate-200 px-2.5 py-1 rounded text-[11px] text-slate-700 font-medium"
                      >
                        ✓ {comp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Functions List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Award className="w-4 h-4 text-blue-700" />
                  III. Funciones Esenciales & Actividades del Cargo
                </h4>
                <div className="space-y-2 text-xs">
                  {currentItem.functions.map((fn, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-slate-100 bg-white hover:bg-slate-50/60 transition-colors flex items-start gap-3"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-slate-800 leading-relaxed">{fn}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Responsibilities */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  IV. Responsabilidades Principales & Rendición de Cuentas
                </h4>
                <div className="space-y-2 text-xs">
                  {currentItem.responsibilities.map((resp, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-emerald-100 bg-emerald-50/40 text-emerald-950 flex items-start gap-2.5"
                    >
                      <span className="font-bold text-emerald-700 text-sm leading-none">•</span>
                      <p className="leading-relaxed">{resp}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signatures for Official Manual */}
              <div className="grid grid-cols-2 gap-8 pt-10 border-t border-slate-200 text-center text-xs print:pt-14">
                <div>
                  <div className="border-t border-slate-400 pt-1.5 font-bold text-slate-800">
                    Martha Lucia Ríos
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans">
                    Administración y Talento Humano · Elaboró y Revisó
                  </p>
                </div>
                <div>
                  <div className="border-t border-slate-400 pt-1.5 font-bold text-slate-800">
                    Dr. Fernando Salazar Valderrama
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans">
                    Gerente General · Aprobó
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* Edit Mode View */}
          {isEditing && editItem && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  Editar Manual de Funciones: {editItem.position}
                </h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Propósito / Objetivo *</label>
                  <textarea
                    rows={3}
                    required
                    value={editItem.objective}
                    onChange={(e) => setEditItem({ ...editItem, objective: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Formación Académica</label>
                    <input
                      type="text"
                      value={editItem.requirements.education}
                      onChange={(e) =>
                        setEditItem({
                          ...editItem,
                          requirements: {
                            ...editItem.requirements,
                            education: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Experiencia Requerida</label>
                    <input
                      type="text"
                      value={editItem.requirements.experience}
                      onChange={(e) =>
                        setEditItem({
                          ...editItem,
                          requirements: {
                            ...editItem.requirements,
                            experience: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                {/* Edit Functions */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                      Funciones Específicas ({editItem.functions.length})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddFunction}
                      className="text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 text-[11px]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Agregar Función
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editItem.functions.map((fn, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-5 text-center font-bold text-slate-400">{idx + 1}.</span>
                        <input
                          type="text"
                          value={fn}
                          onChange={(e) => {
                            const newFns = [...editItem.functions];
                            newFns[idx] = e.target.value;
                            setEditItem({ ...editItem, functions: newFns });
                          }}
                          className="flex-1 border border-slate-300 rounded-lg px-3 py-1.5 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFunction(idx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edit Responsibilities */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                      Responsabilidades Clave ({editItem.responsibilities.length})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddResponsibility}
                      className="text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 text-[11px]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Agregar Responsabilidad
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editItem.responsibilities.map((resp, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-5 text-center font-bold text-slate-400">•</span>
                        <input
                          type="text"
                          value={resp}
                          onChange={(e) => {
                            const newResp = [...editItem.responsibilities];
                            newResp[idx] = e.target.value;
                            setEditItem({ ...editItem, responsibilities: newResp });
                          }}
                          className="flex-1 border border-slate-300 rounded-lg px-3 py-1.5 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveResponsibility(idx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold shadow-sm flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    Guardar Cambios del Manual
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
