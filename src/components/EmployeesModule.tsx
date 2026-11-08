import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  FileCheck,
  Building,
  Mail,
  Phone,
  AlertTriangle,
  CheckCircle,
  X,
  CreditCard,
  Briefcase,
  Shirt,
} from 'lucide-react';
import { ContractType, Employee, LegalParameters, RoleType } from '../types/payroll';
import { formatCOP } from '../utils/calculations';
import { USER_ROLES } from '../data/initialData';

interface EmployeesModuleProps {
  employees: Employee[];
  currentRole: RoleType;
  onSaveEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employeeId: string) => void;
  legalParams: LegalParameters;
}

export const EmployeesModule: React.FC<EmployeesModuleProps> = ({
  employees,
  currentRole,
  onSaveEmployee,
  onDeleteEmployee,
  legalParams,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);

  const rolePermissions = USER_ROLES[currentRole].permissions;

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.documentNumber.includes(searchTerm) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = positionFilter === 'all' || emp.position === positionFilter;
    return matchesSearch && matchesPosition;
  });

  const positions = Array.from(new Set(employees.map((e) => e.position)));

  const handleCreateNew = () => {
    const newEmp: Employee = {
      id: `emp-${Date.now().toString().slice(-4)}`,
      documentType: 'CC',
      documentNumber: '',
      fullName: '',
      position: 'Auxiliar contable',
      department: 'Operaciones',
      project: 'Gestión Institucional Sede Central',
      contractType: 'Término Indefinido',
      startDate: new Date().toISOString().split('T')[0],
      baseSalary: 2000000,
      autoTransportAllowance: true,
      eps: 'Sura EPS',
      pensionFund: 'Porvenir',
      arl: 'Positiva Compañía de Seguros',
      arlRiskLevel: 1,
      compensationBox: 'Compensar',
      email: '',
      phone: '',
      bankName: 'Bancolombia',
      bankAccount: 'Ahorros ',
      status: 'active',
    };
    setEditingEmployee(newEmp);
    setIsModalOpen(true);
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmployee({ ...emp });
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      onDeleteEmployee(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Directorio de Empleados & Colaboradores
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Administración de contratos, salarios, seguridad social y datos laborales de la Corporación.
          </p>
        </div>

        {rolePermissions.canRegisterEmployee && (
          <button
            onClick={handleCreateNew}
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Registrar Nuevo Empleado
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, cédula, cargo o proyecto..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Filtrar cargo:</span>
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Todos los cargos ({employees.length})</option>
            {positions.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="text-left py-3 px-4 font-semibold">Colaborador</th>
                <th className="text-left py-3 px-3 font-semibold">Identificación</th>
                <th className="text-left py-3 px-3 font-semibold">Cargo / Área</th>
                <th className="text-left py-3 px-3 font-semibold">Contrato & Ingreso</th>
                <th className="text-right py-3 px-3 font-semibold">Salario Básico</th>
                <th className="text-left py-3 px-3 font-semibold">Seguridad Social</th>
                <th className="text-right py-3 px-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No se encontraron colaboradores con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const hasTransport = emp.baseSalary <= legalParams.maxSalaryForTransport;
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-xs">
                            {emp.fullName
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">
                              {emp.fullName}
                            </p>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {emp.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ID */}
                      <td className="py-3 px-3 font-mono text-slate-700">
                        <span className="text-[10px] text-slate-400 font-sans mr-1">{emp.documentType}</span>
                        {emp.documentNumber}
                      </td>

                      {/* Position & Project */}
                      <td className="py-3 px-3">
                        <p className="font-medium text-slate-900">{emp.position}</p>
                        <p className="text-[11px] text-slate-500 truncate max-w-xs">{emp.project}</p>
                      </td>

                      {/* Contract & Dotación */}
                      <td className="py-3 px-3">
                        <p className="text-slate-700 font-medium">{emp.contractType}</p>
                        <p className="text-[11px] text-slate-500 font-mono">Desde: {emp.startDate}</p>
                        {emp.uniformSizes && (
                          <div className="mt-1 flex items-center gap-1 text-[10px]">
                            <Shirt className="w-3 h-3 text-blue-600 shrink-0" />
                            <span className="font-mono text-slate-600">
                              C:{emp.uniformSizes.shirt} P:{emp.uniformSizes.pants} Z:{emp.uniformSizes.shoes}
                            </span>
                            {hasTransport ? (
                              <span className="text-emerald-700 font-semibold" title="Califica para dotación Art. 230 CST">
                                · Art. 230
                              </span>
                            ) : (
                              <span className="text-slate-400" title="Supera 2 salarios mínimos">
                                · Exento
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Salary */}
                      <td className="py-3 px-3 text-right font-mono">
                        <span className="font-bold text-slate-900">
                          {formatCOP(emp.baseSalary)}
                        </span>
                        <div className="text-[10px]">
                          {hasTransport ? (
                            <span className="text-emerald-700 font-sans">+ Aux. Transp.</span>
                          ) : (
                            <span className="text-slate-400 font-sans">Sin auxilio (&gt;2 SMLMV)</span>
                          )}
                        </div>
                      </td>

                      {/* Social Security Providers */}
                      <td className="py-3 px-3 text-[11px] text-slate-600">
                        <p>
                          <span className="font-semibold text-slate-500">EPS:</span> {emp.eps}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-500">Pensión:</span> {emp.pensionFund}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-500">ARL:</span> {emp.arl} (Riesgo {emp.arlRiskLevel})
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingEmployee(emp)}
                            className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                            title="Ver ficha laboral detallada"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {rolePermissions.canEditEmployee && (
                            <button
                              onClick={() => handleEdit(emp)}
                              className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors"
                              title="Editar empleado"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}

                          {rolePermissions.canDeleteEmployee && (
                            <button
                              onClick={() => setDeletingId(emp.id)}
                              className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                              title="Eliminar empleado"
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

      {/* View Employee Detail Modal */}
      {viewingEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                  Ficha Laboral Oficial
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {viewingEmployee.fullName}
                </h3>
                <p className="text-xs text-slate-500">
                  {viewingEmployee.position} · {viewingEmployee.department}
                </p>
              </div>
              <button
                onClick={() => setViewingEmployee(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-500 font-medium">Documento:</span>
                  <p className="font-mono font-semibold text-slate-900">
                    {viewingEmployee.documentType} {viewingEmployee.documentNumber}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Tipo Contrato:</span>
                  <p className="font-semibold text-slate-900">{viewingEmployee.contractType}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Fecha de Inicio:</span>
                  <p className="font-mono text-slate-900">{viewingEmployee.startDate}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Salario Básico Mensual:</span>
                  <p className="font-mono font-bold text-blue-700 text-sm">
                    {formatCOP(viewingEmployee.baseSalary)}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2 uppercase text-[11px] tracking-wider">
                  Afiliaciones a Seguridad Social & Parafiscales
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div className="p-2 border border-slate-100 rounded">
                    <span className="text-slate-400 block text-[10px]">EPS</span>
                    <span className="font-medium">{viewingEmployee.eps}</span>
                  </div>
                  <div className="p-2 border border-slate-100 rounded">
                    <span className="text-slate-400 block text-[10px]">Fondo de Pensiones</span>
                    <span className="font-medium">{viewingEmployee.pensionFund}</span>
                  </div>
                  <div className="p-2 border border-slate-100 rounded">
                    <span className="text-slate-400 block text-[10px]">ARL (Riesgo {viewingEmployee.arlRiskLevel})</span>
                    <span className="font-medium">{viewingEmployee.arl}</span>
                  </div>
                  <div className="p-2 border border-slate-100 rounded">
                    <span className="text-slate-400 block text-[10px]">Caja de Compensación</span>
                    <span className="font-medium">{viewingEmployee.compensationBox}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2 uppercase text-[11px] tracking-wider">
                  Datos de Contacto & Dispersión Bancaria
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Correo Electrónico</span>
                    <span className="font-medium">{viewingEmployee.email || 'No registrado'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Teléfono / Celular</span>
                    <span className="font-medium">{viewingEmployee.phone || 'No registrado'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Entidad Bancaria</span>
                    <span className="font-medium">{viewingEmployee.bankName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Número de Cuenta</span>
                    <span className="font-mono font-medium">{viewingEmployee.bankAccount}</span>
                  </div>
                </div>
              </div>

              {/* Dotación Laboral de Calzado y Vestido (Art. 230 a 234 CST) */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <Shirt className="w-3.5 h-3.5 text-blue-700" />
                  Dotación de Calzado y Vestido de Labor (Art. 230 al 234 CST)
                </h4>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200/60">
                    <span className="text-slate-600 font-medium text-[11px]">Condición Legal:</span>
                    {viewingEmployee.baseSalary <= legalParams.maxSalaryForTransport ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        ✓ BENEFICIARIO (Salario ≤ 2 SMLMV)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        ✗ EXENTO (Supera 2 SMLMV - Art. 230 CST)
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-slate-700">
                    <div className="p-2 bg-white rounded border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Tipo Dotación</span>
                      <span className="font-medium text-[11px]">{viewingEmployee.uniformSizes?.uniformType || 'Oficina'}</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-100 text-center">
                      <span className="text-slate-400 block text-[10px]">Camisa/Blusa</span>
                      <span className="font-bold font-mono text-slate-900">{viewingEmployee.uniformSizes?.shirt || 'M'}</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-100 text-center">
                      <span className="text-slate-400 block text-[10px]">Pantalón/Jean</span>
                      <span className="font-bold font-mono text-slate-900">{viewingEmployee.uniformSizes?.pants || '30'}</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-100 text-center">
                      <span className="text-slate-400 block text-[10px]">Calzado</span>
                      <span className="font-bold font-mono text-blue-700">{viewingEmployee.uniformSizes?.shoes || '38'}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">
                    Suministro obligatorio cada 4 meses (30 Abr, 31 Ago, 20 Dic). Prohibido pagar en dinero (Art. 234 CST).
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-900">
                <span className="font-bold block text-[11px] mb-0.5">
                  Proyecto Institucional Asignado:
                </span>
                <p>{viewingEmployee.project}</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-end">
              <button
                onClick={() => setViewingEmployee(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium text-xs hover:bg-slate-800"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Create Employee Modal */}
      {isModalOpen && editingEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {employees.some((e) => e.id === editingEmployee.id)
                  ? 'Editar Información de Colaborador'
                  : 'Registrar Nuevo Colaborador'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSaveEmployee(editingEmployee);
                setIsModalOpen(false);
              }}
              className="py-4 space-y-4 text-xs"
            >
              {/* Row 1: Name and Document */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={editingEmployee.fullName}
                    onChange={(e) =>
                      setEditingEmployee({ ...editingEmployee, fullName: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    placeholder="Ej. Juan Carlos Gómez Montoya"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tipo Doc. *</label>
                  <select
                    value={editingEmployee.documentType}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        documentType: e.target.value as any,
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="CC">Cédula de Ciudadanía (CC)</option>
                    <option value="CE">Cédula de Extranjería (CE)</option>
                    <option value="TI">Tarjeta de Identidad (TI)</option>
                    <option value="PAS">Pasaporte</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Doc Number and Cargo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Número de Identificación *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEmployee.documentNumber}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        documentNumber: e.target.value,
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    placeholder="Ej. 1020456789"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Cargo *</label>
                  <input
                    type="text"
                    required
                    value={editingEmployee.position}
                    onChange={(e) =>
                      setEditingEmployee({ ...editingEmployee, position: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    placeholder="Ej. Auxiliar contable, Gerente, etc."
                  />
                </div>
              </div>

              {/* Row 3: Salary and Contract */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Salario Básico Mensual (COP) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingEmployee.baseSalary}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        baseSalary: Number(e.target.value),
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    {editingEmployee.baseSalary <= legalParams.maxSalaryForTransport
                      ? '✓ Tiene derecho a auxilio de transporte'
                      : '✗ Supera 2 SMLMV (sin auxilio)'}
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tipo Contrato *</label>
                  <select
                    value={editingEmployee.contractType}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        contractType: e.target.value as ContractType,
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="Término Indefinido">Término Indefinido</option>
                    <option value="Término Fijo">Término Fijo</option>
                    <option value="Obra o Labor">Obra o Labor</option>
                    <option value="Aprendizaje SENA">Aprendizaje SENA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Fecha de Ingreso *</label>
                  <input
                    type="date"
                    required
                    value={editingEmployee.startDate}
                    onChange={(e) =>
                      setEditingEmployee({ ...editingEmployee, startDate: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 4: Department & Project */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Departamento / Área</label>
                  <input
                    type="text"
                    value={editingEmployee.department}
                    onChange={(e) =>
                      setEditingEmployee({ ...editingEmployee, department: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Proyecto Asignado</label>
                  <input
                    type="text"
                    value={editingEmployee.project}
                    onChange={(e) =>
                      setEditingEmployee({ ...editingEmployee, project: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 5: Social Security Entidades */}
              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block mb-2">
                  Entidades de Seguridad Social
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">EPS</label>
                    <input
                      type="text"
                      value={editingEmployee.eps}
                      onChange={(e) =>
                        setEditingEmployee({ ...editingEmployee, eps: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Fondo Pensión</label>
                    <input
                      type="text"
                      value={editingEmployee.pensionFund}
                      onChange={(e) =>
                        setEditingEmployee({
                          ...editingEmployee,
                          pensionFund: e.target.value,
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">ARL & Riesgo</label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={editingEmployee.arl}
                        onChange={(e) =>
                          setEditingEmployee({ ...editingEmployee, arl: e.target.value })
                        }
                        className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                      />
                      <select
                        value={editingEmployee.arlRiskLevel}
                        onChange={(e) =>
                          setEditingEmployee({
                            ...editingEmployee,
                            arlRiskLevel: Number(e.target.value) as any,
                          })
                        }
                        className="border border-slate-300 rounded-lg px-1.5 py-1.5 text-xs"
                        title="Nivel de Riesgo ARL (1 a 5)"
                      >
                        <option value={1}>I (0.522%)</option>
                        <option value={2}>II (1.044%)</option>
                        <option value={3}>III (2.436%)</option>
                        <option value={4}>IV (4.350%)</option>
                        <option value={5}>V (6.960%)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Caja Compensación</label>
                    <input
                      type="text"
                      value={editingEmployee.compensationBox}
                      onChange={(e) =>
                        setEditingEmployee({
                          ...editingEmployee,
                          compensationBox: e.target.value,
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Row 6: Contact & Bank */}
              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block mb-2">
                  Contacto y Dispersión
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={editingEmployee.email}
                      onChange={(e) =>
                        setEditingEmployee({ ...editingEmployee, email: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                      placeholder="nombre@somosuno.org.co"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Teléfono</label>
                    <input
                      type="text"
                      value={editingEmployee.phone}
                      onChange={(e) =>
                        setEditingEmployee({ ...editingEmployee, phone: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                      placeholder="310 123 4567"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Banco</label>
                    <input
                      type="text"
                      value={editingEmployee.bankName}
                      onChange={(e) =>
                        setEditingEmployee({ ...editingEmployee, bankName: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Número de Cuenta</label>
                    <input
                      type="text"
                      value={editingEmployee.bankAccount}
                      onChange={(e) =>
                        setEditingEmployee({
                          ...editingEmployee,
                          bankAccount: e.target.value,
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Row 7: Dotación de Calzado y Vestido (Art. 230 a 234 CST) */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <Shirt className="w-3.5 h-3.5 text-blue-700" />
                    Dotación de Calzado y Vestido de Labor (Art. 230 a 234 CST)
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {editingEmployee.baseSalary <= legalParams.maxSalaryForTransport
                      ? '✓ Aplica suministro legal obligatorio'
                      : '✗ Exento (> 2 SMLMV)'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">Tipo de Dotación</label>
                    <select
                      value={editingEmployee.uniformSizes?.uniformType || 'Oficina / Administrativo'}
                      onChange={(e) =>
                        setEditingEmployee({
                          ...editingEmployee,
                          uniformSizes: {
                            shirt: editingEmployee.uniformSizes?.shirt || 'M',
                            pants: editingEmployee.uniformSizes?.pants || '30',
                            shoes: editingEmployee.uniformSizes?.shoes || '38',
                            uniformType: e.target.value as any,
                          },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                    >
                      <option value="Oficina / Administrativo">Oficina / Administrativo</option>
                      <option value="Campo / Proyecto Social">Campo / Proyecto Social</option>
                      <option value="Operativo">Operativo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Talla Camisa / Blusa</label>
                    <input
                      type="text"
                      value={editingEmployee.uniformSizes?.shirt || ''}
                      onChange={(e) =>
                        setEditingEmployee({
                          ...editingEmployee,
                          uniformSizes: {
                            uniformType: editingEmployee.uniformSizes?.uniformType || 'Oficina / Administrativo',
                            pants: editingEmployee.uniformSizes?.pants || '30',
                            shoes: editingEmployee.uniformSizes?.shoes || '38',
                            shirt: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
                      placeholder="M, S, L, XL"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Talla Pantalón / Jean</label>
                    <input
                      type="text"
                      value={editingEmployee.uniformSizes?.pants || ''}
                      onChange={(e) =>
                        setEditingEmployee({
                          ...editingEmployee,
                          uniformSizes: {
                            uniformType: editingEmployee.uniformSizes?.uniformType || 'Oficina / Administrativo',
                            shirt: editingEmployee.uniformSizes?.shirt || 'M',
                            shoes: editingEmployee.uniformSizes?.shoes || '38',
                            pants: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
                      placeholder="28, 30, 32, 34"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Talla Calzado</label>
                    <input
                      type="text"
                      value={editingEmployee.uniformSizes?.shoes || ''}
                      onChange={(e) =>
                        setEditingEmployee({
                          ...editingEmployee,
                          uniformSizes: {
                            uniformType: editingEmployee.uniformSizes?.uniformType || 'Oficina / Administrativo',
                            shirt: editingEmployee.uniformSizes?.shirt || 'M',
                            pants: editingEmployee.uniformSizes?.pants || '30',
                            shoes: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
                      placeholder="37, 38, 40, 41"
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-2">
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
                  Guardar Información
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-xl">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  ¿Confirmar eliminación del colaborador?
                </h3>
                <p className="text-xs text-slate-500">
                  Esta acción eliminará el registro del empleado y sus liquidaciones asociadas.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-3.5 py-2 border border-slate-300 rounded-lg text-slate-700 text-xs font-medium hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Sí, Eliminar Registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
