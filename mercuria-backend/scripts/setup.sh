#!/bin/bash
# scripts/setup.sh
# Run from project root: bash scripts/setup.sh

set -e

# --- Configuration ---
DB_USER="postgres"
REQUIRED_DBS=("mercuria_auth" "mercuria_wallet" "mercuria_transaction" "mercuria_ledger" "mercuria_analytics")
REQUIRED_CONTAINERS=("mercuria-postgres" "mercuria-redis" "mercuria-kafka" "mercuria-zookeeper")

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() { echo -e "${BLUE}▶ $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

# --- Checks ---

# Ensure running from root
if [ ! -d "scripts" ]; then
    print_error "Please run this script from the project root directory."
    exit 1
fi

check_docker() {
    print_step "Checking Docker..."
    if ! sudo docker info > /dev/null 2>&1; then
        print_error "Docker is not running or you need sudo."
        exit 1
    fi
}

check_containers() {
    print_step "Checking containers..."
    for container in "${REQUIRED_CONTAINERS[@]}"; do
        if ! sudo docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
            print_error "Container $container is not running. Run: sudo docker-compose up -d"
            exit 1
        fi
    done
    print_success "Containers are up."
}

wait_for_postgres() {
    print_step "Waiting for PostgreSQL..."
    for i in {1..30}; do
        if sudo docker exec mercuria-postgres pg_isready -U "$DB_USER" > /dev/null 2>&1; then
            print_success "PostgreSQL is ready."
            return 0
        fi
        sleep 1
    done
    print_error "PostgreSQL timed out."
    exit 1
}

# --- Actions ---

create_databases() {
    print_step "Ensuring databases exist..."
    
    # Get list of existing DBs once
    EXISTING_DBS=$(sudo docker exec mercuria-postgres psql -U "$DB_USER" -lqt | cut -d \| -f 1)

    for db in "${REQUIRED_DBS[@]}"; do
        if echo "$EXISTING_DBS" | grep -qw "$db"; then
            print_warning "Database $db already exists."
        else
            echo "Creating database $db..."
            if sudo docker exec mercuria-postgres psql -U "$DB_USER" -c "CREATE DATABASE $db;" > /dev/null; then
                print_success "Created $db"
            else
                print_error "Failed to create $db"
                exit 1
            fi
        fi
    done
}

run_migrations() {
    print_step "Running Migrations..."
    if [ -x "scripts/run_migrations.sh" ]; then
        # Run with current user environment (goose is likely in user path), but script might need DB access
        # Since we use localhost connection for goose, sudo is NOT needed for the goose command itself,
        # but the script file needs to be executable.
        bash scripts/run_migrations.sh
    else
        print_error "scripts/run_migrations.sh not found or not executable."
        exit 1
    fi
}

create_kafka_topics() {
    print_step "Creating Kafka Topics..."
    # This script uses docker exec, so it needs sudo
    sudo bash scripts/create_kafka_topics.sh
}

generate_certs() {
    print_step "Checking Certificates..."
    if [ -d "certs" ] && [ "$(ls -A certs)" ]; then
        print_warning "Certificates found in ./certs/ - Skipping generation."
    else
        print_step "Generating Certificates..."
        bash scripts/generate-certs.sh
    fi
}

# --- Main ---

main() {
    check_docker
    check_containers
    wait_for_postgres
    
    create_databases
    run_migrations
    create_kafka_topics
    generate_certs
    
    echo ""
    print_success "Setup Complete! You can now run 'make run-all'"
}

main