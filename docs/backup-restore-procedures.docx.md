🤖

**AI Robot Control**

**Procedimentos de Backup & Restore**

VPS: 76.13.168.223  ·  dashboard.fbrapps.com  ·  Fevereiro 2026

| ⏰ Agendamento Todo dia às 03:00 | 📦 Retenção 7 dias locais \+ GitHub | ☁️ Destino sergiomvj/OC-Backup |
| :---: | :---: | :---: |

# **1\. O que é incluído no Backup**

| Componente | Caminho na VPS | Arquivo no Backup |
| :---- | :---- | :---- |
| PostgreSQL (openclaw\_dashboard) | /var/lib/postgresql/... | openclaw\_backup\_DATE.tar.gz |
| Workspace dos Agentes | /home/openclaw/workspace/ | openclaw\_backup\_DATE.tar.gz |
| Config do OpenClaw | /home/openclaw/.openclaw/openclaw.json | openclaw\_backup\_DATE.tar.gz |
| GitHub App Config | /home/openclaw/.openclaw/github-app.json | openclaw\_backup\_DATE.tar.gz |
| Chave Privada GitHub | /home/openclaw/.openclaw/\*.pem | openclaw\_backup\_DATE.tar.gz |
| Dashboard .env | /home/openclaw/openclaw-dashboard/.env | openclaw\_backup\_DATE.tar.gz |
| Dashboard API | /home/openclaw/openclaw-dashboard/api.mjs | openclaw\_backup\_DATE.tar.gz |
| Nginx | /etc/nginx/sites-available/openclaw\* | nginx\_backup\_DATE.tar.gz |
| Systemd Services | /etc/systemd/system/openclaw\*.service | services\_backup\_DATE.tar.gz |

# **2\. Onde ficam os Backups**

## **2.1 Local (na VPS)**

Os backups são armazenados localmente na VPS por 7 dias:

| /home/openclaw/.openclaw/backups/ |
| :---- |
| ├── openclaw\_backup\_20260222\_030000.tar.gz   ← backup principal |
| ├── nginx\_backup\_20260222\_030000.tar.gz      ← configs nginx |
| ├── services\_backup\_20260222\_030000.tar.gz   ← systemd services |
| └── backup.log                               ← histórico de execuções |

## **2.2 Remoto (GitHub)**

Cada backup é automaticamente enviado para o repositório privado:

| https://github.com/sergiomvj/OC-Backup |
| :---- |

| ℹ️  Nota sobre o GitHub O repositório OC-Backup armazena todos os backups históricos. Os arquivos .tar.gz são commitados automaticamente com mensagem: backup: YYYYMMDD\_HHMMSS |
| :---- |

# **3\. Baixar o Último Backup**

## **Opção A — Direto da VPS**

Conecte-se via SSH e liste os backups disponíveis:

| ssh root@76.13.168.223 |
| :---- |
| ls \-lht /home/openclaw/.openclaw/backups/\*.tar.gz | head \-5 |

Copie o backup mais recente para sua máquina local:

| \# No PowerShell (Windows) |
| :---- |
| scp root@76.13.168.223:/home/openclaw/.openclaw/backups/openclaw\_backup\_YYYYMMDD\_HHMMSS.tar.gz . |

## **Opção B — Via GitHub**

Acesse o repositório e baixe o arquivo .tar.gz mais recente:

| https://github.com/sergiomvj/OC-Backup |
| :---- |

Ou via linha de comando:

| git clone https://github.com/sergiomvj/OC-Backup.git |
| :---- |
| cd OC-Backup |
| ls \-lt \*.tar.gz | head \-5   \# ver os mais recentes |

# **4\. Restaurar o Backup — Passo a Passo**

| ⚠️  Antes de restaurar • Confirme que o PostgreSQL está rodando: systemctl status postgresql • Confirme que o OpenClaw está parado: systemctl stop openclaw openclaw-dashboard • Faça um backup do estado atual antes de restaurar |
| :---- |

## **4.1 Restaurar PostgreSQL**

| 1 | Extrair o dump | Extraia o backup principal e localize o arquivo SQL do banco. |
| :---: | :---- | :---- |
| **2** | **Acessar PostgreSQL** | Conecte como postgres e prepare o banco para restauração. |
| **3** | **Recriar o banco** | Drop e recrie o banco openclaw\_dashboard. |
| **4** | **Importar o dump** | Execute o arquivo SQL exportado. |
| **5** | **Verificar** | Confirme que as tabelas foram restauradas corretamente. |

Comandos completos:

| \# 1\. Extrair o backup |
| :---- |
| cd /tmp |
| tar \-xzf openclaw\_backup\_YYYYMMDD\_HHMMSS.tar.gz |
|  |
| \# 2\. Localizar o dump SQL |
| find /tmp \-name 'db\_dump\_\*.sql' 2\>/dev/null |
|  |
| \# 3\. Restaurar o banco |
| PGPASSWORD='OCdash2026\!' psql \-U openclaw\_admin \-h localhost \-c 'DROP DATABASE IF EXISTS openclaw\_dashboard;' |
| PGPASSWORD='OCdash2026\!' psql \-U openclaw\_admin \-h localhost \-c 'CREATE DATABASE openclaw\_dashboard;' |
|  |
| \# 4\. Importar |
| PGPASSWORD='OCdash2026\!' psql \-U openclaw\_admin \-h localhost openclaw\_dashboard \< /tmp/db\_dump\_YYYYMMDD\_HHMMSS.sql |
|  |
| \# 5\. Verificar |
| PGPASSWORD='OCdash2026\!' psql \-U openclaw\_admin \-h localhost openclaw\_dashboard \-c '\\dt' |

## **4.2 Restaurar Workspace dos Agentes**

| \# Extrair (se ainda não extraído) |
| :---- |
| cd /tmp && tar \-xzf openclaw\_backup\_YYYYMMDD\_HHMMSS.tar.gz |
|  |
| \# Restaurar workspace |
| cp \-r /tmp/home/openclaw/workspace /home/openclaw/workspace |
|  |
| \# Verificar |
| find /home/openclaw/workspace \-type f | sort |

## **4.3 Restaurar Configurações do OpenClaw**

| \# Restaurar configs principais |
| :---- |
| cp /tmp/home/openclaw/.openclaw/openclaw.json /home/openclaw/.openclaw/ |
| cp /tmp/home/openclaw/.openclaw/github-app.json /home/openclaw/.openclaw/ |
| cp /tmp/home/openclaw/.openclaw/\*.pem /home/openclaw/.openclaw/ |
|  |
| \# Restaurar .env do dashboard |
| cp /tmp/home/openclaw/openclaw-dashboard/.env /home/openclaw/openclaw-dashboard/ |

## **4.4 Restaurar Nginx**

| \# Extrair backup do Nginx |
| :---- |
| cd /tmp && tar \-xzf nginx\_backup\_YYYYMMDD\_HHMMSS.tar.gz |
|  |
| \# Restaurar configs |
| cp /tmp/etc/nginx/sites-available/openclaw /etc/nginx/sites-available/ |
| cp /tmp/etc/nginx/sites-available/openclaw-dashboard /etc/nginx/sites-available/ |
|  |
| \# Recarregar |
| nginx \-t && systemctl reload nginx |

## **4.5 Restaurar Serviços Systemd**

| \# Extrair backup dos serviços |
| :---- |
| cd /tmp && tar \-xzf services\_backup\_YYYYMMDD\_HHMMSS.tar.gz |
|  |
| \# Restaurar serviços |
| cp /tmp/etc/systemd/system/openclaw.service /etc/systemd/system/ |
| cp /tmp/etc/systemd/system/openclaw-dashboard.service /etc/systemd/system/ |
|  |
| \# Recarregar e reiniciar |
| systemctl daemon-reload |
| systemctl start openclaw openclaw-dashboard |
| systemctl status openclaw openclaw-dashboard |

# **5\. Verificação Pós-Restore**

| \# Verificar serviços |
| :---- |
| systemctl status openclaw |
| systemctl status openclaw-dashboard |
|  |
| \# Verificar banco |
| PGPASSWORD='OCdash2026\!' psql \-U openclaw\_admin \-h localhost openclaw\_dashboard \-c 'SELECT COUNT(\*) FROM agents;' |
|  |
| \# Verificar workspace |
| ls /home/openclaw/workspace/Commands/ |
|  |
| \# Verificar logs do OpenClaw |
| journalctl \-u openclaw \-n 20 |
|  |
| \# Testar dashboard |
| curl \-s http://localhost:8080 | head \-5 |

| ✅ Sinais de restore bem-sucedido • systemctl status openclaw → Active: running • systemctl status openclaw-dashboard → Active: running • Banco retorna linhas na tabela agents • dashboard.fbrapps.com carrega normalmente • Agentes enviam heartbeat em até 5 minutos |
| :---- |

# **6\. Integração com Next.js (Dashboard)**

O dashboard Next.js precisa de uma API Route para listar e restaurar backups. Adicionar ao projeto:

## **6.1 API Route — GET /api/backups**

| // app/api/backups/route.ts |
| :---- |
| import { NextResponse } from 'next/server' |
| import fs from 'fs' |
| import path from 'path' |
|  |
| const BACKUP\_DIR \= '/home/openclaw/.openclaw/backups' |
|  |
| export async function GET() { |
|   const files \= fs.readdirSync(BACKUP\_DIR) |
|     .filter(f \=\> f.endsWith('.tar.gz')) |
|     .map(f \=\> ({ |
|       name: f, |
|       path: path.join(BACKUP\_DIR, f), |
|       sizeBytes: fs.statSync(path.join(BACKUP\_DIR, f)).size, |
|       createdAt: fs.statSync(path.join(BACKUP\_DIR, f)).mtime, |
|     })) |
|     .sort((a, b) \=\> b.createdAt \- a.createdAt) |
|   return NextResponse.json(files) |
| } |

## **6.2 API Route — POST /api/backups/trigger**

| // app/api/backups/trigger/route.ts |
| :---- |
| import { NextResponse } from 'next/server' |
| import { exec } from 'child\_process' |
| import { promisify } from 'util' |
|  |
| const execAsync \= promisify(exec) |
|  |
| export async function POST() { |
|   try { |
|     await execAsync('bash /home/openclaw/.openclaw/backup.sh') |
|     return NextResponse.json({ triggered: true }) |
|   } catch (error) { |
|     return NextResponse.json({ error: 'Falha ao executar backup' }, { status: 500 }) |
|   } |
| } |

| ⚠️  Permissões O processo Next.js (pm2) precisa ter permissão para executar o backup.sh. Verificar com: ps aux | grep node  →  ver o usuário do processo Se rodar como 'openclaw': chmod \+x /home/openclaw/.openclaw/backup.sh  (já feito) |
| :---- |

# **7\. Referência Rápida**

| Ação | Comando |
| :---- | :---- |
| **Executar backup agora** | bash /home/openclaw/.openclaw/backup.sh |
| **Ver log do backup** | tail \-40 /home/openclaw/.openclaw/backups/backup.log |
| **Listar backups locais** | ls \-lht /home/openclaw/.openclaw/backups/\*.tar.gz |
| **Inspecionar conteúdo** | tar \-tzf openclaw\_backup\_DATE.tar.gz | head \-30 |
| **Ver cron configurado** | crontab \-l |
| **Status dos serviços** | systemctl status openclaw openclaw-dashboard |
| **Ver heartbeats recentes** | journalctl \-u openclaw \-n 20 \--no-pager |

AI Robot Control  ·  FaceBrasil Apps  ·  Gerado em Fevereiro 2026