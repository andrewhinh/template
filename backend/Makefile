# Arcane incantation to print all the other targets, from https://stackoverflow.com/a/26339924
help:
	@$(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST))

# Install exact Python and CUDA versions
env:
	conda env update --prune -f environment.yml

# Compile and install exact pip packages
install:
	pip install uv==0.1.4
	uv pip compile requirements/prod.in -o requirements/prod.txt && uv pip compile requirements/dev.in -o requirements/dev.txt
	uv pip sync requirements/prod.txt requirements/dev.txt

# Setup
setup:
	pre-commit install
	export PYTHONPATH=.
	echo "export PYTHONPATH=.:$PYTHONPATH" >> ~/.bashrc
	mkcert -install
	mkcert localhost 127.0.0.1 ::1
	mkdir -p certificates
	mv localhost+2-key.pem certificates/localhost+2-key.pem
	mv localhost+2.pem certificates/localhost+2.pem

# Generate migration script
script:
	alembic revision --autogenerate -m "$(m)"

# Apply migration
migrate:
	alembic upgrade head

# Test
test:
	pytest tests -s

# Run app
dev:
	python app/main.py

# Connect to database
db:
	sudo -u postgres psql -c "SELECT 1 FROM pg_database WHERE datname = 'template'" | grep -q 1 || sudo -u postgres createdb template; sudo -u postgres psql -d template

# Start linting server
lint:
	ruff check . --watch --fix


# Lint and format
fix:
	pre-commit run --all-files

# Bump versions of transitive dependencies
upgrade:
	pip install uv==0.1.4
	uv pip compile --upgrade requirements/prod.in -o requirements/prod.txt && uv pip compile --upgrade requirements/dev.in -o requirements/dev.txt
	uv pip sync requirements/prod.txt requirements/dev.txt
