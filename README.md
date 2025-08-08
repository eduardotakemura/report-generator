# 📷 Gerador de Relatórios de Inspeção

Uma ferramenta leve baseada em navegador para técnicos de campo e inspetores gerarem relatórios fotográficos profissionais usando seus dispositivos móveis.

## ✨ Recursos

- **📸 Integração com Câmera**: Capture imagens diretamente da câmera do seu dispositivo
- **📁 Seleção de Arquivos**: Selecione imagens existentes da galeria do seu dispositivo
- **✏️ Anotação de Imagens**: Adicione títulos e descrições a cada imagem
- **📋 Gerenciamento de Relatórios**: Organize múltiplas imagens com reordenação por arrastar e soltar
- **📄 Geração de PDF**: Crie relatórios PDF profissionais com todas as imagens e metadados
- **📱 Otimizado para Mobile**: Projetado para uso em navegadores móveis
- **🔒 Privacidade em Primeiro Lugar**: Sem contas necessárias, todos os dados ficam no seu dispositivo

## 🚀 Início Rápido

1. **Abra o app**: Simplesmente abra `index.html` no seu navegador web
2. **Conceda permissões da câmera**: Permita o acesso à câmera quando solicitado
3. **Comece a capturar**: Clique em "Iniciar Relatório" e comece a tirar fotos
4. **Adicione detalhes**: Dê um título e descrição opcional a cada imagem
5. **Gere o relatório**: Preencha os detalhes do relatório e baixe seu PDF

## 📱 Como Usar

### Passo 1: Capturar/Selecionar Imagens
- Clique em "Iniciar Relatório" para começar
- **Opção 1 - Capturar**: Permita o acesso à câmera e clique em "Capturar Foto"
- **Opção 2 - Selecionar**: Clique em "Selecionar Imagem" para escolher da galeria
- Revise a imagem e clique em "Refazer" se necessário
- Clique em "Próximo: Adicionar Detalhes" para continuar

### Passo 2: Anotar Imagens
- Adicione um título para a imagem (obrigatório)
- Adicione uma descrição opcional
- O timestamp é adicionado automaticamente
- Clique em "Adicionar ao Relatório" para salvar

### Passo 3: Gerenciar Relatório
- Visualize todas as imagens capturadas no resumo
- Remova imagens se necessário
- Adicione mais imagens ou prossiga para finalizar

### Passo 4: Gerar PDF
- Digite o título do relatório e nome do autor (obrigatório)
- Adicione informações opcionais do cliente
- Clique em "Gerar PDF" para criar seu relatório
- Baixe o arquivo PDF

## 🛠️ Detalhes Técnicos

### Stack Tecnológica
- **Frontend**: HTML5, TailwindCSS, JavaScript Vanilla
- **Acesso à Câmera**: API nativa `getUserMedia`
- **Geração de PDF**: Biblioteca jsPDF
- **Armazenamento**: Apenas client-side (memória do navegador)

### Compatibilidade de Navegadores
- **Chrome/Edge**: Suporte completo
- **Firefox**: Suporte completo
- **Safari**: Suporte completo (iOS 11+)
- **Navegadores móveis**: Otimizado para uso móvel

### Estrutura de Arquivos
```
report-generator/
├── index.html          # Arquivo principal da aplicação
├── app.js             # Funcionalidade JavaScript
├── README.md          # Este arquivo
└── INSTRUCTIONS.md    # Especificações originais
```

## 🔧 Requisitos do Navegador

- **HTTPS Obrigatório**: O acesso à câmera requer uma conexão segura
- **Navegador Moderno**: Chrome 53+, Firefox 36+, Safari 11+
- **Permissões da Câmera**: O usuário deve conceder acesso à câmera

## 📋 Limitações (MVP)

- Máximo ~10 imagens por relatório (para performance)
- Imagens são comprimidas para processamento mais rápido
- Todos os dados são armazenados na memória do navegador (limpos ao atualizar a página)
- Sem armazenamento em nuvem ou sistema de contas

## 🎯 Casos de Uso

- **Inspeções de Propriedades**: Documentar condições de propriedades
- **Manutenção de Equipamentos**: Registrar status de equipamentos
- **Inspeções de Segurança**: Documentar problemas de segurança
- **Controle de Qualidade**: Acompanhar qualidade de produtos
- **Serviço de Campo**: Documentar trabalhos de serviço

## 🔒 Privacidade e Segurança

- **Sem Comunicação com Servidor**: Todo processamento acontece localmente
- **Sem Armazenamento de Dados**: Imagens não são enviadas para lugar nenhum
- **Sem Rastreamento**: Sem código de analytics ou rastreamento
- **Apenas Câmera**: Apenas permissões de câmera necessárias

## 🚀 Melhorias Futuras

- Integração com armazenamento em nuvem
- Contas de usuário e histórico de relatórios
- Ferramentas avançadas de edição de imagens
- Modelos de relatório personalizados
- Funcionalidade offline
- Suporte a múltiplos idiomas

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique a compatibilidade do navegador
2. Certifique-se de que as permissões da câmera foram concedidas
3. Tente atualizar a página se a câmera não funcionar
4. Use HTTPS se estiver testando localmente

---

**Construído com ❤️ para profissionais de campo**
