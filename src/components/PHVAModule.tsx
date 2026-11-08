import React, { useState } from 'react';
import {
  GitBranch,
  Calendar,
  CheckCircle2,
  FileText,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  RotateCw,
  Layers,
  ShieldCheck,
  Building,
  CheckSquare,
  Square,
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface PHVAModuleProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

interface PHVAStep {
  phase: 'P' | 'H' | 'V' | 'A';
  letter: string;
  name: string;
  subtitle: string;
  responsible: string;
  color: string;
  borderColor: string;
  bgColor: string;
  activities: string[];
  moduleLink: ActiveTab;
  moduleLabel: string;
}

export const PHVAModule: React.FC<PHVAModuleProps> = ({ onNavigateTab }) => {
  const [activePhase, setActivePhase] = useState<'P' | 'H' | 'V' | 'A'>('P');
  const [completedTasks, setCompletedTasks] = useState<{ [key: string]: boolean }>({
    'P-1': true,
    'P-2': true,
    'H-1': true,
    'H-2': true,
    'V-1': true,
  });

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const steps: PHVAStep[] = [
    {
      phase: 'P',
      letter: 'P',
      name: 'PLANEAR',
      subtitle: 'Organización contractual & calendario',
      responsible: 'Auxiliar Contable & Administración',
      color: 'text-blue-700',
      borderColor: 'border-blue-600',
      bgColor: 'bg-blue-50',
      activities: [
        'Identificar contratos laborales vigentes y tipos de vinculación.',
        'Establecer salarios básicos mensuales y validar derecho al auxilio de transporte.',
        'Definir calendario de pagos (ciclos cada 10 días, quincenal o mensual).',
        'Identificar obligaciones legales laborales y presupuestos por proyecto social.',
      ],
      moduleLink: 'employees',
      moduleLabel: 'Ir al Directorio de Empleados',
    },
    {
      phase: 'H',
      letter: 'H',
      name: 'HACER',
      subtitle: 'Ejecución de cálculos & dispersión',
      responsible: 'Auxiliar Contable & Gerencia',
      color: 'text-emerald-700',
      borderColor: 'border-emerald-600',
      bgColor: 'bg-emerald-50',
      activities: [
        'Registrar novedades del período (incapacidades, horas extras, permisos y vacaciones).',
        'Calcular devengados (salarios, auxilios, recargos y bonificaciones).',
        'Aplicar deducciones de ley (4% salud y 4% pensión sobre IBC).',
        'Liquidar provisiones de prestaciones sociales y aportes PILA.',
        'Realizar dispersión bancaria y pagos netos autorizados.',
      ],
      moduleLink: 'payroll',
      moduleLabel: 'Ir a Liquidación de Nómina',
    },
    {
      phase: 'V',
      letter: 'V',
      name: 'VERIFICAR',
      subtitle: 'Auditoría, control & conciliación',
      responsible: 'Administración & Control Interno',
      color: 'text-amber-700',
      borderColor: 'border-amber-600',
      bgColor: 'bg-amber-50',
      activities: [
        'Revisar cálculos matemáticos de nómina y cotejar con novedades radicadas.',
        'Comparar pagos dispersados contra contratos laborales y acuerdos pactados.',
        'Verificar planilla de aportes al Sistema de Seguridad Social Integral (PILA).',
        'Revisar informes de deducciones, retenciones y soportes documentales.',
      ],
      moduleLink: 'reports',
      moduleLabel: 'Ir al Módulo de Informes',
    },
    {
      phase: 'A',
      letter: 'A',
      name: 'ACTUAR',
      subtitle: 'Mejora continua & retroalimentación',
      responsible: 'Gerencia General & Equipo Directivo',
      color: 'text-purple-700',
      borderColor: 'border-purple-600',
      bgColor: 'bg-purple-50',
      activities: [
        'Corregir inconsistencias detectadas en la liquidación de nómina.',
        'Actualizar parámetros normativos (SMLMV, auxilio de transporte, Ley 2101).',
        'Mejorar los procedimientos operativos y documentales de la Corporación.',
        'Implementar controles preventivos para el siguiente ciclo de nómina.',
      ],
      moduleLink: 'normativity',
      moduleLabel: 'Ir a Normatividad & Parámetros',
    },
  ];

  const currentStep = steps.find((s) => s.phase === activePhase)!;

  // Calculate percentage of tasks completed
  const totalTasksCount = steps.reduce((sum, s) => sum + s.activities.length, 0);
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPct = Math.round((completedCount / totalTasksCount) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-blue-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Flujograma de Gestión de Nómina con Ciclo PHVA
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enfoque de gestión de calidad continua: Planear → Hacer → Verificar → Actuar para la Corporación Social Somos Uno.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg self-start sm:self-auto">
          <RotateCw className="w-4 h-4 text-blue-700 animate-spin-slow" />
          <div className="text-xs">
            <span className="text-slate-500 block text-[10px]">Madurez del Ciclo Actual:</span>
            <span className="font-bold text-slate-900 font-mono">{progressPct}% Completado</span>
          </div>
        </div>
      </div>

      {/* Interactive 4-Phase Stepper Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step) => {
          const isSelected = activePhase === step.phase;
          return (
            <button
              key={step.phase}
              onClick={() => setActivePhase(step.phase)}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? `${step.bgColor} ${step.borderColor} border-2 shadow-sm scale-[1.01]`
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`w-8 h-8 rounded-lg font-black text-sm flex items-center justify-center ${
                    isSelected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {step.letter}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-600">
                  Fase {step.phase}
                </span>
              </div>

              <h3 className={`font-bold text-sm ${isSelected ? step.color : 'text-slate-900'}`}>
                {step.name}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{step.subtitle}</p>

              {/* Indicator bar */}
              <div
                className={`mt-3 h-1 rounded-full ${
                  isSelected ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              ></div>
            </button>
          );
        })}
      </div>

      {/* Detailed Phase Inspection Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-black bg-blue-100 text-blue-800">
                FASE {currentStep.letter}
              </span>
              <h3 className="text-lg font-bold text-slate-900">{currentStep.name}</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Responsables: <span className="font-semibold text-slate-800">{currentStep.responsible}</span>
            </p>
          </div>

          <button
            onClick={() => onNavigateTab(currentStep.moduleLink)}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <span>{currentStep.moduleLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Activities Checklist */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Actividades Específicas del Procedimiento de Nómina:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {currentStep.activities.map((act, idx) => {
              const taskId = `${currentStep.phase}-${idx + 1}`;
              const isDone = !!completedTasks[taskId];

              return (
                <div
                  key={taskId}
                  onClick={() => toggleTask(taskId)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                    isDone
                      ? 'bg-slate-50/80 border-emerald-200 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <button className="mt-0.5 shrink-0 text-emerald-600">
                    {isDone ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  <div>
                    <span className="font-semibold text-slate-800 text-[11px] block mb-0.5">
                      Paso {currentStep.phase}.{idx + 1}
                    </span>
                    <p className={`text-xs ${isDone ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                      {act}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Continuous Improvement Flowchart Sequence Diagram */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Secuencia Operativa del Ciclo de Nómina:
          </h4>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <span className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-[11px]">
                1
              </span>
              <span>PLANEAR contratos & fechas</span>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />

            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[11px]">
                2
              </span>
              <span>HACER novedades & pagos</span>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />

            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <span className="w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-[11px]">
                3
              </span>
              <span>VERIFICAR cálculos & PILA</span>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />

            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <span className="w-6 h-6 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-[11px]">
                4
              </span>
              <span>ACTUAR & reiniciar ciclo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
