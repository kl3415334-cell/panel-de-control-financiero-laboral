import React, { useState } from 'react';
import {
  Shirt,
  PackageCheck,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  Edit2,
  FileText,
  ShieldAlert,
  Info,
  X,
  Plus,
} from 'lucide-react';
import {
  Employee,
  LegalParameters,
  RoleType,
  UniformDelivery,
} from '../types/payroll';
import { exportToCSV, formatCOP } from '../utils/calculations';
import { USER_ROLES } from '../data/initialData';

interface UniformModuleProps {
  employees: Employee[];
  deliveries: UniformDelivery[];
  legalParams: LegalParameters;
  currentRole: RoleType;
  onSaveDelivery: (delivery: UniformDelivery) => void;
  onUpdateEmployeeSizes: (
    employeeId: string,
    sizes: NonNullable<Employee['uniformSizes']>,
    costPerDelivery: number
  ) => void;
}

export const UniformModule: React.FC<UniformModuleProps> = ({
  employees,
  deliveries,
  legalParams,
  currentRole,
  onSaveDelivery,
  onUpdateEmployeeSizes,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'sizes' | 'deliveries' | 'acta' | 'normativa'>('sizes');
  const [selectedPeriodFilter, setSelectedPeriodFilter] = useState<string>('all');
  const [editingEmployeeSizes, setEditingEmployeeSizes] = useState<Employee | null>(null);
  const [selectedActaDelivery, setSelectedActaDelivery] = useState<UniformDelivery | null>(null);
  const [editingDelivery, setEditingDelivery] = useState<UniformDelivery | null>(null);

  const canEdit = USER_ROLES[currentRole].permissions.canRegisterNovelty || currentRole === 'admin' || currentRole === 'gerente';

  // Qualifying employees (<= 2 SMLMV = $3.501.810)
  const qualifyingEmployees = employees.filter(
    (e) => e.baseSalary <= legalParams.maxSalaryForTransport
  );
  const nonQualifyingEmployees = employees.filter(
    (e) => e.baseSalary > legalParams.maxSalaryForTransport
  );

  // Total cost per delivery
  const totalCostPerDelivery = qualifyingEmployees.reduce(
    (acc, emp) => acc + (emp.uniformCostPerDelivery || 250000),
    0
  );
  // Annual cost (3 deliveries)
  const totalAnnualCost = totalCostPerDelivery * 3;
  // Monthly provision
  const monthlyProvision = totalAnnualCost / 12;

  // Filtered deliveries
  const filteredDeliveries = deliveries.filter((d) => {
    if (selectedPeriodFilter === 'all') return true;
    return d.periodName.includes(selectedPeriodFilter);
  });

  // Handle Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Documento',
      'Empleado',
      'Cargo',
      'Salario Basico',
      'Derecho Legal (<= 2 SMLMV)',
      'Tipo Dotacion',
      'Talla Camisa/Blusa',
      'Talla Pantalon/Jean',
      'Talla Calzado',
      'Costo Estimado Entrega',
      'Provision Mensual',
    ];
    const rows = employees.map((emp) => {
      const qualifies = emp.baseSalary <= legalParams.maxSalaryForTransport;
      const cost = qualifies ? (emp.uniformCostPerDelivery || 250000) : 0;
      return [
        emp.documentNumber,
        emp.fullName,
        emp.position,
        Math.round(emp.baseSalary),
        qualifies ? 'SI APLICA (Art. 230 CST)' : 'NO APLICA (> 2 SMLMV)',
        emp.uniformSizes?.uniformType || 'Oficina / Administrativo',
        emp.uniformSizes?.shirt || 'M',
        emp.uniformSizes?.pants || '30',
        emp.uniformSizes?.shoes || '38',
        Math.round(cost),
        Math.round((cost * 3) / 12),
      ];
    });
    exportToCSV('Dotaciones_Laborales_Somos_Uno_2026', headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Shirt className="w-4 h-4" />
                Artículos 230 a 234 del Código Sustantivo del Trabajo
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-blue-200 font-mono">Calzado y Vestido de Labor</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Gestión & Control de Dotaciones Laborales
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Suministro obligatorio gratuito cada 4 meses para trabajadores que devenguen hasta dos (2) salarios mínimos vigentes ($3.501.810) con más de 3 meses de servicio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Exportar Tallas (.csv)
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Imprimir Registro
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Beneficiarios con derecho */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Beneficiarios Legales</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {qualifyingEmployees.length} de {employees.length}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              75% califica
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Salario ≤ 2 SMLMV ($3.501.810)
          </p>
        </div>

        {/* Exentos por Ley */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Exento por Tope Salarial</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {nonQualifyingEmployees.length}
            </span>
            <span className="text-xs text-slate-500">Gerente General</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Devenga $4.500.000 (&gt;2 SMLMV)
          </p>
        </div>

        {/* Costo por Entrega */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Costo por Entrega</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums text-blue-900">
              {formatCOP(totalCostPerDelivery)}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            3 entregas anuales obligatorias
          </p>
        </div>

        {/* Provisión Mensual Contable */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Provisión Mensual</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums text-amber-800">
              {formatCOP(monthlyProvision)}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Presupuesto anual: {formatCOP(totalAnnualCost)}
          </p>
        </div>
      </div>

      {/* Legal Deadlines Banner (Art. 232 CST) */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">
              Fechas de Entrega Legal Obligatoria en Colombia (Art. 232 CST)
            </h4>
            <p className="text-amber-800 text-[11px] mt-0.5">
              1ª Entrega: <strong className="text-slate-900">30 de Abril</strong> · 2ª Entrega: <strong className="text-slate-900">31 de Agosto</strong> · 3ª Entrega: <strong className="text-slate-900">20 de Diciembre</strong>.
              <span className="text-slate-600 ml-1">Prohibido compensar en dinero (Art. 234 CST).</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <span className="px-2.5 py-1 bg-white border border-amber-300 rounded font-mono font-bold text-amber-800">
            Año 2026 Vigente
          </span>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto no-print">
        <button
          onClick={() => setActiveSubTab('sizes')}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'sizes'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Shirt className="w-4 h-4" />
          <span>Ficha de Tallas por Empleado</span>
        </button>

        <button
          onClick={() => setActiveSubTab('deliveries')}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'deliveries'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>Control de Entregas Cuatrimestrales ({deliveries.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('acta')}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'acta'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Acta Oficial de Entrega (PDF / Imprimible)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('normativa')}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'normativa'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Normatividad & Tratamiento Contable</span>
        </button>
      </div>

      {/* SubTab 1: Tallas y Ficha de Dotación */}
      {activeSubTab === 'sizes' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Registro de Tallas y Asignación de Calzado y Vestido de Labor
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verificación de derecho según devengo legal (Art. 230 CST) y registro individual de tallas.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Límite 2 SMLMV: <strong className="text-slate-900 font-bold">{formatCOP(legalParams.maxSalaryForTransport)}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-4 text-left">Colaborador</th>
                  <th className="py-3 px-3 text-left">Cargo</th>
                  <th className="py-3 px-3 text-right">Salario Básico</th>
                  <th className="py-3 px-3 text-center">Derecho Legal</th>
                  <th className="py-3 px-3 text-left">Tipo de Dotación</th>
                  <th className="py-3 px-2 text-center">Camisa</th>
                  <th className="py-3 px-2 text-center">Pantalón</th>
                  <th className="py-3 px-2 text-center">Calzado</th>
                  <th className="py-3 px-3 text-right">Costo / Entrega</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => {
                  const qualifies = emp.baseSalary <= legalParams.maxSalaryForTransport;
                  const cost = qualifies ? (emp.uniformCostPerDelivery || 250000) : 0;
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900">{emp.fullName}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{emp.documentType} {emp.documentNumber}</p>
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium">
                        {emp.position}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-slate-900">
                        {formatCOP(emp.baseSalary)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {qualifies ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Aplica Art. 230
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            Exento (&gt; 2 SMLMV)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        <span className="font-medium">{emp.uniformSizes?.uniformType || 'Oficina / Administrativo'}</span>
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-slate-800">
                        {emp.uniformSizes?.shirt || 'M'}
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-slate-800">
                        {emp.uniformSizes?.pants || '30'}
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-blue-700">
                        {emp.uniformSizes?.shoes || '38'}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        {cost > 0 ? formatCOP(cost) : <span className="text-slate-400">$0</span>}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {canEdit && (
                          <button
                            onClick={() => setEditingEmployeeSizes(emp)}
                            className="p-1.5 text-blue-700 hover:bg-blue-50 rounded transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                            title="Editar tallas y dotación"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Tallas</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-200 text-slate-900 text-xs">
                <tr>
                  <td colSpan={8} className="py-3 px-4 text-right">
                    TOTAL ESTIMADO POR CADA ENTREGA (3 BENEFICIARIOS):
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-blue-900">
                    {formatCOP(totalCostPerDelivery)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* SubTab 2: Control de Entregas Cuatrimestrales */}
      {activeSubTab === 'deliveries' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Filtrar Ciclo Legal:</span>
              <select
                value={selectedPeriodFilter}
                onChange={(e) => setSelectedPeriodFilter(e.target.value)}
                className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">Todas las entregas del año (9 registros)</option>
                <option value="30 de Abril">1ª Entrega (30 de Abril) - Realizadas</option>
                <option value="31 de Agosto">2ª Entrega (31 de Agosto) - Realizadas</option>
                <option value="20 de Diciembre">3ª Entrega (20 de Diciembre) - Programadas</option>
              </select>
            </div>

            <div className="text-xs text-slate-500">
              Mostrando <strong className="text-slate-900">{filteredDeliveries.length}</strong> entregas registradas
            </div>
          </div>

          {/* Deliveries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDeliveries.map((delivery) => {
              const emp = employees.find((e) => e.id === delivery.employeeId);
              const isDelivered = delivery.status === 'entregado';

              return (
                <div
                  key={delivery.id}
                  className={`bg-white rounded-xl border p-5 shadow-sm transition-all flex flex-col justify-between ${
                    isDelivered ? 'border-slate-200' : 'border-amber-200 bg-amber-50/20'
                  }`}
                >
                  <div>
                    {/* Top Status */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
                          {delivery.periodName}
                        </span>
                        <p className="text-xs text-slate-500">Plazo legal: {delivery.legalDeadline}</p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isDelivered
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {delivery.status}
                      </span>
                    </div>

                    {/* Employee info */}
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 mb-3">
                      <h4 className="font-bold text-slate-900 text-xs">{emp?.fullName}</h4>
                      <p className="text-[11px] text-slate-600">{emp?.position}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 font-mono">
                        <span>Tallas: C:{emp?.uniformSizes?.shirt || 'M'} · P:{emp?.uniformSizes?.pants || '30'} · Z:{emp?.uniformSizes?.shoes || '38'}</span>
                        <span className="font-bold text-slate-800">{formatCOP(delivery.estimatedCost)}</span>
                      </div>
                    </div>

                    {/* Items Delivered List */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
                        Prendas Suministradas:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-600 pl-1">
                        {delivery.itemsDelivered.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {delivery.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-3 bg-slate-50/50 p-2 rounded border border-slate-100">
                        "{delivery.notes}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      {delivery.signedReceipt ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Acta Firmada
                        </span>
                      ) : (
                        <span className="text-amber-700 font-semibold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Pendiente Firma
                        </span>
                      )}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedActaDelivery(delivery);
                        setActiveSubTab('acta');
                      }}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Ver Acta
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SubTab 3: Acta Oficial de Entrega de Dotación (Imprimible / PDF) */}
      {activeSubTab === 'acta' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Seleccionar entrega para el Acta:</span>
              <select
                value={selectedActaDelivery?.id || deliveries[0]?.id}
                onChange={(e) => {
                  const d = deliveries.find((del) => del.id === e.target.value);
                  if (d) setSelectedActaDelivery(d);
                }}
                className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-slate-800"
              >
                {deliveries.map((del) => {
                  const emp = employees.find((e) => e.id === del.employeeId);
                  return (
                    <option key={del.id} value={del.id}>
                      {del.periodName} - {emp?.fullName} ({emp?.position})
                    </option>
                  );
                })}
              </select>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Printer className="w-4 h-4" />
              Imprimir / Guardar Acta en PDF
            </button>
          </div>

          {/* Printable Acta Document */}
          {(() => {
            const currentActa = selectedActaDelivery || deliveries[0];
            const emp = employees.find((e) => e.id === currentActa?.employeeId) || employees[0];

            return (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 print:p-0 print:border-none print:shadow-none space-y-6 max-w-3xl mx-auto">
                {/* Header */}
                <div className="border-b-2 border-slate-800 pb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-900 text-white font-black flex items-center justify-center text-sm border border-amber-400">
                      SU
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900 text-base">
                        CORPORACIÓN SOCIAL SOMOS UNO
                      </h2>
                      <p className="text-xs text-slate-600">NIT: 901.458.239-1 · Teusaquillo, Bogotá D.C.</p>
                      <p className="text-xs font-bold text-blue-800 mt-0.5">
                        ACTA OFICIAL INDIVIDUAL DE ENTREGA DE DOTACIÓN LABORAL
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-xs font-mono text-slate-600">
                    <p className="font-bold text-slate-900">Acta No. {currentActa?.id.toUpperCase()}</p>
                    <p>Fecha: {currentActa?.deliveryDate || currentActa?.legalDeadline}</p>
                    <p>CST Art. 230 - 234</p>
                  </div>
                </div>

                {/* Legal Context */}
                <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p>
                    En cumplimiento de lo ordenado por los <strong>Artículos 230 y 232 del Código Sustantivo del Trabajo (CST)</strong>, el suscrito empleador <strong>CORPORACIÓN SOCIAL SOMOS UNO</strong> hace entrega formal, gratuita y en especie del calzado y vestido de labor correspondiente al ciclo cuatrimestral <strong>{currentActa?.periodName}</strong> al colaborador cuyos datos se relacionan a continuación:
                  </p>
                </div>

                {/* Employee Data */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-white p-4 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Nombre del Trabajador:</span>
                    <strong className="text-slate-900">{emp.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Documento de Identidad:</span>
                    <strong className="text-slate-900 font-mono">{emp.documentType} {emp.documentNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Cargo / Dependencia:</span>
                    <strong className="text-slate-900">{emp.position} · {emp.department}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Salario Básico Mensual:</span>
                    <strong className="text-slate-900 font-mono">{formatCOP(emp.baseSalary)} (≤ 2 SMLMV)</strong>
                  </div>
                </div>

                {/* Items Detail */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Detalle de Prendas y Calzado Entregados:
                  </h4>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="min-w-full text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-semibold">
                        <tr>
                          <th className="py-2 px-3 text-left">Ítem / Descripción</th>
                          <th className="py-2 px-3 text-center">Talla</th>
                          <th className="py-2 px-3 text-center">Cantidad</th>
                          <th className="py-2 px-3 text-right">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {currentActa?.itemsDelivered.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-2 px-3 font-sans text-slate-800">{item}</td>
                            <td className="py-2 px-3 text-center font-bold text-blue-800">
                              {idx === 0 ? emp.uniformSizes?.shoes : idx === 1 ? emp.uniformSizes?.pants : emp.uniformSizes?.shirt}
                            </td>
                            <td className="py-2 px-3 text-center">1 Unidad / Par</td>
                            <td className="py-2 px-3 text-right text-emerald-700 font-semibold">Nuevo / Conforme</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Clauses & Legal Commitments (Art. 233 CST) */}
                <div className="text-[11px] text-slate-600 space-y-2 border-t border-slate-200 pt-3">
                  <p>
                    <strong>CLÁUSULA PRIMERA - OBLIGACIÓN DE USO (Art. 233 CST):</strong> El trabajador declara recibir a entera satisfacción las prendas y calzado descritos y se compromete formalmente a destinarlos exclusivamente al desempeño de sus funciones en la Corporación Social Somos Uno. En caso de no utilizarlos en el servicio contratado, el empleador quedará legalmente eximido de suministrarle la dotación del período siguiente.
                  </p>
                  <p>
                    <strong>CLÁUSULA SEGUNDA - PROHIBICIÓN DE COMPENSACIÓN EN DINERO (Art. 234 CST):</strong> Ambas partes dejan constancia expresa de que este suministro se efectúa totalmente en especie y de forma gratuita, sin costo para el colaborador, acatando la prohibición legal de compensación dineraria.
                  </p>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-12 pt-16 border-t border-slate-200 text-xs">
                  <div className="text-center">
                    <div className="border-t border-slate-600 pt-2 font-bold text-slate-900">
                      {emp.fullName}
                    </div>
                    <p className="text-slate-500 text-[11px]">C.C. {emp.documentNumber}</p>
                    <p className="text-slate-600 font-medium text-[11px]">Firma del Trabajador Beneficiario</p>
                    <div className="mt-3 inline-block w-24 h-28 border border-slate-300 rounded text-[9px] text-slate-400 p-1">
                      Huella dactilar
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="border-t border-slate-600 pt-2 font-bold text-slate-900">
                      Martha Lucia Ríos / Fernando Salazar V.
                    </div>
                    <p className="text-slate-500 text-[11px]">Talento Humano / Gerencia General</p>
                    <p className="text-slate-600 font-medium text-[11px]">Corporación Social Somos Uno</p>
                    <p className="text-[10px] text-slate-400 mt-2">NIT 901.458.239-1</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* SubTab 4: Normatividad y Tratamiento Contable */}
      {activeSubTab === 'normativa' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldAlert className="w-5 h-5 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Marco Normativo Colombiano (Art. 230 a 234 CST)
              </h3>
            </div>

            <div className="space-y-3 text-slate-700">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-bold text-slate-900 block mb-1">
                  Artículo 230 - Obligación de suministro:
                </span>
                <p>
                  Todo empleador que habitualmente ocupe trabajadores permanentes deberá suministrar cada cuatro (4) meses, en forma gratuita, un (1) par de zapatos y un (1) vestido de labor al trabajador cuya remuneración mensual sea hasta dos (2) veces el salario mínimo legal vigente ($3.501.810 en 2026), que haya cumplido más de 3 meses de servicio.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-bold text-slate-900 block mb-1">
                  Artículo 232 - Fechas obligatorias de entrega:
                </span>
                <p>
                  Los empleadores obligados deberán suministrar el calzado y vestido en las siguientes fechas fijadas por la ley: <strong>30 de abril</strong>, <strong>31 de agosto</strong> y <strong>20 de diciembre</strong> de cada año calendario.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-bold text-slate-900 block mb-1">
                  Artículo 233 - Obligación de uso por el trabajador:
                </span>
                <p>
                  El trabajador queda obligado a destinar a su uso en las labores contratadas el calzado y vestido que le suministre el empleador. Si no lo hace, el empleador queda eximido de hacerle el suministro del período siguiente.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
                <span className="font-bold block mb-1">
                  Artículo 234 - Prohibición de compensación en dinero:
                </span>
                <p>
                  Queda terminantemente prohibido a los empleadores pagar en dinero las prestaciones establecidas en este capítulo. La única excepción admitida por la jurisprudencia de la Corte Suprema ocurre al terminar el contrato sin haberse suministrado la dotación causada, en cuyo caso procede indemnización de perjuicios.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="w-5 h-5 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Tratamiento Contable y Presupuestal en Somos Uno
              </h3>
            </div>

            <div className="space-y-3 text-slate-700">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-bold text-slate-900 block mb-1">
                  Naturaleza no salarial:
                </span>
                <p>
                  Conforme al Artículo 128 del CST, la dotación de calzado y vestido de labor no constituye salario. En consecuencia:
                </p>
                <ul className="list-disc pl-4 mt-1 space-y-0.5 text-slate-600">
                  <li>No forma base para el cálculo de aportes a Salud ni Pensión.</li>
                  <li>No integra la base para aportes a Parafiscales (Caja, SENA, ICBF).</li>
                  <li>No se tiene en cuenta para liquidar prestaciones sociales.</li>
                </ul>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 text-blue-900">
                <span className="font-bold block mb-1">
                  Provisión Presupuestal y Contable:
                </span>
                <p>
                  Aunque se entrega 3 veces al año, financieramente la Corporación Social Somos Uno provisiona mensualmente el costo estimado para evitar desequilibrios en el flujo de caja:
                </p>
                <div className="mt-2 font-mono font-bold text-blue-800 bg-white p-2 rounded border border-blue-200">
                  Provisión Mensual = (Costo por Entrega × 3) / 12 = $200.000 / mes
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-bold text-slate-900 block mb-1">
                  Custodia y Auditoría:
                </span>
                <p>
                  Cada entrega cuenta con un Acta Oficial debidamente firmada por el colaborador y talento humano, que se archiva en la carpeta física y digital para inspección del Ministerio de Trabajo o auditoría tributaria (DIAN).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Sizes Modal */}
      {editingEmployeeSizes && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Actualizar Tallas de Dotación
                </h3>
                <p className="text-xs text-slate-500">
                  {editingEmployeeSizes.fullName} ({editingEmployeeSizes.position})
                </p>
              </div>
              <button
                onClick={() => setEditingEmployeeSizes(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const shirt = (form.elements.namedItem('shirt') as HTMLInputElement).value;
                const pants = (form.elements.namedItem('pants') as HTMLInputElement).value;
                const shoes = (form.elements.namedItem('shoes') as HTMLInputElement).value;
                const uniformType = (form.elements.namedItem('uniformType') as HTMLSelectElement).value as any;
                const cost = Number((form.elements.namedItem('cost') as HTMLInputElement).value);

                onUpdateEmployeeSizes(
                  editingEmployeeSizes.id,
                  { shirt, pants, shoes, uniformType },
                  cost
                );
                setEditingEmployeeSizes(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-medium mb-1">Tipo de Dotación</label>
                <select
                  name="uniformType"
                  defaultValue={editingEmployeeSizes.uniformSizes?.uniformType || 'Oficina / Administrativo'}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                >
                  <option value="Oficina / Administrativo">Oficina / Administrativo</option>
                  <option value="Campo / Proyecto Social">Campo / Proyecto Social</option>
                  <option value="Operativo">Operativo</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Talla Camisa</label>
                  <input
                    type="text"
                    name="shirt"
                    required
                    defaultValue={editingEmployeeSizes.uniformSizes?.shirt || 'M'}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Talla Pantalón</label>
                  <input
                    type="text"
                    name="pants"
                    required
                    defaultValue={editingEmployeeSizes.uniformSizes?.pants || '30'}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Talla Calzado</label>
                  <input
                    type="text"
                    name="shoes"
                    required
                    defaultValue={editingEmployeeSizes.uniformSizes?.shoes || '38'}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Costo Estimado de Dotación por Entrega (COP)
                </label>
                <input
                  type="number"
                  name="cost"
                  required
                  min={0}
                  step={5000}
                  defaultValue={editingEmployeeSizes.uniformCostPerDelivery ?? 250000}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-bold"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEmployeeSizes(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-sm"
                >
                  Guardar Tallas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
