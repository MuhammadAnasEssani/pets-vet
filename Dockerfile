FROM node:16.17.0

# Set working directory
WORKDIR /pets-vets

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Run any necessary build commands
RUN node ace migration:run && npm run build

# Copy the .env file to the build directory
COPY .env build/

# Expose the port
EXPOSE 4030

# Install PM2 globally
RUN npm install -g pm2

# Copy the PM2 configuration file
COPY pm2.yml .

# Start the application and scheduler with PM2
CMD ["pm2-runtime", "start", "pm2.yml"]
