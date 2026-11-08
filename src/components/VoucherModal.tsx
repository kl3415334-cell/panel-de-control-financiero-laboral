import React from 'react';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';
import { Employee, EmployeeLiquidation, PayrollFrequency } from '../types/payroll';
import { formatCOP, formatNumber } from '../utils/calculations';

interface VoucherModalProps {
  liquidation: EmployeeLiquidation;
  frequency: PayrollFrequency;
  periodNumber: number;
  onClose: () => void;
}

export const VoucherModal: React.FC<VoucherModalProps> = ({
  liquidation,
  frequency,
  periodNumber,
  onClose,
}) => {
  const { employee } = liquidation;

  const handlePrint = () => {
    window.print();
  };

  const periodTitle =
    frequency === 'decenal'
      ? `Período Decenal ${periodNumber} (10 días) · Octubre 2026`
      : frequency === 'quincenal'
      ? `Período Quincenal ${periodNumber} (15 días) · Octubre 2026`
      : 'Mes Completo (30 días) · Octubre 2026';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full p-8 border border-slate-200 shadow-2xl relative my-8 print:m-0 print:p-0 print:border-none print:shadow-none">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6 no-print">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Documento Laboral Oficial
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Comprobante de Liquidación & Pago de Nómina
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Imprimir / PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE VOUCHER CONTENT */}
        <div className="space-y-6 text-xs text-slate-800">
          
          {/* Header of Voucher */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded bg-slate-900 text-white font-black text-sm flex items-center justify-center border border-amber-400">
                SU
              </div>
              <div>
                <h1 className="text-sm font-black text-slate-900 tracking-tight">
                  CORPORACIÓN SOCIAL SOMOS UNO
                </h1>
                <p className="text-[11px] text-slate-600">NIT 901.458.239-1 · Régimen Especial</p>
                <p className="text-[10px] text-slate-500">
                  Calle 45 # 18-32, Bogotá D.C. · Tel: (601) 745 8900
                </p>
              </div>
            </div>

            <div className="text-right font-mono">
              <span className="text-[11px] font-bold text-blue-900 block bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                COMPROBANTE No. SU-2026-{employee.id.replace('emp-', '')}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">{periodTitle}</p>
            </div>
          </div>

          {/* Employee Information Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px]">
            <div>
              <span className="text-slate-500 block font-sans text-[10px]">Colaborador:</span>
              <span className="font-bold text-slate-900">{employee.fullName}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-sans text-[10px]">Identificación:</span>
              <span>{employee.documentType} {employee.documentNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-sans text-[10px]">Cargo:</span>
              <span className="font-semibold text-slate-900">{employee.position}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-sans text-[10px]">Salario Básico:</span>
              <span className="font-bold text-blue-800">{formatCOP(employee.baseSalary)}</span>
            </div>

            <div>
              <span className="text-slate-500 block font-sans text-[10px]">Días Liquidados:</span>
              <span>{liquidation.periodDays} ({liquidation.workedDays} laborados)</span>
            </div>
            <div>
              <span className="text-slate-500 block font-sans text-[10px]">EPS / Pensión:</span>
              <span className="truncate block">{employee.eps} / {employee.pensionFund}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-sans text-[10px]">Entidad Bancaria:</span>
              <span>{employee.bankName}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-sans text-[10px]">Cuenta de Pago:</span>
              <span className="truncate block">{employee.bankAccount}</span>
            </div>
          </div>

          {/* Double Column Breakdown: Devengados vs Deducciones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Devengados */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 font-bold text-slate-800 flex justify-between">
                <span>CONCEPTOS DEVENGADOS</span>
                <span>VALOR (COP)</span>
              </div>
              <div className="p-3 space-y-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="font-sans text-slate-600">Salario Proporcional ({liquidation.workedDays}d):</span>
                  <span>{formatCOP(liquidation.earnedSalary)}</span>
                </div>

                {liquidation.transportAllowance > 0 && (
                  <div className="flex justify-between">
                    <span className="font-sans text-slate-600">Auxilio de Transporte Legal:</span>
                    <span>{formatCOP(liquidation.transportAllowance)}</span>
                  </div>
                )}

                {liquidation.overtimeDiurnaAmount > 0 && (
                  <div className="flex justify-between text-blue-800">
                    <span className="font-sans">Horas Extras Diurnas (25%):</span>
                    <span>+{formatCOP(liquidation.overtimeDiurnaAmount)}</span>
                  </div>
                )}

                {liquidation.incapacityAllowance > 0 && (
                  <div className="flex justify-between text-amber-800">
                    <span className="font-sans">Auxilio Incapacidad ({liquidation.incapacityDays}d):</span>
                    <span>+{formatCOP(liquidation.incapacityAllowance)}</span>
                  </div>
                )}

                {liquidation.bonusesAmount > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span className="font-sans">Bonificación Reconocida:</span>
                    <span>+{formatCOP(liquidation.bonusesAmount)}</span>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 px-3 py-2 border-t border-slate-200 font-bold text-slate-900 flex justify-between font-mono text-xs">
                <span className="font-sans">TOTAL DEVENGADO:</span>
                <span>{formatCOP(liquidation.totalDevengado)}</span>
              </div>
            </div>

            {/* Deducciones */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 font-bold text-slate-800 flex justify-between">
                <span>DEDUCCIONES DE LEY</span>
                <span>VALOR (COP)</span>
              </div>
              <div className="p-3 space-y-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="font-sans text-slate-600">Aporte Salud Trabajador (4%):</span>
                  <span>{formatCOP(liquidation.healthEmployee)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-sans text-slate-600">Aporte Pensión Trabajador (4%):</span>
                  <span>{formatCOP(liquidation.pensionEmployee)}</span>
                </div>

                {liquidation.solidarityPensionFund > 0 && (
                  <div className="flex justify-between text-amber-800">
                    <span className="font-sans">Fondo Solidaridad Pensional:</span>
                    <span>{formatCOP(liquidation.solidarityPensionFund)}</span>
                  </div>
                )}

                {liquidation.unpaidLeaveDeduction > 0 && (
                  <div className="flex justify-between text-red-700">
                    <span className="font-sans">Descuento Permiso No Remunerado:</span>
                    <span>-{formatCOP(liquidation.unpaidLeaveDeduction)}</span>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 px-3 py-2 border-t border-slate-200 font-bold text-red-600 flex justify-between font-mono text-xs">
                <span className="font-sans">TOTAL DEDUCCIONES:</span>
                <span>-{formatCOP(liquidation.totalDeducciones)}</span>
              </div>
            </div>

          </div>

          {/* NET PAYMENT HIGHLIGHT */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between font-mono">
            <div>
              <span className="text-[11px] font-sans font-bold text-emerald-900 block">
                VALOR NETO A RECIBIR:
              </span>
              <span className="text-[10px] text-emerald-700 font-sans">
                Abono en cuenta bancaria registrada · Dispersión autorizada
              </span>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-emerald-800">
                {formatCOP(liquidation.netoPagar)}
              </span>
            </div>
          </div>

          {/* Legal Note & Disclaimer */}
          <div className="p-3 bg-slate-50 rounded border border-slate-200 text-[10px] text-slate-500 leading-relaxed font-sans">
            Constancia de pago expedida conforme a las prescripciones del Código Sustantivo del Trabajo de Colombia. El trabajador manifiesta haber recibido a entera satisfacción los conceptos liquidados en el presente comprobante, reconociendo que no existen acreencias pendientes a la fecha.
          </div>

          {/* Dotación Laboral Note if applies */}
          {employee.uniformSizes && liquidation.qualifiesForUniform && (
            <div className="flex items-center justify-between text-[10px] text-slate-700 bg-blue-50/60 p-2.5 rounded border border-blue-200 font-sans">
              <span className="font-semibold text-blue-900">
                Suministro de Calzado & Vestido de Labor (Art. 230 CST):
              </span>
              <span className="font-mono text-slate-800">
                Tallas registradas: Camisa {employee.uniformSizes.shirt} · Pantalón {employee.uniformSizes.pants} · Calzado {employee.uniformSizes.shoes}
              </span>
            </div>
          )}

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-12 pt-8 text-center text-xs">
            <div>
              <div className="border-t border-slate-400 pt-1.5 font-bold text-slate-800">
                CORPORACIÓN SOCIAL SOMOS UNO
              </div>
              <p className="text-[10px] text-slate-500 font-sans">Firma Autorizada Empleador · NIT 901.458.239-1</p>
            </div>
            <div>
              <div className="border-t border-slate-400 pt-1.5 font-bold text-slate-800">
                {employee.fullName}
              </div>
              <p className="text-[10px] text-slate-500 font-sans">
                Firma de Recibido Trabajador · {employee.documentType} {employee.documentNumber}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
