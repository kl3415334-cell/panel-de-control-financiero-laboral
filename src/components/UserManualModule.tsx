import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Printer,
  ChevronRight,
  UserCheck,
  PlusCircle,
  FileEdit,
  CalendarCheck2,
  Calculator,
  Gift,
  Building2,
  FileSpreadsheet,
  FileText,
  DownloadCloud,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  ShieldAlert,
  Shirt,
} from 'lucide-react';

interface ManualChapter {
  id: string;
  num: number;
  title: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
  steps: string[];
  visualMockup: {
    title: string;
    description: string;
    highlights: string[];
  };
  tips: string;
  legalWarning?: string;
}

export const UserManualModule: React.FC = () => {
  const [activeChapterId, setActiveChapterId] = useState<string>('cap-1');
  const [searchQuery, setSearchQuery] = useState('');

  const chapters: ManualChapter[] = [
    {
      id: 'cap-1',
      num: 1,
      title: 'Cómo ingresar a la plataforma & gestionar perfiles de usuario',
      shortDesc: 'Inicio de sesión, selección de rol y verificación de permisos institucionales.',
      icon: UserCheck,
      steps: [
        'Abra la plataforma en su navegador o ejecútela desde el acceso directo de su escritorio.',
        'En la esquina superior derecha de la barra principal, identifique el selector de "Perfil Activo".',
        'Seleccione el rol correspondiente a sus funciones: Auxiliar Contable (Carlos Mendoza), Administración (Martha Ríos), Gerente General (Dr. Fernando Salazar) o Gestor de Proyectos (Ing. Patricia Duque).',
        'El sistema adaptará automáticamente el menú lateral habilitando únicamente las acciones autorizadas para su perfil institucional.',
      ],
      visualMockup: {
        title: 'Barra Superior & Conmutador de Roles',
        description: 'La cabecera incluye el logo oficial, conmutador de períodos (10 días, 15 días o mes) y selector de roles con control de acceso inmediato.',
        highlights: [
          'Selector de rol en la barra superior derecha',
          'Conmutador de período: Decenal (1-10, 11-20, 21-30), Quincenal o Mensual',
          'Indicador de alertas y campana de vencimientos laborales',
        ],
      },
      tips: 'Los usuarios auxiliares pueden preparar nóminas pero no autorizar pagos; la autorización bancaria está reservada a la Gerencia General.',
    },
    {
      id: 'cap-2',
      num: 2,
      title: 'Cómo registrar un nuevo empleado',
      shortDesc: 'Vinculación de colaboradores, asignación salarial y afiliaciones a seguridad social.',
      icon: PlusCircle,
      steps: [
        'Diríjase al menú lateral y seleccione el módulo "Empleados".',
        'Haga clic en el botón azul superior "Registrar Nuevo Empleado".',
        'Complete los campos obligatorios: Nombre completo, tipo y número de documento de identidad.',
        'Indique el cargo desempeñado, tipo de contrato (Indefinido, Fijo u Obra) y fecha formal de ingreso.',
        'Ingrese el Salario Básico Mensual en pesos colombianos. El sistema calculará automáticamente si tiene derecho al auxilio de transporte legal (si es menor o igual a 2 SMLMV).',
        'Seleccione las entidades de seguridad social asignadas: EPS, Fondo de Pensiones, ARL (Riesgo I a V) y Caja de Compensación Familiar.',
        'Registre los datos bancarios para dispersión y haga clic en "Guardar Información".',
      ],
      visualMockup: {
        title: 'Formulario de Registro de Colaborador',
        description: 'Ventana modal con validación de documento, salario en pesos colombianos y cálculo automático de auxilio de transporte.',
        highlights: [
          'Campo de salario con indicador de derecho a auxilio de transporte',
          'Selección de nivel de riesgo ARL (0.522% a 6.960%)',
          'Registro de cuenta bancaria para pago automatizado',
        ],
      },
      tips: 'El auxilio de transporte en 2026 es de $249.095 y aplica exclusivamente a quienes devenguen hasta dos salarios mínimos legales ($3.501.810).',
    },
    {
      id: 'cap-3',
      num: 3,
      title: 'Cómo consultar & modificar información de colaboradores',
      shortDesc: 'Búsqueda en tiempo real, edición de contratos y retiro de empleados con confirmación.',
      icon: FileEdit,
      steps: [
        'En el módulo "Empleados", utilice la barra de búsqueda para ubicar al trabajador por nombre, cédula o proyecto.',
        'Haga clic en el ícono de ojo (Ver) para consultar la Ficha Laboral Oficial con todo su historial de afiliaciones.',
        'Para actualizar el salario, cargo o datos bancarios, haga clic en el ícono de lápiz (Editar).',
        'Realice las correcciones deseadas y confirme con el botón "Guardar Información".',
        'Si un empleado se desvincula de la organización, haga clic en el ícono de papelera (Eliminar) y confirme en el modal de advertencia.',
      ],
      visualMockup: {
        title: 'Directorio de Personal con Filtros Avanzados',
        description: 'Tabla dinámica con avatar, documento, cargo, salario pactado y botones de acción rápida con confirmación.',
        highlights: [
          'Buscador en tiempo real por cualquier criterio de texto',
          'Filtro rápido por cargo institucional',
          'Modal de confirmación para evitar eliminaciones accidentales',
        ],
      },
      tips: 'Cualquier modificación salarial recalcula inmediatamente todas las proyecciones de prestaciones sociales y nómina.',
    },
    {
      id: 'cap-4',
      num: 4,
      title: 'Cómo registrar novedades laborales & adjuntar soportes',
      shortDesc: 'Incapacidades médicas, horas extras, permisos, recargos y archivo documental.',
      icon: CalendarCheck2,
      steps: [
        'Ingrese al módulo "Novedades Laborales" desde el menú lateral.',
        'Haga clic en "Registrar Nueva Novedad".',
        'Seleccione el empleado relacionado y el tipo de novedad: Incapacidad general, Accidente ARL, Horas extras diurnas (25%), Horas extras nocturnas (75%), Recargo dominical (75%), Permiso no remunerado o Vacaciones.',
        'Defina la fecha del evento y la cantidad de días u horas trabajadas.',
        'Escriba una descripción detallada del evento e indique el nombre del soporte documental expedido (ej. Incapacidad EPS Sura Cert. 88921).',
        'Haga clic en "Guardar Novedad". La novedad quedará radicada para aprobación técnica.',
      ],
      visualMockup: {
        title: 'Panel de Novedades con Visor Documental',
        description: 'Permite visualizar el certificado digital de incapacidad médica o planilla de horas extras autorizada.',
        highlights: [
          'Diferenciación entre permisos remunerados y no remunerados',
          'Visor de soporte documental con radicado interno',
          'Aprobación administrativa antes de liquidar nómina',
        ],
      },
      tips: 'Los permisos no remunerados descuentan días de salario e impactan proporcionalmente el auxilio de transporte.',
      legalWarning: 'Toda incapacidad médica debe contar con el certificado oficial expedido por la EPS o ARL para justificar la ausencia.',
    },
    {
      id: 'cap-5',
      num: 5,
      title: 'Cómo liquidar la nómina & autorizar pagos',
      shortDesc: 'Cálculo de devengados, deducciones de ley, períodos decenales y dispersión bancaria.',
      icon: Calculator,
      steps: [
        'Acceda al módulo "Liquidación de Nómina".',
        'Configure la frecuencia en la barra superior: Decenal (10 días — tres pagos al mes), Quincenal (15 días) o Mensual (30 días).',
        'Revise en la tabla los devengados (salario, auxilio de transporte, extras) y deducciones (salud 4% y pensión 4%).',
        'Use el botón "Con Novedades" para alternar entre el escenario base del documento y el cálculo con eventos del período.',
        'Flujo de aprobación: El auxiliar hace clic en "Borrador" $\\rightarrow$ La administración hace clic en "Verificar Nómina" $\\rightarrow$ El Gerente autoriza el desembolso con "Autorizar Desembolso".',
        'Haga clic en "Exportar Excel (.csv)" para descargar la planilla bancaria de dispersión.',
      ],
      visualMockup: {
        title: 'Tabla de Liquidación con Workflow de Aprobación',
        description: 'Vista integral con desglose exacto columna a columna, totales consolidados y botones de comprobante.',
        highlights: [
          'Semáforo de estado: Borrador -> Verificado -> Autorizado',
          'Cálculo proporcional de auxilio de transporte',
          'Botón de información detallada de fórmulas por empleado',
        ],
      },
      tips: 'Al pagar cada 10 días, el 8% de deducción total en salud y pensión se aplica sobre el IBC proporcional de los 10 días, sin recargos adicionales.',
    },
    {
      id: 'cap-6',
      num: 6,
      title: 'Cómo calcular & proyectar prestaciones sociales',
      shortDesc: 'Cesantías, intereses, prima de servicios, vacaciones y liquidación definitiva anual.',
      icon: Gift,
      steps: [
        'Abra el módulo "Prestaciones Sociales".',
        'Observe las tarjetas superiores con las provisiones mensuales calculadas para Cesantías (8.33%), Intereses (1%), Prima (8.33%) y Vacaciones (4.167%).',
        'Verifique la tabla comparativa por colaborador: las cesantías y primas se calculan sobre la base con auxilio; las vacaciones se calculan únicamente sobre el básico.',
        'Para simular una liquidación final por retiro o corte de año, use el "Simulador de Liquidación Definitiva por Días", ingrese el número de días laborados (ej. 180 o 360 días) y consulte el valor exacto a liquidar.',
        'Haga clic en "Descargar Reporte (.csv)" para llevar el registro contable a su software tributario.',
      ],
      visualMockup: {
        title: 'Cuadro Prestacional & Fórmulas Legales CST',
        description: 'Muestra las bases de cálculo oficiales y simulador interactivo para calcular retiros o liquidaciones semestrales.',
        highlights: [
          'Bases diferenciadas (con y sin auxilio de transporte)',
          'Fórmulas legales visibles del Código Sustantivo del Trabajo',
          'Simulador de liquidación para cualquier número de días',
        ],
      },
      tips: 'El auxilio de transporte no integra la base de vacaciones pero sí la base de cesantías y primas conforme al Art. 7 de la Ley 1 de 1963.',
    },
    {
      id: 'cap-7',
      num: 7,
      title: 'Cómo consultar seguridad social & autoliquidación PILA',
      shortDesc: 'Aportes a Salud, Pensión, ARL, Parafiscales (Caja, SENA, ICBF) y exoneración Art. 114-1.',
      icon: Building2,
      steps: [
        'Ingrese al módulo "Seguridad Social & PILA".',
        'Revise el desglose de aportes patronales: Salud empleador 8.5%, Pensión empleador 12%, ARL Positiva (tarifa administrativa 0.522%) y Parafiscales 9% (Caja 4%, SENA 2%, ICBF 3%).',
        'Si la Corporación aplica a la exención del Art. 114-1 del Estatuto Tributario, active el interruptor "Exoneración Activa" para simular el ahorro del 13.5% en trabajadores de menos de 10 SMLMV.',
        'Consulte la tabla con la estructura oficial de la Planilla Integrada de Liquidación de Aportes (PILA).',
        'Haga clic en "Exportar Planilla PILA (.csv)" para cargar el archivo en operadores autorizados como SOI, MiPlanilla o Aportes en Línea.',
      ],
      visualMockup: {
        title: 'Estructura Oficial Planilla PILA',
        description: 'Resumen de cotizantes, IBC individual, tarifas y valor total a pagar al Sistema de Seguridad Social.',
        highlights: [
          'Toggle interactivo para exoneración Art. 114-1 E.T.',
          'Detalle de tarifas patronales vs tarifas del colaborador',
          'Archivo CSV estructurado listo para pago PILA',
        ],
      },
      tips: 'La autoliquidación PILA debe cancelarse dentro de los primeros 5 días hábiles del mes según los dos últimos dígitos del NIT.',
    },
    {
      id: 'cap-8',
      num: 8,
      title: 'Cómo generar & exportar informes gerenciales',
      shortDesc: '11 reportes especializados de nómina, horas extras, costos por proyecto y prestaciones.',
      icon: FileSpreadsheet,
      steps: [
        'Vaya al módulo "Informes & Documentos" en el menú lateral.',
        'Seleccione el informe deseado entre los 11 tipos disponibles en la barra superior (Nómina General, Costos por Proyecto, Horas Extras, Cesantías, etc.).',
        'Visualice en pantalla la tabla estructurada con el membrete institucional de la Corporación Social Somos Uno.',
        'Para descargar la información a Microsoft Excel, haga clic en el botón "Descargar Excel (.csv)".',
        'Para imprimir o guardar una copia oficial en PDF, haga clic en "Imprimir / Guardar PDF".',
      ],
      visualMockup: {
        title: 'Centro de Informes con Membrete y Firmas Oficiales',
        description: 'Documentos listos para auditoría con líneas de firma para Elaboró (Auxiliar), Verificó (Admin) y Aprobó (Gerente).',
        highlights: [
          '11 tipos de reportes normativos y de control',
          'Exportación compatible con Excel con delimitador punto y coma',
          'Formato optimizado para impresión con membrete y NIT',
        ],
      },
      tips: 'Los informes por proyecto social permiten a los gestores justificar los costos de personal ante cooperantes y donantes.',
    },
    {
      id: 'cap-9',
      num: 9,
      title: 'Cómo emitir & descargar comprobantes de pago individuales',
      shortDesc: 'Generación del desprendible oficial de pago con firmas y desglose detallado.',
      icon: FileText,
      steps: [
        'Tanto en el módulo "Liquidación de Nómina" como en el de "Informes (Nómina Individual)", localice al empleado.',
        'Haga clic en el botón con ícono de impresora "Ver Comprobante" o "Generar Comprobante".',
        'Se abrirá el Comprobante Oficial de Pago con el membrete de la Corporación Social Somos Uno, NIT, datos bancarios, devengados y deducciones.',
        'Verifique el valor neto en números y letras.',
        'Haga clic en "Imprimir / PDF" en la esquina superior del modal para enviarlo directamente a la impresora o guardarlo como archivo PDF firmado.',
      ],
      visualMockup: {
        title: 'Desprendible Oficial de Pago de Nómina',
        description: 'Comprobante formal con certificación de recibo a entera satisfacción, doble columna de conceptos y firmas.',
        highlights: [
          'Membrete corporativo y consecutivo de radicado',
          'Desglose legal de aportes y deducciones',
          'Líneas de firma del empleador y de recibido del trabajador',
        ],
      },
      tips: 'Entregar el desprendible de pago es una obligación del empleador estipulada en la legislación laboral colombiana.',
    },
    {
      id: 'cap-10',
      num: 10,
      title: 'Cómo instalar, actualizar & desinstalar la plataforma',
      shortDesc: 'Instalación PWA de escritorio, copias de seguridad obligatorias y desinstalación segura.',
      icon: DownloadCloud,
      steps: [
        'Para instalar en escritorio: Diríjase al módulo "Instalación & Sistema", pestaña "Instalar Plataforma" y haga clic en "Instalar en Este Dispositivo" para crear el acceso directo en Windows o Mac.',
        'Para buscar actualizaciones: Ingrese a la pestaña "Configuración del Sistema" y haga clic en "Buscar Actualizaciones" para verificar la vigencia de la versión v2026.1.4.',
        'Para crear una copia de seguridad: Vaya a "Auditoría & Seguridad" o "Instalación" y descargue el archivo JSON con toda la base de datos.',
        'Para desinstalar o limpiar la plataforma: Ingrese a la pestaña "Desinstalar Plataforma". El sistema le exigirá primero generar una copia de seguridad obligatoria y luego ingresar la clave maestra de administrador ("somosuno2026").',
      ],
      visualMockup: {
        title: 'Consola de Instalación & Mantenimiento del Sistema',
        description: 'Control de ciclo de vida de la aplicación con salvaguarda preventiva de datos empresariales.',
        highlights: [
          'Instalador directo en un clic para escritorio y móviles',
          'Copia de seguridad preventiva forzada antes de desinstalar',
          'Control mediante clave maestra de administrador',
        ],
      },
      tips: 'Nunca desinstale la plataforma sin haber descargado previamente su archivo de respaldo JSON.',
    },
    {
      id: 'cap-11',
      num: 11,
      title: 'Cómo gestionar las dotaciones laborales de calzado & vestido de labor',
      shortDesc: 'Control de derecho legal (Art. 230 CST), registro de tallas, actas de entrega cuatrimestral y costeo.',
      icon: Shirt,
      steps: [
        'Ingrese al módulo "Dotaciones Laborales" desde el menú lateral.',
        'En la pestaña "Ficha de Tallas por Empleado", verifique qué colaboradores tienen derecho legal: salario básico menor o igual a dos (2) salarios mínimos vigentes ($3.501.810 en 2026).',
        'Consulte y actualice las tallas de camisa/blusa, pantalón/jean y calzado de cada trabajador haciendo clic en "Tallas".',
        'En la pestaña "Control de Entregas Cuatrimestrales", supervise las 3 fechas de cumplimiento legal obligatorio: 30 de abril, 31 de agosto y 20 de diciembre.',
        'Haga clic en "Ver Acta" para generar el Acta Oficial Individual de Entrega con los datos del empleado, prendas suministradas y compromiso de uso obligatorio (Art. 233 CST).',
        'Imprima o guarde el Acta en PDF para recabar la firma física o digital del trabajador beneficiario y archivarla como soporte ante el Ministerio del Trabajo.',
      ],
      visualMockup: {
        title: 'Control de Dotaciones & Acta Oficial Imprimible',
        description: 'Módulo integral de calzado y vestido de labor con ficha de tallas, fechas cuatrimestrales y actas formales con membrete institucional.',
        highlights: [
          'Indicador de derecho legal automático (≤ 2 SMLMV)',
          'Registro individual de tallas de calzado, pantalón y camisa',
          'Acta oficial imprimible con firmas y espacio para huella dactilar',
        ],
      },
      tips: 'El Artículo 234 del CST prohíbe pagar la dotación en dinero a trabajadores activos. Se debe entregar siempre en especie.',
      legalWarning: 'Si el trabajador no utiliza la dotación suministrada en sus labores, el empleador queda eximido de entregarle la del período siguiente (Art. 233 CST).',
    },
  ];

  const filteredChapters = chapters.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.steps.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeChapter = chapters.find((c) => c.id === activeChapterId) || chapters[0];

  const handlePrintManual = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Manual de Usuario & Guía Operativa de la Plataforma
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Instrucciones ilustradas paso a paso para la operación, liquidación, administración y mantenimiento del sistema.
          </p>
        </div>

        <button
          onClick={handlePrintManual}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          Imprimir / Descargar Manual en PDF
        </button>
      </div>

      {/* Main Grid: Chapter Directory (Left) & Chapter Content (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Navigation Sidebar: 4 cols */}
        <div className="lg:col-span-4 space-y-3 no-print">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar temas en el manual..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
              {filteredChapters.map((chap) => {
                const isSelected = activeChapterId === chap.id;
                const IconComponent = chap.icon;
                return (
                  <button
                    key={chap.id}
                    onClick={() => setActiveChapterId(chap.id)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {chap.num}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-bold leading-tight line-clamp-1 ${
                          isSelected ? 'text-blue-900' : 'text-slate-800'
                        }`}
                      >
                        {chap.title}
                      </p>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {chap.shortDesc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chapter Detail View: 8 cols (Printable) */}
        <div className="lg:col-span-8">
          {activeChapter && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:p-0">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Capítulo {activeChapter.num} de {chapters.length}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {activeChapter.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeChapter.shortDesc}
                  </p>
                </div>
              </div>

              {/* Step-by-Step Procedure */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Procedimiento Paso a Paso:
                </h4>
                <div className="space-y-2.5">
                  {activeChapter.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-3 text-xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-slate-800 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Mockup / Interface Diagram */}
              <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    Representación Visual en la Interfaz: {activeChapter.visualMockup.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Guía de Pantalla</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeChapter.visualMockup.description}
                </p>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-slate-300 uppercase block">
                    Puntos clave de interacción en la pantalla:
                  </span>
                  {activeChapter.visualMockup.highlights.map((hl, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-slate-300 flex items-center gap-2 bg-slate-800/80 px-2.5 py-1.5 rounded"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practical Tips Box */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-950 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-blue-950 text-[11px] mb-0.5">
                    Consejo Operativo Somos Uno:
                  </span>
                  <p className="leading-relaxed text-blue-900">{activeChapter.tips}</p>
                </div>
              </div>

              {/* Legal Warning if present */}
              {activeChapter.legalWarning && (
                <div className="p-3.5 bg-amber-50/80 border border-amber-300 rounded-lg text-xs text-amber-950 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-amber-950 text-[11px] mb-0.5">
                      Fundamento Legal Obligatorio:
                    </span>
                    <p className="leading-relaxed text-amber-900">
                      {activeChapter.legalWarning}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation between chapters */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs no-print">
                {activeChapter.num > 1 ? (
                  <button
                    onClick={() =>
                      setActiveChapterId(chapters[activeChapter.num - 2]?.id || 'cap-1')
                    }
                    className="px-3.5 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    ← Capítulo Anterior
                  </button>
                ) : (
                  <div></div>
                )}

                {activeChapter.num < chapters.length ? (
                  <button
                    onClick={() =>
                      setActiveChapterId(chapters[activeChapter.num]?.id || 'cap-10')
                    }
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold flex items-center gap-1.5"
                  >
                    <span>Siguiente Capítulo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div></div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
