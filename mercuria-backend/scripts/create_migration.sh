#!/bin/bash
# scripts/create_migration.sh

if [ -z "$1" ]; then
    echo "Usage: ./scripts/create_migration.sh <migration_name> [service_name]"
    echo "Example: ./scripts/create_migration.sh add_users_table auth"
    exit 1
fi

NAME=$1
SERVICE=${2:-"common"} # Default to common if not specified, though usually you want a specific service

# Check if goose is installed
if ! command -v goose &> /dev/null; then
    echo "❌ goose is not installed. Run: go install github.com/pressly/goose/v3/cmd/goose@latest"
    exit 1
fi

DIR="migrations/${SERVICE}"
mkdir -p "$DIR"

echo "Creating migration '$NAME' in '$DIR'..."
goose -dir "$DIR" create "$NAME" sql