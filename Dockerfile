# Stage 1: Build the Spring Boot backend
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy backend pom.xml
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copy backend source code and package
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal JRE runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=builder /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
