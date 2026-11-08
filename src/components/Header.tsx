import React from 'react';
import {
  Shield,
  Bell,
  Download,
  Upload,
  Calendar,
  Layers,
  Sparkles,
  Lock,
} from 'lucide-react';
import { PayrollFrequency, RoleType, UserRole } from '../types/payroll';
import { USER_ROLES } from '../data/initialData';

interface HeaderProps {
  currentRole: RoleType;
  onRoleChange: (role: RoleType) => void;
  frequency: PayrollFrequency;
  onFrequencyChange: (freq: PayrollFrequency) => void;
  periodNumber: number;
  onPeriodNumberChange: (p: number) => void;
  includeNovelties: boolean;
  onToggleNovelties: () => void;
  onOpenBackup: () => void;
  onOpenAudit: () => void;
  alertsCount: number;
  onOpenAlerts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  frequency,
  onFrequencyChange,
  periodNumber,
  onPeriodNumberChange,
  includeNovelties,
  onToggleNovelties,
  onOpenBackup,
  onOpenAudit,
  alertsCount,
  onOpenAlerts,
}) => {
  const roleData: UserRole = USER_ROLES[currentRole];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top Banner with Brand Identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-700 via-blue-800 to-amber-600 flex items-center justify-center shadow-inner border border-amber-400/30">
              <span className="text-white font-black tracking-wider text-sm">SU</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">
                  Corporación Social Somos Uno
                </span>
                <span className="hidden sm:inline-block text-[11px] font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  NIT 901.458.239-1
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Plataforma Integral de Gestión, Administración y Liquidación de Nómina · Colombia 2026
              </p>
            </div>
          </div>

          {/* Period & Simulation Controls */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/60 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 pl-1.5 pr-2 font-medium">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Período:
            </span>
            
            {/* Frequency Selector */}
            <div className="flex items-center bg-slate-900 rounded p-0.5 border border-slate-700">
              <button
                onClick={() => {
                  onFrequencyChange('decenal');
                  onPeriodNumberChange(1);
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  frequency === 'decenal'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Pago cada 10 días (3 pagos al mes)"
              >
                Decenal (10d)
              </button>
              <button
                onClick={() => {
                  onFrequencyChange('quincenal');
                  onPeriodNumberChange(1);
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  frequency === 'quincenal'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Pago quincenal (2 pagos al mes)"
              >
                Quincenal (15d)
              </button>
              <button
                onClick={() => {
                  onFrequencyChange('mensual');
                  onPeriodNumberChange(1);
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  frequency === 'mensual'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Liquidación mensual completa (30 días)"
              >
                Mensual (30d)
              </button>
            </div>

            {/* Sub-period if decenal or quincenal */}
            {frequency === 'decenal' && (
              <div className="flex items-center gap-1 pl-1">
                <button
                  onClick={() => onPeriodNumberChange(1)}
                  className={`px-2 py-0.5 rounded text-[11px] ${
                    periodNumber === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Días 1-10
                </button>
                <button
                  onClick={() => onPeriodNumberChange(2)}
                  className={`px-2 py-0.5 rounded text-[11px] ${
                    periodNumber === 2 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Días 11-20
                </button>
                <button
                  onClick={() => onPeriodNumberChange(3)}
                  className={`px-2 py-0.5 rounded text-[11px] ${
                    periodNumber === 3 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Días 21-30
                </button>
              </div>
            )}

            {frequency === 'quincenal' && (
              <div className="flex items-center gap-1 pl-1">
                <button
                  onClick={() => onPeriodNumberChange(1)}
                  className={`px-2 py-0.5 rounded text-[11px] ${
                    periodNumber === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1ª Quincena (1-15)
                </button>
                <button
                  onClick={() => onPeriodNumberChange(2)}
                  className={`px-2 py-0.5 rounded text-[11px] ${
                    periodNumber === 2 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2ª Quincena (16-30)
                </button>
              </div>
            )}

            {/* Mode: Base Document Scenario vs Live Novelties */}
            <div className="border-l border-slate-700 pl-2 ml-1">
              <button
                onClick={onToggleNovelties}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all ${
                  includeNovelties
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-semibold'
                    : 'bg-slate-700/60 text-slate-300 hover:text-white border border-slate-600'
                }`}
                title="Alternar entre escenario base sin novedades (documento) y cálculo con novedades aplicadas"
              >
                <Layers className="w-3 h-3" />
                {includeNovelties ? 'Con Novedades' : 'Escenario Base'}
              </button>
            </div>
          </div>

          {/* Right Zone: System Tools & Role Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Alerts button */}
            <button
              onClick={onOpenAlerts}
              className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Alertas de pagos y vencimientos laborales"
            >
              <Bell className="w-4 h-4" />
              {alertsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400"></span>
              )}
            </button>

            {/* Backup & System button */}
            <button
              onClick={onOpenBackup}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors hidden sm:block"
              title="Copias de seguridad y auditoría del sistema"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Role Switcher Dropdown */}
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 gap-2">
              <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-400 leading-tight">Perfil activo:</span>
                <select
                  value={currentRole}
                  onChange={(e) => onRoleChange(e.target.value as RoleType)}
                  aria-label="Seleccionar perfil activo"
                  className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-1"
                >
                  <option value="auxiliar" className="bg-slate-900 text-white">
                    Auxiliar Contable (C. Mendoza)
                  </option>
                  <option value="admin" className="bg-slate-900 text-white">
                    Administración (M. Ríos)
                  </option>
                  <option value="gerente" className="bg-slate-900 text-white">
                    Gerente General (Dr. Salazar)
                  </option>
                  <option value="gestor" className="bg-slate-900 text-white">
                    Gestor Proyectos (P. Duque)
                  </option>
                </select>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
