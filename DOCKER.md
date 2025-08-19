# 🐳 Docker Guide for Support Ticket Analyzer

This guide explains how to run the Support Ticket Analyzer application using Docker.

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Build and start the application
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop the application
docker-compose down

# View logs
docker-compose logs -f
```

### Option 2: Direct Docker Commands

```bash
# Build the image
docker build -t support-ticket-analyzer:latest .

# Run the container
docker run --rm -p 3000:3000 --name support-ticket-analyzer support-ticket-analyzer:latest

# Run in background
docker run -d --rm -p 3000:3000 --name support-ticket-analyzer support-ticket-analyzer:latest
```

## 🌐 Access the Application

Once running, open your browser and navigate to:
- **Local**: http://localhost:3000
- **Network**: http://your-ip:3000

## 📋 Docker Commands Reference

### Building
```bash
# Build with latest tag
docker build -t support-ticket-analyzer:latest .

# Build with specific tag
docker build -t support-ticket-analyzer:v1.0.0 .

# Build without cache
docker build --no-cache -t support-ticket-analyzer:latest .
```

### Running
```bash
# Basic run
docker run -p 3000:3000 support-ticket-analyzer:latest

# Run with custom port
docker run -p 8080:3000 support-ticket-analyzer:latest

# Run with environment variables
docker run -p 3000:3000 -e NODE_ENV=production support-ticket-analyzer:latest

# Run with volume mount for data updates
docker run -p 3000:3000 -v $(pwd)/public:/app/public support-ticket-analyzer:latest
```

### Management
```bash
# List running containers
docker ps

# Stop container
docker stop support-ticket-analyzer

# Remove container
docker rm support-ticket-analyzer

# View logs
docker logs support-ticket-analyzer

# Follow logs
docker logs -f support-ticket-analyzer

# Access container shell
docker exec -it support-ticket-analyzer sh

# Copy files from container
docker cp support-ticket-analyzer:/app/some-file ./
```

### Docker Compose
```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build

# View logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Scale service
docker-compose up --scale support-ticket-analyzer=3
```

## 🔧 Configuration

### Environment Variables
```bash
# Available environment variables
NODE_ENV=production          # Node environment
PORT=3000                    # Application port
NEXT_TELEMETRY_DISABLED=1    # Disable Next.js telemetry
```

### Port Mapping
```bash
# Default port mapping
-p 3000:3000                # Host:Container

# Custom host port
-p 8080:3000                # Access via http://localhost:8080

# All interfaces
-p 0.0.0.0:3000:3000       # Access from any IP
```

## 📁 Volume Mounts

### Data File Updates
```bash
# Mount the data file for easy updates without rebuilding
docker run -p 3000:3000 \
  -v $(pwd)/public/zendesk_mock_tickets_llm_flavor.json:/app/public/zendesk_mock_tickets_llm_flavor.json:ro \
  support-ticket-analyzer:latest
```

### Development Mode
```bash
# Mount source code for development
docker run -p 3000:3000 \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/public:/app/public \
  support-ticket-analyzer:latest
```

## 🏗️ Multi-Stage Build

The Dockerfile uses a multi-stage build process:

1. **Base Stage**: Sets up the Node.js environment
2. **Dependencies Stage**: Installs all dependencies (including devDependencies)
3. **Builder Stage**: Builds the Next.js application
4. **Runner Stage**: Creates the production image with only necessary files

### Benefits
- **Smaller final image**: Only production dependencies included
- **Security**: Non-root user in production
- **Efficiency**: Cached layers for faster rebuilds
- **Standalone**: Next.js standalone output for minimal runtime

## 🔍 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using port 3000
lsof -i :3000

# Use different port
docker run -p 3001:3000 support-ticket-analyzer:latest
```

#### Permission Issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Run with current user
docker run -u $(id -u):$(id -g) -p 3000:3000 support-ticket-analyzer:latest
```

#### Container Won't Start
```bash
# Check container logs
docker logs support-ticket-analyzer

# Check container status
docker ps -a

# Remove and recreate
docker rm support-ticket-analyzer
docker run --rm -p 3000:3000 support-ticket-analyzer:latest
```

#### Build Failures
```bash
# Clean build
docker system prune -a
docker build --no-cache -t support-ticket-analyzer:latest .

# Check Dockerfile syntax
docker build --target deps -t test .
```

### Debug Commands
```bash
# Inspect image layers
docker history support-ticket-analyzer:latest

# Check image size
docker images support-ticket-analyzer

# Inspect container
docker inspect support-ticket-analyzer

# Check resource usage
docker stats support-ticket-analyzer
```

## 🚀 Production Deployment

### Production Considerations
```bash
# Use specific version tags
docker build -t support-ticket-analyzer:v1.0.0 .

# Set restart policy
docker run -d --restart=unless-stopped -p 3000:3000 support-ticket-analyzer:v1.0.0

# Use health checks
docker run -d --health-cmd="curl -f http://localhost:3000/api/tickets" \
  --health-interval=30s \
  --health-timeout=10s \
  --health-retries=3 \
  -p 3000:3000 support-ticket-analyzer:latest
```

### Reverse Proxy (Nginx)
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 Monitoring

### Health Checks
```bash
# Check application health
curl http://localhost:3000/api/tickets

# Monitor container health
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### Logs
```bash
# View real-time logs
docker logs -f support-ticket-analyzer

# Search logs
docker logs support-ticket-analyzer | grep "ERROR"

# Export logs
docker logs support-ticket-analyzer > app.log
```

## 🔒 Security

### Best Practices
- ✅ Non-root user in container
- ✅ Minimal base image (Alpine Linux)
- ✅ Multi-stage build reduces attack surface
- ✅ No sensitive data in image layers
- ✅ Health checks for monitoring

### Security Scanning
```bash
# Scan image for vulnerabilities
docker scan support-ticket-analyzer:latest

# Use Trivy for detailed scanning
trivy image support-ticket-analyzer:latest
```

---

**🎯 Ready to deploy?** Start with `docker-compose up --build` and access your application at http://localhost:3000! 