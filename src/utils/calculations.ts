import {
  Employee,
  EmployeeLiquidation,
  LegalParameters,
  Novelty,
  PayrollFrequency,
} from '../types/payroll';

export function calculateHourlyRate(baseSalary: number, params: LegalParameters): number {
  // Conforme a la Ley 2101 de 2021 (42 horas semanales desde julio 2026),
  // el número de horas al mes es (42 horas / 6 días) * 30 días = 210 horas
  const monthlyHours = params.monthlyHours || 210;
  return baseSalary / monthlyHours;
}

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

interface LiquidationOptions {
  frequency: PayrollFrequency;
  subPeriod?: number; // 1, 2, 3 for decenal; 1, 2 for quincenal
  includeNovelties?: boolean;
}

export function calculateEmployeePayroll(
  employee: Employee,
  params: LegalParameters,
  novelties: Novelty[] = [],
  options: LiquidationOptions = { frequency: 'mensual', includeNovelties: true }
): EmployeeLiquidation {
  const { frequency, includeNovelties = true } = options;

  // Determinar los días del período
  let periodDays = 30;
  if (frequency === 'decenal') {
    periodDays = 10;
  } else if (frequency === 'quincenal') {
    periodDays = 15;
  }

  // Filtrar novedades del empleado si están habilitadas
  const empNovelties = includeNovelties
    ? novelties.filter((n) => n.employeeId === employee.id && n.status === 'aprobado')
    : [];

  // Calcular impacto de novedades en días laborados
  let unpaidDays = 0;
  let incapacityDays = 0;
  let vacationDays = 0;
  let overtimeDiurnaHours = 0;
  let overtimeNocturnaHours = 0;
  let overtimeFestivaHours = 0;
  let nightSurchargeHours = 0;
  let holidaySurchargeHours = 0;
  let bonusesAmount = 0;
  let commissionsAmount = 0;

  empNovelties.forEach((nov) => {
    switch (nov.type) {
      case 'permiso_no_remunerado':
      case 'ausencia_injustificada':
        unpaidDays += nov.days || 1;
        break;
      case 'incapacidad_general':
      case 'incapacidad_laboral':
        incapacityDays += nov.days || 1;
        break;
      case 'vacaciones':
        vacationDays += nov.days || 0;
        break;
      case 'horas_extras_diurnas':
        overtimeDiurnaHours += nov.hours || 0;
        break;
      case 'horas_extras_nocturnas':
        overtimeNocturnaHours += nov.hours || 0;
        break;
      case 'horas_extras_festivas_diurnas':
      case 'horas_extras_festivas_nocturnas':
        overtimeFestivaHours += nov.hours || 0;
        break;
      case 'recargo_nocturno':
        nightSurchargeHours += nov.hours || 0;
        break;
      case 'recargo_festivo':
        holidaySurchargeHours += nov.hours || 0;
        break;
      case 'bonificacion':
        bonusesAmount += nov.amount || 0;
        break;
      case 'comision':
        commissionsAmount += nov.amount || 0;
        break;
      default:
        break;
    }
  });

  // Días laborados efectivos
  const workedDays = Math.max(0, periodDays - unpaidDays - incapacityDays);

  // Valor hora ordinaria
  const hourlyRate = calculateHourlyRate(employee.baseSalary, params);
  const dailyRate = employee.baseSalary / 30;

  // Salario proporcional
  const earnedSalary = (employee.baseSalary / 30) * (periodDays - unpaidDays - incapacityDays);

  // Incapacidad (empresa asume primeros días conforme a CST al 66.67% o mínimo el SMLMV proporcional)
  let incapacityAllowance = 0;
  if (incapacityDays > 0) {
    const minDailyRate = params.smlmv / 30;
    const calcDaily = (dailyRate * 2) / 3;
    incapacityAllowance = Math.max(calcDaily, minDailyRate) * incapacityDays;
  }

  // Horas extras y recargos
  const overtimeDiurnaAmount = overtimeDiurnaHours * hourlyRate * params.overtimeRates.diurna;
  const overtimeNocturnaAmount = overtimeNocturnaHours * hourlyRate * params.overtimeRates.nocturna;
  const overtimeFestivaAmount = overtimeFestivaHours * hourlyRate * params.overtimeRates.festivaDiurna;
  const nightSurchargesAmount = nightSurchargeHours * hourlyRate * params.overtimeRates.recargoNocturno;
  const holidaySurchargesAmount = holidaySurchargeHours * hourlyRate * params.overtimeRates.recargoDominical;

  // Auxilio de transporte
  // Aplica si devenga hasta 2 SMLMV
  const qualifiesForTransport = employee.baseSalary <= params.maxSalaryForTransport;
  let transportAllowance = 0;
  if (qualifiesForTransport) {
    // Proporcional a días que realmente se desplazó a laborar (descuenta incapacidades y permisos)
    transportAllowance = (params.transportAllowance / 30) * (periodDays - unpaidDays - incapacityDays);
  }

  // Total devengado
  const totalDevengado =
    earnedSalary +
    transportAllowance +
    incapacityAllowance +
    overtimeDiurnaAmount +
    overtimeNocturnaAmount +
    overtimeFestivaAmount +
    nightSurchargesAmount +
    holidaySurchargesAmount +
    bonusesAmount +
    commissionsAmount;

  // Ingreso Base de Cotización (IBC)
  // El auxilio de transporte no hace parte del IBC
  // El IBC no puede ser inferior a 1 SMLMV mensual (proporcional al tiempo)
  const ibcSinAux = totalDevengado - transportAllowance;
  const minIbcPeriod = (params.smlmv / 30) * (periodDays - unpaidDays);
  const ibc = Math.max(ibcSinAux, Math.min(minIbcPeriod, ibcSinAux));

  // Deducciones del trabajador
  const healthEmployee = ibc * params.healthEmployeeRate; // 4%
  const pensionEmployee = ibc * params.pensionEmployeeRate; // 4%

  // Fondo de Solidaridad Pensional: si salario mensual supera 4 SMLMV
  let solidarityPensionFund = 0;
  if (employee.baseSalary > params.smlmv * 4) {
    // 1% a 2% según escala
    solidarityPensionFund = (ibc * 0.01);
  }

  const unpaidLeaveDeduction = (employee.baseSalary / 30) * unpaidDays;
  const voluntaryDeductions = 0;

  const totalDeducciones =
    healthEmployee +
    pensionEmployee +
    solidarityPensionFund +
    voluntaryDeductions;

  // Neto a pagar
  const netoPagar = totalDevengado - totalDeducciones;

  // Aportes del Empleador
  // Exoneración Art. 114-1 Estatuto Tributario: si aplica y gana menos de 10 SMLMV,
  // salud patronal (8.5%), SENA (2%) e ICBF (3%) están exonerados.
  const isEmployeeBelow10SMLMV = employee.baseSalary < params.smlmv * 10;
  const isExempt = params.isExemptArticle114 && isEmployeeBelow10SMLMV;

  const healthEmployer = isExempt ? 0 : ibc * params.healthEmployerRate; // 8.5%
  const pensionEmployer = ibc * params.pensionEmployerRate; // 12%

  const arlRate = params.arlRates[employee.arlRiskLevel] || 0.00522;
  const arlEmployer = ibc * arlRate;

  const cajaCompensacion = ibc * params.compensationBoxRate; // 4%
  const sena = isExempt ? 0 : ibc * params.senaRate; // 2%
  const icbf = isExempt ? 0 : ibc * params.icbfRate; // 3%

  const totalSeguridadSocialEmpleador = healthEmployer + pensionEmployer + arlEmployer;
  const totalParafiscales = cajaCompensacion + sena + icbf;

  // Prestaciones Sociales (Provisiones mensuales o del período)
  // Base cesantías y prima = Devengado total incluyendo auxilio de transporte
  // Base vacaciones = Solo salario básico y recargos salariales (NO incluye auxilio de transporte)
  const basePrestaciones = totalDevengado;
  const baseVacaciones = totalDevengado - transportAllowance;

  // Fórmulas oficiales colombianas:
  // Cesantías: (Base * días) / 360  (aprox 8.333%)
  // Intereses a cesantías: (Cesantías * días * 12%) / 360  (aprox 1% mensual de la cesantía)
  // Prima de servicios: (Base * días) / 360  (aprox 8.333%)
  // Vacaciones: (BaseVacaciones * días) / 720  (aprox 4.167%)
  const effectiveDaysForProvisions = workedDays + (incapacityDays > 0 ? incapacityDays : 0);
  
  const provisionCesantias = (basePrestaciones * effectiveDaysForProvisions) / 360;
  const provisionInteresesCesantias = (provisionCesantias * effectiveDaysForProvisions * params.severanceInterestRate) / 360;
  const provisionPrima = (basePrestaciones * effectiveDaysForProvisions) / 360;
  const provisionVacaciones = (baseVacaciones * effectiveDaysForProvisions) / 720;

  const totalPrestaciones =
    provisionCesantias +
    provisionInteresesCesantias +
    provisionPrima +
    provisionVacaciones;

  // Dotaciones Laborales (Art. 230 CST): Aplica a devengos de hasta 2 SMLMV
  const qualifiesForUniform = employee.baseSalary <= params.maxSalaryForTransport;
  const dotacionCostoEntrega = qualifiesForUniform ? (employee.uniformCostPerDelivery || 250000) : 0;
  // Provisión mensual: 3 entregas al año distribuidas en 12 meses = costoEntrega * 3 / 12 = costoEntrega / 4
  const dotacionProvisionMensual = qualifiesForUniform ? (dotacionCostoEntrega * 3) / 12 : 0;

  // Costo total de la empresa para este colaborador en el período
  const costoTotalEmpresa =
    totalDevengado +
    totalSeguridadSocialEmpleador +
    totalParafiscales +
    totalPrestaciones;


  return {
    employee,
    periodDays,
    workedDays,
    unpaidDays,
    incapacityDays,
    baseSalary: employee.baseSalary,
    earnedSalary,
    transportAllowance,
    overtimeDiurnaAmount,
    overtimeNocturnaAmount,
    overtimeFestivaAmount,
    nightSurchargesAmount,
    holidaySurchargesAmount,
    bonusesAmount,
    commissionsAmount,
    incapacityAllowance,
    totalDevengado,
    ibc,
    healthEmployee,
    pensionEmployee,
    solidarityPensionFund,
    unpaidLeaveDeduction,
    voluntaryDeductions,
    totalDeducciones,
    netoPagar,
    healthEmployer,
    pensionEmployer,
    arlEmployer,
    cajaCompensacion,
    sena,
    icbf,
    totalSeguridadSocialEmpleador,
    totalParafiscales,
    basePrestaciones,
    baseVacaciones,
    provisionCesantias,
    provisionInteresesCesantias,
    provisionPrima,
    provisionVacaciones,
    totalPrestaciones,
    qualifiesForUniform,
    dotacionCostoEntrega,
    dotacionProvisionMensual,
    costoTotalEmpresa,
  };
}

export function calculatePayrollTotals(liquidations: EmployeeLiquidation[]) {
  return liquidations.reduce(
    (acc, curr) => ({
      totalSalarios: acc.totalSalarios + curr.baseSalary,
      totalDevengado: acc.totalDevengado + curr.totalDevengado,
      totalAuxilioTransporte: acc.totalAuxilioTransporte + curr.transportAllowance,
      totalIbc: acc.totalIbc + curr.ibc,
      totalSaludEmpleado: acc.totalSaludEmpleado + curr.healthEmployee,
      totalPensionEmpleado: acc.totalPensionEmpleado + curr.pensionEmployee,
      totalDeducciones: acc.totalDeducciones + curr.totalDeducciones,
      totalNetoPagar: acc.totalNetoPagar + curr.netoPagar,
      
      // Empleador
      totalSaludEmpleador: acc.totalSaludEmpleador + curr.healthEmployer,
      totalPensionEmpleador: acc.totalPensionEmpleador + curr.pensionEmployer,
      totalArl: acc.totalArl + curr.arlEmployer,
      totalSeguridadSocialEmpleador: acc.totalSeguridadSocialEmpleador + curr.totalSeguridadSocialEmpleador,
      
      // Parafiscales
      totalCaja: acc.totalCaja + curr.cajaCompensacion,
      totalSena: acc.totalSena + curr.sena,
      totalIcbf: acc.totalIcbf + curr.icbf,
      totalParafiscales: acc.totalParafiscales + curr.totalParafiscales,
      
      // Prestaciones
      totalCesantias: acc.totalCesantias + curr.provisionCesantias,
      totalInteresesCesantias: acc.totalInteresesCesantias + curr.provisionInteresesCesantias,
      totalPrima: acc.totalPrima + curr.provisionPrima,
      totalVacaciones: acc.totalVacaciones + curr.provisionVacaciones,
      totalPrestaciones: acc.totalPrestaciones + curr.totalPrestaciones,

      // Dotaciones Laborales (Art. 230 CST)
      totalDotacionesProvision: acc.totalDotacionesProvision + curr.dotacionProvisionMensual,
      totalDotacionesEntrega: acc.totalDotacionesEntrega + curr.dotacionCostoEntrega,
      totalEmpleadosConDotacion: acc.totalEmpleadosConDotacion + (curr.qualifiesForUniform ? 1 : 0),
      
      // Gran costo
      totalCostoEmpresa: acc.totalCostoEmpresa + curr.costoTotalEmpresa,
    }),
    {
      totalSalarios: 0,
      totalDevengado: 0,
      totalAuxilioTransporte: 0,
      totalIbc: 0,
      totalSaludEmpleado: 0,
      totalPensionEmpleado: 0,
      totalDeducciones: 0,
      totalNetoPagar: 0,
      totalSaludEmpleador: 0,
      totalPensionEmpleador: 0,
      totalArl: 0,
      totalSeguridadSocialEmpleador: 0,
      totalCaja: 0,
      totalSena: 0,
      totalIcbf: 0,
      totalParafiscales: 0,
      totalCesantias: 0,
      totalInteresesCesantias: 0,
      totalPrima: 0,
      totalVacaciones: 0,
      totalPrestaciones: 0,
      totalDotacionesProvision: 0,
      totalDotacionesEntrega: 0,
      totalEmpleadosConDotacion: 0,
      totalCostoEmpresa: 0,
    }
  );
}

// Generador de planilla PILA resumida
export function generatePilaSummary(liquidations: EmployeeLiquidation[]) {
  return liquidations.map((liq, index) => ({
    secuencia: index + 1,
    tipoDoc: liq.employee.documentType,
    numeroDoc: liq.employee.documentNumber,
    nombre: liq.employee.fullName,
    cargo: liq.employee.position,
    diasCotizados: liq.workedDays + liq.incapacityDays,
    salarioBasico: liq.baseSalary,
    ibc: Math.round(liq.ibc),
    tarifaSalud: '12.5%',
    aporteSaludTotal: Math.round(liq.healthEmployee + liq.healthEmployer),
    tarifaPension: '16.0%',
    aportePensionTotal: Math.round(liq.pensionEmployee + liq.pensionEmployer),
    tarifaArl: `${(liq.employee.arlRiskLevel === 1 ? 0.522 : 1.044)}%`,
    aporteArl: Math.round(liq.arlEmployer),
    tarifaCaja: '4.0%',
    aporteCaja: Math.round(liq.cajaCompensacion),
    sena: Math.round(liq.sena),
    icbf: Math.round(liq.icbf),
    totalAportesSeguridad: Math.round(
      liq.healthEmployee +
        liq.healthEmployer +
        liq.pensionEmployee +
        liq.pensionEmployer +
        liq.arlEmployer +
        liq.cajaCompensacion +
        liq.sena +
        liq.icbf
    ),
  }));
}

// Exportador a CSV / Excel con delimitador punto y coma y BOM UTF-8
export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const bom = '\uFEFF';
  const csvContent =
    bom +
    [
      headers.join(';'),
      ...rows.map((row) =>
        row
          .map((cell) => {
            const str = String(cell ?? '');
            if (str.includes(';') || str.includes('"') || str.includes('\n')) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          })
          .join(';')
      ),
    ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
