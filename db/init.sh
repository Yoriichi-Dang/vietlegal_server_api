#!/bin/bash

set -e  # Dừng script nếu có lỗi xảy ra

echo "Restoring database from SQL file..."
psql --username="$POSTGRES_USER" --dbname="$POSTGRES_DB" --file=/docker-entrypoint-initdb.d/legal_wise.sql
echo "Database restored successfully!"