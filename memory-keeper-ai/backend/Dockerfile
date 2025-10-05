# backend/Dockerfile

# Use a lightweight, official OpenJDK 17 image as the base
FROM openjdk:17-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the compiled JAR file from your Maven build into the container
# The JAR is created in the 'target' directory when you build
COPY target/backend-1.0.0.jar app.jar

# Expose the port your Spring Boot application runs on
EXPOSE 8080

# The command to run when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]