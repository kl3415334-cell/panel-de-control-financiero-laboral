import React, { useState } from 'react';
import {
  CalendarCheck2,
  Plus,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  Eye,
  Download,
  Trash2,
  X,
  FileCheck,
} from 'lucide-react';
import { Employee, Novelty, NoveltyType, RoleType } from '../types/payroll';
import { formatCOP } from '../utils/calculations';
import { USER_ROLES } from '../data/initialData';

interface NoveltiesModuleProps {
  employees: Employee[];
  novelties: Novelty[];
  currentRole: RoleType;
  onSaveNovelty: (novelty: Novelty) => void;
  onDeleteNovelty: (id: string) => void;
  onToggleNoveltyStatus: (id: string, status: 'aprobado' | 'pendiente' | 'rechazado') => void;
}

export const NoveltiesModule: React.FC<NoveltiesModuleProps> = ({
  employees,
  novelties,
  currentRole,
  onSaveNovelty,
  onDeleteNovelty,
  onToggleNoveltyStatus,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterEmployeeId, setFilterEmployeeId] = useState<string>('all');
  const [viewingSupport, setViewingSupport] = useState<Novelty | null>(null);

  const rolePermissions = USER_ROLES[currentRole].permissions;

  const [formData, setFormData] = useState<Omit<Novelty, 'id' | 'createdAt'>>({
    employeeId: employees[0]?.id || '',
    type: 'horas_extras_diurnas',
    startDate: new Date().toISOString().split('T')[0],
    days: 0,
    hours: 2,
    description: '',
    supportDocName: '',
    supportDocSize: '150 KB',
    status: 'aprobado',
    amount: 0,
  });

  const filteredNovelties = novelties.filter((nov) => {
    if (filterEmployeeId !== 'all' && nov.employeeId !== filterEmployeeId) {
      return false;
    }
    return true;
  });

  const getNoveltyLabel = (type: NoveltyType) => {
    switch (type) {
      case 'incapacidad_general':
        return { label: 'Incapacidad Enfermedad General', badge: 'bg-amber-100 text-amber-800' };
      case 'incapacidad_laboral':
        return { label: 'Incapacidad Accidente Laboral (ARL)', badge: 'bg-red-100 text-red-800' };
      case 'horas_extras_diurnas':
        return { label: 'Horas Extras Diurnas (25%)', badge: 'bg-blue-100 text-blue-800' };
      case 'horas_extras_nocturnas':
        return { label: 'Horas Extras Nocturnas (75%)', badge: 'bg-indigo-100 text-indigo-800' };
      case 'horas_extras_festivas_diurnas':
        return { label: 'Horas Extras Festivas Diurnas (75%)', badge: 'bg-purple-100 text-purple-800' };
      case 'horas_extras_festivas_nocturnas':
        return { label: 'Horas Extras Festivas Nocturnas (110%)', badge: 'bg-purple-100 text-purple-900' };
      case 'recargo_nocturno':
        return { label: 'Recargo Nocturno Ordinario (35%)', badge: 'bg-slate-100 text-slate-800' };
      case 'recargo_festivo':
        return { label: 'Recargo Festivo / Dominical (75%)', badge: 'bg-rose-100 text-rose-800' };
      case 'permiso_remunerado':
        return { label: 'Permiso Remunerado', badge: 'bg-emerald-100 text-emerald-800' };
      case 'permiso_no_remunerado':
        return { label: 'Permiso No Remunerado', badge: 'bg-orange-100 text-orange-800' };
      case 'licencia_maternidad_paternidad':
        return { label: 'Licencia Maternidad / Paternidad', badge: 'bg-pink-100 text-pink-800' };
      case 'vacaciones':
        return { label: 'Vacaciones Disfrutadas', badge: 'bg-teal-100 text-teal-800' };
      case 'bonificacion':
        return { label: 'Bonificación / Prima Extralegal', badge: 'bg-green-100 text-green-800' };
      case 'comision':
        return { label: 'Comisión por Cumplimiento', badge: 'bg-emerald-100 text-emerald-800' };
      case 'ausencia_injustificada':
        return { label: 'Ausencia Injustificada', badge: 'bg-red-100 text-red-800' };
      case 'llegada_tarde':
        return { label: 'Llegada Tarde', badge: 'bg-yellow-100 text-yellow-800' };
      default:
        return { label: type, badge: 'bg-slate-100 text-slate-700' };
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNovelty: Novelty = {
      ...formData,
      id: `nov-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      supportDocName: formData.supportDocName || `Soporte_${formData.type}_${Date.now().toString().slice(-4)}.pdf`,
    };
    onSaveNovelty(newNovelty);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck2 className="w-5 h-5 text-blue-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Gestión de Novedades Laborales
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registro de incapacidades médicas, permisos, licencias, horas extras y soportes documentales.
          </p>
        </div>

        {rolePermissions.canRegisterNovelty && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Registrar Nueva Novedad
          </button>
        )}
      </div>

      {/* Filter by Employee */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-medium text-slate-700">Filtrar por Colaborador:</span>
        <select
          value={filterEmployeeId}
          onChange={(e) => setFilterEmployeeId(e.target.value)}
          className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="all">Todos los empleados ({novelties.length} novedades)</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.fullName} ({emp.position})
            </option>
          ))}
        </select>
      </div>

      {/* Novelties Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="text-left py-3 px-4 font-semibold">Colaborador</th>
                <th className="text-left py-3 px-3 font-semibold">Tipo de Novedad</th>
                <th className="text-center py-3 px-3 font-semibold">Fecha</th>
                <th className="text-center py-3 px-2 font-semibold">Días / Horas</th>
                <th className="text-left py-3 px-4 font-semibold">Descripción / Observación</th>
                <th className="text-left py-3 px-3 font-semibold">Soporte Adjunto</th>
                <th className="text-center py-3 px-3 font-semibold">Estado</th>
                <th className="text-right py-3 px-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNovelties.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    No se registran novedades para el filtro seleccionado.
                  </td>
                </tr>
              ) : (
                filteredNovelties.map((nov) => {
                  const emp = employees.find((e) => e.id === nov.employeeId);
                  const { label, badge } = getNoveltyLabel(nov.type);

                  return (
                    <tr key={nov.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Employee */}
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <p>{emp?.fullName || 'Empleado no encontrado'}</p>
                        <p className="text-[11px] text-slate-500 font-normal">{emp?.position}</p>
                      </td>

                      {/* Type Badge */}
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${badge}`}>
                          {label}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 text-center font-mono text-slate-600">
                        {nov.startDate}
                      </td>

                      {/* Quantity */}
                      <td className="py-3 px-2 text-center font-mono font-bold text-slate-800">
                        {nov.days > 0 && <span>{nov.days} días</span>}
                        {nov.hours && nov.hours > 0 ? (
                          <span className="block text-[11px] text-blue-700">
                            {nov.hours} horas
                          </span>
                        ) : null}
                        {nov.amount && nov.amount > 0 ? (
                          <span className="block text-[11px] text-emerald-700">
                            {formatCOP(nov.amount)}
                          </span>
                        ) : null}
                      </td>

                      {/* Description */}
                      <td className="py-3 px-4 text-slate-700 max-w-xs">
                        <p className="line-clamp-2">{nov.description}</p>
                      </td>

                      {/* Support Document */}
                      <td className="py-3 px-3">
                        {nov.supportDocName ? (
                          <button
                            onClick={() => setViewingSupport(nov)}
                            className="flex items-center gap-1.5 text-blue-700 hover:text-blue-900 font-medium hover:underline text-[11px]"
                          >
                            <FileCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="truncate max-w-[120px]">{nov.supportDocName}</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Sin soporte</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <select
                          value={nov.status}
                          disabled={!rolePermissions.canVerifyPayroll}
                          onChange={(e) =>
                            onToggleNoveltyStatus(nov.id, e.target.value as any)
                          }
                          className={`text-[11px] font-semibold rounded px-2 py-0.5 border ${
                            nov.status === 'aprobado'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : nov.status === 'pendiente'
                              ? 'bg-amber-50 text-amber-700 border-amber-300'
                              : 'bg-red-50 text-red-700 border-red-300'
                          }`}
                        >
                          <option value="aprobado">Aprobado</option>
                          <option value="pendiente">Pendiente</option>
                          <option value="rechazado">Rechazado</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {nov.supportDocName && (
                            <button
                              onClick={() => setViewingSupport(nov)}
                              className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded"
                              title="Ver soporte documental"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {rolePermissions.canRegisterNovelty && (
                            <button
                              onClick={() => onDeleteNovelty(nov.id)}
                              className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded"
                              title="Eliminar novedad"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Support Document Preview Modal */}
      {viewingSupport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 border border-slate-200 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-700" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Soporte Documental Digital
                  </h3>
                  <p className="text-[11px] text-slate-500">{viewingSupport.supportDocName}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingSupport(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Document Viewer */}
            <div className="my-4 p-4 border border-slate-200 rounded-lg bg-slate-50 text-xs space-y-3 font-mono">
              <div className="flex justify-between border-b border-slate-200 pb-2 font-sans font-semibold text-slate-800">
                <span>Corporación Social Somos Uno</span>
                <span className="text-[10px] text-slate-500">Radicado Interno #SU-{viewingSupport.id}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-sans text-[10px]">Colaborador:</span>
                <span className="font-bold text-slate-900">
                  {employees.find((e) => e.id === viewingSupport.employeeId)?.fullName}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block font-sans text-[10px]">Concepto Legal:</span>
                <span className="text-blue-700">{getNoveltyLabel(viewingSupport.type).label}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-sans text-[10px]">Fecha / Período:</span>
                <span>{viewingSupport.startDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-sans text-[10px]">Observación de Soporte:</span>
                <p className="font-sans text-slate-800 bg-white p-2.5 rounded border border-slate-200 mt-1">
                  "{viewingSupport.description}"
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[11px]">
                <span className="text-emerald-700 font-sans font-semibold">
                  ✓ Validación de Firma & Expedición Exitosa
                </span>
                <span className="text-slate-400">{viewingSupport.supportDocSize || '180 KB'}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-end gap-2">
              <button
                onClick={() => setViewingSupport(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Novelty Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Registrar Novedad de Nómina
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="py-4 space-y-3.5 text-xs">
              {/* Employee Selection */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Colaborador Relacionado *
                </label>
                <select
                  required
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} — {emp.position}
                    </option>
                  ))}
                </select>
              </div>

              {/* Novelty Type */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Tipo de Novedad Laboral *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as NoveltyType })
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="horas_extras_diurnas">Horas Extras Diurnas (25% recargo)</option>
                  <option value="horas_extras_nocturnas">Horas Extras Nocturnas (75% recargo)</option>
                  <option value="horas_extras_festivas_diurnas">Horas Extras Festivas Diurnas (75% recargo)</option>
                  <option value="horas_extras_festivas_nocturnas">Horas Extras Festivas Nocturnas (110% recargo)</option>
                  <option value="recargo_nocturno">Recargo Nocturno Ordinario (35%)</option>
                  <option value="recargo_festivo">Recargo Dominical / Festivo (75%)</option>
                  <option value="incapacidad_general">Incapacidad Médica por Enfermedad General</option>
                  <option value="incapacidad_laboral">Incapacidad por Accidente de Trabajo (ARL)</option>
                  <option value="permiso_no_remunerado">Permiso No Remunerado (descuenta tiempo)</option>
                  <option value="permiso_remunerado">Permiso Remunerado</option>
                  <option value="vacaciones">Vacaciones Disfrutadas</option>
                  <option value="bonificacion">Bonificación / Prima Extralegal</option>
                  <option value="comision">Comisión</option>
                  <option value="ausencia_injustificada">Ausencia Injustificada</option>
                </select>
              </div>

              {/* Date and Values */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Fecha de Novedad *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  {formData.type.includes('horas') || formData.type.includes('recargo') ? (
                    <>
                      <label className="block text-slate-700 font-medium mb-1">
                        Número de Horas *
                      </label>
                      <input
                        type="number"
                        min={0.5}
                        step={0.5}
                        required
                        value={formData.hours || 0}
                        onChange={(e) =>
                          setFormData({ ...formData, hours: Number(e.target.value), days: 0 })
                        }
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-bold"
                      />
                    </>
                  ) : formData.type === 'bonificacion' || formData.type === 'comision' ? (
                    <>
                      <label className="block text-slate-700 font-medium mb-1">
                        Valor Reconocido (COP) *
                      </label>
                      <input
                        type="number"
                        min={1000}
                        step={1000}
                        required
                        value={formData.amount || 0}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: Number(e.target.value) })
                        }
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-bold"
                      />
                    </>
                  ) : (
                    <>
                      <label className="block text-slate-700 font-medium mb-1">
                        Número de Días *
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        required
                        value={formData.days || 1}
                        onChange={(e) =>
                          setFormData({ ...formData, days: Number(e.target.value) })
                        }
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-bold"
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Descripción / Justificación *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalle el motivo, diagnóstico o soporte de la novedad..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                ></textarea>
              </div>

              {/* Document Support Name */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Nombre de Soporte Documental (PDF / Certificado)
                </label>
                <input
                  type="text"
                  value={formData.supportDocName}
                  onChange={(e) => setFormData({ ...formData, supportDocName: e.target.value })}
                  placeholder="Ej. Incapacidad_EPS_Sura_Cert_991.pdf"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-sm"
                >
                  Guardar Novedad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
