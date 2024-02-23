# Northcoders News API

## Link

Link to hosted version: https://nc-news-94l5.onrender.com 

## Overview

The intention of this project is to mimic the building of a real world backend service (such as GitHub) which should provide this information to the front end architecture.
This project uses `Node.js` and `PostgreSQL` to build a backend database and associated API. After recieving requests from clients using various endpoints, the app responds with the required data from the databases.


## Minimum version requirements

>These are minimum versions of the dependencies needed to run this project:
>* `Node.js:` v21.1.0
>* `Postgres (PostgreSQL):` 14.9
>

### Navigation:
1. [Cloning the repository](#1-cloning-the-repository)
2. [Installing necassary dependencies](#2-installing-necassary-dependencies)
3. [Connecting to the databases](#3-connecting-to-the-databases)
4. [Seeding the local databases](#4-seeding-the-local-databases)
5. [Running the tests](#5-running-the-tests)

## 1. Cloning the repository

Clone the repository:

```
$ git clone https://github.com/emlips/nc-news.git
```

Then navigate to the repository.


## 2. Installing necassary dependencies:

Use the `npm install` command to install the dependencies in the `package.json` file:

```
$ npm install
```

## 3. Connecting to the databases:

### 1. Create a .env.development file in the project root for development: ###

To configure the database for for development, copy the following into newly created `.env.development` file:

```
PGDATABASE=nc_news
```

### 2. Create a `` file in the project root for testing: ###

To configure the database for testing, copy the following into a newly created .`.env.test` file:

```
PGDATABASE=nc_news_test
```

## 4. Seeding the local databases:

The project includes the following npm scripts to setup and seed the databases locally:

- To **create** the databases:

```
$ npm run setup-dbs
```

- To **seed** the databases:

```
$ npm run seed
```

## 5. Running the tests:

Run all test suites using the following script:

```
$ npm run test
```

**or**

```
npm t
```

