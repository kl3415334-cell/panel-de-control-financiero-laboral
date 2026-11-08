export type RoleType = 'auxiliar' | 'admin' | 'gerente' | 'gestor';

export interface UserRole {
  id: RoleType;
  title: string;
  name: string;
  email: string;
  badge: string;
  permissions: {
    canRegisterEmployee: boolean;
    canEditEmployee: boolean;
    canDeleteEmployee: boolean;
    canRegisterNovelty: boolean;
    canPreparePayroll: boolean;
    canVerifyPayroll: boolean;
    canAuthorizePayment: boolean;
    canEditParameters: boolean;
    canViewProjectsCost: boolean;
    canViewFullFinancials: boolean;
  };
}

export type ContractType = 
  | 'Término Indefinido'
  | 'Término Fijo'
  | 'Obra o Labor'
  | 'Aprendizaje SENA';

export interface Employee {
  id: string;
  documentType: 'CC' | 'CE' | 'TI' | 'PAS';
  documentNumber: string;
  fullName: string;
  position: 'Auxiliar contable' | 'Administración' | 'Gerente' | 'Gestor de proyectos' | string;
  department: string;
  project: string;
  contractType: ContractType;
  startDate: string;
  baseSalary: number;
  autoTransportAllowance: boolean; // Auto determines <= 2 SMLMV
  eps: string;
  pensionFund: string;
  arl: string;
  arlRiskLevel: 1 | 2 | 3 | 4 | 5; // 1: 0.522%, 2: 1.044%, 3: 2.436%, 4: 4.350%, 5: 6.960%
  compensationBox: string;
  email: string;
  phone: string;
  bankName: string;
  bankAccount: string;
  status: 'active' | 'on_leave' | 'vacation' | 'inactive';
  uniformSizes?: {
    shirt: string;
    pants: string;
    shoes: string;
    uniformType: 'Oficina / Administrativo' | 'Campo / Proyecto Social' | 'Operativo';
  };
  uniformCostPerDelivery?: number; // Costo estimado de dotación por entrega (ej. $240.000)
}

export interface UniformDelivery {
  id: string;
  employeeId: string;
  periodName: '1ª Entrega (30 de Abril)' | '2ª Entrega (31 de Agosto)' | '3ª Entrega (20 de Diciembre)';
  legalDeadline: string; // '2026-04-30', '2026-08-31', '2026-12-20'
  deliveryDate?: string;
  itemsDelivered: string[];
  estimatedCost: number;
  status: 'entregado' | 'pendiente' | 'programado';
  signedReceipt: boolean;
  notes?: string;
}


export type NoveltyType =
  | 'incapacidad_general'
  | 'incapacidad_laboral'
  | 'permiso_remunerado'
  | 'permiso_no_remunerado'
  | 'licencia_maternidad_paternidad'
  | 'vacaciones'
  | 'horas_extras_diurnas'
  | 'horas_extras_nocturnas'
  | 'horas_extras_festivas_diurnas'
  | 'horas_extras_festivas_nocturnas'
  | 'recargo_nocturno'
  | 'recargo_festivo'
  | 'bonificacion'
  | 'comision'
  | 'ausencia_injustificada'
  | 'llegada_tarde';

export interface Novelty {
  id: string;
  employeeId: string;
  type: NoveltyType;
  startDate: string;
  endDate?: string;
  days: number;
  hours?: number;
  description: string;
  supportDocName?: string;
  supportDocSize?: string;
  amount?: number; // For bonuses or fixed novelty amounts
  status: 'aprobado' | 'pendiente' | 'rechazado';
  createdAt: string;
}

export interface LegalParameters {
  smlmv: number; // Salario mínimo referencia 2026 ($1.750.905)
  transportAllowance: number; // Auxilio transporte ($249.095)
  maxSalaryForTransport: number; // 2 SMLMV ($3.501.810)
  weeklyHours: number; // 42 horas (Ley 2101 de 2021 desde 15 julio 2026)
  monthlyHours: number; // (42/6)*30 = 210 horas mensuales para valor hora ordinaria
  healthEmployeeRate: number; // 0.04
  pensionEmployeeRate: number; // 0.04
  healthEmployerRate: number; // 0.085
  pensionEmployerRate: number; // 0.12
  arlRates: {
    1: number; // 0.00522
    2: number; // 0.01044
    3: number; // 0.02436
    4: number; // 0.04350
    5: number; // 0.06960
  };
  compensationBoxRate: number; // 0.04
  senaRate: number; // 0.02
  icbfRate: number; // 0.03
  isExemptArticle114: boolean; // Exoneración Ley 1607/1819 (Art. 114-1 E.T.) para empleados < 10 SMLMV
  severanceRate: number; // Cesantías: 8.3333% (1/12)
  severanceInterestRate: number; // Intereses a cesantías: 12% anual
  primaRate: number; // Prima de servicios: 8.3333% (1/12)
  vacationRate: number; // Vacaciones: 4.1667% (15/360)
  overtimeRates: {
    diurna: number; // 1.25 (25% recargo)
    nocturna: number; // 1.75 (75% recargo)
    festivaDiurna: number; // 1.75 (75% recargo)
    festivaNocturna: number; // 2.10 (110% recargo)
    recargoNocturno: number; // 0.35 (35% recargo)
    recargoDominical: number; // 0.75 (75% recargo ordinario)
  };
}

export type PayrollFrequency = 'decenal' | 'quincenal' | 'mensual';

export interface PayrollPeriod {
  year: number;
  month: number; // 1 - 12
  frequency: PayrollFrequency;
  subPeriod: number; // 1, 2, 3 for decenal; 1, 2 for quincenal; 1 for mensual
  totalDaysInPeriod: number;
  startDate: string;
  endDate: string;
  label: string;
}

export interface EmployeeLiquidation {
  employee: Employee;
  periodDays: number;
  workedDays: number;
  unpaidDays: number;
  incapacityDays: number;
  
  // Devengados
  baseSalary: number;
  earnedSalary: number;
  transportAllowance: number;
  
  // Novedades devengadas
  overtimeDiurnaAmount: number;
  overtimeNocturnaAmount: number;
  overtimeFestivaAmount: number;
  nightSurchargesAmount: number;
  holidaySurchargesAmount: number;
  bonusesAmount: number;
  commissionsAmount: number;
  incapacityAllowance: number;
  
  totalDevengado: number;
  
  // Deducciones
  ibc: number; // Ingreso Base de Cotización
  healthEmployee: number;
  pensionEmployee: number;
  solidarityPensionFund: number;
  unpaidLeaveDeduction: number;
  voluntaryDeductions: number;
  totalDeducciones: number;
  
  // Neto a pagar
  netoPagar: number;
  
  // Aportes Empleador (Costo Corporativo)
  healthEmployer: number;
  pensionEmployer: number;
  arlEmployer: number;
  cajaCompensacion: number;
  sena: number;
  icbf: number;
  totalSeguridadSocialEmpleador: number;
  totalParafiscales: number;
  
  // Prestaciones Sociales (Provisiones)
  basePrestaciones: number; // Salario devengado + Aux transporte (si aplica)
  baseVacaciones: number; // Sin auxilio de transporte
  provisionCesantias: number;
  provisionInteresesCesantias: number;
  provisionPrima: number;
  provisionVacaciones: number;
  totalPrestaciones: number;
  
  // Dotaciones Laborales (Art. 230 CST - Calzado y Vestido de Labor)
  qualifiesForUniform: boolean;
  dotacionCostoEntrega: number;
  dotacionProvisionMensual: number;

  // Costo total empresa
  costoTotalEmpresa: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  category: 'empleados' | 'nomina' | 'novedades' | 'prestaciones' | 'parametros' | 'sistema';
  details: string;
}

export interface JobManualItem {
  id: string;
  position: string;
  department: string;
  directBoss: string;
  objective: string;
  requirements: {
    education: string;
    experience: string;
    competencies: string[];
  };
  functions: string[];
  responsibilities: string[];
  updatedAt: string;
}

export interface CompanyConfig {
  businessName: string;
  nit: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  legalRepresentative: string;
  economicActivity: string;
  establishedYear: number;
}

export interface SystemUser {
  id: string;
  username: string;
  fullName: string;
  role: RoleType;
  email: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

