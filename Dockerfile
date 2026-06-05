FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app/backend

COPY backend/pom.xml ./
COPY backend/.mvn ./.mvn
COPY backend/mvnw ./

RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

COPY backend/src ./src

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/backend/target/backend-0.0.1-SNAPSHOT.jar app.jar

ENV PORT=10000
EXPOSE 10000

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
