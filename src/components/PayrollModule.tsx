import React, { useState } from 'react';
import {
  Calculator,
  Calendar,
  Layers,
  CheckCircle2,
  FileText,
  Download,
  Printer,
  Info,
  ChevronRight,
  ShieldCheck,
  CheckCheck,
  Coins,
  Shirt,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Employee,
  EmployeeLiquidation,
  LegalParameters,
  PayrollFrequency,
  RoleType,
} from '../types/payroll';
import { formatCOP, formatNumber, exportToCSV } from '../utils/calculations';
import { USER_ROLES } from '../data/initialData';

interface PayrollModuleProps {
  liquidations: EmployeeLiquidation[];
  frequency: PayrollFrequency;
  onFrequencyChange: (freq: PayrollFrequency) => void;
  periodNumber: number;
  onPeriodNumberChange: (p: number) => void;
  includeNovelties: boolean;
  onToggleNovelties: () => void;
  currentRole: RoleType;
  totals: ReturnType<typeof import('../utils/calculations').calculatePayrollTotals>;
  onSelectVoucherEmployee: (employee: Employee) => void;
  legalParams: LegalParameters;
}

export const PayrollModule: React.FC<PayrollModuleProps> = ({
  liquidations,
  frequency,
  onFrequencyChange,
  periodNumber,
  onPeriodNumberChange,
  includeNovelties,
  onToggleNovelties,
  currentRole,
  totals,
  onSelectVoucherEmployee,
  legalParams,
}) => {
  const [detailLiquidation, setDetailLiquidation] = useState<EmployeeLiquidation | null>(null);
  
  // Payroll approval workflow stages: 'draft' -> 'verified' -> 'authorized'
  const [payrollStatus, setPayrollStatus] = useState<'draft' | 'verified' | 'authorized'>('draft');

  const rolePermissions = USER_ROLES[currentRole].permissions;

  const handleVerify = () => {
    setPayrollStatus('verified');
  };

  const handleAuthorizePayment = () => {
    setPayrollStatus('authorized');
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleExportCSV = () => {
    const headers = [
      'Documento',
      'Empleado',
      'Cargo',
      'Dias Laborados',
      'Salario Basico',
      'Salario Proporcional',
      'Auxilio Transporte',
      'Horas Extras y Recargos',
      'Bonificaciones',
      'Total Devengado',
      'IBC',
      'Salud Empleado 4%',
      'Pension Empleado 4%',
      'Fondo Solidaridad',
      'Otras Deducciones',
      'Total Deducciones',
      'Neto a Pagar',
      'Salud Empleador 8.5%',
      'Pension Empleador 12%',
      'ARL Empleador',
      'Caja Compensacion 4%',
      'SENA 2%',
      'ICBF 3%',
      'Cesantias',
      'Intereses Cesantias',
      'Prima Servicios',
      'Vacaciones',
      'Costo Total Empleador',
    ];

    const rows = liquidations.map((l) => [
      l.employee.documentNumber,
      l.employee.fullName,
      l.employee.position,
      l.workedDays,
      Math.round(l.baseSalary),
      Math.round(l.earnedSalary),
      Math.round(l.transportAllowance),
      Math.round(
        l.overtimeDiurnaAmount +
          l.overtimeNocturnaAmount +
          l.overtimeFestivaAmount +
          l.nightSurchargesAmount +
          l.holidaySurchargesAmount
      ),
      Math.round(l.bonusesAmount + l.commissionsAmount),
      Math.round(l.totalDevengado),
      Math.round(l.ibc),
      Math.round(l.healthEmployee),
      Math.round(l.pensionEmployee),
      Math.round(l.solidarityPensionFund),
      Math.round(l.unpaidLeaveDeduction + l.voluntaryDeductions),
      Math.round(l.totalDeducciones),
      Math.round(l.netoPagar),
      Math.round(l.healthEmployer),
      Math.round(l.pensionEmployer),
      Math.round(l.arlEmployer),
      Math.round(l.cajaCompensacion),
      Math.round(l.sena),
      Math.round(l.icbf),
      Math.round(l.provisionCesantias),
      Math.round(l.provisionInteresesCesantias),
      Math.round(l.provisionPrima),
      Math.round(l.provisionVacaciones),
      Math.round(l.costoTotalEmpresa),
    ]);

    exportToCSV(`Nomina_Somos_Uno_${frequency}_P${periodNumber}_2026`, headers, rows);
  };

  const periodSubtitle =
    frequency === 'decenal'
      ? `Período Decenal ${periodNumber} (10 días) · Mes de referencia: Octubre 2026`
      : frequency === 'quincenal'
      ? `Período Quincenal ${periodNumber} (15 días) · Mes de referencia: Octubre 2026`
      : 'Liquidación Mensual Consolidada (30 días) · Mes de referencia: Octubre 2026';

  return (
    <div className="space-y-6">
      {/* Top Controls Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Liquidación Integral de Nómina
            </h2>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              {frequency.toUpperCase()} (P{periodNumber})
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{periodSubtitle}</p>
        </div>

        {/* Action Buttons & Status */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Export to CSV/Excel */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 border border-slate-300 rounded-lg text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-slate-600" />
            Exportar Excel (.csv)
          </button>

          {/* Verification / Authorization Workflow */}
          {payrollStatus === 'draft' && (
            <>
              <span className="text-[11px] font-medium text-slate-500 px-2 py-1 bg-slate-100 rounded">
                Estado: Borrador en preparación
              </span>
              {rolePermissions.canVerifyPayroll && (
                <button
                  onClick={handleVerify}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Verificar Nómina (Administración)
                </button>
              )}
            </>
          )}

          {payrollStatus === 'verified' && (
            <>
              <span className="text-[11px] font-medium text-amber-700 px-2 py-1 bg-amber-50 border border-amber-200 rounded">
                ✓ Verificado por Administración
              </span>
              {rolePermissions.canAuthorizePayment ? (
                <button
                  onClick={handleAuthorizePayment}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Autorizar Desembolso (Gerente)
                </button>
              ) : (
                <span className="text-[11px] text-slate-500 italic">
                  (Pendiente autorización de Gerencia)
                </span>
              )}
            </>
          )}

          {payrollStatus === 'authorized' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <CheckCheck className="w-4 h-4 text-emerald-700" />
                PAGOS AUTORIZADOS & DISPERSADOS
              </span>
              <button
                onClick={() => setPayrollStatus('draft')}
                className="text-[11px] text-slate-400 hover:text-slate-600 underline"
              >
                Reiniciar estado
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Period Configuration Alert & Novelties Toggle Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-800">
              Regla de liquidación para el período seleccionado:
            </span>{' '}
            {frequency === 'decenal' && (
              <span className="text-slate-600">
                La organización realiza tres pagos de 10 días cada uno. Las deducciones del 4% en salud y pensión se distribuyen sobre el IBC del período.
              </span>
            )}
            {frequency === 'quincenal' && (
              <span className="text-slate-600">
                La organización realiza dos pagos de 15 días cada uno. El auxilio y salario son proporcionales a los 15 días.
              </span>
            )}
            {frequency === 'mensual' && (
              <span className="text-slate-600">
                Cálculo sobre 30 días laborales completos. Coincide exactamente con el escenario base de la propuesta académica de la Corporación.
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onToggleNovelties}
          className={`shrink-0 px-3 py-1.5 rounded-lg font-medium border transition-colors flex items-center gap-1.5 ${
            includeNovelties
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          {includeNovelties
            ? 'Novedades Activas (Incapacidades / H. Extras)'
            : 'Escenario Base Sin Novedades'}
        </button>
      </div>

      {/* Main Payroll Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="bg-slate-900 text-white border-b border-slate-800">
                <th className="text-left py-3 px-3 font-semibold">Colaborador / Cargo</th>
                <th className="text-center py-3 px-2 font-semibold">Días</th>
                <th className="text-right py-3 px-3 font-semibold">Salario Básico</th>
                <th className="text-right py-3 px-3 font-semibold">Sal. Período</th>
                <th className="text-right py-3 px-3 font-semibold">Aux. Transp.</th>
                <th className="text-right py-3 px-3 font-semibold">Novedades / Extras</th>
                <th className="text-right py-3 px-3 font-semibold bg-slate-800 text-amber-300">
                  Total Devengado
                </th>
                <th className="text-right py-3 px-3 font-semibold">Salud (4%)</th>
                <th className="text-right py-3 px-3 font-semibold">Pensión (4%)</th>
                <th className="text-right py-3 px-3 font-semibold text-red-300">
                  Total Deduc.
                </th>
                <th className="text-right py-3 px-4 font-semibold bg-blue-950 text-emerald-400">
                  Neto a Pagar
                </th>
                <th className="text-center py-3 px-3 font-semibold">Comprobante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {liquidations.map((liq) => {
                const extrasTotal =
                  liq.overtimeDiurnaAmount +
                  liq.overtimeNocturnaAmount +
                  liq.overtimeFestivaAmount +
                  liq.nightSurchargesAmount +
                  liq.holidaySurchargesAmount +
                  liq.bonusesAmount +
                  liq.commissionsAmount +
                  liq.incapacityAllowance;

                return (
                  <tr key={liq.employee.id} className="hover:bg-slate-50 transition-colors">
                    {/* Employee & Cargo */}
                    <td className="py-3 px-3 font-sans">
                      <div className="font-semibold text-slate-900 leading-tight">
                        {liq.employee.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <span className="font-medium text-blue-700">{liq.employee.position}</span>
                        <span>·</span>
                        <span className="font-mono text-slate-400">{liq.employee.documentNumber}</span>
                      </div>
                      {liq.employee.uniformSizes && (
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Shirt className="w-3 h-3 text-blue-600 shrink-0" />
                          <span>Dotación: C:{liq.employee.uniformSizes.shirt} P:{liq.employee.uniformSizes.pants} Z:{liq.employee.uniformSizes.shoes}</span>
                          {liq.qualifiesForUniform ? (
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

                    {/* Días laborados */}
                    <td className="py-3 px-2 text-center font-bold text-slate-700 font-mono">
                      {liq.workedDays}
                      {liq.incapacityDays > 0 && (
                        <span className="block text-[10px] text-amber-600 font-sans">
                          +{liq.incapacityDays}d incap.
                        </span>
                      )}
                      {liq.unpaidDays > 0 && (
                        <span className="block text-[10px] text-red-500 font-sans">
                          -{liq.unpaidDays}d perm.
                        </span>
                      )}
                    </td>

                    {/* Salario básico mensual pactado */}
                    <td className="py-3 px-3 text-right text-slate-600">
                      {formatCOP(liq.baseSalary)}
                    </td>

                    {/* Salario ganado en el período */}
                    <td className="py-3 px-3 text-right text-slate-900 font-medium">
                      {formatCOP(liq.earnedSalary)}
                    </td>

                    {/* Auxilio transporte proporcional */}
                    <td className="py-3 px-3 text-right text-slate-700">
                      {formatCOP(liq.transportAllowance)}
                    </td>

                    {/* Novedades y horas extras */}
                    <td className="py-3 px-3 text-right text-slate-700">
                      {extrasTotal > 0 ? (
                        <span className="text-amber-700 font-semibold">
                          +{formatCOP(extrasTotal)}
                        </span>
                      ) : (
                        <span className="text-slate-400">$0</span>
                      )}
                    </td>

                    {/* Total devengado */}
                    <td className="py-3 px-3 text-right font-bold text-slate-900 bg-amber-50/50">
                      {formatCOP(liq.totalDevengado)}
                    </td>

                    {/* Deducción Salud */}
                    <td className="py-3 px-3 text-right text-slate-600">
                      {formatCOP(liq.healthEmployee)}
                    </td>

                    {/* Deducción Pensión */}
                    <td className="py-3 px-3 text-right text-slate-600">
                      {formatCOP(liq.pensionEmployee)}
                    </td>

                    {/* Total Deducciones */}
                    <td className="py-3 px-3 text-right font-semibold text-red-600">
                      -{formatCOP(liq.totalDeducciones)}
                    </td>

                    {/* Neto a pagar */}
                    <td className="py-3 px-4 text-right font-bold text-emerald-700 text-sm bg-emerald-50/40">
                      {formatCOP(liq.netoPagar)}
                    </td>

                    {/* Botón Comprobante */}
                    <td className="py-3 px-3 text-center font-sans">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onSelectVoucherEmployee(liq.employee)}
                          className="p-1.5 text-blue-700 hover:bg-blue-50 rounded transition-colors"
                          title="Generar comprobante individual de pago (PDF / Imprimir)"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDetailLiquidation(liq)}
                          className="p-1.5 text-slate-500 hover:bg-slate-100 rounded transition-colors"
                          title="Ver desglose de fórmulas y costos patronales"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Totals Footer Row */}
            <tfoot className="bg-slate-100 font-mono font-bold text-slate-900 border-t-2 border-slate-300">
              <tr>
                <td className="py-3.5 px-3 font-sans">TOTAL CONSOLIDADO ({liquidations.length} Trabajadores)</td>
                <td className="py-3.5 px-2 text-center">--</td>
                <td className="py-3.5 px-3 text-right">{formatCOP(totals.totalSalarios)}</td>
                <td className="py-3.5 px-3 text-right">--</td>
                <td className="py-3.5 px-3 text-right">{formatCOP(totals.totalAuxilioTransporte)}</td>
                <td className="py-3.5 px-3 text-right">--</td>
                <td className="py-3.5 px-3 text-right text-amber-900 bg-amber-100/70">
                  {formatCOP(totals.totalDevengado)}
                </td>
                <td className="py-3.5 px-3 text-right">{formatCOP(totals.totalSaludEmpleado)}</td>
                <td className="py-3.5 px-3 text-right">{formatCOP(totals.totalPensionEmpleado)}</td>
                <td className="py-3.5 px-3 text-right text-red-700">
                  -{formatCOP(totals.totalDeducciones)}
                </td>
                <td className="py-3.5 px-4 text-right text-emerald-800 text-sm bg-emerald-100/70">
                  {formatCOP(totals.totalNetoPagar)}
                </td>
                <td className="py-3.5 px-3 text-center"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Comparison with the Reference Document */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-2">
          Verificación de Correspondencia con la Propuesta Académica 2026 (Documento PDF)
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          El sistema integra las cifras oficiales del ejercicio de simulación presentado a la Corporación:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-slate-100 bg-slate-50">
            <span className="font-semibold text-slate-700 block">Auxiliar Contable</span>
            <span className="text-[11px] text-slate-500">Básico: $2.000.000</span>
            <div className="mt-1 font-mono">
              <p className="text-emerald-700 font-bold">Neto 10d: $696.365</p>
              <p className="text-slate-600">Neto mes: $2.089.095</p>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-slate-100 bg-slate-50">
            <span className="font-semibold text-slate-700 block">Administración</span>
            <span className="text-[11px] text-slate-500">Básico: $2.500.000</span>
            <div className="mt-1 font-mono">
              <p className="text-emerald-700 font-bold">Neto 10d: $849.698</p>
              <p className="text-slate-600">Neto mes: $2.549.095</p>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-slate-100 bg-slate-50">
            <span className="font-semibold text-slate-700 block">Gerente</span>
            <span className="text-[11px] text-slate-500">Básico: $4.500.000</span>
            <div className="mt-1 font-mono">
              <p className="text-emerald-700 font-bold">Neto 10d: $1.380.000</p>
              <p className="text-slate-600">Neto mes: $4.140.000</p>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-slate-100 bg-slate-50">
            <span className="font-semibold text-slate-700 block">Gestor de Proyectos</span>
            <span className="text-[11px] text-slate-500">Básico: $3.000.000</span>
            <div className="mt-1 font-mono">
              <p className="text-emerald-700 font-bold">Neto 10d: $1.003.032</p>
              <p className="text-slate-600">Neto mes: $3.009.095</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Breakdown Modal for an Employee */}
      {detailLiquidation && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
                  Desglose Técnico de Liquidación
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {detailLiquidation.employee.fullName} ({detailLiquidation.employee.position})
                </h3>
                <p className="text-xs text-slate-500">
                  IBC: {formatCOP(detailLiquidation.ibc)} · Período: {detailLiquidation.periodDays} días
                </p>
              </div>
              <button
                onClick={() => setDetailLiquidation(null)}
                className="text-slate-400 hover:text-slate-600 p-1 text-base font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              {/* Devengados vs Deducciones */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <h4 className="font-bold text-emerald-900 mb-2">Devengados Reconocidos</h4>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="font-sans text-slate-600">Salario Proporcional:</span>
                      <span>{formatCOP(detailLiquidation.earnedSalary)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans text-slate-600">Auxilio Transporte:</span>
                      <span>{formatCOP(detailLiquidation.transportAllowance)}</span>
                    </div>
                    {detailLiquidation.overtimeDiurnaAmount > 0 && (
                      <div className="flex justify-between text-amber-800">
                        <span className="font-sans">Horas Extras Diurnas:</span>
                        <span>+{formatCOP(detailLiquidation.overtimeDiurnaAmount)}</span>
                      </div>
                    )}
                    {detailLiquidation.incapacityAllowance > 0 && (
                      <div className="flex justify-between text-blue-800">
                        <span className="font-sans">Auxilio Incapacidad:</span>
                        <span>+{formatCOP(detailLiquidation.incapacityAllowance)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold pt-1 border-t border-emerald-200 text-emerald-900 text-xs">
                      <span className="font-sans">Total Devengado:</span>
                      <span>{formatCOP(detailLiquidation.totalDevengado)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-red-50/50 rounded-lg border border-red-100">
                  <h4 className="font-bold text-red-900 mb-2">Deducciones Aplicadas</h4>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="font-sans text-slate-600">Salud Trabajador (4%):</span>
                      <span>{formatCOP(detailLiquidation.healthEmployee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans text-slate-600">Pensión Trabajador (4%):</span>
                      <span>{formatCOP(detailLiquidation.pensionEmployee)}</span>
                    </div>
                    {detailLiquidation.solidarityPensionFund > 0 && (
                      <div className="flex justify-between">
                        <span className="font-sans text-slate-600">Fondo Solidaridad:</span>
                        <span>{formatCOP(detailLiquidation.solidarityPensionFund)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold pt-1 border-t border-red-200 text-red-900 text-xs">
                      <span className="font-sans">Total Deducido:</span>
                      <span>-{formatCOP(detailLiquidation.totalDeducciones)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Costo Patronal Adicional */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">
                  Carga Prestacional y Seguridad Social (Aporte Empleador)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
                  <div>
                    <span className="font-sans text-slate-500 block text-[10px]">Salud (8.5%)</span>
                    <span className="font-semibold">{formatCOP(detailLiquidation.healthEmployer)}</span>
                  </div>
                  <div>
                    <span className="font-sans text-slate-500 block text-[10px]">Pensión (12%)</span>
                    <span className="font-semibold">{formatCOP(detailLiquidation.pensionEmployer)}</span>
                  </div>
                  <div>
                    <span className="font-sans text-slate-500 block text-[10px]">ARL ({detailLiquidation.employee.arlRiskLevel})</span>
                    <span className="font-semibold">{formatCOP(detailLiquidation.arlEmployer)}</span>
                  </div>
                  <div>
                    <span className="font-sans text-slate-500 block text-[10px]">Parafiscales (9%)</span>
                    <span className="font-semibold">{formatCOP(detailLiquidation.totalParafiscales)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px] mt-3 pt-2 border-t border-slate-200">
                  <div>
                    <span className="font-sans text-slate-500 block text-[10px]">Cesantías (8.33%)</span>
                    <span>{formatCOP(detailLiquidation.provisionCesantias)}</span>
                  </div>
                  <div>
                    <span className="font-sans text-slate-500 block text-[10px]">Intereses (1%)</span>
                    <span>{formatCOP(detailLiquidation.provisionInteresesCesantias)}</span>
                  </div>
                  <div>
                    <span className="font-sans text-slate-500 block text-[10px]">Prima (8.33%)</span>
                    <span>{formatCOP(detailLiquidation.provisionPrima)}</span>
                  </div>
                  <div>
                    <span className="font-sans text-slate-500 block text-[10px]">Vacaciones (4.167%)</span>
                    <span>{formatCOP(detailLiquidation.provisionVacaciones)}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                  <span className="font-sans">Costo Total Empresa por este Empleado:</span>
                  <span className="font-mono text-indigo-900">{formatCOP(detailLiquidation.costoTotalEmpresa)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-end gap-2">
              <button
                onClick={() => {
                  onSelectVoucherEmployee(detailLiquidation.employee);
                  setDetailLiquidation(null);
                }}
                className="px-3.5 py-1.5 bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-blue-800"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimir Comprobante
              </button>
              <button
                onClick={() => setDetailLiquidation(null)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 text-xs hover:bg-slate-50 font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
