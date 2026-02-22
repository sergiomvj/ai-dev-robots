# 🗄️ SKILL: Operações PostgreSQL
> **Executa queries, backups e manutenção no banco de dados PostgreSQL da VPS.**

---

## Parâmetros

- **Operação** — query, backup, restore, migrate
- **Database** — nome do banco alvo
- **Credenciais** — via variáveis de ambiente (nunca hardcoded)

## Como usar

```bash
# Query simples
PGPASSWORD=$DB_PASS psql -h localhost -U $DB_USER -d $DB_NAME \
  -c "SELECT * FROM agents WHERE active = true;"

# Backup completo
bash /workspace/Scripts/db-backup.sh --db openclaw_db --output /backups/

# Restore
bash /workspace/Scripts/db-restore.sh \
  --file /backups/openclaw_db_20260222.dump \
  --db openclaw_db

# Executar migration
bash /workspace/Scripts/db-migrate.sh --dir /workspace/migrations/
```

## Protocolo de backup obrigatório
1. Backup ANTES de qualquer alteração estrutural
2. Verificar integridade após backup: `pg_restore --list arquivo.dump`
3. Registrar em MEMORY.md com timestamp

## Variáveis de ambiente necessárias
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASS=sua_senha  # via .env, nunca no código
DB_NAME=openclaw_db
```

## Responsável primário
David Novaes (Senior Programmer)
