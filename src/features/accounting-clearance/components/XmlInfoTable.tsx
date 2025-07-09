import React from 'react';
import { useRender } from '../hooks/useRender';
import { useUtils } from '../hooks/useUtils';
import { XmlInfoTableProps } from '../interfaces/comprobacionestable.Interface';

export const XmlInfoTable: React.FC<XmlInfoTableProps> = ({ xmlData }) => {
  const { renderXmlInfoRow } = useRender();
  const { formatDate } = useUtils();

  return (
    <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg'>
      <table className='w-full divide-y divide-gray-300'>
        <tbody className='divide-y divide-gray-200 bg-white'>
          {renderXmlInfoRow(
            'Fecha de Emisión',
            formatDate(xmlData.fechaEmision),
            true,
          )}
          {renderXmlInfoRow('Total', xmlData.total)}
          {renderXmlInfoRow(
            'Lugar de Expedición (Código Postal)',
            xmlData.lugarExpedicion,
            true,
          )}
          {renderXmlInfoRow('RFC Emisor', xmlData.emisor.rfc)}
          {renderXmlInfoRow(
            'Razón Social Emisor',
            xmlData.emisor.razonSocial || 'N/A',
            true,
          )}
          {renderXmlInfoRow(
            'Régimen Fiscal Emisor',
            `${xmlData.emisor.regimenFiscal} - ${xmlData.emisor.regimenFiscalDescripcion}`,
          )}
          {renderXmlInfoRow('RFC Receptor', xmlData.receptor.rfc, true)}
          {renderXmlInfoRow(
            'Régimen Fiscal Receptor',
            `${xmlData.receptor.regimenFiscal} - ${xmlData.receptor.regimenFiscalDescripcion}`,
          )}
          {renderXmlInfoRow(
            'Uso CFDI',
            `${xmlData.receptor.usoCFDI} - ${xmlData.receptor.usoCFDIDescripcion}`,
            true,
          )}
          {renderXmlInfoRow('Folio Fiscal (UUID)', xmlData.folioFiscal)}
          {renderXmlInfoRow(
            'Forma de Pago',
            `${xmlData.formaPago} - ${xmlData.formaPagoLetra}`,
            true,
          )}
          {renderXmlInfoRow(
            'Método de Pago',
            `${xmlData.metodoPago} - ${xmlData.metodoPagoLetra}`,
          )}
          {renderXmlInfoRow(
            'Total Impuestos Retenidos',
            xmlData.impuestos.retenidos,
            true,
          )}
          {renderXmlInfoRow('Total Traslados', xmlData.impuestos.traslados)}
        </tbody>
      </table>
    </div>
  );
};
