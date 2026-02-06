#!/bin/bash
# scripts/run_migrations.sh

set -e

# Database connection info (matching docker-compose defaults)
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}
DB_USER=${DB_USER:-"postgres"}
DB_PASSWORD=${DB_PASSWORD:-"postgres"}
DB_SSLMODE=${DB_SSLMODE:-"disable"}

# Check if goose is installed
if ! command -v goose &> /dev/null; then
    echo "❌ goose is not installed."
    echo "Please install it: go install github.com/pressly/goose/v3/cmd/goose@latest"
    exit 1
fi

echo "🦆 Running migrations with Goose..."

# Function to run migration for a specific service
run_service_migration() {
    local service=$1
    local db_name="mercuria_${service}"
    local migration_dir="migrations/${service}"

    echo "▶ Migrating ${service} (DB: ${db_name})..."

    # Construct DSN
    DSN="postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${db_name}?sslmode=${DB_SSLMODE}"

    # 1. Apply Outbox migration if the service uses the outbox pattern
    # (Wallet, Transaction, and Ledger use outbox)
    if [[ "$service" == "wallet" || "$service" == "transaction" || "$service" == "ledger" ]]; then
         echo "  -> Applying outbox schema..."
         goose -dir "migrations/outbox" postgres "$DSN" up
    fi

    # 2. Apply Service-specific migrations
    if [ -d "$migration_dir" ]; then
        goose -dir "$migration_dir" postgres "$DSN" up
    else
        echo "⚠️  Migration directory not found: $migration_dir"
    fi
    echo "✅ ${service} done."
}

# Run migrations for all services defined in setup.sh
run_service_migration "auth"
run_service_migration "wallet"
run_service_migration "transaction"
run_service_migration "ledger"
run_service_migration "analytics"

echo "✨ All migrations completed successfully!"