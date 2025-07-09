import { useComprobacionState } from '../hooks/useComprobacionState';
import { useCompany } from '../hooks/useCompany';
import { ComprobacionRowHeader } from './ComprobacionRowHeader';
import { ComprobacionRowDetails } from './ComprobacionRowDetails';
import { PdfPreviewModal } from './PdfPreviewModal';
import { generarFacturaProveedor } from '@/services/facturaProveedorService';
import { documentService } from '@/services/documentService';
import { toast } from 'sonner';
import { rejectComprobacion } from '@/services/comprobacionesService';
import { useState } from 'react';
import { authorizeTicket } from '@/services/valeTicketService';

interface SelectOption {
  value: string;
  label: string;
}

interface OptionsState {
  categoryOptions: SelectOption[];
  taxIndicatorOptions: SelectOption[];
  distributionRuleOptions: SelectOption[];
}

interface ComprobacionRowProps {
  comprobacion: any;
  xmlData: any;
  options: OptionsState;
}

export const ComprobacionRow = ({
  comprobacion,
  xmlData,
  options,
}: ComprobacionRowProps) => {
  const { company } = useCompany();
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const {
    isOpen,
    setIsOpen,
    category,
    setCategory,
    taxIndicator,
    setTaxIndicator,
    distributionRule,
    setDistributionRule,
    comment,
    setComment,
  } = useComprobacionState();

  const handleToggle = () => setIsOpen(!isOpen);

  const handleClosePdfModal = () => {
    setIsPdfModalOpen(false);
    if (pdfUrl) {
      documentService.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };
  const handleDecline = async () => {
    try {
      await rejectComprobacion(comprobacion.id, 1, comment); // 1 = id de usuario simulado
      toast.success('Comprobación rechazada correctamente.');
      window.location.reload();
    } catch (error) {
      toast.error('Error al rechazar la comprobación.');
    }
  };
  const handleSend = async () => {
    // Si es un vale/ticket, usar el endpoint especial
    if (comprobacion.comprobanteType === 'ticket') {
      try {
        const cardNumberToSend = comprobacion.memo;
        const payload = {
          empresa: company,
          cardNumber: cardNumberToSend,
          category,
          taxIndicator,
          distributionRule,
          responsable: comprobacion.responsable,
          motivo: comprobacion.motivo,
          descripcion: comprobacion.descripcion,
          importe: comprobacion.importe,
          comment,
          comprobacionId: comprobacion.id,
          approverId: 1, // ID de usuario simulado, cámbialo si tienes el real
        };
        console.log('Payload ticket/vale:', payload);
        const result = await authorizeTicket(payload);
        if (result.success) {
          toast.success('Vale/ticket autorizado correctamente.');
        } else {
          toast.error(result.message || 'Error al autorizar el vale/ticket.');
        }
      } catch (error: any) {
        toast.error(
          error.message || 'Error desconocido al autorizar el vale/ticket.',
        );
      }
      return;
    }
    if (!xmlData || !company) {
      toast.error('No hay datos XML o empresa seleccionada.');
      return;
    }
    try {
      // Construir el objeto Comprobante SOLO con las propiedades requeridas y con nombres correctos
      const Comprobante = {
        Version: xmlData.version || '4.0', // Si tienes el valor real, úsalo
        Serie: xmlData.serie || '',
        Folio: xmlData.folio || '',
        Fecha: xmlData.fechaEmision || '',
        CondicionesDePago: xmlData.condicionesDePago || '',
        SubTotal: xmlData.subTotal || 0,
        Descuento: xmlData.descuento || 0,
        Moneda: xmlData.moneda || 'MXN',
        TipoDeComprobante: xmlData.tipoDeComprobante || '',
        NoCertificado: xmlData.noCertificado || '',
        Sello: xmlData.sello || '',
        LugarExpedicion: xmlData.lugarExpedicion || '',
        Total: xmlData.total || 0,
        FormaPago: xmlData.formaPago || '',
        MetodoPago: xmlData.metodoPago || '',
      };

      // Mapear los conceptos a los nombres correctos y transformar 'traslados' en 'Impuestos.Traslados' con nombres correctos y sin valores vacíos
      const Conceptos = Array.isArray(xmlData.conceptos)
        ? xmlData.conceptos.map((c: any) => {
            const {
              claveProdServ,
              noIdentificacion,
              cantidad,
              claveUnidad,
              unidad,
              descripcion,
              valorUnitario,
              importe,
              descuento,
              objetoImp,
              traslados,
            } = c;
            return {
              ClaveProdServ: claveProdServ,
              NoIdentificacion: noIdentificacion,
              Cantidad: cantidad,
              ClaveUnidad: claveUnidad,
              Unidad: unidad,
              Descripcion: descripcion,
              ValorUnitario: valorUnitario,
              Importe: importe,
              Descuento: descuento,
              ObjetoImp: objetoImp,
              Impuestos: {
                Traslados: Array.isArray(traslados)
                  ? traslados
                      .map((t: any) => {
                        const traslado: any = {};
                        if (t.base !== undefined && t.base !== null)
                          traslado.Base = t.base;
                        if (t.impuesto) traslado.Impuesto = t.impuesto;
                        if (t.tipoFactor) traslado.TipoFactor = t.tipoFactor;
                        if (t.tasaOCuota !== undefined && t.tasaOCuota !== null)
                          traslado.TasaOCuota = t.tasaOCuota;
                        if (t.importe !== undefined && t.importe !== null)
                          traslado.Importe = t.importe;
                        return Object.keys(traslado).length > 0
                          ? traslado
                          : null;
                      })
                      .filter((t: any) => t !== null)
                  : [],
              },
            };
          })
        : [];

      if (!Conceptos.length) {
        toast.error('El XML no contiene un array válido de Conceptos.');
        return;
      }

      const cleanXmlData = { Comprobante, Conceptos };
      console.log('xmlData que se enviará:', cleanXmlData);

      // Mostrar el objeto comprobacion y el valor de cardNumber antes de enviar
      console.log('Objeto comprobacion:', comprobacion);
      const cardNumberToSend = comprobacion.memo; // Usar el campo correcto para el número de tarjeta
      console.log('CardNumber que se enviará:', cardNumberToSend);

      // Loguear el payload completo solicitado
      const payloadLog = {
        categoria: category,
        indicadorImpuestos: taxIndicator,
        normaReparto: distributionRule,
        responsable: comprobacion.responsable,
        motivo: comprobacion.motivo,
        descripcion: comprobacion.descripcion,
        importe: comprobacion.importe,
        comentario: comment,
      };
      console.log('Payload completo:', payloadLog);

      const request = {
        empresa: company,
        cardNumber: cardNumberToSend,
        xmlData: cleanXmlData,
        comments: comment,
        accountName: category,
        taxName: taxIndicator,
      };
      const result = await generarFacturaProveedor(request);
      if (result.success) {
        toast.success('Factura de proveedor generada exitosamente.');
      } else {
        toast.error(
          result.message || 'Error al generar la factura de proveedor.',
        );
      }
    } catch (error: any) {
      toast.error(
        error.message ||
          'Error desconocido al generar la factura de proveedor.',
      );
    }
  };

  return (
    <>
      <ComprobacionRowHeader
        comprobacion={comprobacion}
        onToggle={handleToggle}
      />

      {isOpen && (
        <ComprobacionRowDetails
          category={category}
          setCategory={setCategory}
          taxIndicator={taxIndicator}
          setTaxIndicator={setTaxIndicator}
          distributionRule={distributionRule}
          setDistributionRule={setDistributionRule}
          comment={comment}
          setComment={setComment}
          categoryOptions={options.categoryOptions}
          taxIndicatorOptions={options.taxIndicatorOptions}
          distributionRuleOptions={options.distributionRuleOptions}
          xmlData={xmlData}
          isLoadingXml={false}
          onDecline={handleDecline}
          onSend={handleSend}
          comprobacionType={comprobacion.type}
          responsable={comprobacion.responsable}
          motivo={comprobacion.motivo}
          descripcion={comprobacion.descripcion}
          importe={comprobacion.importe}
          pdfFile={comprobacion}
          onPreviewPdf={async () => {
            try {
              // Buscar el documento PDF en el array de documentos
              if (
                comprobacion.documents &&
                Array.isArray(comprobacion.documents)
              ) {
                const pdfDocument = comprobacion.documents.find(
                  (doc: any) =>
                    doc.mimeType === 'application/pdf' ||
                    doc.type === 'factura_pdf',
                );

                if (pdfDocument) {
                  // Obtener el documento PDF del servidor
                  const documentResponse = await documentService.getDocument(
                    pdfDocument.id,
                  );

                  // Crear URL del blob
                  const url = documentService.createObjectURL(
                    documentResponse.data,
                  );

                  // Configurar el modal
                  setPdfUrl(url);
                  setIsPdfModalOpen(true);
                } else {
                  toast.error(
                    'No se encontró un documento PDF para esta comprobación',
                  );
                }
              } else {
                toast.error(
                  'No hay documentos disponibles para esta comprobación',
                );
              }
            } catch (error) {
              console.error('Error al abrir el PDF:', error);
              toast.error('Error al abrir el documento PDF');
            }
          }}
        />
      )}

      <PdfPreviewModal
        isOpen={isPdfModalOpen}
        onClose={handleClosePdfModal}
        pdfUrl={pdfUrl}
      />
    </>
  );
};
