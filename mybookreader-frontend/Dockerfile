# Use official Node.js image as the base image
FROM node:20-slim

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create and set the working directory
WORKDIR /app

# Copy package files first (better cache utilization)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application (after dependencies are installed)
COPY . .

# Ensure Tailwind and PostCSS dependencies are installed
RUN npm install tailwindcss postcss autoprefixer --save-dev

# Build the application
RUN npm run build

# Expose Next.js default port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
