# PostgreSQL Database Configuration

## 🐘 Database Setup

The project now uses **PostgreSQL 16** for better performance, reliability, and advanced features.

### 📊 **Database Connection Details**

#### Development Environment:
```
Host: localhost
Port: 5432
Database: attendance_system
Username: attendance_user
Password: attendance_pass
```

#### Production Environment:
```
Host: postgres_prod (internal Docker network)
Port: 5432
Database: attendance_system
Username: attendance_user
Password: attendance_pass
```

### 🔧 **Laravel Database Configuration**

The Laravel `.env` configuration is automatically set by Docker:

```env
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=attendance_system
DB_USERNAME=attendance_user
DB_PASSWORD=attendance_pass
```

### 🛠️ **PostgreSQL Features Enabled**

The database includes these extensions:
- `uuid-ossp` - UUID generation functions
- `pg_trgm` - Trigram matching for better text search

### 📱 **Connecting with Database Clients**

#### pgAdmin:
1. Host: `localhost`
2. Port: `5432`
3. Database: `attendance_system`
4. Username: `attendance_user`
5. Password: `attendance_pass`

#### DBeaver:
1. Create new PostgreSQL connection
2. Host: `localhost`
3. Port: `5432`
4. Database: `attendance_system`
5. Username: `attendance_user`
6. Password: `attendance_pass`

#### Command Line (psql):
```bash
# Connect from host machine
psql -h localhost -p 5432 -U attendance_user -d attendance_system

# Connect from inside Docker container
docker exec -it attendance_postgres_dev psql -U attendance_user -d attendance_system
```

### 🚀 **Performance Benefits**

PostgreSQL provides:
- ✅ Better concurrent performance
- ✅ Advanced indexing capabilities
- ✅ Full-text search
- ✅ JSON/JSONB data types
- ✅ Better data integrity
- ✅ More robust transactions
- ✅ Built-in replication support

### 🔄 **Migration from SQLite**

If you need to migrate existing SQLite data:

1. Export from SQLite:
```bash
sqlite3 database/database.sqlite .dump > backup.sql
```

2. Clean up SQL for PostgreSQL:
```bash
# Remove SQLite specific syntax
sed -i 's/AUTOINCREMENT/SERIAL/g' backup.sql
```

3. Import to PostgreSQL:
```bash
psql -h localhost -U attendance_user -d attendance_system < backup.sql
```

### 📈 **Development vs Production**

| Environment | Container Name | Port | Features |
|-------------|----------------|------|----------|
| Development | `attendance_postgres_dev` | 5432 | Hot reload, debug logs |
| Production | `attendance_postgres_prod` | Internal | Optimized, persistent volumes |

### 🔍 **Monitoring & Logs**

View PostgreSQL logs:
```bash
# Development logs
./docker-run.sh logs-dev

# Production logs  
./docker-run.sh logs

# Direct PostgreSQL logs
docker logs attendance_postgres_dev
```

### 🛡️ **Security Notes**

- Database is isolated within Docker network
- Only exposed port is 5432 for development access
- Production database has no external port exposure
- Strong password authentication required
- Database user has limited privileges (no superuser)