import React, { useState } from 'react';
import {
  ShieldCheck,
  History,
  Download,
  Upload,
  Bell,
  Lock,
  FileText,
  AlertTriangle,
  CheckCircle,
  Database,
  Calendar,
} from 'lucide-react';
import { AuditLogItem, Employee, LegalParameters, Novelty } from '../types/payroll';

interface AuditSecurityModuleProps {
  auditLogs: AuditLogItem[];
  onExportBackup: () => void;
  onRestoreBackup: (data: any) => void;
  employees: Employee[];
  novelties: Novelty[];
  legalParams: LegalParameters;
}

export const AuditSecurityModule: React.FC<AuditSecurityModuleProps> = ({
  auditLogs,
  onExportBackup,
  onRestoreBackup,
  employees,
  novelties,
  legalParams,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'audit' | 'backup' | 'habeas_data' | 'alerts'>('audit');
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.employees && json.legalParams) {
          onRestoreBackup(json);
          setRestoreStatus('Copia de seguridad restaurada correctamente con éxito.');
          setTimeout(() => setRestoreStatus(null), 4000);
        } else {
          setRestoreStatus('El archivo no contiene un formato de respaldo válido de Somos Uno.');
        }
      } catch (err) {
        setRestoreStatus('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  const deadlines = [
    {
      title: 'Pago Nómina Decenal 1',
      date: '10 de cada mes',
      type: 'Nómina',
      status: 'upcoming',
      desc: 'Dispersión a cuentas bancarias del primer tercio del mes.',
    },
    {
      title: 'Pago Nómina Decenal 2',
      date: '20 de cada mes',
      type: 'Nómina',
      status: 'upcoming',
      desc: 'Dispersión a cuentas bancarias del segundo tercio del mes.',
    },
    {
      title: 'Pago Nómina Decenal 3 / Mensual',
      date: '30 de cada mes',
      type: 'Nómina',
      status: 'upcoming',
      desc: 'Cierre del período laboral mensual completo.',
    },
    {
      title: 'Pago Planilla PILA (Operador SOI / MiPlanilla)',
      date: '5to día hábil del mes',
      type: 'Seguridad Social',
      status: 'warning',
      desc: 'Pago oportuno de salud, pensión, ARL y parafiscales según dos últimos dígitos del NIT.',
    },
    {
      title: 'Pago Intereses a las Cesantías (Ley 52 de 1975)',
      date: '31 de Enero',
      type: 'Prestaciones',
      status: 'legal',
      desc: 'Reconocimiento y pago directo al trabajador del 12% anual sobre el saldo de cesantías.',
    },
    {
      title: 'Consignación de Cesantías (Ley 50 de 1990)',
      date: '14 de Febrero',
      type: 'Prestaciones',
      status: 'legal',
      desc: 'Consignación obligatoria en el fondo de cesantías (Porvenir, Protección, Colfondos) so pena de sanción moratoria de un día de salario por cada día de retardo.',
    },
    {
      title: 'Pago Prima de Servicios - Primer Semestre',
      date: '30 de Junio',
      type: 'Prestaciones',
      status: 'legal',
      desc: 'Pago de 15 días de salario por el semestre laborado.',
    },
    {
      title: 'Pago Prima de Servicios - Segundo Semestre',
      date: '20 de Diciembre',
      type: 'Prestaciones',
      status: 'legal',
      desc: 'Pago de la segunda cuota de la prima legal de servicios.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Auditoría, Copias de Seguridad & Protección de Datos
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Trazabilidad de modificaciones, respaldo en JSON, alertas de vencimientos y cumplimiento de la Ley 1581 de 2012 (Habeas Data).
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeSubTab === 'audit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Historial de Cambios
          </button>
          <button
            onClick={() => setActiveSubTab('alerts')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeSubTab === 'alerts' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Alertas & Vencimientos
          </button>
          <button
            onClick={() => setActiveSubTab('backup')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeSubTab === 'backup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Copias de Respaldo
          </button>
          <button
            onClick={() => setActiveSubTab('habeas_data')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeSubTab === 'habeas_data' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Habeas Data (Ley 1581)
          </button>
        </div>
      </div>

      {/* Subtab 1: Historial de Modificaciones */}
      {activeSubTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Registro de Auditoría de Operaciones (Logs)
              </h3>
              <p className="text-xs text-slate-500">
                Trazabilidad inmutable de acciones realizadas en la plataforma
              </p>
            </div>
            <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
              {auditLogs.length} eventos registrados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <th className="py-2.5 px-3 text-left font-semibold">Fecha y Hora</th>
                  <th className="py-2.5 px-3 text-left font-semibold">Usuario Responsable</th>
                  <th className="py-2.5 px-3 text-left font-semibold">Perfil</th>
                  <th className="py-2.5 px-3 text-left font-semibold">Acción</th>
                  <th className="py-2.5 px-3 text-left font-semibold">Módulo</th>
                  <th className="py-2.5 px-4 text-left font-semibold">Detalles del Cambio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 text-slate-600 text-[11px]">{log.timestamp}</td>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900">
                      {log.userName}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-blue-700">{log.userRole}</td>
                    <td className="py-2.5 px-3 font-sans font-semibold text-slate-800">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-700">
                        {log.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-sans text-slate-600 text-[11px]">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 2: Alertas y Vencimientos */}
      {activeSubTab === 'alerts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deadlines.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3.5"
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  item.status === 'warning'
                    ? 'bg-amber-100 text-amber-700'
                    : item.status === 'legal'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                <Calendar className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                    {item.type}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {item.date}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 3: Copias de Seguridad */}
      {activeSubTab === 'backup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export Backup */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Descargar Copia de Seguridad Completa
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Exporta en un único archivo encriptado en formato JSON toda la base de colaboradores, historial de novedades, parámetros legales 2026 y registros de auditoría de la Corporación Social Somos Uno.
            </p>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs font-mono space-y-1">
              <p className="text-slate-600">✓ Empleados activos: {employees.length}</p>
              <p className="text-slate-600">✓ Novedades registradas: {novelties.length}</p>
              <p className="text-slate-600">✓ Parámetros legales SMLMV: {legalParams.smlmv}</p>
            </div>

            <button
              onClick={onExportBackup}
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar Respaldo JSON
            </button>
          </div>

          {/* Restore Backup */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-amber-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Restaurar Información desde Copia
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Seleccione un archivo JSON de respaldo generado previamente para restaurar el estado completo de la plataforma.
            </p>

            {restoreStatus && (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-700 shrink-0" />
                <span>{restoreStatus}</span>
              </div>
            )}

            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Database className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                Haga clic o arrastre su archivo .json aquí
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Formato compatible con Somos Uno 2026</p>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: Habeas Data & Protección de Datos */}
      {activeSubTab === 'habeas_data' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Lock className="w-5 h-5 text-blue-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Política de Tratamiento y Protección de Datos Personales (Ley 1581 de 2012)
            </h3>
          </div>

          <div className="space-y-3 text-slate-700 leading-relaxed">
            <p>
              En cumplimiento de la <strong>Ley Estatutaria 1581 de 2012</strong> y del Decreto Reglamentario 1377 de 2013, la <strong>Corporación Social Somos Uno</strong>, identificada con NIT 901.458.239-1, informa a todos sus colaboradores y directivos que los datos personales recolectados en esta plataforma son tratados bajo los principios de legalidad, finalidad, libertad, veracidad y confidencialidad.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">Finalidad Exclusiva</h4>
                <p className="text-slate-600 text-[11px]">
                  Cálculo de nómina, dispersión salarial, autoliquidación PILA, reporte ante UGPP, DIAN y entidades de seguridad social.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">Derechos del Titular</h4>
                <p className="text-slate-600 text-[11px]">
                  Conocer, actualizar, rectificar y suprimir sus datos en cualquier momento mediante solicitud a talento humano.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">Seguridad de la Información</h4>
                <p className="text-slate-600 text-[11px]">
                  Cifrado de datos, perfiles con control de acceso RBAC, auditoría de eventos y copias de seguridad locales.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
