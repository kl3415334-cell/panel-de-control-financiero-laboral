import React, { useState } from 'react';
import {
  Gift,
  HelpCircle,
  FileCheck,
  Calendar,
  Sparkles,
  Calculator,
  ArrowRight,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { EmployeeLiquidation, LegalParameters } from '../types/payroll';
import { formatCOP, formatNumber, exportToCSV } from '../utils/calculations';

interface BenefitsModuleProps {
  liquidations: EmployeeLiquidation[];
  legalParams: LegalParameters;
}

export const BenefitsModule: React.FC<BenefitsModuleProps> = ({
  liquidations,
  legalParams,
}) => {
  // Simulator for final settlement by custom days
  const [simDays, setSimDays] = useState<number>(360);
  const [extralegalBonus, setExtralegalBonus] = useState<{ [empId: string]: number }>({});

  const handleExportBenefitsCSV = () => {
    const headers = [
      'Documento',
      'Empleado',
      'Cargo',
      'Base Prestaciones (con Auxilio)',
      'Base Vacaciones (sin Auxilio)',
      'Provisión Cesantías (8.33%)',
      'Intereses a Cesantías (1%)',
      'Prima de Servicios (8.33%)',
      'Vacaciones (4.167%)',
      'Total Prestaciones Mensuales',
    ];

    const rows = liquidations.map((l) => [
      l.employee.documentNumber,
      l.employee.fullName,
      l.employee.position,
      Math.round(l.basePrestaciones),
      Math.round(l.baseVacaciones),
      Math.round(l.provisionCesantias),
      Math.round(l.provisionInteresesCesantias),
      Math.round(l.provisionPrima),
      Math.round(l.provisionVacaciones),
      Math.round(l.totalPrestaciones),
    ]);

    exportToCSV('Prestaciones_Sociales_Somos_Uno_2026', headers, rows);
  };

  const totalCesantias = liquidations.reduce((sum, l) => sum + l.provisionCesantias, 0);
  const totalIntereses = liquidations.reduce((sum, l) => sum + l.provisionInteresesCesantias, 0);
  const totalPrima = liquidations.reduce((sum, l) => sum + l.provisionPrima, 0);
  const totalVacaciones = liquidations.reduce((sum, l) => sum + l.provisionVacaciones, 0);
  const grandTotal = totalCesantias + totalIntereses + totalPrima + totalVacaciones;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Liquidación & Provisión de Prestaciones Sociales
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cálculos automáticos de cesantías, intereses a cesantías, prima de servicios y vacaciones conforme al Código Sustantivo del Trabajo.
          </p>
        </div>

        <button
          onClick={handleExportBenefitsCSV}
          className="px-3.5 py-2 border border-slate-300 rounded-lg text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-600" />
          Descargar Reporte (.csv)
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 block">Cesantías (8.33%)</span>
          <span className="text-lg font-bold font-mono text-slate-900">
            {formatCOP(totalCesantias)}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">Base incluye auxilio</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 block">Intereses Cesantías (1%)</span>
          <span className="text-lg font-bold font-mono text-slate-900">
            {formatCOP(totalIntereses)}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">12% anual sobre cesantías</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 block">Prima de Servicios (8.33%)</span>
          <span className="text-lg font-bold font-mono text-slate-900">
            {formatCOP(totalPrima)}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">Semestral (Junio/Diciembre)</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 block">Vacaciones (4.167%)</span>
          <span className="text-lg font-bold font-mono text-slate-900">
            {formatCOP(totalVacaciones)}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">15 días/año (sin auxilio)</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-slate-900 p-4 rounded-xl border border-slate-800 text-white shadow-sm">
          <span className="text-[11px] font-medium text-blue-200 block">Provisión Total Mes</span>
          <span className="text-lg font-bold font-mono text-amber-300">
            {formatCOP(grandTotal)}
          </span>
          <p className="text-[10px] text-blue-300 mt-0.5">Carga prestacional corporativa</p>
        </div>
      </div>

      {/* Main Prestaciones Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Cuadro Comparativo de Liquidación Mensual por Colaborador
            </h3>
            <p className="text-xs text-slate-500">
              Correspondencia directa con la tabla del simulacro académico de la Corporación Social Somos Uno
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="text-left py-3 px-4 font-semibold">Colaborador / Cargo</th>
                <th className="text-right py-3 px-3 font-semibold">Base Cesantías & Prima</th>
                <th className="text-right py-3 px-3 font-semibold">Base Vacaciones</th>
                <th className="text-right py-3 px-3 font-semibold text-blue-800">
                  Cesantías (8.33%)
                </th>
                <th className="text-right py-3 px-3 font-semibold text-indigo-800">
                  Intereses (1%)
                </th>
                <th className="text-right py-3 px-3 font-semibold text-emerald-800">
                  Prima (8.33%)
                </th>
                <th className="text-right py-3 px-3 font-semibold text-amber-800">
                  Vacaciones (4.167%)
                </th>
                <th className="text-right py-3 px-4 font-semibold bg-slate-100 text-slate-900">
                  Total Acumulado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {liquidations.map((l) => (
                <tr key={l.employee.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">
                    <p>{l.employee.position}</p>
                    <p className="text-[11px] text-slate-500 font-normal">{l.employee.fullName}</p>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-800 font-semibold">
                    {formatCOP(l.basePrestaciones)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-600">
                    {formatCOP(l.baseVacaciones)}
                  </td>
                  <td className="py-3 px-3 text-right text-blue-700 font-semibold">
                    {formatCOP(l.provisionCesantias)}
                  </td>
                  <td className="py-3 px-3 text-right text-indigo-700 font-semibold">
                    {formatCOP(l.provisionInteresesCesantias)}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-700 font-semibold">
                    {formatCOP(l.provisionPrima)}
                  </td>
                  <td className="py-3 px-3 text-right text-amber-700 font-semibold">
                    {formatCOP(l.provisionVacaciones)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 bg-slate-50">
                    {formatCOP(l.totalPrestaciones)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 font-mono font-bold text-slate-900 border-t-2 border-slate-300">
              <tr>
                <td className="py-3 px-4 font-sans">TOTALES CONSOLIDADOS</td>
                <td className="py-3 px-3 text-right">--</td>
                <td className="py-3 px-3 text-right">--</td>
                <td className="py-3 px-3 text-right text-blue-800">{formatCOP(totalCesantias)}</td>
                <td className="py-3 px-3 text-right text-indigo-800">{formatCOP(totalIntereses)}</td>
                <td className="py-3 px-3 text-right text-emerald-800">{formatCOP(totalPrima)}</td>
                <td className="py-3 px-3 text-right text-amber-800">{formatCOP(totalVacaciones)}</td>
                <td className="py-3 px-4 text-right text-slate-900 bg-slate-200">
                  {formatCOP(grandTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Legal Formulas and Guidelines Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-4 h-4 text-blue-700" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Fórmulas Legales de Liquidación en Colombia (CST)
            </h4>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="font-sans font-semibold text-slate-900 block text-[11px]">
                1. Auxilio de Cesantías (Art. 249 CST)
              </span>
              <p className="text-blue-700 mt-0.5">
                Cesantías = (Base con auxilio × Días trabajados) / 360
              </p>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                Equivale a 1 mes de salario por cada año de servicios laborado.
              </p>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="font-sans font-semibold text-slate-900 block text-[11px]">
                2. Intereses a las Cesantías (Ley 52 de 1975)
              </span>
              <p className="text-indigo-700 mt-0.5">
                Intereses = (Cesantías acumuladas × Días trabajados × 12%) / 360
              </p>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                Se pagan directamente al trabajador a más tardar el 31 de enero.
              </p>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="font-sans font-semibold text-slate-900 block text-[11px]">
                3. Prima de Servicios (Art. 306 CST)
              </span>
              <p className="text-emerald-700 mt-0.5">
                Prima = (Base con auxilio × Días laborados en el semestre) / 360
              </p>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                Se paga en dos cuotas: mitad en junio y mitad los primeros 20 días de diciembre.
              </p>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="font-sans font-semibold text-slate-900 block text-[11px]">
                4. Vacaciones (Art. 186 CST)
              </span>
              <p className="text-amber-700 mt-0.5">
                Vacaciones = (Salario básico × Días trabajados) / 720
              </p>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                15 días hábiles consecutivos por año. NO incluye el auxilio de transporte.
              </p>
            </div>
          </div>
        </div>

        {/* Extralegal Benefits & Annual Settlement Simulator */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Simulador de Liquidación Definitiva por Días
              </h4>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Calcule la liquidación de prestaciones para cualquier período acumulado de días laborados en el año:
            </p>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium text-slate-700">Días a simular:</span>
              <input
                type="number"
                min={1}
                max={360}
                value={simDays}
                onChange={(e) => setSimDays(Math.max(1, Math.min(360, Number(e.target.value))))}
                className="w-24 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-center"
              />
              <div className="flex gap-1 text-[11px]">
                <button
                  onClick={() => setSimDays(180)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200"
                >
                  Semestre (180d)
                </button>
                <button
                  onClick={() => setSimDays(360)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200"
                >
                  Año (360d)
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {liquidations.map((l) => {
                const simCesantias = (l.basePrestaciones * simDays) / 360;
                const simIntereses = (simCesantias * simDays * 0.12) / 360;
                const simPrima = (l.basePrestaciones * simDays) / 360;
                const simVacaciones = (l.baseVacaciones * simDays) / 720;
                const simTotal = simCesantias + simIntereses + simPrima + simVacaciones;

                return (
                  <div
                    key={l.employee.id}
                    className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{l.employee.position}</span>
                      <span className="text-[11px] text-slate-500 block">
                        Cesantías: {formatCOP(simCesantias)} · Prima: {formatCOP(simPrima)}
                      </span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-xs font-bold text-blue-800">
                        {formatCOP(simTotal)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Total en {simDays} días</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-xs text-amber-900">
            <span className="font-bold block mb-0.5">Primas Extralegales (Pactadas):</span>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              La Corporación Social Somos Uno puede reconocer beneficios adicionales (bonificación por cumplimiento, prima extralegal de fin de año o auxilio educativo) mediante acuerdo expreso de las partes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
