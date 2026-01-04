.PHONY: help install dev build up down re logs shell db-upgrade db-downgrade db-revision clean

# Default target
help:
	@echo "Available commands:"
	@echo ""
	@echo "Development:"
	@echo "  install         - Install backend dependencies"
	@echo "  dev             - Run backend dev server locally"
	@echo ""
	@echo "Docker:"
	@echo "  build           - Build Docker images"
	@echo "  build-no-cache  - Build Docker images without cache"
	@echo "  up              - Start all services"
	@echo "  down            - Stop all services"
	@echo "  re              - Restart all services"
	@echo "  re-build        - Force rebuild and restart"
	@echo "  logs            - Show logs from all services"
	@echo "  shell           - Open shell in backend container"
	@echo ""
	@echo "Database:"
	@echo "  db-upgrade      - Run database migrations"
	@echo "  db-downgrade    - Rollback last migration"
	@echo "  db-revision     - Create new migration"
	@echo ""
	@echo "Cleanup:"
	@echo "  clean           - Stop services and prune Docker"

# Install backend dependencies
install:
	pip install -r ../backend/requirements.txt

# Run backend dev server locally
dev:
	cd ../backend && uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload

# Build Docker images
build:
	docker-compose build

# Build Docker images without cache
build-no-cache:
	docker-compose build --no-cache

# Start all services
up:
	docker-compose up -d

# Stop all services
down:
	docker-compose down

# Restart all services
re:
	docker-compose down
	docker-compose up -d

# Force rebuild and restart
re-build:
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

# Show logs
logs:
	docker-compose logs -f

# Open shell in backend container
shell:
	docker-compose exec backend /bin/bash

# Database migrations
db-upgrade:
	docker-compose exec backend alembic upgrade head

db-downgrade:
	docker-compose exec backend alembic downgrade -1

db-revision:
	@read -p "Enter migration message: " msg; \
	docker-compose exec backend alembic revision --autogenerate -m "$$msg"

# Clean up Docker resources
clean:
	docker-compose down
	docker system prune -f
