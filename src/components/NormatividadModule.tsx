import React, { useState } from 'react';
import {
  BookOpen,
  Scale,
  Save,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  Sliders,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { LegalParameters } from '../types/payroll';
import { DEFAULT_LEGAL_PARAMETERS_2026, NORMATIVITY_ARTICLES } from '../data/initialData';
import { formatCOP } from '../utils/calculations';

interface NormatividadModuleProps {
  legalParams: LegalParameters;
  onSaveParams: (params: LegalParameters) => void;
  canEdit: boolean;
}

export const NormatividadModule: React.FC<NormatividadModuleProps> = ({
  legalParams,
  onSaveParams,
  canEdit,
}) => {
  const [paramsForm, setParamsForm] = useState<LegalParameters>({ ...legalParams });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedLawIndex, setSelectedLawIndex] = useState(0);

  const handleResetDefaults = () => {
    setParamsForm({ ...DEFAULT_LEGAL_PARAMETERS_2026 });
    onSaveParams({ ...DEFAULT_LEGAL_PARAMETERS_2026 });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveParams(paramsForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const activeLaw = NORMATIVITY_ARTICLES[selectedLawIndex];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Marco Normativo Laboral & Parámetros Legales
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Fundamento legal colombiano aplicable a la nómina de la Corporación Social Somos Uno y configuración dinámica de variables.
          </p>
        </div>

        {saveSuccess && (
          <div className="px-3 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Parámetros actualizados y nómina recalculada
          </div>
        )}
      </div>

      {/* Main Grid: Parameters Form (Left) & Legal Encyclopedia (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Parameters Form: 5 cols */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Parámetros Económicos & Salario 2026
              </h3>
            </div>
            {canEdit && (
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-xs text-slate-500 hover:text-blue-700 flex items-center gap-1"
                title="Restablecer valores de referencia 2026"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Valores 2026
              </button>
            )}
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            {/* SMLMV y Aux Transporte */}
            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Salario Mínimo Mensual Vigente (SMLMV) *
                </label>
                <input
                  type="number"
                  disabled={!canEdit}
                  required
                  value={paramsForm.smlmv}
                  onChange={(e) => {
                    const smlmv = Number(e.target.value);
                    setParamsForm({
                      ...paramsForm,
                      smlmv,
                      maxSalaryForTransport: smlmv * 2,
                    });
                  }}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Referencia ejercicio 2026: $1.750.905
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Auxilio de Transporte Legal *
                </label>
                <input
                  type="number"
                  disabled={!canEdit}
                  required
                  value={paramsForm.transportAllowance}
                  onChange={(e) =>
                    setParamsForm({
                      ...paramsForm,
                      transportAllowance: Number(e.target.value),
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Referencia ejercicio 2026: $249.095 (Total mínimo con auxilio: $2.000.000)
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tope Salarial para Auxilio (2 SMLMV)
                </label>
                <input
                  type="number"
                  disabled
                  value={paramsForm.maxSalaryForTransport}
                  className="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-xs font-mono text-slate-600"
                />
              </div>
            </div>

            {/* Jornada laboral Ley 2101 de 2021 */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-slate-800 font-bold block mb-2 text-[11px] uppercase tracking-wider">
                Jornada Laboral Máxima (Ley 2101 de 2021)
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Horas Semanales</label>
                  <input
                    type="number"
                    disabled={!canEdit}
                    value={paramsForm.weeklyHours}
                    onChange={(e) => {
                      const weekly = Number(e.target.value);
                      const monthly = (weekly / 6) * 30;
                      setParamsForm({
                        ...paramsForm,
                        weeklyHours: weekly,
                        monthlyHours: monthly,
                      });
                    }}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
                  />
                  <span className="text-[10px] text-emerald-700 block mt-0.5">
                    Meta 42h (desde julio 2026)
                  </span>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Horas Mensuales Divisor</label>
                  <input
                    type="number"
                    disabled
                    value={paramsForm.monthlyHours}
                    className="w-full border border-slate-200 bg-slate-50 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-600"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    (42/6)*30 = 210 horas/mes
                  </span>
                </div>
              </div>
            </div>

            {/* Tarifas de Seguridad Social y Parafiscales */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-slate-800 font-bold block mb-2 text-[11px] uppercase tracking-wider">
                Tarifas de Cotización
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div className="p-2 border border-slate-100 rounded bg-slate-50">
                  <span className="text-slate-500 block text-[10px]">Salud Trabajador / Patrono</span>
                  <span className="font-mono font-bold">4.0% / 8.5%</span>
                </div>
                <div className="p-2 border border-slate-100 rounded bg-slate-50">
                  <span className="text-slate-500 block text-[10px]">Pensión Trabajador / Patrono</span>
                  <span className="font-mono font-bold">4.0% / 12.0%</span>
                </div>
                <div className="p-2 border border-slate-100 rounded bg-slate-50">
                  <span className="text-slate-500 block text-[10px]">ARL Riesgo I (Oficinas)</span>
                  <span className="font-mono font-bold">0.522%</span>
                </div>
                <div className="p-2 border border-slate-100 rounded bg-slate-50">
                  <span className="text-slate-500 block text-[10px]">Parafiscales (Caja, SENA, ICBF)</span>
                  <span className="font-mono font-bold">4% + 2% + 3% = 9%</span>
                </div>
              </div>
            </div>

            {/* Recargos de Horas Extras */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-slate-800 font-bold block mb-2 text-[11px] uppercase tracking-wider">
                Recargos Legales de Horas Extras
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-1.5 border border-slate-100 rounded">
                  <span className="text-slate-500 block text-[10px]">Extra Diurna</span>
                  <span>+25% (Factor 1.25)</span>
                </div>
                <div className="p-1.5 border border-slate-100 rounded">
                  <span className="text-slate-500 block text-[10px]">Extra Nocturna</span>
                  <span>+75% (Factor 1.75)</span>
                </div>
                <div className="p-1.5 border border-slate-100 rounded">
                  <span className="text-slate-500 block text-[10px]">Recargo Nocturno Ord.</span>
                  <span>+35% (Factor 0.35)</span>
                </div>
                <div className="p-1.5 border border-slate-100 rounded">
                  <span className="text-slate-500 block text-[10px]">Dominical / Festivo</span>
                  <span>+75% (Ley 2466)</span>
                </div>
              </div>
            </div>

            {canEdit ? (
              <div className="pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Guardar & Recalcular Toda la Plataforma
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic text-center pt-2">
                * Se requiere perfil de Administración o Gerencia para modificar parámetros legales.
              </p>
            )}
          </form>
        </div>

        {/* Legal Encyclopedia: 7 cols */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Scale className="w-4 h-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Compendio de Leyes y Decretos Laborales Colombianos
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Consulte la base jurídica que sustenta los devengados, descuentos y prestaciones de la nómina:
            </p>

            {/* Laws Pills / Selector */}
            <div className="flex flex-wrap gap-1.5 pb-3 border-b border-slate-100">
              {NORMATIVITY_ARTICLES.map((law, idx) => (
                <button
                  key={law.code}
                  onClick={() => setSelectedLawIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedLawIndex === idx
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {law.code}
                </button>
              ))}
            </div>

            {/* Selected Law Details */}
            <div className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-blue-950 text-sm">{activeLaw.code}</h4>
                  <span className="text-[11px] text-blue-700 font-semibold">
                    {activeLaw.theme}
                  </span>
                </div>
                <p className="text-blue-900/80 mt-1 leading-relaxed">
                  {activeLaw.summary}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2.5">
                  Artículos & Disposiciones Relevantes:
                </h5>
                <div className="space-y-2">
                  {activeLaw.articles.map((art) => (
                    <div
                      key={art.num}
                      className="p-3 rounded-lg border border-slate-100 bg-slate-50"
                    >
                      <span className="font-bold text-slate-900 text-xs block mb-0.5">
                        {art.num}
                      </span>
                      <p className="text-slate-600 leading-relaxed text-[11px]">{art.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Legal Compliance Guarantee Note */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm text-emerald-950 mb-0.5">
                Cumplimiento Estricto del Principio de Legalidad
              </span>
              <p className="text-emerald-900/80 leading-relaxed">
                Toda retención, deducción y aporte efectuado en esta plataforma se sustenta en norma expresa legal (CST, Ley 100, Ley 2101) o en autorización expresa y voluntaria del trabajador, garantizando la seguridad jurídica de la Corporación Social Somos Uno frente a entes de fiscalización como la UGPP y el Ministerio del Trabajo.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
