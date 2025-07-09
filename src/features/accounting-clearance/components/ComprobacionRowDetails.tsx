import React from 'react';
import { CategorizationControls } from './CategorizationControls';
import { XmlContent } from './XmlContent';
import { CommentField } from './CommentField';
import { ActionButtons } from './ActionButtons';
import { ComprobacionRowDetailsProps } from '../interfaces/comprobacionestable.Interface';

export const ComprobacionRowDetails: React.FC<ComprobacionRowDetailsProps> = ({
  category,
  setCategory,
  taxIndicator,
  setTaxIndicator,
  distributionRule,
  setDistributionRule,
  comment,
  setComment,
  categoryOptions,
  taxIndicatorOptions,
  distributionRuleOptions,
  xmlData,
  isLoadingXml,
  onDecline,
  onSend,
  comprobacionType,
  responsable,
  motivo,
  descripcion,
  importe,
  pdfFile,
  onPreviewPdf,
}) => {
  return (
    <tr>
      <td colSpan={7} className='bg-gray-100 px-6 py-4'>
        <div className='p-4 border border-gray-300 rounded-lg shadow-sm bg-white'>
          <h3 className='text-lg font-medium mb-4'>Detalles del movimiento</h3>

          <CategorizationControls
            category={category}
            setCategory={setCategory}
            taxIndicator={taxIndicator}
            setTaxIndicator={setTaxIndicator}
            distributionRule={distributionRule}
            setDistributionRule={setDistributionRule}
            categoryOptions={categoryOptions}
            taxIndicatorOptions={taxIndicatorOptions}
            distributionRuleOptions={distributionRuleOptions}
          />

          <XmlContent
            xmlData={xmlData}
            isLoadingXml={isLoadingXml}
            category={category}
            taxIndicator={taxIndicator}
            comprobacionType={comprobacionType}
            responsable={responsable}
            motivo={motivo}
            descripcion={descripcion}
            importe={importe}
            pdfFile={pdfFile}
            onPreviewPdf={onPreviewPdf}
          />

          <CommentField comment={comment} setComment={setComment} />
          <ActionButtons onDecline={onDecline} onSend={onSend} />
        </div>
      </td>
    </tr>
  );
};
