import type { ReportPage } from './ReportPage';

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  preview: string; // Base64 image or URL for template preview
  pages: Omit<ReportPage, 'id' | 'photos'>[]; // Template pages without photos
  category: 'construction' | 'inspection' | 'maintenance' | 'blank';
  isBlank?: boolean; // For the blank template option
}

export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'blank',
    name: 'Relatório Personalizado',
    description: 'Crie seu próprio relatório do zero com total liberdade',
    preview: '',
    pages: [],
    category: 'blank',
    isBlank: true
  },
  {
    id: 'electrical-inspection-basic',
    name: 'Padrão de Entrada',
    description: 'Vistória de padrão de entrada ENEL',
    preview: '',
    category: 'inspection',
    pages: [
      {
        title: 'Identificação da Vistoria',
        content: 'VISTORIA ELÉTRICA\n\nData: [Data da Vistoria]\nLocal: [Endereço]\nEngenheiro Eletricista: [Nome do Engenheiro]\nCREA: [Número do CREA]\nTipo de Instalação: [Residencial/Comercial/Industrial]',
        order: 0,
        layout: { columns: 1, photoOrder: [] }
      },
      {
        title: 'Quadro de Distribuição',
        content: 'Análise do quadro de distribuição principal e secundários\n\n- Estado geral do quadro\n- Disjuntores e dispositivos de proteção\n- Aterramento e equipotencialização\n- Sinalização e identificação',
        order: 1,
        layout: { columns: 2, photoOrder: [] }
      },
      {
        title: 'Instalações Internas',
        content: 'Verificação das instalações internas\n\n- Pontos de luz e tomadas\n- Circuitos elétricos\n- Fiação e conduítes\n- Dispositivos de proteção',
        order: 2,
        layout: { columns: 2, photoOrder: [] }
      },
      {
        title: 'Medições e Testes',
        content: 'Resultados das medições e testes realizados\n\n- Tensão de alimentação\n- Resistência de isolamento\n- Continuidade dos condutores\n- Funcionamento dos dispositivos',
        order: 3,
        layout: { columns: 2, photoOrder: [] }
      },
      {
        title: 'Não Conformidades',
        content: 'Registro de não conformidades encontradas\n\n- Violações da NBR 5410\n- Riscos de segurança\n- Itens que necessitam correção\n- Prazo para adequação',
        order: 4,
        layout: { columns: 2, photoOrder: [] }
      },
      {
        title: 'Recomendações',
        content: 'Recomendações técnicas e próximos passos\n\n- Melhorias sugeridas\n- Manutenções preventivas\n- Atualizações necessárias\n- Observações gerais',
        order: 5,
        layout: { columns: 1, photoOrder: [] }
      }
    ]
  },
  {
    id: 'electrical-inspection-detailed',
    name: 'Acesso de Microgeração Solar',
    description: 'Vistória de acesso de microgeração solar',
    preview: '',
    category: 'inspection',
    pages: [
      {
        title: 'Identificação da Vistoria',
        content: 'VISTORIA ELÉTRICA DETALHADA\n\nData: [Data da Vistoria]\nLocal: [Endereço Completo]\nEngenheiro Eletricista: [Nome do Engenheiro]\nCREA: [Número do CREA]\nTipo de Instalação: [Industrial/Comercial Complexo]\nNorma de Referência: NBR 5410',
        order: 0,
        layout: { columns: 1, photoOrder: [] }
      },
      {
        title: 'Entrada de Energia e Medição',
        content: 'Análise da entrada de energia e sistema de medição\n\n- Transformador de entrada\n- Medidor de energia\n- Proteções de entrada\n- Aterramento principal',
        order: 1,
        layout: { columns: 2, photoOrder: [] }
      },
      {
        title: 'Quadros de Distribuição',
        content: 'Verificação detalhada dos quadros de distribuição\n\n- Quadro principal (QGBT)\n- Quadros secundários\n- Disjuntores e seccionadores\n- Dispositivos de proteção diferencial',
        order: 2,
        layout: { columns: 2, photoOrder: [] }
      },
      {
        title: 'Instalações de Força',
        content: 'Análise das instalações de força\n\n- Motores e equipamentos\n- Comandos elétricos\n- Proteções específicas\n- Sistemas de partida',
        order: 3,
        layout: { columns: 2, photoOrder: [] }
      },
      {
        title: 'Instalações de Iluminação',
        content: 'Verificação do sistema de iluminação\n\n- Luminárias e lâmpadas\n- Comandos de iluminação\n- Níveis de iluminância\n- Eficiência energética',
        order: 4,
        layout: { columns: 2, photoOrder: [] }
      },
      {
        title: 'Sistemas de Proteção',
        content: 'Análise dos sistemas de proteção\n\n- Para-raios e aterramento\n- Proteção contra surtos\n- Sistemas de emergência\n- Iluminação de emergência',
        order: 5,
        layout: { columns: 2, photoOrder: [] }
      },
      {
        title: 'Medições e Ensaios',
        content: 'Resultados das medições e ensaios\n\n- Resistência de isolamento\n- Continuidade dos condutores\n- Resistência de aterramento\n- Funcionamento dos dispositivos',
        order: 6,
        layout: { columns: 2, photoOrder: [] }
      },
      {
        title: 'Análise de Conformidade',
        content: 'Análise de conformidade com as normas\n\n- Conformidade com NBR 5410\n- Conformidade com NBR 14039\n- Conformidade com NBR 5419\n- Outras normas aplicáveis',
        order: 7,
        layout: { columns: 2, photoOrder: [] }
      },
      {
        title: 'Relatório de Não Conformidades',
        content: 'Relatório detalhado de não conformidades\n\n- Classificação por criticidade\n- Violações das normas\n- Riscos identificados\n- Cronograma de correções',
        order: 8,
        layout: { columns: 2, photoOrder: [] }
      },
      {
        title: 'Recomendações e Conclusões',
        content: 'Recomendações técnicas e conclusões\n\n- Melhorias prioritárias\n- Plano de manutenção\n- Atualizações necessárias\n- Próximas vistorias',
        order: 9,
        layout: { columns: 1, photoOrder: [] }
      }
    ]
  },
  
];
