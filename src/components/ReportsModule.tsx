import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  FileText,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  Building,
} from 'lucide-react';
import {
  Employee,
  EmployeeLiquidation,
  LegalParameters,
  Novelty,
  PayrollFrequency,
} from '../types/payroll';
import { formatCOP, formatNumber, exportToCSV } from '../utils/calculations';

interface ReportsModuleProps {
  employees: Employee[];
  liquidations: EmployeeLiquidation[];
  novelties: Novelty[];
  frequency: PayrollFrequency;
  periodNumber: number;
  totals: ReturnType<typeof import('../utils/calculations').calculatePayrollTotals>;
  legalParams: LegalParameters;
  onSelectVoucherEmployee: (employee: Employee) => void;
}

export type ReportType =
  | 'nomina_general'
  | 'nomina_individual'
  | 'devengados_deducciones'
  | 'horas_extras'
  | 'incapacidades_ausencias'
  | 'vacaciones'
  | 'cesantias_intereses'
  | 'primas'
  | 'seguridad_social'
  | 'parafiscales'
  | 'costos_proyecto'
  | 'dotaciones';

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  employees,
  liquidations,
  novelties,
  frequency,
  periodNumber,
  totals,
  legalParams,
  onSelectVoucherEmployee,
}) => {
  const [selectedReport, setSelectedReport] = useState<ReportType>('nomina_general');

  const reportList = [
    { id: 'nomina_general' as ReportType, title: '1. Nómina General Consolidada' },
    { id: 'nomina_individual' as ReportType, title: '2. Nómina Individual por Empleado' },
    { id: 'devengados_deducciones' as ReportType, title: '3. Salarios, Devengados y Deducciones' },
    { id: 'horas_extras' as ReportType, title: '4. Horas Extras y Recargos' },
    { id: 'incapacidades_ausencias' as ReportType, title: '5. Incapacidades, Permisos y Ausencias' },
    { id: 'vacaciones' as ReportType, title: '6. Informe de Vacaciones' },
    { id: 'cesantias_intereses' as ReportType, title: '7. Cesantías e Intereses de Cesantías' },
    { id: 'primas' as ReportType, title: '8. Primas de Servicios Legales y Extralegales' },
    { id: 'seguridad_social' as ReportType, title: '9. Seguridad Social y Riesgos Laborales' },
    { id: 'parafiscales' as ReportType, title: '10. Aportes Parafiscales (Caja, SENA, ICBF)' },
    { id: 'costos_proyecto' as ReportType, title: '11. Costos Laborales por Proyecto Social' },
    { id: 'dotaciones' as ReportType, title: '12. Dotaciones de Calzado y Vestido (Art. 230 CST)' },
  ];

  const handlePrintCurrentReport = () => {
    window.print();
  };

  const handleExportCurrentReportCSV = () => {
    switch (selectedReport) {
      case 'nomina_general':
      case 'devengados_deducciones': {
        const headers = [
          'Documento',
          'Empleado',
          'Cargo',
          'Salario Basico',
          'Auxilio Transporte',
          'Otros Devengados',
          'Total Devengado',
          'Salud 4%',
          'Pension 4%',
          'Total Deducciones',
          'Neto a Pagar',
        ];
        const rows = liquidations.map((l) => [
          l.employee.documentNumber,
          l.employee.fullName,
          l.employee.position,
          Math.round(l.baseSalary),
          Math.round(l.transportAllowance),
          Math.round(l.totalDevengado - l.earnedSalary - l.transportAllowance),
          Math.round(l.totalDevengado),
          Math.round(l.healthEmployee),
          Math.round(l.pensionEmployee),
          Math.round(l.totalDeducciones),
          Math.round(l.netoPagar),
        ]);
        exportToCSV(`Reporte_Nomina_General_Somos_Uno_${frequency}`, headers, rows);
        break;
      }
      case 'horas_extras': {
        const headers = ['Documento', 'Empleado', 'Cargo', 'Tipo Novedad', 'Horas', 'Monto'];
        const rows = liquidations.map((l) => [
          l.employee.documentNumber,
          l.employee.fullName,
          l.employee.position,
          'Horas Extras y Recargos',
          l.overtimeDiurnaAmount > 0 ? '2h diurnas' : '0',
          Math.round(l.overtimeDiurnaAmount + l.overtimeNocturnaAmount + l.nightSurchargesAmount),
        ]);
        exportToCSV('Reporte_Horas_Extras_Somos_Uno', headers, rows);
        break;
      }
      case 'incapacidades_ausencias': {
        const headers = ['Documento', 'Empleado', 'Cargo', 'Tipo Incapacidad/Permiso', 'Dias', 'Descripcion'];
        const rows = novelties.map((n) => {
          const emp = employees.find((e) => e.id === n.employeeId);
          return [
            emp?.documentNumber || '',
            emp?.fullName || '',
            emp?.position || '',
            n.type,
            n.days,
            n.description,
          ];
        });
        exportToCSV('Reporte_Incapacidades_Permisos_Somos_Uno', headers, rows);
        break;
      }
      case 'cesantias_intereses': {
        const headers = ['Documento', 'Empleado', 'Cargo', 'Base Cesantias', 'Cesantias', 'Intereses Cesantias'];
        const rows = liquidations.map((l) => [
          l.employee.documentNumber,
          l.employee.fullName,
          l.employee.position,
          Math.round(l.basePrestaciones),
          Math.round(l.provisionCesantias),
          Math.round(l.provisionInteresesCesantias),
        ]);
        exportToCSV('Reporte_Cesantias_Intereses_Somos_Uno', headers, rows);
        break;
      }
      case 'primas': {
        const headers = ['Documento', 'Empleado', 'Cargo', 'Base Prima', 'Prima Legal', 'Primas Extralegales'];
        const rows = liquidations.map((l) => [
          l.employee.documentNumber,
          l.employee.fullName,
          l.employee.position,
          Math.round(l.basePrestaciones),
          Math.round(l.provisionPrima),
          0,
        ]);
        exportToCSV('Reporte_Primas_Somos_Uno', headers, rows);
        break;
      }
      case 'vacaciones': {
        const headers = ['Documento', 'Empleado', 'Cargo', 'Salario Base (sin auxilio)', 'Provision Vacaciones'];
        const rows = liquidations.map((l) => [
          l.employee.documentNumber,
          l.employee.fullName,
          l.employee.position,
          Math.round(l.baseVacaciones),
          Math.round(l.provisionVacaciones),
        ]);
        exportToCSV('Reporte_Vacaciones_Somos_Uno', headers, rows);
        break;
      }
      case 'costos_proyecto': {
        const headers = ['Proyecto', 'Colaboradores', 'Total Devengado', 'Total Costo Institucional'];
        const projectGroups: Record<string, { dev: number; cost: number; count: number }> = {};
        liquidations.forEach((l) => {
          const p = l.employee.project;
          if (!projectGroups[p]) projectGroups[p] = { dev: 0, cost: 0, count: 0 };
          projectGroups[p].dev += l.totalDevengado;
          projectGroups[p].cost += l.costoTotalEmpresa;
          projectGroups[p].count += 1;
        });
        const rows = Object.entries(projectGroups).map(([proj, data]) => [
          proj,
          data.count,
          Math.round(data.dev),
          Math.round(data.cost),
        ]);
        exportToCSV('Reporte_Costos_Proyecto_Somos_Uno', headers, rows);
        break;
      }
      case 'dotaciones': {
        const headers = [
          'Documento',
          'Empleado',
          'Cargo',
          'Salario Basico',
          'Derecho Legal Art 230',
          'Tipo Dotacion',
          'Talla Camisa',
          'Talla Pantalon',
          'Talla Calzado',
          'Costo Estimado Entrega',
          'Fechas Obligatorias Entrega',
        ];
        const rows = employees.map((emp) => {
          const qualifies = emp.baseSalary <= legalParams.maxSalaryForTransport;
          return [
            emp.documentNumber,
            emp.fullName,
            emp.position,
            Math.round(emp.baseSalary),
            qualifies ? 'SI APLICA (<= 2 SMLMV)' : 'NO APLICA (> 2 SMLMV)',
            emp.uniformSizes?.uniformType || 'Oficina / Administrativo',
            emp.uniformSizes?.shirt || 'M',
            emp.uniformSizes?.pants || '30',
            emp.uniformSizes?.shoes || '38',
            qualifies ? Math.round(emp.uniformCostPerDelivery || 250000) : 0,
            '30 de abril, 31 de agosto, 20 de diciembre',
          ];
        });
        exportToCSV('Reporte_Dotaciones_Calzado_Vestido_Somos_Uno', headers, rows);
        break;
      }
      default: {
        const headers = ['Documento', 'Empleado', 'Cargo', 'Neto a Pagar', 'Costo Empresa'];
        const rows = liquidations.map((l) => [
          l.employee.documentNumber,
          l.employee.fullName,
          l.employee.position,
          Math.round(l.netoPagar),
          Math.round(l.costoTotalEmpresa),
        ]);
        exportToCSV('Reporte_Somos_Uno', headers, rows);
        break;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Centro de Informes & Reportes Laborales
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generación y exportación de nómina general, individual, novedades, prestaciones y costos por proyecto en PDF y Excel.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCurrentReportCSV}
            className="px-3.5 py-2 border border-slate-300 rounded-lg text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-slate-600" />
            Descargar Excel (.csv)
          </button>
          <button
            onClick={handlePrintCurrentReport}
            className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm overflow-x-auto no-print">
        <div className="flex items-center gap-1.5 min-w-max">
          {reportList.map((rep) => (
            <button
              key={rep.id}
              onClick={() => setSelectedReport(rep.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedReport === rep.id
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {rep.title}
            </button>
          ))}
        </div>
      </div>

      {/* Printable Report Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6 print:border-none print:shadow-none print:p-0">
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-900 text-white font-black flex items-center justify-center text-sm border border-amber-400/40">
              SU
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                CORPORACIÓN SOCIAL SOMOS UNO
              </h3>
              <p className="text-xs text-slate-500">
                NIT 901.458.239-1 · Entidad sin Ánimo de Lucro
              </p>
              <p className="text-xs font-semibold text-blue-700 mt-0.5">
                {reportList.find((r) => r.id === selectedReport)?.title}
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500 font-mono">
            <p>Período: {frequency.toUpperCase()} (P{periodNumber})</p>
            <p>Fecha Generación: 2026-10-31</p>
            <p>Referencia Normativa: CST & Ley 2101</p>
          </div>
        </div>

        {/* Content based on selectedReport */}
        {selectedReport === 'nomina_general' && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-semibold">
                  <th className="py-2.5 px-3 text-left">Documento</th>
                  <th className="py-2.5 px-3 text-left">Colaborador</th>
                  <th className="py-2.5 px-3 text-left">Cargo</th>
                  <th className="py-2.5 px-2 text-center">Días</th>
                  <th className="py-2.5 px-3 text-right">Básico</th>
                  <th className="py-2.5 px-3 text-right">Aux. Transp.</th>
                  <th className="py-2.5 px-3 text-right">Devengado</th>
                  <th className="py-2.5 px-3 text-right">Deducciones</th>
                  <th className="py-2.5 px-4 text-right font-bold text-slate-900">Neto a Pagar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {liquidations.map((l) => (
                  <tr key={l.employee.id}>
                    <td className="py-2.5 px-3">{l.employee.documentNumber}</td>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900">
                      {l.employee.fullName}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-600">{l.employee.position}</td>
                    <td className="py-2.5 px-2 text-center">{l.workedDays}</td>
                    <td className="py-2.5 px-3 text-right">{formatCOP(l.baseSalary)}</td>
                    <td className="py-2.5 px-3 text-right">{formatCOP(l.transportAllowance)}</td>
                    <td className="py-2.5 px-3 text-right font-bold">{formatCOP(l.totalDevengado)}</td>
                    <td className="py-2.5 px-3 text-right text-red-600">
                      -{formatCOP(l.totalDeducciones)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-emerald-800">
                      {formatCOP(l.netoPagar)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-mono font-bold text-slate-900 border-t-2 border-slate-300">
                <tr>
                  <td colSpan={4} className="py-2.5 px-3 font-sans">TOTALES CONSOLIDADOS</td>
                  <td className="py-2.5 px-3 text-right">{formatCOP(totals.totalSalarios)}</td>
                  <td className="py-2.5 px-3 text-right">{formatCOP(totals.totalAuxilioTransporte)}</td>
                  <td className="py-2.5 px-3 text-right">{formatCOP(totals.totalDevengado)}</td>
                  <td className="py-2.5 px-3 text-right text-red-600">
                    -{formatCOP(totals.totalDeducciones)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-emerald-800">
                    {formatCOP(totals.totalNetoPagar)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {selectedReport === 'nomina_individual' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Seleccione un colaborador para emitir o imprimir su comprobante oficial de pago:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {liquidations.map((l) => (
                <div
                  key={l.employee.id}
                  className="p-4 border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{l.employee.fullName}</h4>
                    <p className="text-[11px] text-slate-500">{l.employee.position}</p>
                    <p className="text-xs font-mono font-bold text-emerald-700 mt-1">
                      Neto: {formatCOP(l.netoPagar)}
                    </p>
                  </div>
                  <button
                    onClick={() => onSelectVoucherEmployee(l.employee)}
                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Ver Comprobante
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedReport === 'devengados_deducciones' && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-semibold">
                  <th className="py-2.5 px-3 text-left">Colaborador</th>
                  <th className="py-2.5 px-3 text-right">Salario Base</th>
                  <th className="py-2.5 px-3 text-right">Aux. Transp.</th>
                  <th className="py-2.5 px-3 text-right">H. Extras & Recargos</th>
                  <th className="py-2.5 px-3 text-right">Devengado Total</th>
                  <th className="py-2.5 px-3 text-right">Salud (4%)</th>
                  <th className="py-2.5 px-3 text-right">Pensión (4%)</th>
                  <th className="py-2.5 px-3 text-right">Otras Deduc.</th>
                  <th className="py-2.5 px-4 text-right font-bold text-slate-900">Total Neto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {liquidations.map((l) => (
                  <tr key={l.employee.id}>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900">
                      {l.employee.fullName}
                    </td>
                    <td className="py-2.5 px-3 text-right">{formatCOP(l.baseSalary)}</td>
                    <td className="py-2.5 px-3 text-right">{formatCOP(l.transportAllowance)}</td>
                    <td className="py-2.5 px-3 text-right">
                      {formatCOP(
                        l.overtimeDiurnaAmount +
                          l.overtimeNocturnaAmount +
                          l.nightSurchargesAmount +
                          l.incapacityAllowance
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold">{formatCOP(l.totalDevengado)}</td>
                    <td className="py-2.5 px-3 text-right">{formatCOP(l.healthEmployee)}</td>
                    <td className="py-2.5 px-3 text-right">{formatCOP(l.pensionEmployee)}</td>
                    <td className="py-2.5 px-3 text-right text-red-500">
                      {l.unpaidLeaveDeduction > 0 ? formatCOP(l.unpaidLeaveDeduction) : '$0'}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-emerald-800">
                      {formatCOP(l.netoPagar)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'horas_extras' && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-semibold">
                  <th className="py-2.5 px-3 text-left">Colaborador</th>
                  <th className="py-2.5 px-3 text-left">Cargo</th>
                  <th className="py-2.5 px-3 text-right">Vlr. Hora Ordinaria (42h)</th>
                  <th className="py-2.5 px-3 text-right">H.E. Diurna (25%)</th>
                  <th className="py-2.5 px-3 text-right">H.E. Nocturna (75%)</th>
                  <th className="py-2.5 px-3 text-right">Recargo Nocturno (35%)</th>
                  <th className="py-2.5 px-4 text-right font-bold">Total Recargos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {liquidations.map((l) => {
                  const hourlyRate = l.baseSalary / 210;
                  return (
                    <tr key={l.employee.id}>
                      <td className="py-2.5 px-3 font-sans font-medium text-slate-900">
                        {l.employee.fullName}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-slate-600">{l.employee.position}</td>
                      <td className="py-2.5 px-3 text-right">{formatCOP(hourlyRate)}</td>
                      <td className="py-2.5 px-3 text-right">
                        {l.overtimeDiurnaAmount > 0 ? formatCOP(l.overtimeDiurnaAmount) : '$0'}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {l.overtimeNocturnaAmount > 0 ? formatCOP(l.overtimeNocturnaAmount) : '$0'}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {l.nightSurchargesAmount > 0 ? formatCOP(l.nightSurchargesAmount) : '$0'}
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-blue-700">
                        {formatCOP(
                          l.overtimeDiurnaAmount +
                            l.overtimeNocturnaAmount +
                            l.nightSurchargesAmount
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'incapacidades_ausencias' && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-semibold">
                  <th className="py-2.5 px-3 text-left">Colaborador</th>
                  <th className="py-2.5 px-3 text-left">Tipo Novedad</th>
                  <th className="py-2.5 px-3 text-center">Fecha Inicio</th>
                  <th className="py-2.5 px-2 text-center">Días</th>
                  <th className="py-2.5 px-4 text-left">Descripción / Diagnóstico</th>
                  <th className="py-2.5 px-3 text-left">Soporte Médico / Acta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {novelties.map((nov) => {
                  const emp = employees.find((e) => e.id === nov.employeeId);
                  return (
                    <tr key={nov.id}>
                      <td className="py-2.5 px-3 font-sans font-medium text-slate-900">
                        {emp?.fullName}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-slate-700">{nov.type}</td>
                      <td className="py-2.5 px-3 text-center">{nov.startDate}</td>
                      <td className="py-2.5 px-2 text-center font-bold">{nov.days || nov.hours}</td>
                      <td className="py-2.5 px-4 font-sans text-slate-600">{nov.description}</td>
                      <td className="py-2.5 px-3 font-sans text-blue-700">
                        {nov.supportDocName || 'Sin soporte'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'cesantias_intereses' && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-semibold">
                  <th className="py-2.5 px-3 text-left">Colaborador / Cargo</th>
                  <th className="py-2.5 px-3 text-right">Base con Auxilio</th>
                  <th className="py-2.5 px-3 text-right">Días Liquidados</th>
                  <th className="py-2.5 px-3 text-right text-blue-800">Cesantías (8.33%)</th>
                  <th className="py-2.5 px-3 text-right text-indigo-800">Intereses (1% mes / 12% año)</th>
                  <th className="py-2.5 px-4 text-right font-bold text-slate-900">Total Provisión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {liquidations.map((l) => (
                  <tr key={l.employee.id}>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900">
                      {l.employee.fullName} ({l.employee.position})
                    </td>
                    <td className="py-2.5 px-3 text-right">{formatCOP(l.basePrestaciones)}</td>
                    <td className="py-2.5 px-3 text-right">{l.workedDays + l.incapacityDays}</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-blue-700">
                      {formatCOP(l.provisionCesantias)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-indigo-700">
                      {formatCOP(l.provisionInteresesCesantias)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                      {formatCOP(l.provisionCesantias + l.provisionInteresesCesantias)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'costos_proyecto' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-semibold">
                    <th className="py-2.5 px-3 text-left">Proyecto Institucional</th>
                    <th className="py-2.5 px-3 text-left">Colaborador Asignado</th>
                    <th className="py-2.5 px-3 text-left">Cargo</th>
                    <th className="py-2.5 px-3 text-right">Salario Devengado</th>
                    <th className="py-2.5 px-3 text-right">Carga Social Patronal</th>
                    <th className="py-2.5 px-4 text-right font-bold text-slate-900">Costo Proyecto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {liquidations.map((l) => (
                    <tr key={l.employee.id}>
                      <td className="py-2.5 px-3 font-sans font-medium text-blue-900">
                        {l.employee.project}
                      </td>
                      <td className="py-2.5 px-3 font-sans">{l.employee.fullName}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-600">{l.employee.position}</td>
                      <td className="py-2.5 px-3 text-right">{formatCOP(l.totalDevengado)}</td>
                      <td className="py-2.5 px-3 text-right">
                        {formatCOP(l.costoTotalEmpresa - l.totalDevengado)}
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-indigo-900">
                        {formatCOP(l.costoTotalEmpresa)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other reports fall back to clean overview */}
        {(selectedReport === 'primas' ||
          selectedReport === 'vacaciones' ||
          selectedReport === 'seguridad_social' ||
          selectedReport === 'parafiscales') && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-semibold">
                  <th className="py-2.5 px-3 text-left">Documento</th>
                  <th className="py-2.5 px-3 text-left">Colaborador</th>
                  <th className="py-2.5 px-3 text-left">Cargo</th>
                  <th className="py-2.5 px-3 text-right">IBC / Base</th>
                  <th className="py-2.5 px-3 text-right">Aporte Empleado</th>
                  <th className="py-2.5 px-3 text-right">Aporte Empleador</th>
                  <th className="py-2.5 px-4 text-right font-bold">Total Reconocido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {liquidations.map((l) => (
                  <tr key={l.employee.id}>
                    <td className="py-2.5 px-3">{l.employee.documentNumber}</td>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900">
                      {l.employee.fullName}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-600">{l.employee.position}</td>
                    <td className="py-2.5 px-3 text-right">{formatCOP(l.ibc)}</td>
                    <td className="py-2.5 px-3 text-right">{formatCOP(l.totalDeducciones)}</td>
                    <td className="py-2.5 px-3 text-right">
                      {formatCOP(l.totalSeguridadSocialEmpleador + l.totalParafiscales)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                      {formatCOP(l.costoTotalEmpresa)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'dotaciones' && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
              <span className="font-bold">Marco Jurídico (Artículos 230 a 234 CST):</span> Suministro obligatorio gratuito cada cuatro (4) meses de 1 par de zapatos y 1 vestido de labor para trabajadores que devenguen hasta dos (2) salarios mínimos vigentes ($3.501.810 en 2026). Fechas de entrega legal: 30 de abril, 31 de agosto y 20 de diciembre. Queda prohibida la compensación en dinero (Art. 234 CST).
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-semibold">
                    <th className="py-2.5 px-3 text-left">Documento</th>
                    <th className="py-2.5 px-3 text-left">Colaborador</th>
                    <th className="py-2.5 px-3 text-left">Cargo</th>
                    <th className="py-2.5 px-3 text-right">Salario Básico</th>
                    <th className="py-2.5 px-3 text-center">Derecho Legal</th>
                    <th className="py-2.5 px-3 text-left">Tipo Dotación</th>
                    <th className="py-2.5 px-2 text-center">Camisa</th>
                    <th className="py-2.5 px-2 text-center">Pantalón</th>
                    <th className="py-2.5 px-2 text-center">Calzado</th>
                    <th className="py-2.5 px-3 text-right">Costo / Entrega</th>
                    <th className="py-2.5 px-4 text-center">Fechas Obligatorias</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {employees.map((emp) => {
                    const qualifies = emp.baseSalary <= legalParams.maxSalaryForTransport;
                    const cost = qualifies ? (emp.uniformCostPerDelivery || 250000) : 0;
                    return (
                      <tr key={emp.id}>
                        <td className="py-2.5 px-3">{emp.documentNumber}</td>
                        <td className="py-2.5 px-3 font-sans font-medium text-slate-900">
                          {emp.fullName}
                        </td>
                        <td className="py-2.5 px-3 font-sans text-slate-600">{emp.position}</td>
                        <td className="py-2.5 px-3 text-right">{formatCOP(emp.baseSalary)}</td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          {qualifies ? (
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              SÍ (≤ 2 SMLMV)
                            </span>
                          ) : (
                            <span className="text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                              EXENTO (&gt; 2 SMLMV)
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-sans text-slate-700">
                          {emp.uniformSizes?.uniformType || 'Oficina'}
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold text-slate-800">
                          {emp.uniformSizes?.shirt || 'M'}
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold text-slate-800">
                          {emp.uniformSizes?.pants || '30'}
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold text-blue-700">
                          {emp.uniformSizes?.shoes || '38'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                          {cost > 0 ? formatCOP(cost) : '$0'}
                        </td>
                        <td className="py-2.5 px-4 text-center font-sans text-slate-600 text-[11px]">
                          30 Abr / 31 Ago / 20 Dic
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-100 font-mono font-bold text-slate-900 border-t-2 border-slate-300">
                  <tr>
                    <td colSpan={9} className="py-2.5 px-3 font-sans text-right">
                      COSTO TOTAL ESTIMADO POR CADA ENTREGA CUATRIMESTRAL:
                    </td>
                    <td className="py-2.5 px-3 text-right text-blue-900">
                      {formatCOP(
                        employees
                          .filter((e) => e.baseSalary <= legalParams.maxSalaryForTransport)
                          .reduce((acc, e) => acc + (e.uniformCostPerDelivery || 250000), 0)
                      )}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Official Signature Lines for Document */}
        <div className="grid grid-cols-3 gap-8 pt-12 border-t border-slate-200 text-center text-xs print:pt-16">
          <div>
            <div className="border-t border-slate-400 pt-1.5 font-bold text-slate-800">
              Carlos Mendoza
            </div>
            <p className="text-[11px] text-slate-500">Auxiliar Contable · Preparó</p>
          </div>
          <div>
            <div className="border-t border-slate-400 pt-1.5 font-bold text-slate-800">
              Martha Lucia Ríos
            </div>
            <p className="text-[11px] text-slate-500">Administración · Verificó</p>
          </div>
          <div>
            <div className="border-t border-slate-400 pt-1.5 font-bold text-slate-800">
              Dr. Fernando Salazar V.
            </div>
            <p className="text-[11px] text-slate-500">Gerente General · Autorizó</p>
          </div>
        </div>
      </div>
    </div>
  );
};
