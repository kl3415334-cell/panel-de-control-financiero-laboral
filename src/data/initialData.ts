import {
  CompanyConfig,
  Employee,
  JobManualItem,
  LegalParameters,
  Novelty,
  SystemUser,
  UniformDelivery,
  UserRole,
} from '../types/payroll';

export const USER_ROLES: Record<string, UserRole> = {
  auxiliar: {
    id: 'auxiliar',
    title: 'Auxiliar Contable',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@somosuno.org.co',
    badge: 'Operativo / Contable',
    permissions: {
      canRegisterEmployee: true,
      canEditEmployee: true,
      canDeleteEmployee: false,
      canRegisterNovelty: true,
      canPreparePayroll: true,
      canVerifyPayroll: false,
      canAuthorizePayment: false,
      canEditParameters: false,
      canViewProjectsCost: true,
      canViewFullFinancials: true,
    },
  },
  admin: {
    id: 'admin',
    title: 'Administración',
    name: 'Martha Lucia Ríos',
    email: 'administracion@somosuno.org.co',
    badge: 'Verificación y Control',
    permissions: {
      canRegisterEmployee: true,
      canEditEmployee: true,
      canDeleteEmployee: true,
      canRegisterNovelty: true,
      canPreparePayroll: true,
      canVerifyPayroll: true,
      canAuthorizePayment: false,
      canEditParameters: true,
      canViewProjectsCost: true,
      canViewFullFinancials: true,
    },
  },
  gerente: {
    id: 'gerente',
    title: 'Gerente General',
    name: 'Dr. Fernando Salazar V.',
    email: 'gerencia@somosuno.org.co',
    badge: 'Dirección & Autorización',
    permissions: {
      canRegisterEmployee: true,
      canEditEmployee: true,
      canDeleteEmployee: true,
      canRegisterNovelty: true,
      canPreparePayroll: true,
      canVerifyPayroll: true,
      canAuthorizePayment: true,
      canEditParameters: true,
      canViewProjectsCost: true,
      canViewFullFinancials: true,
    },
  },
  gestor: {
    id: 'gestor',
    title: 'Gestor de Proyectos',
    name: 'Ing. Patricia Duque',
    email: 'proyectos@somosuno.org.co',
    badge: 'Seguimiento Presupuestal',
    permissions: {
      canRegisterEmployee: false,
      canEditEmployee: false,
      canDeleteEmployee: false,
      canRegisterNovelty: false,
      canPreparePayroll: false,
      canVerifyPayroll: false,
      canAuthorizePayment: false,
      canEditParameters: false,
      canViewProjectsCost: true,
      canViewFullFinancials: false,
    },
  },
};

export const DEFAULT_LEGAL_PARAMETERS_2026: LegalParameters = {
  smlmv: 1750905, // SMLMV de referencia 2026 según documento
  transportAllowance: 249095, // Auxilio de transporte 2026
  maxSalaryForTransport: 3501810, // 2 SMLMV
  weeklyHours: 42, // Ley 2101 de 2021 (42 horas desde 15 julio 2026)
  monthlyHours: 210, // Base para valor de hora ordinaria
  healthEmployeeRate: 0.04, // 4%
  pensionEmployeeRate: 0.04, // 4%
  healthEmployerRate: 0.085, // 8.5%
  pensionEmployerRate: 0.12, // 12%
  arlRates: {
    1: 0.00522, // Riesgo I - Administrativo / oficina
    2: 0.01044, // Riesgo II
    3: 0.02436, // Riesgo III
    4: 0.04350, // Riesgo IV
    5: 0.06960, // Riesgo V
  },
  compensationBoxRate: 0.04, // 4%
  senaRate: 0.02, // 2%
  icbfRate: 0.03, // 3%
  isExemptArticle114: false, // Por defecto en el documento se calcula completo parafiscales 9% y salud 8.5%
  severanceRate: 1 / 12, // 8.3333% (Cesantías)
  severanceInterestRate: 0.12, // 12% anual
  primaRate: 1 / 12, // 8.3333% (Prima de servicios)
  vacationRate: 15 / 360, // 4.1667% (Vacaciones - 15 días hábiles por año)
  overtimeRates: {
    diurna: 1.25, // 25%
    nocturna: 1.75, // 75%
    festivaDiurna: 1.75, // 75%
    festivaNocturna: 2.10, // 110%
    recargoNocturno: 0.35, // 35%
    recargoDominical: 0.75, // 75%
  },
};

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-001',
    documentType: 'CC',
    documentNumber: '1020456789',
    fullName: 'Juan Carlos Gómez Montoya',
    position: 'Auxiliar contable',
    department: 'Contabilidad y Finanzas',
    project: 'Gestión Institucional Sede Central',
    contractType: 'Término Indefinido',
    startDate: '2025-01-15',
    baseSalary: 2000000,
    autoTransportAllowance: true,
    eps: 'Sura EPS',
    pensionFund: 'Porvenir',
    arl: 'Positiva Compañía de Seguros',
    arlRiskLevel: 1,
    compensationBox: 'Compensar',
    email: 'carlos.gomez@somosuno.org.co',
    phone: '310 456 7890',
    bankName: 'Bancolombia',
    bankAccount: 'Ahorros 245-890123-44',
    status: 'active',
    uniformSizes: {
      shirt: 'M',
      pants: '30',
      shoes: '38',
      uniformType: 'Oficina / Administrativo',
    },
    uniformCostPerDelivery: 240000,
  },
  {
    id: 'emp-002',
    documentType: 'CC',
    documentNumber: '52890123',
    fullName: 'Diana Marcela Pérez Castro',
    position: 'Administración',
    department: 'Talento Humano y Operaciones',
    project: 'Proyecto Comunitario Bienestar',
    contractType: 'Término Indefinido',
    startDate: '2024-06-01',
    baseSalary: 2500000,
    autoTransportAllowance: true,
    eps: 'Sanitas EPS',
    pensionFund: 'Protección',
    arl: 'Positiva Compañía de Seguros',
    arlRiskLevel: 1,
    compensationBox: 'Colsubsidio',
    email: 'diana.perez@somosuno.org.co',
    phone: '315 789 0123',
    bankName: 'Banco de Bogotá',
    bankAccount: 'Ahorros 032-456781-99',
    status: 'active',
    uniformSizes: {
      shirt: 'S',
      pants: '28',
      shoes: '37',
      uniformType: 'Oficina / Administrativo',
    },
    uniformCostPerDelivery: 260000,
  },
  {
    id: 'emp-003',
    documentType: 'CC',
    documentNumber: '79654321',
    fullName: 'Andrés Felipe Restrepo Silva',
    position: 'Gerente',
    department: 'Alta Dirección',
    project: 'Gestión Institucional Sede Central',
    contractType: 'Término Indefinido',
    startDate: '2023-02-10',
    baseSalary: 4500000,
    autoTransportAllowance: true, // Supera 2 SMLMV -> auxilio automático será 0
    eps: 'Sura EPS',
    pensionFund: 'Colpensiones',
    arl: 'Positiva Compañía de Seguros',
    arlRiskLevel: 1,
    compensationBox: 'Compensar',
    email: 'andres.restrepo@somosuno.org.co',
    phone: '320 123 4567',
    bankName: 'Davivienda',
    bankAccount: 'Corriente 110-345672-01',
    status: 'active',
    uniformSizes: {
      shirt: 'L',
      pants: '32',
      shoes: '40',
      uniformType: 'Oficina / Administrativo',
    },
    uniformCostPerDelivery: 0, // No califica legalmente (> 2 SMLMV, Art. 230 CST)
  },
  {
    id: 'emp-004',
    documentType: 'CC',
    documentNumber: '1032890456',
    fullName: 'Laura Camila Moreno Ruiz',
    position: 'Gestor de proyectos',
    department: 'Dirección de Proyectos Sociales',
    project: 'Proyecto Juventud y Paz',
    contractType: 'Término Indefinido',
    startDate: '2024-09-01',
    baseSalary: 3000000,
    autoTransportAllowance: true,
    eps: 'Compensar EPS',
    pensionFund: 'Protección',
    arl: 'Positiva Compañía de Seguros',
    arlRiskLevel: 1,
    compensationBox: 'Cafam',
    email: 'laura.moreno@somosuno.org.co',
    phone: '318 654 3210',
    bankName: 'Bancolombia',
    bankAccount: 'Ahorros 450-987654-12',
    status: 'active',
    uniformSizes: {
      shirt: 'L',
      pants: '32',
      shoes: '41',
      uniformType: 'Campo / Proyecto Social',
    },
    uniformCostPerDelivery: 300000,
  },
];

export const INITIAL_NOVELTIES: Novelty[] = [
  {
    id: 'nov-001',
    employeeId: 'emp-001', // Auxiliar contable
    type: 'incapacidad_general',
    startDate: '2026-10-06',
    endDate: '2026-10-06',
    days: 1,
    hours: 8,
    description: 'Incapacidad médica por enfermedad respiratoria aguda ambulatoria.',
    supportDocName: 'Incapacidad_Medica_EPS_Sura_Cert_88921.pdf',
    supportDocSize: '245 KB',
    status: 'aprobado',
    createdAt: '2026-10-06 08:30',
  },
  {
    id: 'nov-002',
    employeeId: 'emp-002', // Administración
    type: 'horas_extras_diurnas',
    startDate: '2026-10-08',
    days: 0,
    hours: 2,
    description: 'Dos horas extras diurnas por cierre de informes contables mensuales.',
    supportDocName: 'Autorizacion_Horas_Extras_Admin_08Oct.pdf',
    supportDocSize: '112 KB',
    status: 'aprobado',
    createdAt: '2026-10-08 18:30',
  },
  {
    id: 'nov-003',
    employeeId: 'emp-004', // Gestor de proyectos
    type: 'permiso_no_remunerado',
    startDate: '2026-10-09',
    endDate: '2026-10-09',
    days: 1,
    hours: 8,
    description: 'Un día de permiso personal no remunerado para diligencias notariales.',
    supportDocName: 'Solicitud_Permiso_No_Remunerado_LauraMoreno.pdf',
    supportDocSize: '180 KB',
    status: 'aprobado',
    createdAt: '2026-10-05 14:00',
  },
];

export const INITIAL_UNIFORM_DELIVERIES: UniformDelivery[] = [
  {
    id: 'dot-001',
    employeeId: 'emp-001', // Auxiliar contable
    periodName: '1ª Entrega (30 de Abril)',
    legalDeadline: '2026-04-30',
    deliveryDate: '2026-04-28',
    itemsDelivered: [
      '1 Par de Calzado Formal de Oficina (Talla 38)',
      '1 Vestido de Labor / Pantalón de Paño (Talla 30)',
      '2 Camisas Ejecutivas con Logo Corporación Somos Uno (Talla M)',
    ],
    estimatedCost: 240000,
    status: 'entregado',
    signedReceipt: true,
    notes: 'Acta de entrega firmada y archivada. Prendas en óptimo estado.',
  },
  {
    id: 'dot-002',
    employeeId: 'emp-002', // Administración
    periodName: '1ª Entrega (30 de Abril)',
    legalDeadline: '2026-04-30',
    deliveryDate: '2026-04-28',
    itemsDelivered: [
      '1 Par de Calzado Ergonómico de Oficina (Talla 37)',
      '1 Pantalón Formal de Dotación (Talla 28)',
      '2 Blusas Institucionales Manga Larga (Talla S)',
    ],
    estimatedCost: 260000,
    status: 'entregado',
    signedReceipt: true,
    notes: 'Entrega cuatrimestral formalizada conforme a Art. 230 CST.',
  },
  {
    id: 'dot-003',
    employeeId: 'emp-004', // Gestor de proyectos
    periodName: '1ª Entrega (30 de Abril)',
    legalDeadline: '2026-04-30',
    deliveryDate: '2026-04-29',
    itemsDelivered: [
      '1 Par de Botas / Calzado Ergonómico de Terreno (Talla 41)',
      '1 Jean de Alta Resistencia para Trabajo de Campo (Talla 32)',
      '2 Camisas Tipo Polo de Labor Comunitaria (Talla L)',
      '1 Chaleco Institucional Impermeable con Distintivo Somos Uno',
    ],
    estimatedCost: 300000,
    status: 'entregado',
    signedReceipt: true,
    notes: 'Dotación para intervención en territorio y proyectos sociales.',
  },
  {
    id: 'dot-004',
    employeeId: 'emp-001',
    periodName: '2ª Entrega (31 de Agosto)',
    legalDeadline: '2026-08-31',
    deliveryDate: '2026-08-25',
    itemsDelivered: [
      '1 Par de Calzado Formal de Oficina (Talla 38)',
      '1 Pantalón de Labor (Talla 30)',
      '2 Camisas Ejecutivas Corporativas (Talla M)',
    ],
    estimatedCost: 240000,
    status: 'entregado',
    signedReceipt: true,
    notes: 'Segunda entrega cuatrimestral efectuada oportunamente.',
  },
  {
    id: 'dot-005',
    employeeId: 'emp-002',
    periodName: '2ª Entrega (31 de Agosto)',
    legalDeadline: '2026-08-31',
    deliveryDate: '2026-08-25',
    itemsDelivered: [
      '1 Par de Calzado de Oficina (Talla 37)',
      '1 Pantalón Formal (Talla 28)',
      '2 Blusas Institucionales (Talla S)',
    ],
    estimatedCost: 260000,
    status: 'entregado',
    signedReceipt: true,
    notes: 'Segunda dotación verificada por talento humano.',
  },
  {
    id: 'dot-006',
    employeeId: 'emp-004',
    periodName: '2ª Entrega (31 de Agosto)',
    legalDeadline: '2026-08-31',
    deliveryDate: '2026-08-26',
    itemsDelivered: [
      '1 Par de Botas de Campo (Talla 41)',
      '1 Jean Industrial (Talla 32)',
      '2 Camisas Polo de Campo (Talla L)',
    ],
    estimatedCost: 300000,
    status: 'entregado',
    signedReceipt: true,
    notes: 'Segunda entrega para actividades en campo.',
  },
  {
    id: 'dot-007',
    employeeId: 'emp-001',
    periodName: '3ª Entrega (20 de Diciembre)',
    legalDeadline: '2026-12-20',
    deliveryDate: undefined,
    itemsDelivered: [
      '1 Par de Calzado Formal (Talla 38)',
      '1 Pantalón de Labor (Talla 30)',
      '2 Camisas Ejecutivas (Talla M)',
    ],
    estimatedCost: 240000,
    status: 'programado',
    signedReceipt: false,
    notes: 'Programada según calendario legal para el 20 de diciembre de 2026.',
  },
  {
    id: 'dot-008',
    employeeId: 'emp-002',
    periodName: '3ª Entrega (20 de Diciembre)',
    legalDeadline: '2026-12-20',
    deliveryDate: undefined,
    itemsDelivered: [
      '1 Par de Calzado de Oficina (Talla 37)',
      '1 Pantalón Formal (Talla 28)',
      '2 Blusas Institucionales (Talla S)',
    ],
    estimatedCost: 260000,
    status: 'programado',
    signedReceipt: false,
    notes: 'Programada según calendario legal para el 20 de diciembre de 2026.',
  },
  {
    id: 'dot-009',
    employeeId: 'emp-004',
    periodName: '3ª Entrega (20 de Diciembre)',
    legalDeadline: '2026-12-20',
    deliveryDate: undefined,
    itemsDelivered: [
      '1 Par de Botas de Campo (Talla 41)',
      '1 Jean Industrial (Talla 32)',
      '2 Camisas Polo de Campo (Talla L)',
    ],
    estimatedCost: 300000,
    status: 'programado',
    signedReceipt: false,
    notes: 'Programada según calendario legal para el 20 de diciembre de 2026.',
  },
];

export const PROJECTS_LIST = [
  'Gestión Institucional Sede Central',
  'Proyecto Comunitario Bienestar y Nutrición',
  'Proyecto Juventud y Paz - Huellas de Esperanza',
  'Proyecto Fortalecimiento Microempresarial',
];

export const NORMATIVITY_ARTICLES = [
  {
    code: 'Código Sustantivo del Trabajo (Art. 230 a 234)',
    theme: 'Suministro de Calzado y Vestido de Labor (Dotaciones)',
    summary: 'Obligación legal del empleador de suministrar cada 4 meses (3 veces al año: 30 de abril, 31 de agosto y 20 de diciembre), en forma gratuita, un par de zapatos y un vestido de labor al trabajador cuya remuneración mensual sea hasta 2 salarios mínimos (Art. 230). Prohibición absoluta de compensación en dinero (Art. 234). Obligación del trabajador de destinarlo al servicio contratado (Art. 233).',
    articles: [
      { num: 'Art. 230', desc: 'Todo empleador debe suministrar cada 4 meses un par de zapatos y un vestido de labor al trabajador con más de 3 meses de servicio que devengue hasta 2 SMLMV.' },
      { num: 'Art. 232', desc: 'Fechas obligatorias de entrega de dotaciones: 30 de abril, 31 de agosto y 20 de diciembre de cada año.' },
      { num: 'Art. 233', desc: 'Obligación de uso: el trabajador debe destinar la dotación al servicio contratado; si no la usa, el empleador queda eximido de la siguiente entrega.' },
      { num: 'Art. 234', desc: 'Prohibición de compensación en dinero: queda terminantemente prohibido a los empleadores pagar en dinero la dotación de calzado y vestido.' }
    ]
  },
  {
    code: 'Código Sustantivo del Trabajo (CST)',
    theme: 'Estatuto general laboral',
    summary: 'Regula derechos y obligaciones entre empleador y trabajador: jornada ordinaria (Art. 158-167), descansos dominicales (Art. 172), salarios (Art. 127-134), auxilio de cesantías (Art. 249) y vacaciones (Art. 186).',
    articles: [
      { num: 'Art. 127', desc: 'Elementos integrantes del salario: remuneración fija u ordinaria, primas, sobresueldos y bonificaciones habituales.' },
      { num: 'Art. 128', desc: 'Pagos que no constituyen salario: auxilios de mera liberalidad, prestaciones sociales y viáticos accidentales.' },
      { num: 'Art. 186', desc: 'Vacaciones: 15 días hábiles consecutivos de vacaciones remuneradas por cada año laborado.' },
      { num: 'Art. 249', desc: 'Auxilio de Cesantías: el empleador debe pagar un mes de salario por cada año de servicios y proporcionalmente por fracción.' }
    ]
  },
  {
    code: 'Ley 50 de 1990',
    theme: 'Régimen especial de cesantías y contratos',
    summary: 'Crea el sistema de liquidación definitiva anual de cesantías con consignación a fondos antes del 15 de febrero de cada año, eliminando la retroactividad.',
    articles: [
      { num: 'Art. 99', desc: 'Liquidación de cesantías al 31 de diciembre de cada año y consignación en el fondo escogido por el empleado antes del 15 de febrero.' }
    ]
  },
  {
    code: 'Ley 52 de 1975',
    theme: 'Intereses a las cesantías',
    summary: 'Obliga a los empleadores a reconocer y pagar un interés del 12% anual sobre el saldo de las cesantías acumuladas, cancelable en enero de cada año.',
    articles: [
      { num: 'Art. 1', desc: 'Pago directo al trabajador de intereses del 12% anual sobre las cesantías acumuladas a 31 de diciembre o fecha de retiro.' }
    ]
  },
  {
    code: 'Ley 100 de 1993',
    theme: 'Sistema de Seguridad Social Integral',
    summary: 'Crea el Sistema General de Seguridad Social en Salud (8.5% empleador / 4% trabajador), Pensiones (12% empleador / 4% trabajador) y Riesgos Laborales (ARL).',
    articles: [
      { num: 'Libro I', desc: 'Sistema General de Pensiones (16% total sobre el IBC).' },
      { num: 'Libro II', desc: 'Sistema General de Seguridad Social en Salud (12.5% total sobre el IBC).' }
    ]
  },
  {
    code: 'Ley 2101 de 2021',
    theme: 'Reducción de la jornada laboral máxima',
    summary: 'Reduce de manera gradual la jornada laboral máxima legal de 48 a 42 horas semanales sin disminuir el salario del trabajador. A partir del 15 de julio de 2026 se alcanza la meta final de 42 horas semanales.',
    articles: [
      { num: 'Art. 2 y 3', desc: 'Jornada máxima semanal de 42 horas a partir de julio de 2026. Impacta la fórmula del valor hora ordinaria y recargos.' }
    ]
  },
  {
    code: 'Ley 2466 de 2025',
    theme: 'Reforma laboral colombiana',
    summary: 'Modifica las condiciones laborales en Colombia, incluyendo el incremento progresivo de los recargos dominicales y festivos, regulación de contratos y estabilidad reforzada.',
    articles: [
      { num: 'Cap. Recargos', desc: 'Ajuste al valor de trabajo dominical y festivo, y protección de derechos sindicales y de maternidad.' }
    ]
  },
  {
    code: 'Estatuto Tributario (Art. 114-1)',
    theme: 'Exoneración de aportes parafiscales y salud',
    summary: 'Exonera a sociedades y personas jurídicas del pago de aportes a SENA, ICBF y salud correspondientes a trabajadores que devenguen menos de 10 SMLMV.',
    articles: [
      { num: 'Art. 114-1', desc: 'Exención de aportes al SENA (2%), ICBF (3%) y salud patronal (8.5%) para devengos menores a 10 salarios mínimos.' }
    ]
  },
  {
    code: 'Decreto 1072 de 2015',
    theme: 'Decreto Único Reglamentario del Sector Trabajo',
    summary: 'Compila todas las normas reglamentarias laborales en Colombia, incluyendo el Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST) y reglas de pago.',
    articles: [
      { num: 'Libro 2, Parte 2', desc: 'Disposiciones reglamentarias sobre contratos, prestaciones y reportes al Ministerio de Trabajo.' }
    ]
  }
];

export const INITIAL_JOB_MANUAL: JobManualItem[] = [
  {
    id: 'man-001',
    position: 'Auxiliar contable',
    department: 'Contabilidad y Finanzas',
    directBoss: 'Administración / Gerencia General',
    objective:
      'Registrar, organizar y procesar las novedades y cálculos de nómina, asegurando el cumplimiento legal y el soporte documental de los pagos.',
    requirements: {
      education: 'Técnico, tecnólogo o estudiante universitario en Contabilidad, Finanzas o afines.',
      experience: 'Mínimo 1 año en liquidación de nómina, seguridad social (PILA) y prestaciones sociales.',
      competencies: [
        'Precisión matemática y numérica',
        'Manejo de normatividad laboral colombiana (CST)',
        'Organización de soportes y archivo contable',
        'Manejo de herramientas ofimáticas y plataformas contables',
      ],
    },
    functions: [
      'Registrar las novedades de nómina (incapacidades médicas, horas extras, permisos y vacaciones).',
      'Verificar los comprobantes de pago de cada colaborador.',
      'Apoyar la liquidación periódica de salarios (decenal, quincenal o mensual).',
      'Calcular deducciones legales (4% salud, 4% pensión) y provisiones de prestaciones sociales.',
      'Organizar y custodiar los documentos contables y soportes de pago.',
      'Generar informes de nómina y borradores de planillas de aportes.',
    ],
    responsibilities: [
      'Custodia de los soportes médicos y autorizaciones de novedades.',
      'Verificación de la correcta aplicación del auxilio de transporte legal.',
      'Garantizar la confidencialidad de la información salarial de los trabajadores.',
    ],
    updatedAt: '2026-10-15',
  },
  {
    id: 'man-002',
    position: 'Administración',
    department: 'Talento Humano y Operaciones',
    directBoss: 'Gerente General',
    objective:
      'Coordinar, supervisar y validar la gestión contractual, laboral y de talento humano de la Corporación Social Somos Uno, garantizando el orden administrativo.',
    requirements: {
      education: 'Profesional en Administración de Empresas, Gestión Humana, Contaduría o áreas afines.',
      experience: 'Mínimo 2 años en administración de personal, contratos y supervisión de procesos de nómina.',
      competencies: [
        'Liderazgo y supervisión de equipos',
        'Control y auditoría administrativa',
        'Resolución de conflictos y relaciones laborales',
        'Orientación a la calidad y mejora continua',
      ],
    },
    functions: [
      'Supervisar la información de los empleados en la plataforma institucional.',
      'Revisar contratos de trabajo, afiliaciones al sistema de seguridad social y novedades radicadas.',
      'Verificar las liquidaciones de nómina preparadas por el auxiliar contable.',
      'Controlar los períodos de pago y velar por el cumplimiento de los calendarios institucionales.',
      'Aprobar los procesos administrativos correspondientes antes del desembolso.',
      'Coordinar auditorías internas de nómina y expedientes de personal.',
    ],
    responsibilities: [
      'Aprobación y verificación formal previa al desembolso de nómina.',
      'Custodia de contratos laborales y actas de vinculación.',
      'Cumplimiento de la política de protección de datos personales (Habeas Data).',
    ],
    updatedAt: '2026-10-15',
  },
  {
    id: 'man-003',
    position: 'Gerente',
    department: 'Alta Dirección',
    directBoss: 'Junta Directiva / Asamblea General',
    objective:
      'Liderar estratégicamente la Corporación Social Somos Uno, autorizar el gasto y dispersión de recursos laborales, y garantizar la sostenibilidad financiera y legal de la organización.',
    requirements: {
      education: 'Profesional universitario con especialización o maestría en Gerencia, Finanzas o Gestión Social.',
      experience: 'Mínimo 4 años en cargos de dirección, manejo de presupuestos y gestión integral de organizaciones.',
      competencies: [
        'Visión estratégica institucional',
        'Toma de decisiones financieras y legales',
        'Representación legal y negociación',
        'Gestión de presupuestos de alto impacto',
      ],
    },
    functions: [
      'Supervisar el proceso general de nómina de la Corporación Social Somos Uno.',
      'Autorizar los pagos y la dispersión bancaria definitiva de los salarios.',
      'Consultar informes financieros, costos laborales y provisiones.',
      'Aprobar presupuestos laborales anuales y asignaciones de recursos por proyecto.',
      'Tomar decisiones relacionadas con la gestión, contratación y desvinculación del personal.',
      'Representar a la corporación ante entidades gubernamentales y de control.',
    ],
    responsibilities: [
      'Autorización final de desembolsos bancarios de nómina.',
      'Garantizar la disponibilidad de fondos para el pago oportuno de salarios y PILA.',
      'Aprobación de aumentos salariales y modificaciones en los parámetros normativos.',
    ],
    updatedAt: '2026-10-15',
  },
  {
    id: 'man-004',
    position: 'Gestor de proyectos',
    department: 'Dirección de Proyectos Sociales',
    directBoss: 'Gerente General',
    objective:
      'Formular, planificar y supervisar la ejecución presupuestal y de talento humano de los proyectos comunitarios y sociales ejecutados por la Corporación.',
    requirements: {
      education: 'Profesional en Ciencias Sociales, Ingeniería, Gestión de Proyectos o áreas afines.',
      experience: 'Mínimo 2 años en gestión de proyectos sociales, control de presupuestos y seguimiento de equipos.',
      competencies: [
        'Planificación y seguimiento presupuestal',
        'Trabajo en territorio y articulación comunitaria',
        'Manejo de cronogramas e indicadores de impacto',
        'Análisis de costos y optimización de recursos',
      ],
    },
    functions: [
      'Consultar los costos laborales imputados a cada proyecto social.',
      'Registrar la asignación de personal a los proyectos institucionales correspondientes.',
      'Verificar presupuestos de personal y validar disponibilidad de recursos.',
      'Generar informes de costos y ejecución presupuestal por proyecto.',
      'Apoyar el seguimiento del bienestar y recursos humanos en territorio.',
      'Optimizar el rendimiento del personal adscrito a cada iniciativa social.',
    ],
    responsibilities: [
      'Seguimiento a la asignación eficiente de colaboradores en los proyectos.',
      'Control del techo presupuestal asignado a cada iniciativa comunitaria.',
      'Verificación del cumplimiento de entregables de los proyectos.',
    ],
    updatedAt: '2026-10-15',
  },
];

export const INITIAL_COMPANY_CONFIG: CompanyConfig = {
  businessName: 'Corporación Social Somos Uno',
  nit: '901.458.239-1',
  address: 'Calle 45 # 18-32, Teusaquillo',
  city: 'Bogotá D.C., Colombia',
  phone: '(601) 745 8900',
  email: 'administracion@somosuno.org.co',
  legalRepresentative: 'Dr. Fernando Salazar Valderrama',
  economicActivity: '9499 - Actividades de otras asociaciones n.c.p. (Entidad sin ánimo de lucro)',
  establishedYear: 2018,
};

export const INITIAL_SYSTEM_USERS: SystemUser[] = [
  {
    id: 'usr-001',
    username: 'carlos.mendoza',
    fullName: 'Carlos Mendoza',
    role: 'auxiliar',
    email: 'carlos.mendoza@somosuno.org.co',
    status: 'active',
    lastLogin: '2026-10-31 08:30',
  },
  {
    id: 'usr-002',
    username: 'martha.rios',
    fullName: 'Martha Lucia Ríos',
    role: 'admin',
    email: 'administracion@somosuno.org.co',
    status: 'active',
    lastLogin: '2026-10-31 09:15',
  },
  {
    id: 'usr-003',
    username: 'fernando.salazar',
    fullName: 'Dr. Fernando Salazar V.',
    role: 'gerente',
    email: 'gerencia@somosuno.org.co',
    status: 'active',
    lastLogin: '2026-10-31 10:00',
  },
  {
    id: 'usr-004',
    username: 'patricia.duque',
    fullName: 'Ing. Patricia Duque',
    role: 'gestor',
    email: 'proyectos@somosuno.org.co',
    status: 'active',
    lastLogin: '2026-10-31 11:20',
  },
];

