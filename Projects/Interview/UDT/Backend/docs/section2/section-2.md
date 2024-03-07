# Section 2: Database Design

## ERD

ERD for ecomerce backend, presented in [ERD](docs/section2/ERD.png).

I use dbdiagram.io to create the ERD. You can view the diagram [here](https://dbdiagram.io/d/ecomerce-6491d21202bd1c4a5ec9a3b7) or see the image below.

![ERD](docs/section2/ERD.png)

## Choose database

For this project, I choose to use MySQL as the database.

Reasons:
- MySQL is a popular database, so it has a lot of support and documentation.
- MySQL is open source, so it is free to use.
- This project is a small project, so MySQL is enough to handle the data.

MySQL strong and weak points:
- Strong points:
    - MySQL is easy to use.
    - MySQL is fast.
    - MySQL is secure.
    - MySQL is scalable.
    - MySQL is reliable.
- Weak points:
    - MySQL is not suitable for large databases.
    - MySQL is not suitable for complex queries.
    - MySQL is not suitable for complex data type like json.

## Dockerize MySQL

The docker-compose file for MySQL, presented in [docker-compose.yml](docs/section2/docker-compose.yml).

```yml
version: '3'

services:
  hmall-mysql:
    image: mysql:8.0
    container_name: hmall-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: mall
      MYSQL_USER: mall
      MYSQL_PASSWORD: secret
    ports:
      - 3306:3306


  hmall-redis:
    image: redis:6.2
    container_name: hmall-redis
    restart: always
    ports:
      - 6379:6379
```

Start the MySQL server with the command:

```sh
docker-compose up -d hmall-mysql
```

## Spring Boot Setup

The project can be found in my repository [hmall](https://github.com/vanhung4499/hmall).

I have presented basic information about the project in the README.md file.

The project is not completed yet, many modules are still in development.
Because of the time, I can't complete all business logic for some features!
