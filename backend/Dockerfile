# Stage 1: Build the Spring Boot application using Maven
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy pom.xml first to take advantage of Docker layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and package application
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Lightweight JRE runtime container
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create a non-privileged user to run the app securely
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy compiled JAR
COPY --from=builder /app/target/*.jar app.jar

# Default port (Render overrides this with dynamic PORT environment variable)
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
