import React, { useState } from 'react';
import {
  DownloadCloud,
  Trash2,
  Settings,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Building,
  UserPlus,
  KeyRound,
  Database,
  Lock,
  Layers,
  Save,
  Laptop,
  Smartphone,
  Info,
  History,
} from 'lucide-react';
import { CompanyConfig, RoleType, SystemUser, LegalParameters } from '../types/payroll';
import { USER_ROLES } from '../data/initialData';

interface InstallationModuleProps {
  companyConfig: CompanyConfig;
  onSaveCompanyConfig: (config: CompanyConfig) => void;
  systemUsers: SystemUser[];
  onSaveSystemUsers: (users: SystemUser[]) => void;
  onExportBackup: () => void;
  onResetFactoryData: () => void;
  legalParams: LegalParameters;
  currentRole: RoleType;
}

export const InstallationModule: React.FC<InstallationModuleProps> = ({
  companyConfig,
  onSaveCompanyConfig,
  systemUsers,
  onSaveSystemUsers,
  onExportBackup,
  onResetFactoryData,
  legalParams,
  currentRole,
}) => {
  const [activeTab, setActiveTab] = useState<'install' | 'uninstall' | 'config'>('install');
  const [companyForm, setCompanyForm] = useState<CompanyConfig>({ ...companyConfig });
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // New admin user state
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    fullName: '',
    email: '',
    role: 'admin' as RoleType,
    password: '',
    confirmPassword: '',
  });

  // Uninstall state
  const [uninstallStep, setUninstallStep] = useState<1 | 2 | 3>(1);
  const [uninstallPassword, setUninstallPassword] = useState('');
  const [hasBackedUp, setHasBackedUp] = useState(false);
  const [uninstallError, setUninstallError] = useState<string | null>(null);

  // Updates check
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCompanyConfig(companyForm);
    setSaveSuccess('Datos empresariales guardados exitosamente.');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleCreateAdminUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdmin.password !== newAdmin.confirmPassword) {
      alert('Las contraseñas no coinciden. Por favor verifique.');
      return;
    }
    const newUser: SystemUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      username: newAdmin.username,
      fullName: newAdmin.fullName,
      email: newAdmin.email,
      role: newAdmin.role,
      status: 'active',
      lastLogin: 'Pendiente primer ingreso',
    };
    onSaveSystemUsers([...systemUsers, newUser]);
    setNewAdmin({
      username: '',
      fullName: '',
      email: '',
      role: 'admin',
      password: '',
      confirmPassword: '',
    });
    setSaveSuccess(`Usuario ${newUser.fullName} creado y configurado.`);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleTriggerInstall = () => {
    // Check if beforeinstallprompt is available or alert user instructions
    if ('standalone' in window.navigator && (window.navigator as any).standalone) {
      alert('La plataforma ya se encuentra instalada en modo de aplicación en este dispositivo.');
    } else {
      alert(
        'Para instalar la plataforma en su dispositivo:\n\n1. En Chrome / Edge: Haga clic en el ícono de instalación (icono de computadora o "+" en la barra de direcciones).\n2. En Windows: Seleccione "Instalar Nómina Somos Uno".\n3. En Móvil / Safari: Seleccione Compartir -> "Agregar a pantalla de inicio".\n\nTendrá acceso directo desde su escritorio y menú de inicio.'
      );
    }
  };

  const handleCheckUpdates = () => {
    setIsCheckingUpdate(true);
    setUpdateMessage(null);
    setTimeout(() => {
      setIsCheckingUpdate(false);
      setUpdateMessage('La plataforma se encuentra en la versión más reciente (v2026.1.4). Normatividad 2026 y Ley 2101 al día.');
    }, 1200);
  };

  const handleExecuteUninstall = () => {
    if (!hasBackedUp) {
      setUninstallError('Es obligatorio generar y descargar una copia de seguridad antes de proceder.');
      return;
    }
    if (uninstallPassword !== 'somosuno2026' && uninstallPassword !== 'admin123') {
      setUninstallError('Contraseña de administrador incorrecta. No se autoriza el restablecimiento.');
      return;
    }
    onResetFactoryData();
    setUninstallStep(3);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Instalación, Desinstalación & Administración del Sistema
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configuración inicial de la entidad, gestión de acceso de escritorio/móvil, administración de usuarios y ciclo de vida de la plataforma.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('install')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'install'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DownloadCloud className="w-3.5 h-3.5 text-blue-700" />
            Instalar Plataforma
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'config'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-amber-700" />
            Configuración del Sistema
          </button>
          <button
            onClick={() => setActiveTab('uninstall')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'uninstall'
                ? 'bg-white text-red-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-red-700'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
            Desinstalar Plataforma
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* TAB 1: INSTALAR PLATAFORMA */}
      {activeTab === 'install' && (
        <div className="space-y-6">
          {/* Quick Install Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-xl">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Acceso Nativo de Escritorio & PWA
              </span>
              <h3 className="text-lg font-bold text-white">
                Instalar Aplicación en Dispositivo (Windows / macOS / Android / iOS)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Permite ejecutar la plataforma directamente desde su escritorio o menú de aplicaciones, sin barras de navegación del explorador y con funcionamiento óptimo fuera de línea.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                onClick={handleTriggerInstall}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
              >
                <DownloadCloud className="w-4 h-4 text-slate-950" />
                Instalar en Este Dispositivo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Step 1: Datos Iniciales de la Empresa */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Building className="w-4 h-4 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  1. Configuración de Datos Iniciales de la Entidad
                </h3>
              </div>

              <form onSubmit={handleCompanySubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Razón Social *</label>
                  <input
                    type="text"
                    required
                    value={companyForm.businessName}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, businessName: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">NIT con Dígito *</label>
                    <input
                      type="text"
                      required
                      value={companyForm.nit}
                      onChange={(e) => setCompanyForm({ ...companyForm, nit: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Ciudad Sede</label>
                    <input
                      type="text"
                      value={companyForm.city}
                      onChange={(e) => setCompanyForm({ ...companyForm, city: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Dirección Principal</label>
                  <input
                    type="text"
                    value={companyForm.address}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, address: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Teléfono</label>
                    <input
                      type="text"
                      value={companyForm.phone}
                      onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Correo Institucional</label>
                    <input
                      type="email"
                      value={companyForm.email}
                      onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Representante Legal</label>
                  <input
                    type="text"
                    value={companyForm.legalRepresentative}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, legalRepresentative: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Guardar Parámetros de la Entidad
                  </button>
                </div>
              </form>
            </div>

            {/* Step 2: Crear Usuario Administrador & Roles */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <UserPlus className="w-4 h-4 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  2. Crear Usuario Administrador & Asignar Permisos
                </h3>
              </div>

              <form onSubmit={handleCreateAdminUser} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Martha Lucia Ríos"
                    value={newAdmin.fullName}
                    onChange={(e) => setNewAdmin({ ...newAdmin, fullName: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Nombre de Usuario *</label>
                    <input
                      type="text"
                      required
                      placeholder="martha.rios"
                      value={newAdmin.username}
                      onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Perfil / Rol *</label>
                    <select
                      value={newAdmin.role}
                      onChange={(e) =>
                        setNewAdmin({ ...newAdmin, role: e.target.value as RoleType })
                      }
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                    >
                      <option value="admin">Administración (Verificación & Control)</option>
                      <option value="gerente">Gerente (Autorización de Pagos)</option>
                      <option value="auxiliar">Auxiliar Contable (Preparación)</option>
                      <option value="gestor">Gestor de Proyectos (Costos)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="martha.rios@somosuno.org.co"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Contraseña *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Confirmar Contraseña *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newAdmin.confirmPassword}
                      onChange={(e) =>
                        setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    Crear Credenciales & Habilitar Acceso
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Matriz de Permisos por Perfil */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              3. Matriz de Control de Acceso & Permisos por Perfil (RBAC)
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                    <th className="py-2.5 px-3 text-left">Módulo / Acción</th>
                    <th className="py-2.5 px-3 text-center">Auxiliar Contable</th>
                    <th className="py-2.5 px-3 text-center">Administración</th>
                    <th className="py-2.5 px-3 text-center">Gerente General</th>
                    <th className="py-2.5 px-3 text-center">Gestor Proyectos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-center">
                  <tr>
                    <td className="py-2 px-3 text-left font-medium text-slate-800">
                      Registrar y editar empleados
                    </td>
                    <td className="text-emerald-600 font-bold">✓ Sí</td>
                    <td className="text-emerald-600 font-bold">✓ Sí</td>
                    <td className="text-emerald-600 font-bold">✓ Sí</td>
                    <td className="text-slate-400">✗ Solo lectura</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-left font-medium text-slate-800">
                      Registrar novedades laborales
                    </td>
                    <td className="text-emerald-600 font-bold">✓ Sí</td>
                    <td className="text-emerald-600 font-bold">✓ Sí</td>
                    <td className="text-emerald-600 font-bold">✓ Sí</td>
                    <td className="text-slate-400">✗ Bloqueado</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-left font-medium text-slate-800">
                      Preparar borradores de nómina
                    </td>
                    <td className="text-emerald-600 font-bold">✓ Sí (Prepara)</td>
                    <td className="text-emerald-600 font-bold">✓ Sí</td>
                    <td className="text-emerald-600 font-bold">✓ Sí</td>
                    <td className="text-slate-400">✗ Bloqueado</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-left font-medium text-slate-800">
                      Verificar y aprobar administrativamente
                    </td>
                    <td className="text-slate-400">✗ Sin permiso</td>
                    <td className="text-emerald-600 font-bold">✓ Sí (Verifica)</td>
                    <td className="text-emerald-600 font-bold">✓ Sí</td>
                    <td className="text-slate-400">✗ Bloqueado</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-left font-medium text-slate-800">
                      Autorizar desembolsos y pagos
                    </td>
                    <td className="text-slate-400">✗ Sin permiso</td>
                    <td className="text-slate-400">✗ Sin permiso</td>
                    <td className="text-emerald-600 font-bold">✓ Sí (Autoriza)</td>
                    <td className="text-slate-400">✗ Bloqueado</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-left font-medium text-slate-800">
                      Consultar costos por proyecto
                    </td>
                    <td className="text-emerald-600 font-bold">✓ Sí</td>
                    <td className="text-emerald-600 font-bold">✓ Sí</td>
                    <td className="text-emerald-600 font-bold">✓ Sí</td>
                    <td className="text-emerald-600 font-bold">✓ Sí (Especializado)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONFIGURACIÓN DEL SISTEMA */}
      {activeTab === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Version and Updates */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Actualización & Mantenimiento de la Plataforma
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded">
                v2026.1.4
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              La plataforma incluye el motor normativo de liquidación laboral 2026, jornada ordinaria de 42 horas (Ley 2101) y parámetros de reforma laboral (Ley 2466).
            </p>

            {updateMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{updateMessage}</span>
              </div>
            )}

            <div className="space-y-2 text-xs">
              <button
                onClick={handleCheckUpdates}
                disabled={isCheckingUpdate}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingUpdate ? 'animate-spin' : ''}`} />
                {isCheckingUpdate ? 'Verificando con el servidor...' : 'Buscar Actualizaciones'}
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-[11px] font-bold text-slate-700 uppercase mb-2">
                Historial de Actualizaciones (Changelog)
              </h4>
              <div className="space-y-2 text-[11px] text-slate-600 font-mono">
                <div className="p-2 bg-slate-50 rounded">
                  <span className="text-blue-700 font-bold block">v2026.1.4 (Actual)</span>
                  <span className="font-sans">
                    Incorporación de Manual de Funciones descargable, instalador PWA de escritorio y manual de usuario paso a paso.
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded">
                  <span className="text-slate-700 font-bold block">v2026.1.0</span>
                  <span className="font-sans">
                    Liquidación decenal (10 días), simulación de 4 cargos, PILA completa y ciclo PHVA.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User Accounts Administration */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <KeyRound className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Usuarios Registrados en el Sistema ({systemUsers.length})
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              {systemUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-slate-900">{user.fullName}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      @{user.username} · {user.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      {user.status === 'active' ? '✓ Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Credenciales maestras de soporte:</span>
              <span className="font-mono font-bold text-slate-800">admin / somosuno2026</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DESINSTALAR PLATAFORMA */}
      {activeTab === 'uninstall' && (
        <div className="bg-white rounded-xl border border-red-200 shadow-sm p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-3 border-b border-red-100 pb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Desinstalación & Restablecimiento de Fábrica de la Plataforma
              </h3>
              <p className="text-xs text-red-600">
                Atención: Esta acción eliminará los registros almacenados localmente de empleados, novedades y nóminas.
              </p>
            </div>
          </div>

          {uninstallStep === 1 && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-950 space-y-2">
                <span className="font-bold block text-sm">
                  Paso 1 Obligatorio: Respaldo Preventivo de Información Empresarial
                </span>
                <p className="leading-relaxed">
                  Para evitar la pérdida no autorizada de datos laborales de la Corporación Social Somos Uno, el protocolo de desinstalación exige descargar una copia de seguridad íntegra de la base de datos antes de continuar.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onExportBackup();
                      setHasBackedUp(true);
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shadow-sm flex items-center gap-2"
                  >
                    <DownloadCloud className="w-4 h-4" />
                    Descargar Copia de Seguridad Obligatoria (.json)
                  </button>
                </div>
              </div>

              {hasBackedUp && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Copia de seguridad generada con éxito.
                  </span>
                  <button
                    onClick={() => setUninstallStep(2)}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold text-xs"
                  >
                    Continuar al Paso 2
                  </button>
                </div>
              )}
            </div>
          )}

          {uninstallStep === 2 && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-950 space-y-2">
                <span className="font-bold block text-sm">
                  Paso 2: Confirmación de Seguridad del Administrador
                </span>
                <p className="leading-relaxed">
                  Ingrese la clave de administrador para autorizar la desinstalación y el restablecimiento del sistema. (Clave por defecto: <code className="font-bold font-mono">somosuno2026</code>).
                </p>

                {uninstallError && (
                  <p className="text-red-700 font-bold bg-white p-2 rounded border border-red-300">
                    {uninstallError}
                  </p>
                )}

                <div className="pt-2 max-w-sm">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Contraseña de Administrador *
                  </label>
                  <input
                    type="password"
                    value={uninstallPassword}
                    onChange={(e) => {
                      setUninstallPassword(e.target.value);
                      setUninstallError(null);
                    }}
                    placeholder="••••••••"
                    className="w-full border border-red-300 rounded-lg px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setUninstallStep(1)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 text-xs font-medium"
                >
                  Volver al Respaldo
                </button>
                <button
                  onClick={handleExecuteUninstall}
                  className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-lg font-bold text-xs shadow-md flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Autorizar y Desinstalar Plataforma
                </button>
              </div>
            </div>
          )}

          {uninstallStep === 3 && (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">
                Plataforma Restablecida & Limpiada
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                La aplicación ha sido restablecida a su estado inicial de fábrica con los 4 cargos base del ejercicio. Puede reinstalarla o restaurar su copia de seguridad en cualquier momento.
              </p>
              <button
                onClick={() => setUninstallStep(1)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Cerrar Protocolo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
