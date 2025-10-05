# backend/Dockerfile

# --- STAGE 1: Build the Application ---
# Use an official Maven image that includes JDK 17 to build our app
FROM maven:3.8.5-openjdk-17 AS builder

# Set the working directory
WORKDIR /build

# Copy the Maven project files
COPY pom.xml .
COPY src ./src

# Run the Maven build command to compile the code and create the JAR file.
# This will create the 'target' directory.
RUN mvn clean install -DskipTests


# --- STAGE 2: Create the Final, Lightweight Image ---
# Use a lightweight JRE image for the final application, which is smaller and more secure
FROM openjdk:17-slim

# Set the working directory
WORKDIR /app

# Copy ONLY the final JAR file from the 'builder' stage
COPY --from=builder /build/target/backend-1.0.0.jar app.jar

# Expose the port the application runs on
EXPOSE 8080

# The command to run when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]