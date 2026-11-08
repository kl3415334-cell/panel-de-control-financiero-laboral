import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { EmployeesModule } from './components/EmployeesModule';
import { PayrollModule } from './components/PayrollModule';
import { NoveltiesModule } from './components/NoveltiesModule';
import { BenefitsModule } from './components/BenefitsModule';
import { SocialSecurityModule } from './components/SocialSecurityModule';
import { ReportsModule } from './components/ReportsModule';
import { NormatividadModule } from './components/NormatividadModule';
import { PHVAModule } from './components/PHVAModule';
import { AuditSecurityModule } from './components/AuditSecurityModule';
import { JobManualModule } from './components/JobManualModule';
import { InstallationModule } from './components/InstallationModule';
import { UserManualModule } from './components/UserManualModule';
import { UniformModule } from './components/UniformModule';
import { VoucherModal } from './components/VoucherModal';
import {
  AuditLogItem,
  CompanyConfig,
  Employee,
  JobManualItem,
  LegalParameters,
  Novelty,
  PayrollFrequency,
  RoleType,
  SystemUser,
  UniformDelivery,
} from './types/payroll';
import {
  INITIAL_EMPLOYEES,
  INITIAL_NOVELTIES,
  DEFAULT_LEGAL_PARAMETERS_2026,
  INITIAL_JOB_MANUAL,
  INITIAL_COMPANY_CONFIG,
  INITIAL_SYSTEM_USERS,
  INITIAL_UNIFORM_DELIVERIES,
  USER_ROLES,
} from './data/initialData';
import {
  calculateEmployeePayroll,
  calculatePayrollTotals,
} from './utils/calculations';
import { Bell, X, Calendar, ArrowRight } from 'lucide-react';


const STORAGE_KEY = 'somos_uno_payroll_state_v1';

export default function App() {
  // Load saved state or fall back to defaults
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_emp`);
      return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  });

  const [novelties, setNovelties] = useState<Novelty[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_nov`);
      return saved ? JSON.parse(saved) : INITIAL_NOVELTIES;
    } catch {
      return INITIAL_NOVELTIES;
    }
  });

  const [legalParams, setLegalParams] = useState<LegalParameters>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_params`);
      return saved ? JSON.parse(saved) : DEFAULT_LEGAL_PARAMETERS_2026;
    } catch {
      return DEFAULT_LEGAL_PARAMETERS_2026;
    }
  });

  const [manualItems, setManualItems] = useState<JobManualItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_manual`);
      return saved ? JSON.parse(saved) : INITIAL_JOB_MANUAL;
    } catch {
      return INITIAL_JOB_MANUAL;
    }
  });

  const [companyConfig, setCompanyConfig] = useState<CompanyConfig>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_company`);
      return saved ? JSON.parse(saved) : INITIAL_COMPANY_CONFIG;
    } catch {
      return INITIAL_COMPANY_CONFIG;
    }
  });

  const [systemUsers, setSystemUsers] = useState<SystemUser[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
      return saved ? JSON.parse(saved) : INITIAL_SYSTEM_USERS;
    } catch {
      return INITIAL_SYSTEM_USERS;
    }
  });

  const [uniformDeliveries, setUniformDeliveries] = useState<UniformDelivery[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_uniforms`);
      return saved ? JSON.parse(saved) : INITIAL_UNIFORM_DELIVERIES;
    } catch {
      return INITIAL_UNIFORM_DELIVERIES;
    }
  });

  const [currentRole, setCurrentRole] = useState<RoleType>('admin');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [frequency, setFrequency] = useState<PayrollFrequency>('decenal');
  const [periodNumber, setPeriodNumber] = useState<number>(1);
  const [includeNovelties, setIncludeNovelties] = useState<boolean>(true);
  const [selectedVoucherEmployee, setSelectedVoucherEmployee] = useState<Employee | null>(null);
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);


  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 'log-1',
      timestamp: '2026-10-01 08:00',
      userName: 'Carlos Mendoza',
      userRole: 'Auxiliar Contable',
      action: 'Apertura de período',
      category: 'nomina',
      details: 'Apertura del ciclo de nómina de Octubre 2026 para los 4 colaboradores.',
    },
    {
      id: 'log-2',
      timestamp: '2026-10-06 09:15',
      userName: 'Carlos Mendoza',
      userRole: 'Auxiliar Contable',
      action: 'Registro de novedad',
      category: 'novedades',
      details: 'Radicación de incapacidad médica de 1 día para Juan Carlos Gómez (Auxiliar Contable).',
    },
    {
      id: 'log-3',
      timestamp: '2026-10-08 18:30',
      userName: 'Martha Lucia Ríos',
      userRole: 'Administración',
      action: 'Aprobación de horas extras',
      category: 'novedades',
      details: 'Aprobación de 2 horas extras diurnas para Diana Marcela Pérez (Administración).',
    },
    {
      id: 'log-4',
      timestamp: '2026-10-09 14:00',
      userName: 'Martha Lucia Ríos',
      userRole: 'Administración',
      action: 'Registro de novedad',
      category: 'novedades',
      details: 'Registro de 1 día de permiso no remunerado para Laura Camila Moreno (Gestor de Proyectos).',
    },
  ]);

  // Persist state in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_emp`, JSON.stringify(employees));
    } catch (e) {
      console.error(e);
    }
  }, [employees]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_nov`, JSON.stringify(novelties));
    } catch (e) {
      console.error(e);
    }
  }, [novelties]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_params`, JSON.stringify(legalParams));
    } catch (e) {
      console.error(e);
    }
  }, [legalParams]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_manual`, JSON.stringify(manualItems));
    } catch (e) {
      console.error(e);
    }
  }, [manualItems]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_company`, JSON.stringify(companyConfig));
    } catch (e) {
      console.error(e);
    }
  }, [companyConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(systemUsers));
    } catch (e) {
      console.error(e);
    }
  }, [systemUsers]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_uniforms`, JSON.stringify(uniformDeliveries));
    } catch (e) {
      console.error(e);
    }
  }, [uniformDeliveries]);


  // Compute live liquidations for all employees
  const liquidations = useMemo(() => {
    return employees.map((emp) =>
      calculateEmployeePayroll(emp, legalParams, novelties, {
        frequency,
        subPeriod: periodNumber,
        includeNovelties,
      })
    );
  }, [employees, legalParams, novelties, frequency, periodNumber, includeNovelties]);

  // Compute live totals
  const totals = useMemo(() => {
    return calculatePayrollTotals(liquidations);
  }, [liquidations]);

  // Audit helper
  const addAuditLog = (
    action: string,
    category: AuditLogItem['category'],
    details: string
  ) => {
    const roleObj = USER_ROLES[currentRole];
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      userName: roleObj.name,
      userRole: roleObj.title,
      action,
      category,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Handlers
  const handleSaveEmployee = (emp: Employee) => {
    setEmployees((prev) => {
      const exists = prev.some((e) => e.id === emp.id);
      if (exists) {
        addAuditLog(
          'Actualización de empleado',
          'empleados',
          `Se modificó la información laboral de ${emp.fullName} (${emp.position}).`
        );
        return prev.map((e) => (e.id === emp.id ? emp : e));
      } else {
        addAuditLog(
          'Registro de nuevo empleado',
          'empleados',
          `Se vinculó al colaborador ${emp.fullName} en el cargo ${emp.position}.`
        );
        return [...prev, emp];
      }
    });
  };

  const handleDeleteEmployee = (id: string) => {
    const emp = employees.find((e) => e.id === id);
    if (emp) {
      addAuditLog(
        'Eliminación de colaborador',
        'empleados',
        `Se retiró el registro de ${emp.fullName} (${emp.position}).`
      );
    }
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const handleUpdateEmployeeSalary = (id: string, newSalary: number) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, baseSalary: newSalary } : e))
    );
  };

  const handleSaveNovelty = (nov: Novelty) => {
    const emp = employees.find((e) => e.id === nov.employeeId);
    addAuditLog(
      'Registro de novedad',
      'novedades',
      `Se registró novedad ${nov.type} para ${emp?.fullName || 'empleado'}.`
    );
    setNovelties((prev) => [nov, ...prev]);
  };

  const handleDeleteNovelty = (id: string) => {
    setNovelties((prev) => prev.filter((n) => n.id !== id));
    addAuditLog('Eliminación de novedad', 'novedades', `Se eliminó el registro de novedad #${id}.`);
  };

  const handleToggleNoveltyStatus = (
    id: string,
    status: 'aprobado' | 'pendiente' | 'rechazado'
  ) => {
    setNovelties((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status } : n))
    );
    addAuditLog(
      'Cambio estado novedad',
      'novedades',
      `Novedad #${id} actualizada a estado: ${status}.`
    );
  };

  const handleSaveLegalParams = (newParams: LegalParameters) => {
    setLegalParams(newParams);
    addAuditLog(
      'Actualización normativa',
      'parametros',
      `Se actualizaron parámetros legales: SMLMV $${newParams.smlmv}, Aux. Transporte $${newParams.transportAllowance}, Jornada ${newParams.weeklyHours}h.`
    );
  };

  const handlePartialParamsUpdate = (partial: Partial<LegalParameters>) => {
    setLegalParams((prev) => ({ ...prev, ...partial }));
    addAuditLog(
      'Modificación de parámetros',
      'parametros',
      `Ajuste de parámetros tributarios/ARL.`
    );
  };

  const handleSaveManualItem = (item: JobManualItem) => {
    setManualItems((prev) =>
      prev.map((m) => (m.id === item.id ? { ...item, updatedAt: new Date().toISOString().split('T')[0] } : m))
    );
    addAuditLog(
      'Actualización manual de funciones',
      'sistema',
      `Se actualizaron funciones y requisitos para el cargo de ${item.position}.`
    );
  };

  const handleSaveCompanyConfig = (config: CompanyConfig) => {
    setCompanyConfig(config);
    addAuditLog(
      'Actualización datos entidad',
      'sistema',
      `Se actualizaron datos institucionales de ${config.businessName} (NIT: ${config.nit}).`
    );
  };

  const handleSaveSystemUsers = (users: SystemUser[]) => {
    setSystemUsers(users);
    addAuditLog(
      'Gestión de usuarios',
      'sistema',
      `Se actualizó el catálogo de usuarios del sistema (${users.length} cuentas configuradas).`
    );
  };

  const handleSaveUniformDelivery = (delivery: UniformDelivery) => {
    setUniformDeliveries((prev) => {
      const exists = prev.some((d) => d.id === delivery.id);
      if (exists) {
        return prev.map((d) => (d.id === delivery.id ? delivery : d));
      }
      return [delivery, ...prev];
    });
    addAuditLog(
      'Actualización de dotación',
      'sistema',
      `Se actualizó el registro de entrega de dotación #${delivery.id} (${delivery.periodName}).`
    );
  };

  const handleUpdateEmployeeUniformSizes = (
    employeeId: string,
    sizes: NonNullable<Employee['uniformSizes']>,
    costPerDelivery: number
  ) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId
          ? { ...emp, uniformSizes: sizes, uniformCostPerDelivery: costPerDelivery }
          : emp
      )
    );
    const emp = employees.find((e) => e.id === employeeId);
    addAuditLog(
      'Actualización tallas dotación',
      'empleados',
      `Se actualizaron tallas de calzado y vestido para ${emp?.fullName || employeeId}: Camisa ${sizes.shirt}, Pantalón ${sizes.pants}, Calzado ${sizes.shoes}.`
    );
  };

  const handleResetFactoryData = () => {
    setEmployees(INITIAL_EMPLOYEES);
    setNovelties(INITIAL_NOVELTIES);
    setLegalParams(DEFAULT_LEGAL_PARAMETERS_2026);
    setManualItems(INITIAL_JOB_MANUAL);
    setCompanyConfig(INITIAL_COMPANY_CONFIG);
    setSystemUsers(INITIAL_SYSTEM_USERS);
    setUniformDeliveries(INITIAL_UNIFORM_DELIVERIES);
    addAuditLog(
      'Restablecimiento de fábrica',
      'sistema',
      'Se ejecutó el protocolo de desinstalación / restablecimiento a valores iniciales de prueba.'
    );
  };

  const handleExportBackup = () => {
    const backupData = {
      version: '2026.1',
      organization: companyConfig.businessName,
      nit: companyConfig.nit,
      exportedAt: new Date().toISOString(),
      employees,
      novelties,
      legalParams,
      manualItems,
      companyConfig,
      systemUsers,
      uniformDeliveries,
      auditLogs,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_Nomina_Somos_Uno_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    addAuditLog('Exportación de respaldo', 'sistema', 'Se descargó copia de seguridad en JSON.');
  };

  const handleRestoreBackup = (data: any) => {
    if (data.employees) setEmployees(data.employees);
    if (data.novelties) setNovelties(data.novelties);
    if (data.legalParams) setLegalParams(data.legalParams);
    if (data.manualItems) setManualItems(data.manualItems);
    if (data.companyConfig) setCompanyConfig(data.companyConfig);
    if (data.systemUsers) setSystemUsers(data.systemUsers);
    if (data.uniformDeliveries) setUniformDeliveries(data.uniformDeliveries);
    if (data.auditLogs) setAuditLogs(data.auditLogs);
    addAuditLog('Restauración de sistema', 'sistema', 'Se restauró el sistema desde archivo JSON.');
  };


  // Selected liquidation for voucher modal
  const voucherLiquidation = useMemo(() => {
    if (!selectedVoucherEmployee) return null;
    return (
      liquidations.find((l) => l.employee.id === selectedVoucherEmployee.id) || null
    );
  }, [selectedVoucherEmployee, liquidations]);

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans">
      {/* Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        frequency={frequency}
        onFrequencyChange={setFrequency}
        periodNumber={periodNumber}
        onPeriodNumberChange={setPeriodNumber}
        includeNovelties={includeNovelties}
        onToggleNovelties={() => setIncludeNovelties(!includeNovelties)}
        onOpenBackup={() => setActiveTab('audit')}
        onOpenAudit={() => setActiveTab('audit')}
        alertsCount={4}
        onOpenAlerts={() => setIsAlertsOpen(true)}
      />

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          employeesCount={employees.length}
          noveltiesCount={novelties.length}
          currentRole={currentRole}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <Dashboard
              employees={employees}
              liquidations={liquidations}
              totals={totals}
              frequency={frequency}
              periodNumber={periodNumber}
              includeNovelties={includeNovelties}
              onNavigateTab={setActiveTab}
              onUpdateEmployeeSalary={handleUpdateEmployeeSalary}
              legalParams={legalParams}
            />
          )}

          {activeTab === 'employees' && (
            <EmployeesModule
              employees={employees}
              currentRole={currentRole}
              onSaveEmployee={handleSaveEmployee}
              onDeleteEmployee={handleDeleteEmployee}
              legalParams={legalParams}
            />
          )}

          {activeTab === 'payroll' && (
            <PayrollModule
              liquidations={liquidations}
              frequency={frequency}
              onFrequencyChange={setFrequency}
              periodNumber={periodNumber}
              onPeriodNumberChange={setPeriodNumber}
              includeNovelties={includeNovelties}
              onToggleNovelties={() => setIncludeNovelties(!includeNovelties)}
              currentRole={currentRole}
              totals={totals}
              onSelectVoucherEmployee={setSelectedVoucherEmployee}
              legalParams={legalParams}
            />
          )}

          {activeTab === 'novelties' && (
            <NoveltiesModule
              employees={employees}
              novelties={novelties}
              currentRole={currentRole}
              onSaveNovelty={handleSaveNovelty}
              onDeleteNovelty={handleDeleteNovelty}
              onToggleNoveltyStatus={handleToggleNoveltyStatus}
            />
          )}

          {activeTab === 'uniforms' && (
            <UniformModule
              employees={employees}
              deliveries={uniformDeliveries}
              legalParams={legalParams}
              currentRole={currentRole}
              onSaveDelivery={handleSaveUniformDelivery}
              onUpdateEmployeeSizes={handleUpdateEmployeeUniformSizes}
            />
          )}

          {activeTab === 'benefits' && (
            <BenefitsModule
              liquidations={liquidations}
              legalParams={legalParams}
            />
          )}

          {activeTab === 'social_security' && (
            <SocialSecurityModule
              liquidations={liquidations}
              legalParams={legalParams}
              onUpdateParams={handlePartialParamsUpdate}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsModule
              employees={employees}
              liquidations={liquidations}
              novelties={novelties}
              frequency={frequency}
              periodNumber={periodNumber}
              totals={totals}
              legalParams={legalParams}
              onSelectVoucherEmployee={setSelectedVoucherEmployee}
            />
          )}

          {activeTab === 'normativity' && (
            <NormatividadModule
              legalParams={legalParams}
              onSaveParams={handleSaveLegalParams}
              canEdit={USER_ROLES[currentRole].permissions.canEditParameters}
            />
          )}

          {activeTab === 'phva' && (
            <PHVAModule onNavigateTab={setActiveTab} />
          )}

          {activeTab === 'job_manual' && (
            <JobManualModule
              manualItems={manualItems}
              onSaveManualItem={handleSaveManualItem}
              currentRole={currentRole}
            />
          )}

          {activeTab === 'installation' && (
            <InstallationModule
              companyConfig={companyConfig}
              onSaveCompanyConfig={handleSaveCompanyConfig}
              systemUsers={systemUsers}
              onSaveSystemUsers={handleSaveSystemUsers}
              onExportBackup={handleExportBackup}
              onResetFactoryData={handleResetFactoryData}
              legalParams={legalParams}
              currentRole={currentRole}
            />
          )}

          {activeTab === 'user_manual' && (
            <UserManualModule />
          )}

          {activeTab === 'audit' && (
            <AuditSecurityModule
              auditLogs={auditLogs}
              onExportBackup={handleExportBackup}
              onRestoreBackup={handleRestoreBackup}
              employees={employees}
              novelties={novelties}
              legalParams={legalParams}
            />
          )}
        </main>
      </div>

      {/* Official Voucher Modal */}
      {voucherLiquidation && (
        <VoucherModal
          liquidation={voucherLiquidation}
          frequency={frequency}
          periodNumber={periodNumber}
          onClose={() => setSelectedVoucherEmployee(null)}
        />
      )}

      {/* Alerts Slide-over / Modal */}
      {isAlertsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Alertas de Pagos & Vencimientos Laborales
                </h3>
              </div>
              <button
                onClick={() => setIsAlertsOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex justify-between font-bold text-blue-900">
                  <span>Próximo Pago Decenal</span>
                  <span className="font-mono">10 de mes</span>
                </div>
                <p className="text-blue-800 text-[11px] mt-1">
                  Revisar y verificar los comprobantes de nómina para los 4 colaboradores.
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex justify-between font-bold text-amber-900">
                  <span>Autoliquidación Planilla PILA</span>
                  <span className="font-mono">Día 5 hábil</span>
                </div>
                <p className="text-amber-800 text-[11px] mt-1">
                  Vence plazo oportuno para el pago de aportes parafiscales y seguridad social.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Intereses a las Cesantías</span>
                  <span className="font-mono">31 de Enero</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-1">
                  Pago directo del 12% anual sobre las cesantías acumuladas.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex justify-between font-bold text-emerald-900">
                  <span>Entrega Dotación Laboral</span>
                  <span className="font-mono">30 Abr / 31 Ago / 20 Dic</span>
                </div>
                <p className="text-emerald-800 text-[11px] mt-1">
                  Suministro legal de calzado y vestido para los 3 colaboradores con salario ≤ 2 SMLMV (Art. 230 CST).
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsAlertsOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
