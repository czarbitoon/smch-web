FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install
RUN apt-get update && apt-get install -y \
    libpq-dev \

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql pgsql   
# Copy project files
COPY . .

# Build the app
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev", "--", "--host"]