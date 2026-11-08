import React, { useState } from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Calendar,
  Building,
  ShieldAlert,
  ArrowUpRight,
  PieChart as PieChartIcon,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sliders,
  Sparkles,
  Shirt,
} from 'lucide-react';
import {
  Employee,
  EmployeeLiquidation,
  LegalParameters,
  PayrollFrequency,
} from '../types/payroll';
import { formatCOP, formatNumber } from '../utils/calculations';
import { ActiveTab } from './Sidebar';

interface DashboardProps {
  employees: Employee[];
  liquidations: EmployeeLiquidation[];
  totals: ReturnType<typeof import('../utils/calculations').calculatePayrollTotals>;
  frequency: PayrollFrequency;
  periodNumber: number;
  includeNovelties: boolean;
  onNavigateTab: (tab: ActiveTab) => void;
  onUpdateEmployeeSalary: (id: string, newSalary: number) => void;
  legalParams: LegalParameters;
}

export const Dashboard: React.FC<DashboardProps> = ({
  employees,
  liquidations,
  totals,
  frequency,
  periodNumber,
  includeNovelties,
  onNavigateTab,
  onUpdateEmployeeSalary,
  legalParams,
}) => {
  const [simulationSalary, setSimulationSalary] = useState<{ [id: string]: number }>({});

  // Frecuencia texto
  const periodLabel =
    frequency === 'decenal'
      ? `Período Decenal ${periodNumber} (10 días)`
      : frequency === 'quincenal'
      ? `Período Quincenal ${periodNumber} (15 días)`
      : 'Mes Completo (30 días)';

  // Proporciones porcentuales para gráficos de barras
  const totalCost = totals.totalCostoEmpresa || 1;
  const pctSalarios = ((totals.totalDevengado - totals.totalAuxilioTransporte) / totalCost) * 100;
  const pctAuxilio = (totals.totalAuxilioTransporte / totalCost) * 100;
  const pctSeguridad = (totals.totalSeguridadSocialEmpleador / totalCost) * 100;
  const pctParafiscales = (totals.totalParafiscales / totalCost) * 100;
  const pctPrestaciones = (totals.totalPrestaciones / totalCost) * 100;

  // Agrupación por proyectos
  const projectCosts: { [key: string]: { devengado: number; costoTotal: number; count: number } } = {};
  liquidations.forEach((liq) => {
    const proj = liq.employee.project || 'General';
    if (!projectCosts[proj]) {
      projectCosts[proj] = { devengado: 0, costoTotal: 0, count: 0 };
    }
    projectCosts[proj].devengado += liq.totalDevengado;
    projectCosts[proj].costoTotal += liq.costoTotalEmpresa;
    projectCosts[proj].count += 1;
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Panel de Control Financiero & Laboral
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-300 font-mono">
                {includeNovelties ? 'Escenario con novedades' : 'Escenario base de referencia'}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Corporación Social Somos Uno
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Control presupuestal, liquidación y auditoría de nómina conforme a la legislación laboral colombiana vigente para el período 2026.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateTab('payroll')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <DollarSign className="w-4 h-4" />
              Liquidar Nómina
            </button>
            <button
              onClick={() => onNavigateTab('uniforms')}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <Shirt className="w-4 h-4" />
              Dotaciones (Art. 230)
            </button>
            <button
              onClick={() => onNavigateTab('reports')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              Ver Informes
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Empleados */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Empleados</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {employees.length}
            </span>
            <span className="text-xs text-emerald-600 font-medium">100% Activos</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            4 cargos simulados (Indefinido)
          </p>
        </div>

        {/* Total Nómina Período (Devengado) */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Nómina Bruta (Devengados)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
              {formatCOP(totals.totalDevengado)}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 truncate">
            {periodLabel}
          </p>
        </div>

        {/* Neto a Pagar */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Neto a Dispersar</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums text-emerald-700">
              {formatCOP(totals.totalNetoPagar)}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Deducciones: {formatCOP(totals.totalDeducciones)}
          </p>
        </div>

        {/* Costo Total Empleador */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Costo Total Empresa</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums text-indigo-900">
              {formatCOP(totals.totalCostoEmpresa)}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Incluye prestaciones & PILA
          </p>
        </div>

      </div>

      {/* Dotaciones Laborales Banner Card (Art. 230 a 234 CST) */}
      <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-blue-50/70 via-white to-amber-50/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Shirt className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Dotaciones Laborales de Calzado y Vestido (Art. 230 al 234 CST)
              </h4>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold">
                3 de 4 Colaboradores Califican
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Suministro obligatorio gratuito cada 4 meses (30 Abr, 31 Ago, 20 Dic) para salarios ≤ 2 SMLMV ($3.501.810). Costo por entrega: <strong>$800.000</strong> · Provisión mensual: <strong>$200.000</strong>.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('uniforms')}
          className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 self-start md:self-auto shrink-0"
        >
          <Shirt className="w-3.5 h-3.5" />
          Ver Ficha de Tallas & Entregas
        </button>
      </div>

      {/* Second Row: Detailed Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Prestaciones Sociales Acumuladas */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Prestaciones Sociales</h3>
              <p className="text-xs text-slate-500">Provisiones del período actual</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              {formatCOP(totals.totalPrestaciones)}
            </span>
          </div>

          <div className="mt-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Cesantías (8.33%):</span>
              <span className="font-mono font-semibold text-slate-900">
                {formatCOP(totals.totalCesantias)}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Intereses a las Cesantías (1%):</span>
              <span className="font-mono font-semibold text-slate-900">
                {formatCOP(totals.totalInteresesCesantias)}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Prima de Servicios (8.33%):</span>
              <span className="font-mono font-semibold text-slate-900">
                {formatCOP(totals.totalPrima)}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Vacaciones (4.167%):</span>
              <span className="font-mono font-semibold text-slate-900">
                {formatCOP(totals.totalVacaciones)}
              </span>
            </div>
          </div>
        </div>

        {/* Seguridad Social & Riesgos (Empleador) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Seguridad Social Patronal</h3>
              <p className="text-xs text-slate-500">Aportes institucionales</p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              {formatCOP(totals.totalSeguridadSocialEmpleador)}
            </span>
          </div>

          <div className="mt-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Salud Empleador (8.5%):</span>
              <span className="font-mono font-semibold text-slate-900">
                {formatCOP(totals.totalSaludEmpleador)}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Pensión Empleador (12%):</span>
              <span className="font-mono font-semibold text-slate-900">
                {formatCOP(totals.totalPensionEmpleador)}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>ARL Riesgo I (0.522%):</span>
              <span className="font-mono font-semibold text-slate-900">
                {formatCOP(totals.totalArl)}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-100">
              <span className="text-slate-500">IBC Base Nómina:</span>
              <span className="font-mono text-slate-700">
                {formatCOP(totals.totalIbc)}
              </span>
            </div>
          </div>
        </div>

        {/* Parafiscales */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Aportes Parafiscales</h3>
              <p className="text-xs text-slate-500">Tarifa legal 9% sobre salarios</p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              {formatCOP(totals.totalParafiscales)}
            </span>
          </div>

          <div className="mt-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Caja Compensación (4%):</span>
              <span className="font-mono font-semibold text-slate-900">
                {formatCOP(totals.totalCaja)}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>SENA (2%):</span>
              <span className="font-mono font-semibold text-slate-900">
                {formatCOP(totals.totalSena)}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>ICBF (3%):</span>
              <span className="font-mono font-semibold text-slate-900">
                {formatCOP(totals.totalIcbf)}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-100">
              <span className="text-slate-500">Exoneración 114-1 E.T.:</span>
              <span className="font-semibold text-slate-700">
                {legalParams.isExemptArticle114 ? 'Activa' : 'Inactiva (Completo 9%)'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Third Row: Visual Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cost Structure Breakdown Bar Visualizer */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Estructura del Costo Laboral Corporativo
              </h3>
              <p className="text-xs text-slate-500">
                Distribución porcentual de cada componente en el presupuesto total
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-800">
              {formatCOP(totals.totalCostoEmpresa)} (100%)
            </span>
          </div>

          {/* Segmented bar */}
          <div className="h-6 w-full rounded-lg overflow-hidden flex shadow-inner bg-slate-100">
            <div
              style={{ width: `${pctSalarios}%` }}
              className="bg-blue-600 hover:opacity-90 transition-all"
              title={`Salarios Básicos: ${pctSalarios.toFixed(1)}%`}
            ></div>
            <div
              style={{ width: `${pctAuxilio}%` }}
              className="bg-cyan-500 hover:opacity-90 transition-all"
              title={`Auxilio Transporte: ${pctAuxilio.toFixed(1)}%`}
            ></div>
            <div
              style={{ width: `${pctPrestaciones}%` }}
              className="bg-amber-500 hover:opacity-90 transition-all"
              title={`Prestaciones Sociales: ${pctPrestaciones.toFixed(1)}%`}
            ></div>
            <div
              style={{ width: `${pctSeguridad}%` }}
              className="bg-indigo-600 hover:opacity-90 transition-all"
              title={`Seguridad Social Empleador: ${pctSeguridad.toFixed(1)}%`}
            ></div>
            <div
              style={{ width: `${pctParafiscales}%` }}
              className="bg-emerald-600 hover:opacity-90 transition-all"
              title={`Parafiscales: ${pctParafiscales.toFixed(1)}%`}
            ></div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-blue-600 shrink-0"></span>
              <div>
                <p className="text-[11px] text-slate-500">Salarios</p>
                <p className="font-semibold text-slate-800 font-mono">{pctSalarios.toFixed(1)}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-cyan-500 shrink-0"></span>
              <div>
                <p className="text-[11px] text-slate-500">Aux. Transporte</p>
                <p className="font-semibold text-slate-800 font-mono">{pctAuxilio.toFixed(1)}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-amber-500 shrink-0"></span>
              <div>
                <p className="text-[11px] text-slate-500">Prestaciones</p>
                <p className="font-semibold text-slate-800 font-mono">{pctPrestaciones.toFixed(1)}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-indigo-600 shrink-0"></span>
              <div>
                <p className="text-[11px] text-slate-500">Seg. Social</p>
                <p className="font-semibold text-slate-800 font-mono">{pctSeguridad.toFixed(1)}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-emerald-600 shrink-0"></span>
              <div>
                <p className="text-[11px] text-slate-500">Parafiscales</p>
                <p className="font-semibold text-slate-800 font-mono">{pctParafiscales.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Distribution by Position table */}
          <div className="mt-6 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Costos por Cargo (Simulacro 4 Trabajadores)
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="text-left py-2 font-medium">Cargo</th>
                    <th className="text-right py-2 font-medium">Básico</th>
                    <th className="text-right py-2 font-medium">Auxilio</th>
                    <th className="text-right py-2 font-medium">Deducciones</th>
                    <th className="text-right py-2 font-medium">Neto Trabajador</th>
                    <th className="text-right py-2 font-medium text-blue-800">Dotación (Entrega)</th>
                    <th className="text-right py-2 font-medium">Costo Total Empresa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {liquidations.map((liq) => (
                    <tr key={liq.employee.id} className="hover:bg-slate-50/80">
                      <td className="py-2.5 font-sans font-medium text-slate-900">
                        {liq.employee.position}
                      </td>
                      <td className="text-right py-2.5 text-slate-700">
                        {formatCOP(liq.baseSalary)}
                      </td>
                      <td className="text-right py-2.5 text-slate-600">
                        {formatCOP(liq.transportAllowance)}
                      </td>
                      <td className="text-right py-2.5 text-red-600">
                        -{formatCOP(liq.totalDeducciones)}
                      </td>
                      <td className="text-right py-2.5 font-bold text-emerald-700">
                        {formatCOP(liq.netoPagar)}
                      </td>
                      <td className="text-right py-2.5">
                        {liq.qualifiesForUniform ? (
                          <span className="text-blue-700 font-bold">
                            {formatCOP(liq.dotacionCostoEntrega)}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-sans text-[10px]">
                            Exento (&gt;2 SMLMV)
                          </span>
                        )}
                      </td>
                      <td className="text-right py-2.5 font-bold text-slate-900">
                        {formatCOP(liq.costoTotalEmpresa)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Calendar & Upcoming Payment Deadlines */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Calendario de Pagos & Vencimientos
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Fechas críticas de cumplimiento legal y desembolso de nómina
            </p>

            <div className="space-y-3">
              {/* Event 1 */}
              <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-900">Pago Nómina Decenal 1</span>
                  <span className="text-[11px] font-mono font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
                    10 de mes
                  </span>
                </div>
                <p className="text-[11px] text-blue-800 mt-1">
                  Dispersión a cuentas bancarias de los 4 colaboradores.
                </p>
              </div>

              {/* Event 2 */}
              <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-900">Autoliquidación PILA</span>
                  <span className="text-[11px] font-mono font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                    Día 5 hábil
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 mt-1">
                  Aportes a Salud, Pensión, ARL Positiva y Caja de Compensación.
                </p>
              </div>

              {/* Event 3 */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Consignación de Cesantías</span>
                  <span className="text-[11px] font-mono font-semibold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                    14 de Febrero
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Consignación obligatoria en fondos Porvenir / Protección / Colfondos.
                </p>
              </div>

              {/* Event 4 */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Intereses a Cesantías</span>
                  <span className="text-[11px] font-mono font-semibold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                    31 de Enero
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Pago directo al trabajador del 12% anual sobre saldo.
                </p>
              </div>

              {/* Event 5: Dotaciones Laborales */}
              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Shirt className="w-3.5 h-3.5 text-emerald-700" />
                    Entrega de Dotación (Art. 230 CST)
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    30 Abr / 31 Ago / 20 Dic
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 mt-1">
                  Calzado y vestido para los 3 colaboradores con salario ≤ 2 SMLMV ($800.000 / entrega).
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('phva')}
              className="w-full py-2 text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Ver Ciclo PHVA de Gestión de Nómina</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Fourth Row: Project Cost Imputation & Live Salary Sensitivity Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Project Cost Imputation */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Imputación de Costos por Proyecto Social
              </h3>
              <p className="text-xs text-slate-500">
                Gasto laboral asociado a las iniciativas de la corporación
              </p>
            </div>
            <Building className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3 mt-4">
            {Object.entries(projectCosts).map(([projectName, data]) => {
              const pct = (data.costoTotal / totalCost) * 100;
              return (
                <div key={projectName} className="p-3 rounded-lg border border-slate-100 bg-slate-50/60">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-900">{projectName}</span>
                    <span className="font-mono font-bold text-slate-800">
                      {formatCOP(data.costoTotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                    <span>{data.count} colaborador(es) asignado(s)</span>
                    <span className="font-mono">{pct.toFixed(1)}% del presupuesto</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-700 rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Salary Sensitivity Simulator */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Simulador de Sensibilidad Salarial
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Ajuste el salario básico de los cargos para verificar el impacto presupuestal en vivo
              </p>
            </div>
          </div>

          <div className="space-y-3 mt-4 text-xs">
            {employees.map((emp) => (
              <div key={emp.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="font-semibold text-slate-900">{emp.position}</span>
                    <span className="text-[11px] text-slate-500 ml-2">({emp.fullName})</span>
                  </div>
                  <span className="font-mono font-bold text-blue-700">
                    {formatCOP(emp.baseSalary)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1750905} // Mínimo
                    max={6000000}
                    step={50000}
                    value={emp.baseSalary}
                    onChange={(e) => onUpdateEmployeeSalary(emp.id, Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateEmployeeSalary(emp.id, emp.baseSalary - 100000)}
                      className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[11px] font-mono hover:bg-slate-100"
                      title="Reducir $100.000"
                    >
                      -100k
                    </button>
                    <button
                      onClick={() => onUpdateEmployeeSalary(emp.id, emp.baseSalary + 100000)}
                      className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[11px] font-mono hover:bg-slate-100"
                      title="Aumentar $100.000"
                    >
                      +100k
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
