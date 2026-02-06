#!/bin/bash
# scripts/create_kafka_topics.sh

set -e

KAFKA_CONTAINER="mercuria-kafka"
BOOTSTRAP_SERVER="localhost:9092"
PARTITIONS=3
REPLICATION_FACTOR=1

echo "Create Kafka Topics..."

# List of topics derived from your code constants
TOPICS=(
    "wallet.created"
    "wallet.balance_updated"
    "transaction.completed"
    "transaction.failed"
    "ledger.entry_created"
    "user.created"
)

# Function to create a topic
create_topic() {
    local topic=$1
    echo "▶ Creating topic: $topic"
    
    docker exec $KAFKA_CONTAINER kafka-topics \
        --create \
        --if-not-exists \
        --bootstrap-server $BOOTSTRAP_SERVER \
        --partitions $PARTITIONS \
        --replication-factor $REPLICATION_FACTOR \
        --topic "$topic"
}

# Wait for Kafka to be ready
echo "Waiting for Kafka to be ready..."
sleep 5

# Create all topics
for topic in "${TOPICS[@]}"; do
    create_topic "$topic"
done

echo "✅ Kafka topics created successfully!"