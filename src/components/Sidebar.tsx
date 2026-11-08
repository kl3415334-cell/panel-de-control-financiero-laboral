import React from 'react';
import {
  LayoutDashboard,
  Users,
  Calculator,
  CalendarCheck2,
  Gift,
  Building2,
  FileSpreadsheet,
  BookOpen,
  GitBranch,
  ShieldCheck,
  Briefcase,
  DownloadCloud,
  HelpCircle,
  ChevronRight,
  Shirt,
} from 'lucide-react';
import { RoleType } from '../types/payroll';

export type ActiveTab =
  | 'dashboard'
  | 'employees'
  | 'payroll'
  | 'novelties'
  | 'uniforms'
  | 'benefits'
  | 'social_security'
  | 'reports'
  | 'normativity'
  | 'phva'
  | 'job_manual'
  | 'installation'
  | 'user_manual'
  | 'audit';


interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  employeesCount: number;
  noveltiesCount: number;
  currentRole: RoleType;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  employeesCount,
  noveltiesCount,
  currentRole,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Panel Principal',
      subtitle: 'Resumen gerencial y métricas',
      icon: LayoutDashboard,
      badge: null,
      accessibleTo: ['auxiliar', 'admin', 'gerente', 'gestor'],
    },
    {
      id: 'employees' as ActiveTab,
      label: 'Empleados',
      subtitle: 'Directorio y contratos',
      icon: Users,
      badge: `${employeesCount}`,
      accessibleTo: ['auxiliar', 'admin', 'gerente', 'gestor'],
    },
    {
      id: 'payroll' as ActiveTab,
      label: 'Liquidación de Nómina',
      subtitle: 'Devengados, deducciones y neto',
      icon: Calculator,
      badge: 'Decenal/Mes',
      accessibleTo: ['auxiliar', 'admin', 'gerente'],
    },
    {
      id: 'novelties' as ActiveTab,
      label: 'Novedades Laborales',
      subtitle: 'Incapacidades, horas extras, permisos',
      icon: CalendarCheck2,
      badge: `${noveltiesCount}`,
      accessibleTo: ['auxiliar', 'admin', 'gerente'],
    },
    {
      id: 'uniforms' as ActiveTab,
      label: 'Dotaciones Laborales',
      subtitle: 'Calzado y vestido Art. 230',
      icon: Shirt,
      badge: 'Art. 230',
      accessibleTo: ['auxiliar', 'admin', 'gerente', 'gestor'],
    },
    {
      id: 'benefits' as ActiveTab,
      label: 'Prestaciones Sociales',
      subtitle: 'Cesantías, intereses, primas, vacaciones',
      icon: Gift,
      badge: null,
      accessibleTo: ['auxiliar', 'admin', 'gerente', 'gestor'],
    },
    {
      id: 'social_security' as ActiveTab,
      label: 'Seguridad Social & PILA',
      subtitle: 'Salud, pensión, ARL y parafiscales',
      icon: Building2,
      badge: '9% Paraf.',
      accessibleTo: ['auxiliar', 'admin', 'gerente'],
    },
    {
      id: 'reports' as ActiveTab,
      label: 'Informes & Documentos',
      subtitle: 'Exportación a Excel y comprobantes',
      icon: FileSpreadsheet,
      badge: '11 tipos',
      accessibleTo: ['auxiliar', 'admin', 'gerente', 'gestor'],
    },
    {
      id: 'normativity' as ActiveTab,
      label: 'Normatividad & Parámetros',
      subtitle: 'CST, Ley 2101, Ley 2466, SMLMV 2026',
      icon: BookOpen,
      badge: '2026',
      accessibleTo: ['auxiliar', 'admin', 'gerente', 'gestor'],
    },
    {
      id: 'phva' as ActiveTab,
      label: 'Flujograma PHVA',
      subtitle: 'Planear, Hacer, Verificar, Actuar',
      icon: GitBranch,
      badge: 'Calidad',
      accessibleTo: ['auxiliar', 'admin', 'gerente', 'gestor'],
    },
    {
      id: 'job_manual' as ActiveTab,
      label: 'Manual de Funciones',
      subtitle: 'Perfiles y responsabilidades',
      icon: Briefcase,
      badge: '4 Cargos',
      accessibleTo: ['auxiliar', 'admin', 'gerente', 'gestor'],
    },
    {
      id: 'user_manual' as ActiveTab,
      label: 'Manual de Usuario',
      subtitle: 'Guía paso a paso ilustrada',
      icon: HelpCircle,
      badge: '11 Capítulos',
      accessibleTo: ['auxiliar', 'admin', 'gerente', 'gestor'],
    },
    {
      id: 'installation' as ActiveTab,
      label: 'Instalación & Sistema',
      subtitle: 'PWA, usuarios y desinstalación',
      icon: DownloadCloud,
      badge: 'v2026.1',
      accessibleTo: ['admin', 'gerente'],
    },
    {
      id: 'audit' as ActiveTab,
      label: 'Auditoría & Seguridad',
      subtitle: 'Historial de cambios y copias',
      icon: ShieldCheck,
      badge: null,
      accessibleTo: ['admin', 'gerente'],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col shrink-0 no-print">
      {/* Navigation items */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Módulos del Sistema
        </div>

        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const isAllowed = item.accessibleTo.includes(currentRole);

          if (!isAllowed) {
            return (
              <div
                key={item.id}
                className="opacity-40 cursor-not-allowed flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-400"
                title="Acceso restringido para el perfil actual"
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </div>
                <span className="text-[10px] text-slate-400">Bloqueado</span>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <item.icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-amber-300' : 'text-slate-400 group-hover:text-amber-400'
                  }`}
                />
                <div className="truncate">
                  <p className="text-xs font-semibold leading-tight truncate">{item.label}</p>
                  <p
                    className={`text-[10px] truncate ${
                      isActive ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono tabular-nums shrink-0 ${
                    isActive
                      ? 'bg-blue-700 text-white border border-blue-500'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer info in sidebar */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-400">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-medium text-slate-300">Jornada Legal 2026</span>
          <span className="text-[11px] font-mono text-amber-400">42 hrs/sem</span>
        </div>
        <p className="text-[10px] leading-relaxed text-slate-400">
          Ley 2101 de 2021 · Salario Mínimo: <span className="font-mono text-slate-300">$1.750.905</span>
        </p>
      </div>
    </aside>
  );
};
