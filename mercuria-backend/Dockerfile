# syntax=docker/dockerfile:1

# --------------------------------------------------------
# Stage 1: Builder
# --------------------------------------------------------
# ✅ CHANGED: Updated to Go 1.24 to match your go.mod
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Install build tools
RUN apk add --no-cache git make

# Download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code
COPY . .

# Argument to specify which service to build
ARG SERVICE_NAME
RUN if [ -z "$SERVICE_NAME" ]; then echo "SERVICE_NAME is required"; exit 1; fi

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /bin/server ./cmd/${SERVICE_NAME}/main.go

# --------------------------------------------------------
# Stage 2: Runtime
# --------------------------------------------------------
FROM alpine:3.19

WORKDIR /app

# Install certificates and timezone data
RUN apk add --no-cache ca-certificates tzdata bash

# Create non-root user
RUN adduser -D mercuria
USER mercuria

# Copy binary from builder
COPY --from=builder /bin/server /app/server

# Expose port (can be overridden)
EXPOSE 8080

CMD ["/app/server"]