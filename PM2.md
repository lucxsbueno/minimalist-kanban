# 🚀 Guia PM2 - Servidor em Produção

Este guia explica como funciona o servidor em produção usando PM2 e como trabalhar com desenvolvimento e produção.

## 📋 Índice

- [Como Funciona](#como-funciona)
- [Servidor Continua Rodando?](#servidor-continua-rodando)
- [Alterações no Código](#alterações-no-código)
- [Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)
- [Comandos Úteis](#comandos-úteis)
- [Troubleshooting](#troubleshooting)

## Como Funciona

O PM2 é um gerenciador de processos que mantém sua aplicação rodando em segundo plano, mesmo quando você fecha o Cursor, Terminal ou faz logout do sistema.

### Modo Produção vs Desenvolvimento

**Modo Produção (PM2):**
- ✅ Roda 24/7 em segundo plano
- ✅ Continua funcionando mesmo fechando aplicações
- ✅ Auto-restart em caso de crash
- ✅ Otimizado para performance
- ❌ Não tem hot reload (alterações não aparecem automaticamente)
- ❌ Requer build + restart para ver mudanças

**Modo Desenvolvimento (`npm run dev`):**
- ✅ Hot reload automático (mudanças aparecem instantaneamente)
- ✅ Melhor para debugar
- ✅ Mais rápido para desenvolvimento
- ❌ Precisa do terminal aberto
- ❌ Para quando você fecha o terminal
- ❌ Não roda em segundo plano

## Servidor Continua Rodando?

### ✅ SIM - O servidor continua funcionando mesmo se você:

- Fechar o Cursor completamente
- Fechar o Terminal
- Fazer logout e login novamente
- Desconectar monitor/teclado (em servidores remotos)
- Fechar todas as aplicações

O PM2 roda como um **processo do sistema operacional**, não depende de nenhuma aplicação estar aberta.

### ❌ O servidor PARA apenas se você:

- Reiniciar o Mac (a menos que tenha configurado `pm2 startup`)
- Executar `npm run pm2:stop` ou `sudo pm2 stop minimalist-kanban`
- Desligar o Mac
- Remover o processo manualmente

## Alterações no Código

### ❌ NÃO - Alterações NÃO aparecem automaticamente

O PM2 está rodando em **modo produção**, que:
- Não tem hot reload
- Não detecta mudanças nos arquivos
- Serve a versão que foi compilada no último build

### Para ver suas alterações no código:

```bash
# 1. Compilar as mudanças
npm run build

# 2. Reiniciar o servidor PM2
npm run pm2:restart
```

Depois disso, acesse `http://minimalist-kanban` para ver as mudanças.

### Por que não tem hot reload em produção?

Hot reload é uma feature de desenvolvimento que:
- Compila código sob demanda
- Reinicia o servidor automaticamente
- É mais lento e consome mais recursos

Em produção, você quer:
- Performance otimizada
- Código pré-compilado
- Estabilidade

Por isso, produção requer build manual.

## Fluxo de Desenvolvimento

### Recomendação: Use os dois modos

#### Durante o desenvolvimento ativo:

```bash
# Em um terminal separado
npm run dev
```

- Acesse `http://localhost:3000` para testar
- Alterações aparecem automaticamente (hot reload)
- Melhor para desenvolvimento e debug

#### Para ter sempre disponível:

```bash
# Servidor PM2 em produção (já deve estar rodando)
# Acesse: http://minimalist-kanban
```

- Disponível 24/7
- Pode fechar tudo e continuar funcionando
- Versão estável e otimizada

#### Quando terminar de desenvolver:

```bash
# 1. Compilar para produção
npm run build

# 2. Atualizar servidor PM2
npm run pm2:restart

# 3. Verificar se está funcionando
sudo pm2 list
```

Agora suas mudanças estão disponíveis em `http://minimalist-kanban`.

### Resumo do Fluxo

```
┌─────────────────────────────────────────┐
│  Desenvolvendo Ativamente               │
│  npm run dev → localhost:3000          │
│  (hot reload, rápido, terminal aberto) │
└─────────────────────────────────────────┘
                    │
                    │ Terminou?
                    ▼
┌─────────────────────────────────────────┐
│  Deploy para Produção                   │
│  1. npm run build                       │
│  2. npm run pm2:restart                 │
│  3. Acesse: minimalist-kanban           │
└─────────────────────────────────────────┘
```

## Comandos Úteis

### Gerenciamento do Servidor

```bash
# Iniciar servidor
npm run pm2:start

# Parar servidor
npm run pm2:stop

# Reiniciar servidor (útil após build)
npm run pm2:restart

# Ver logs em tempo real
npm run pm2:logs

# Ver logs (últimas 100 linhas)
npm run pm2:logs -- --lines 100

# Remover processo do PM2
npm run pm2:delete

# Salvar configuração atual
npm run pm2:save

# Configurar inicialização automática no boot
npm run pm2:startup
```

### Verificação

```bash
# Listar todos os processos PM2
sudo pm2 list

# Ver informações detalhadas
sudo pm2 info minimalist-kanban

# Monitorar processos (CPU, memória, etc)
sudo pm2 monit

# Ver status do servidor
sudo pm2 status
```

### Desenvolvimento

```bash
# Modo desenvolvimento (hot reload)
npm run dev

# Compilar para produção
npm run build

# Compilar + reiniciar servidor (comando combinado)
npm run build && npm run pm2:restart
```

## Troubleshooting

### Servidor não inicia

```bash
# Verificar se porta 80 está em uso
sudo lsof -i :80

# Ver logs de erro
npm run pm2:logs

# Verificar se build foi feito
ls -la .next

# Se não tiver build, fazer:
npm run build
```

### Alterações não aparecem

1. **Verificar se fez build:**
   ```bash
   npm run build
   ```

2. **Verificar se reiniciou:**
   ```bash
   npm run pm2:restart
   ```

3. **Limpar cache do navegador:**
   - Pressione `Cmd+Shift+R` (hard refresh)
   - Ou abra janela anônima

4. **Verificar logs:**
   ```bash
   npm run pm2:logs
   ```

### Servidor parou sozinho

```bash
# Verificar logs de erro
npm run pm2:logs

# Verificar status
sudo pm2 list

# Reiniciar
npm run pm2:start
```

### Não consegue acessar minimalist-kanban

1. **Verificar se /etc/hosts está configurado:**
   ```bash
   cat /etc/hosts | grep minimalist-kanban
   ```
   
   Deve aparecer: `127.0.0.1  minimalist-kanban`

2. **Verificar se servidor está rodando:**
   ```bash
   sudo pm2 list
   ```
   
   Status deve ser "online"

3. **Testar localhost:**
   ```bash
   curl http://localhost:80
   ```

4. **Limpar cache DNS:**
   ```bash
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   ```

### Porta 80 já está em uso

```bash
# Ver o que está usando a porta 80
sudo lsof -i :80

# Se for outro processo, pare-o ou mude a porta no ecosystem.config.js
```

## Dicas Importantes

1. **Sempre faça build antes de restart:**
   - `npm run build` compila o código
   - `npm run pm2:restart` serve a nova versão

2. **Use modo dev durante desenvolvimento:**
   - Muito mais rápido para testar mudanças
   - Hot reload salva tempo

3. **PM2 para produção:**
   - Versão estável sempre disponível
   - Pode acessar de qualquer lugar na rede local

4. **Logs são seus amigos:**
   - Sempre verifique logs se algo não funcionar
   - `npm run pm2:logs` mostra o que está acontecendo

5. **Salve configuração após mudanças:**
   - `npm run pm2:save` após configurar startup
   - Garante que configuração persiste

## Perguntas Frequentes

### Posso ter dev e produção rodando ao mesmo tempo?

Sim! Mas em portas diferentes:
- Dev: `npm run dev` → `localhost:3000`
- Produção: PM2 → `minimalist-kanban` (porta 80)

### Preciso fazer build toda vez que mudar algo?

**Se estiver desenvolvendo:** Use `npm run dev` (sem build)

**Se quiser atualizar produção:** Sim, precisa `build` + `restart`

### O servidor reinicia sozinho após reiniciar o Mac?

Só se você configurou:
```bash
npm run pm2:startup
npm run pm2:save
```

### Posso ver as mudanças sem fazer build?

Sim, use `npm run dev` em modo desenvolvimento. Mas isso não é o servidor PM2 em produção.

### Quanto tempo leva para fazer build?

Depende do tamanho do projeto, geralmente 10-30 segundos. Use `npm run dev` durante desenvolvimento para evitar builds constantes.

---

**Dúvidas?** Consulte os logs com `npm run pm2:logs` ou verifique o status com `sudo pm2 list`.
