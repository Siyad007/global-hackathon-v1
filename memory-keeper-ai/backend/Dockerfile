# backend/Dockerfile

# --- STAGE 1: Build the Application with JDK 21 ---

# Use an official Maven image that includes JDK 21 to build our app
# The comment is now on its own line, which is correct.
FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Set the working directory
WORKDIR /build

# Copy the Maven project files
COPY pom.xml .
COPY src ./src

# Run the Maven build command to compile the code and create the JAR file
RUN mvn clean install -DskipTests


# --- STAGE 2: Create the Final, Lightweight Image with JRE 21 ---

# Use a lightweight JRE 21 image for the final application
# The comment is now on its own line, which is correct.
FROM openjdk:21-jre-slim

# Set the working directory
WORKDIR /app

# Copy ONLY the final JAR file from the 'builder' stage
COPY --from=builder /build/target/backend-1.0.0.jar app.jar

# Expose the port the application runs on
EXPOSE 8080

# The command to run when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]