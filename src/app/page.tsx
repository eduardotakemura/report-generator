import Link from "next/link";

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-badge">
            <span className="badge-text">⚡ Especializado para ENEL</span>
          </div>
          <h1>Relatórios Fotográficos ENEL</h1>
          <p className="hero-subtitle">
            Sistema profissional para geração rápida de relatórios fotográficos 
            de inspeções e projetos da ENEL. Organize fotos e gere relatórios 
            padronizados em minutos.
          </p>
          <div className="hero-actions">
            <Link href="/dashboard" className="btn-primary">
              <span className="btn-icon">🚀</span>
              Começar Agora
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Tempo Economizado</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Padrão ENEL</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5min</div>
              <div className="stat-label">Relatório Completo</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="features-section">
          <div className="section-header">
            <h2>Por que escolher nossa solução?</h2>
            <p className="section-subtitle">
              Desenvolvida especificamente para atender os padrões e necessidades da ENEL
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card primary">
              <div className="feature-icon">⚡</div>
              <h3>Geração Rápida</h3>
              <p>Relatórios fotográficos completos em poucos minutos, seguindo todos os padrões ENEL</p>
              <ul className="feature-list">
                <li>• Templates pré-configurados</li>
                <li>• Automação inteligente</li>
                <li>• Exportação em PDF</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📸</div>
              <h3>Organização Inteligente</h3>
              <p>Organize e categorize fotos automaticamente por tipo de inspeção e localização</p>
              <ul className="feature-list">
                <li>• Categorização automática</li>
                <li>• Geolocalização integrada</li>
                <li>• Metadados preservados</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Padrão ENEL</h3>
              <p>Relatórios formatados exatamente conforme os padrões e especificações da ENEL</p>
              <ul className="feature-list">
                <li>• Layouts oficiais</li>
                <li>• Campos obrigatórios</li>
                <li>• Assinatura digital</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="process-section">
          <div className="section-header">
            <h2>Como funciona</h2>
            <p className="section-subtitle">Processo simples em 3 etapas</p>
          </div>
          
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Importe as Fotos</h3>
                <p>Faça upload das fotos da inspeção ou projeto</p>
              </div>
            </div>
            
            <div className="process-arrow">→</div>
            
            <div className="process-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Organize e Categorize</h3>
                <p>O sistema organiza automaticamente por tipo e localização</p>
              </div>
            </div>
            
            <div className="process-arrow">→</div>
            
            <div className="process-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Gere o Relatório</h3>
                <p>Relatório PDF pronto em segundos, no padrão ENEL</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>Pronto para otimizar seus relatórios?</h2>
            <p>Junte-se aos profissionais que já economizam tempo com nossa solução</p>
            <div className="cta-actions">
              <Link href="/dashboard" className="btn-primary large">
                <span className="btn-icon">🚀</span>
                Começar Gratuitamente
              </Link>
            </div>
            <div className="cta-note">
              <span className="note-icon">✓</span>
              Sem necessidade de instalação • Acesso imediato
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
