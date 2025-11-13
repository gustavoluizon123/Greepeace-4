# Greenpeace 

[![build-status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://example.com)
[![wcag](https://img.shields.io/badge/WCAG-2.1%20AA-blue.svg)](https://www.w3.org/TR/WCAG21/)
[![license](https://img.shields.io/badge/license-MIT-lightgrey.svg)](LICENSE)
[![version](https://img.shields.io/badge/version-1.0.0-blue.svg)]()

## Descrição
Site institucional para a Greenpeace (projeto acadêmico). O objetivo deste projeto é demonstrar boas práticas front-end, acessibilidade (WCAG 2.1 AA), versionamento com GitFlow e commits semânticos, além de rotinas básicas de otimização para produção.

---

## Badges
- `build`: passing 
- `WCAG`: 2.1 AA
- `license`: MIT 
- `version`: v1.0.0

---

## Funcionalidades principais
- Layout responsivo baseado em grid (12 colunas).
- Formulário de cadastro com validação client-side (HTML5 + JS) e máscaras para CPF, CEP e telefone.
- Navegação tipo SPA (interceptação de links e carregamento dinâmico).
- **Controle de tema (Acessibilidade)**:
  - Alternância de tema: **Claro**, **Escuro**, **Alto Contraste**.
  - Persistência da preferência do usuário via `localStorage`.
  - Controle acessível com `aria-pressed`, `aria-live` para comunicadores e foco visível.
  - Atalhos de teclado: `C` = claro, `D` = escuro, `H` = alto contraste.
- Feedback visual e ARIA para erros de formulário (mensagens com `role="alert"`).
- Componentes acessíveis: alerts, modals, toasts, botões e foco consistente.
- Otimizações para produção (descritas na seção "Otimização").

---

## 📂 Estrutura de Pastas

```
/greenpeace
│── index.html
│── projetos.html
│── cadastro.html
│── css/
│   └── styles.css
│── js/
│   └── script.js
│── img/
│   ├── amazoniar.jpg
│   ├── expedicao.png
|   ├── Greenpeace.jpg
|   ├── proposta.jpg
|   ├── transparencia.jpg
│   └── voluntariado.jpg 
│           
└── README.md
```


## 👨‍💻 Autor

**Gustavo Luizon Camilo Victorio**

📧 Email: gustavoluizon9cim@gmail.com  
🔗 LinkedIn: https://www.linkedin.com/in/gustavo-luizon-056b15344/

> 🌿 "Codando com propósito — acessibilidade, evolução e tecnologia unidas por um mundo mais verde." ✨
