import React from 'react';
import {
  Building2,
  Shield,
  FileSpreadsheet,
  ToggleLeft,
  ToggleRight,
  Info,
  CheckCircle,
  Download,
  Percent,
} from 'lucide-react';
import { EmployeeLiquidation, LegalParameters } from '../types/payroll';
import { formatCOP, generatePilaSummary, exportToCSV } from '../utils/calculations';

interface SocialSecurityModuleProps {
  liquidations: EmployeeLiquidation[];
  legalParams: LegalParameters;
  onUpdateParams: (newParams: Partial<LegalParameters>) => void;
}

export const SocialSecurityModule: React.FC<SocialSecurityModuleProps> = ({
  liquidations,
  legalParams,
  onUpdateParams,
}) => {
  const pilaData = generatePilaSummary(liquidations);

  const totalIbc = liquidations.reduce((s, l) => s + l.ibc, 0);
  const totalSaludEmpleador = liquidations.reduce((s, l) => s + l.healthEmployer, 0);
  const totalSaludTrabajador = liquidations.reduce((s, l) => s + l.healthEmployee, 0);
  const totalPensionEmpleador = liquidations.reduce((s, l) => s + l.pensionEmployer, 0);
  const totalPensionTrabajador = liquidations.reduce((s, l) => s + l.pensionEmployee, 0);
  const totalArl = liquidations.reduce((s, l) => s + l.arlEmployer, 0);

  const totalCaja = liquidations.reduce((s, l) => s + l.cajaCompensacion, 0);
  const totalSena = liquidations.reduce((s, l) => s + l.sena, 0);
  const totalIcbf = liquidations.reduce((s, l) => s + l.icbf, 0);
  const totalParafiscales = totalCaja + totalSena + totalIcbf;

  const totalPila =
    totalSaludEmpleador +
    totalSaludTrabajador +
    totalPensionEmpleador +
    totalPensionTrabajador +
    totalArl +
    totalParafiscales;

  const handleExportPilaCSV = () => {
    const headers = [
      'Secuencia',
      'Tipo Doc',
      'Numero Doc',
      'Nombre Trabajador',
      'Cargo',
      'Dias Cotizados',
      'Salario Basico',
      'IBC Periodo',
      'Tarifa Salud',
      'Aporte Salud Total',
      'Tarifa Pension',
      'Aporte Pension Total',
      'Tarifa ARL',
      'Aporte ARL',
      'Tarifa Caja',
      'Aporte Caja (4%)',
      'SENA (2%)',
      'ICBF (3%)',
      'Total Planilla PILA',
    ];

    const rows = pilaData.map((p) => [
      p.secuencia,
      p.tipoDoc,
      p.numeroDoc,
      p.nombre,
      p.cargo,
      p.diasCotizados,
      p.salarioBasico,
      p.ibc,
      p.tarifaSalud,
      p.aporteSaludTotal,
      p.tarifaPension,
      p.aportePensionTotal,
      p.tarifaArl,
      p.aporteArl,
      p.tarifaCaja,
      p.aporteCaja,
      p.sena,
      p.icbf,
      p.totalAportesSeguridad,
    ]);

    exportToCSV('Planilla_PILA_Somos_Uno_2026', headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Seguridad Social Integral & Aportes Parafiscales
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de aportes a Salud (EPS), Pensión (AFP), ARL Positiva y Parafiscales (Caja, SENA, ICBF) conforme a la normatividad colombiana.
          </p>
        </div>

        <button
          onClick={handleExportPilaCSV}
          className="px-3.5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Exportar Planilla PILA (.csv)
        </button>
      </div>

      {/* Tax Exemption (Art 114-1 E.T.) Toggle Card */}
      <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-bold text-indigo-950">
              Configuración de Exoneración Tributaria (Artículo 114-1 del Estatuto Tributario)
            </h3>
            <p className="text-xs text-indigo-900/80 mt-0.5 max-w-2xl">
              Si la persona jurídica califica para la exoneración de aportes, no paga SENA (2%), ICBF (3%) ni Salud patronal (8.5%) por trabajadores que devenguen menos de 10 SMLMV. Por defecto en la simulación académica de la Corporación se liquida el esquema ordinario completo (9% parafiscales).
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            onUpdateParams({ isExemptArticle114: !legalParams.isExemptArticle114 })
          }
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            legalParams.isExemptArticle114
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-800 text-white'
          }`}
        >
          {legalParams.isExemptArticle114 ? (
            <>
              <ToggleRight className="w-5 h-5" />
              Exoneración Activa (Ahorro 13.5%)
            </>
          ) : (
            <>
              <ToggleLeft className="w-5 h-5 text-slate-400" />
              Régimen Completo (Simulación 9%)
            </>
          )}
        </button>
      </div>

      {/* Two Column Breakdown: Seguridad Social vs Parafiscales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Seguridad Social Integral */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              1. Sistema de Seguridad Social Integral
            </h3>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded">
              Total: {formatCOP(totalSaludEmpleador + totalSaludTrabajador + totalPensionEmpleador + totalPensionTrabajador + totalArl)}
            </span>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* Salud */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex justify-between font-sans font-bold text-slate-800 text-xs mb-1">
                <span>Salud Integral (Total 12.5%):</span>
                <span className="font-mono text-blue-700">
                  {formatCOP(totalSaludEmpleador + totalSaludTrabajador)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span className="font-sans">Aporte Empleador (8.5%):</span>
                <span>{formatCOP(totalSaludEmpleador)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span className="font-sans">Aporte Trabajador (4.0%):</span>
                <span>{formatCOP(totalSaludTrabajador)}</span>
              </div>
            </div>

            {/* Pensión */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex justify-between font-sans font-bold text-slate-800 text-xs mb-1">
                <span>Pensión Integral (Total 16.0%):</span>
                <span className="font-mono text-blue-700">
                  {formatCOP(totalPensionEmpleador + totalPensionTrabajador)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span className="font-sans">Aporte Empleador (12.0%):</span>
                <span>{formatCOP(totalPensionEmpleador)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span className="font-sans">Aporte Trabajador (4.0%):</span>
                <span>{formatCOP(totalPensionTrabajador)}</span>
              </div>
            </div>

            {/* ARL */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex justify-between font-sans font-bold text-slate-800 text-xs mb-1">
                <span>Riesgos Laborales (ARL Positiva):</span>
                <span className="font-mono text-blue-700">{formatCOP(totalArl)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span className="font-sans">Tarifa Clase I (Oficinas / Administrativo):</span>
                <span>0.522% (100% Empleador)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Aportes Parafiscales */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              2. Aportes Parafiscales (9% sobre Salario)
            </h3>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded">
              Total: {formatCOP(totalParafiscales)}
            </span>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* Caja */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex justify-between font-sans font-bold text-slate-800 text-xs mb-1">
                <span>Caja de Compensación Familiar (4.0%):</span>
                <span className="font-mono text-amber-700">{formatCOP(totalCaja)}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-sans">
                Subsidio monetario, recreación, vivienda y bienestar para los trabajadores de la Corporación.
              </p>
            </div>

            {/* SENA */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex justify-between font-sans font-bold text-slate-800 text-xs mb-1">
                <span>Servicio Nacional de Aprendizaje - SENA (2.0%):</span>
                <span className="font-mono text-amber-700">{formatCOP(totalSena)}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-sans">
                Formación técnica y tecnológica para el desarrollo productivo.
              </p>
            </div>

            {/* ICBF */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex justify-between font-sans font-bold text-slate-800 text-xs mb-1">
                <span>Instituto Colombiano de Bienestar Familiar - ICBF (3.0%):</span>
                <span className="font-mono text-amber-700">{formatCOP(totalIcbf)}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-sans">
                Protección integral de la niñez y fortalecimiento familiar en Colombia.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Planilla Integrada de Liquidación de Aportes (PILA) Preview Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Estructura Oficial de la Planilla PILA (Operador SOI / MiPlanilla / Aportes en Línea)
            </h3>
            <p className="text-xs text-slate-500">
              Resumen de cotizantes, IBC individual y valor total a pagar por concepto
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded">
            Gran Total PILA: {formatCOP(totalPila)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="bg-slate-900 text-white border-b border-slate-800">
                <th className="text-center py-2.5 px-2 font-semibold">Sec.</th>
                <th className="text-left py-2.5 px-3 font-semibold">Documento</th>
                <th className="text-left py-2.5 px-3 font-semibold">Cotizante / Cargo</th>
                <th className="text-center py-2.5 px-2 font-semibold">Días</th>
                <th className="text-right py-2.5 px-3 font-semibold">IBC Salarial</th>
                <th className="text-right py-2.5 px-3 font-semibold">Salud (12.5%)</th>
                <th className="text-right py-2.5 px-3 font-semibold">Pensión (16%)</th>
                <th className="text-right py-2.5 px-3 font-semibold">ARL</th>
                <th className="text-right py-2.5 px-3 font-semibold">Caja (4%)</th>
                <th className="text-right py-2.5 px-3 font-semibold">SENA + ICBF</th>
                <th className="text-right py-2.5 px-4 font-semibold text-emerald-300">
                  Total PILA
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {pilaData.map((row) => (
                <tr key={row.secuencia} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-2 text-center text-slate-500">{row.secuencia}</td>
                  <td className="py-2.5 px-3 text-slate-700">
                    {row.tipoDoc} {row.numeroDoc}
                  </td>
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-900">
                    <p>{row.nombre}</p>
                    <p className="text-[10px] text-slate-500 font-normal">{row.cargo}</p>
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{row.diasCotizados}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                    {formatCOP(row.ibc)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-700">
                    {formatCOP(row.aporteSaludTotal)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-700">
                    {formatCOP(row.aportePensionTotal)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-700">{formatCOP(row.aporteArl)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-700">{formatCOP(row.aporteCaja)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-700">
                    {formatCOP(row.sena + row.icbf)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-indigo-900 bg-indigo-50/40">
                    {formatCOP(row.totalAportesSeguridad)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 font-mono font-bold text-slate-900 border-t-2 border-slate-300">
              <tr>
                <td colSpan={4} className="py-3 px-3 font-sans">
                  TOTALES PILA CONSOLIDADOS
                </td>
                <td className="py-3 px-3 text-right">{formatCOP(totalIbc)}</td>
                <td className="py-3 px-3 text-right">
                  {formatCOP(totalSaludEmpleador + totalSaludTrabajador)}
                </td>
                <td className="py-3 px-3 text-right">
                  {formatCOP(totalPensionEmpleador + totalPensionTrabajador)}
                </td>
                <td className="py-3 px-3 text-right">{formatCOP(totalArl)}</td>
                <td className="py-3 px-3 text-right">{formatCOP(totalCaja)}</td>
                <td className="py-3 px-3 text-right">{formatCOP(totalSena + totalIcbf)}</td>
                <td className="py-3 px-4 text-right text-indigo-950 bg-indigo-100/70">
                  {formatCOP(totalPila)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
