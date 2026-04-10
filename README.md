# 🌿 Céu Irmão Lakota — Site Institucional

Site institucional moderno e responsivo desenvolvido para o **Espaço Céu Irmão Lakota**, localizado em **Mogi das Cruzes – SP**, dedicado a vivências espirituais, autoconhecimento e reconexão com saberes ancestrais.

O site apresenta informações sobre o espaço, serviços oferecidos, agenda de vivências e formas de contato.

---

## ✨ Melhorias Implementadas

### 🎨 Design Moderno
- **Paleta de cores atualizada**: Verde natureza (#4ade80), azul profissional (#1e40af), âmbar (#f59e0b)
- **Tipografia aprimorada**: Uso consistente da fonte Poppins
- **Espaçamento harmonioso**: Sistema de espaçamento consistente
- **Efeitos visuais**: Transições suaves, sombras modernas, gradientes sutis

### 📱 Responsividade Total
- **Mobile-first**: Design otimizado para dispositivos móveis
- **Breakpoints inteligentes**: Adaptação perfeita em todas as telas
- **Navegação mobile**: Menu hambúrguer elegante com animações
- **Toque otimizado**: Botões e elementos interativos adequados para toque

### 🚀 Performance Otimizada
- **Lazy loading**: Carregamento inteligente de imagens
- **Código limpo**: JavaScript desminificado e bem estruturado
- **CSS eficiente**: Variáveis CSS para manutenção fácil
- **Preload estratégico**: Recursos críticos carregados prioritariamente

### ♿ Acessibilidade Melhorada
- **Screen readers**: Anúncios para tecnologias assistivas
- **Navegação por teclado**: Suporte completo ao Tab
- **Contraste adequado**: Cores com bom contraste
- **Semântica HTML**: Estrutura semântica correta

### 🎯 UX Aprimorada
- **Feedback visual**: Animações e transições informativas
- **Navegação intuitiva**: Estrutura clara e previsível
- **Conteúdo acessível**: Informações bem organizadas
- **Interações suaves**: Micro-animações e efeitos hover

---

## 🧰 Tecnologias Utilizadas

* **HTML5** com semântica aprimorada
* **CSS3** com variáveis e Grid/Flexbox
* **JavaScript ES6+** modular e organizado
* **Font Awesome 6** para ícones modernos
* **Google Fonts (Poppins)** para tipografia
* **Parallax UI** com efeitos otimizados
* **Google Maps Embed** para localização
* **ASP (Classic ASP)** para formulários

---

## 📂 Estrutura do Projeto

```
/project
│
├── index.html                           # Página principal
├── sendmail.asp                         # Processamento de formulários
├── README.md                           # Documentação
│
├── css/
│   └── tooplate-living-parallax.css    # Estilos principais (modernizados)
│
├── js/
│   ├── tooplate-living-scripts.js      # Scripts principais (desminificados)
│   ├── utils.js                        # Utilitários e melhorias de UX
│   ├── site.js                         # Scripts específicos do site
│   ├── anamnese.js                     # Scripts do formulário de anamnese
│   └── validation.js                   # Validações de formulários
│
├── formularios/
│   └── anamnese.html                   # Formulário de anamnese médica
│
├── images/                             # Imagens do site
└── Css/
    └── anamnese.css                    # Estilos do formulário de anamnese
```

---

## 🎨 Paleta de Cores

- **Verde Natureza**: `#4ade80` - Representa crescimento e cura
- **Azul Profissional**: `#1e40af` - Transmite confiança e serenidade
- **Âmbar**: `#f59e0b` - Energia e vitalidade
- **Background**: `#0f172a` - Base escura elegante
- **Superfície**: `#1e293b` - Elementos de interface

---

## 📱 Funcionalidades

### Navegação Principal
- Menu responsivo com animações
- Overlays modais para seções
- Navegação por teclado
- Indicadores visuais de estado

### Slider Parallax
- 8 imagens em fullscreen
- Controles de navegação intuitivos
- Barra de progresso
- Controles de play/pause
- Suporte a teclado

### Seções do Site
- **Sobre**: Apresentação do espaço
- **Agenda**: Calendário de eventos
- **Serviços**: Kambo e Barras Access
- **Contato**: Formulário e informações

### Formulários
- Contato principal
- Anamnese médica completa
- Validações em tempo real
- Feedback visual

---

## 🚀 Como Executar

1. **Clone o repositório**
2. **Abra o `index.html`** no navegador
3. **Para formulários**: Configure o servidor ASP ou use alternativa

### Desenvolvimento Local
```bash
# Servidor simples para desenvolvimento
python -m http.server 8000
# ou
php -S localhost:8000
```

---

## 🔧 Personalização

### Cores
Edite as variáveis CSS em `tooplate-living-parallax.css`:
```css
:root {
  --accent: #4ade80;     /* Verde principal */
  --primary: #1e40af;    /* Azul secundário */
  --secondary: #f59e0b;  /* Âmbar */
}
```

### Conteúdo
- Atualize textos em `index.html`
- Substitua imagens em `images/`
- Modifique serviços e informações

---

## 📈 Métricas de Performance

- **Carregamento inicial**: Otimizado com preload
- **Interatividade**: < 3s (métricas Core Web Vitals)
- **Acessibilidade**: Score alto em testes automatizados
- **SEO**: Meta tags completas e schema.org

---

## 🤝 Contribuição

Para contribuir com melhorias:

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

## 📞 Contato

**Espaço Céu Irmão Lakota**
- 📍 Mogi das Cruzes, SP
- 📱 (11) 93069-2059
- 🌐 [ceuirmaolakota.com.br](https://ceuirmaolakota.com.br)
- 📧 contato@ceuirmaolakota.com.br

---

*Desenvolvido com ❤️ para promover bem-estar e crescimento espiritual*
│
├── js/
│   ├── tooplate-living-scripts.js
│   └── site.js
│
├── images/
│   ├── logo.png
│   ├── home.jpg
│   ├── casa.jpg
│   └── outras imagens
│
└── README.md
```

---

# ⚙️ Funcionalidades

### 🖼 Slider Parallax

* Apresentação visual com múltiplas imagens
* Controle por setas e pontos
* Tempo configurável

### 📅 Agenda

Carregamento dinâmico de eventos e vivências.

### 🧘 Serviços

Apresentação dos serviços oferecidos:

* Kambo
* Barras Access

Com botão direto para **WhatsApp**.

### 📩 Formulário de contato

Envio de mensagens através de **sendmail.asp**.

Campos:

* Nome
* Email
* Assunto
* Mensagem

### 📍 Mapa

Localização integrada via **Google Maps**.

---

# 📱 Contato

📍 Endereço
Estrada Servidão Silveira Lopes, 5311
Bairro Piata parte B
Mogi das Cruzes – SP

📞 Telefone
(11) 93069-2059

📧 Email
[contato@ceuirmaolakota.com.br](mailto:contato@ceuirmaolakota.com.br)

---

# 🌐 Redes sociais

Instagram
https://www.instagram.com/ceulakota/

Facebook
https://www.facebook.com/pages/Ceu%20Irmao%20Lakota/1839235849656215/

---

# 👨‍💻 Desenvolvedor

Desenvolvido por **Marcelo P. Matos**

WhatsApp
https:/
