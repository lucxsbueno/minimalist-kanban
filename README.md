# 📋 Minimalist Kanban

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.7-38bdf8?style=for-the-badge&logo=tailwind-css)
![Zustand](https://img.shields.io/badge/Zustand-4.5.2-443f84?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**Um Kanban board minimalista e elegante construído com Next.js, TypeScript e TailwindCSS**

[Features](#-features) • [Tecnologias](#-tecnologias) • [Instalação](#-instalação) • [Uso](#-uso)

</div>

---

## 📖 Sobre

Minimalist Kanban é uma aplicação web moderna e minimalista para gerenciamento de tarefas usando o método Kanban. Desenvolvido com foco em simplicidade, performance e experiência do usuário, oferece uma interface limpa e intuitiva para organizar suas tarefas em colunas personalizáveis.

### ✨ Características Principais

- 🎯 **100% focado no Kanban** - Sem barras de navegação, menus laterais ou elementos desnecessários
- 🎨 **Design Minimalista** - Interface limpa e neutra, focada na usabilidade
- 🎨 **Colunas Personalizáveis** - Customize cores de fundo e texto de cada coluna
- 🔄 **Drag & Drop** - Arraste e solte colunas e tarefas com facilidade
- 💾 **Persistência Local** - Todas as suas tarefas são salvas automaticamente no navegador
- ⚡ **Performance Otimizada** - Construído com Next.js 14 e React 18
- 📱 **Responsivo** - Funciona perfeitamente em diferentes tamanhos de tela
- 🌐 **TypeScript** - Código type-safe e mais seguro

## 🚀 Features

### Colunas

- ✅ Criar, editar e reordenar colunas
- ✅ Personalizar cores de fundo e texto
- ✅ Drag & drop para reordenar
- ✅ 4 colunas padrão: Backlog, A fazer, Fazendo, Pronto

### Tarefas

- ✅ Criar tarefas em qualquer coluna
- ✅ Editar título e descrição
- ✅ Marcar como completada
- ✅ Arrastar entre colunas
- ✅ Reordenar dentro da mesma coluna
- ✅ Descrição com ellipsis para textos longos

### Interface

- ✅ Design minimalista e limpo
- ✅ Fonte Montserrat para melhor legibilidade
- ✅ Hover states sutis
- ✅ Transições suaves
- ✅ Modal para edição de tarefas e colunas

## 🛠 Tecnologias

Este projeto foi construído com as seguintes tecnologias:

- **[Next.js 14](https://nextjs.org/)** - Framework React com App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[TailwindCSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Gerenciamento de estado leve
- **[@dnd-kit](https://dndkit.com/)** - Biblioteca de drag and drop moderna e acessível
- **[Lucide React](https://lucide.dev/)** - Ícones SVG otimizados
- **LocalStorage** - Persistência de dados no navegador

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ 
- npm, yarn ou pnpm

### Passos

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/minimalistic-kanban.git
cd minimalistic-kanban
```

2. **Instale as dependências**

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Execute o servidor de desenvolvimento**

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

4. **Acesse no navegador**

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🎯 Uso

### Criando uma Nova Coluna

1. Clique no botão **"+ Nova Coluna"** no final da lista de colunas
2. Preencha o título da coluna
3. Escolha as cores de fundo e texto (ou use as padrão)
4. Clique em **"Adicionar"**

### Editando uma Coluna

1. Passe o mouse sobre o header da coluna
2. Clique no ícone de lápis que aparece
3. Ou clique diretamente no título da coluna
4. Edite o nome e/ou cores
5. Clique em **"Salvar"**

### Criando uma Nova Tarefa

1. Clique no botão **"+ Nova Tarefa"** no final de uma coluna
2. Digite o título da tarefa (obrigatório)
3. Adicione uma descrição (opcional)
4. Clique em **"Adicionar"** ou pressione `Ctrl/Cmd + Enter`

### Editando uma Tarefa

1. Clique em qualquer tarefa
2. Edite o título e/ou descrição no modal
3. Clique em **"Salvar"** ou pressione `Escape` para cancelar

### Movendo Tarefas

- **Entre colunas**: Arraste a tarefa para outra coluna
- **Dentro da coluna**: Arraste a tarefa para reordenar na mesma coluna
- **Colunas**: Arraste o header da coluna para reordenar

### Completando Tarefas

1. Clique na checkbox à esquerda da tarefa
2. A tarefa ficará riscada e semi-transparente quando completada

## 📁 Estrutura do Projeto

```
minimalistic-kanban/
├── app/
│   ├── layout.tsx          # Layout raiz com configuração de fonte
│   ├── page.tsx            # Página principal
│   └── globals.css         # Estilos globais
├── components/
│   ├── Board.tsx           # Componente principal do board
│   ├── Column.tsx          # Componente de coluna
│   ├── Task.tsx            # Componente de tarefa
│   ├── TaskModal.tsx       # Modal para editar tarefas
│   ├── ColumnModal.tsx     # Modal para editar colunas
│   └── AddColumnModal.tsx  # Modal para criar colunas
├── store/
│   └── kanbanStore.ts      # Store Zustand com persistência
├── types/
│   └── index.ts            # Definições de tipos TypeScript
├── public/                 # Arquivos estáticos
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🎨 Customização

### Cores Padrão das Colunas

As colunas padrão são criadas com:
- **Cor de fundo**: `#f3f4f6` (cinza claro)
- **Cor do texto**: `#000000` (preto)

Você pode personalizar as cores através do modal de edição de colunas.

### Fonte

O projeto usa a fonte **Montserrat** via Google Fonts. A fonte é configurada globalmente no `app/layout.tsx`.

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start

# Linting
npm run lint
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Sinta-se à vontade para:

1. Fazer um Fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 👤 Autor

Criado com ❤️ para facilitar o gerenciamento de tarefas de forma minimalista e elegante.

---

<div align="center">

⭐ Se este projeto foi útil para você, considere dar uma estrela!

Feito com Next.js, TypeScript e muito ☕

</div>
