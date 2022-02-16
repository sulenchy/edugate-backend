# Edugate-backend
This project is titled Edugate. The idea behind this project centers around providing result management system to schools expecially high school around the globe. Built at https://chingu.io/ Voyage-9

[![codecov](https://codecov.io/gh/sulenchy/edugate-backend/branch/main/graph/badge.svg?token=KMZVN08948)](https://codecov.io/gh/sulenchy/edugate-backend)
---
## Requirements

For development, you will only need Node.js version 10 and a node global package, npm, installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v10

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

## Install

    $ git clone https://github.com/chingu-voyages/v9-bears-team-21
    $ cd v9-bears-team-21
    $ ensure node version is 10
    $ add env variables(follow the .env-sample)
    $ npm install

## API Endpoints
| Verb            | Endpoint           | Description       |
|-----------------|--------------------|-------------------|
| GET             | /api/v1            | Home              |
| GET             | /api/v1/users/logout | Logout           |
| POST            | /api/v1/users/signup | Signup           |
| POST            | /api/v1/users/login | Login             |
| PATCH           | /api/v1/users/changePassword | Change Password |
| GET             | /api/v1/results | View Results |
| GET             | /api/v1/users/:query | Search for Users |
| PATCH           | /api/v1/users/update | Update Users |
| POST            | /api/v1/results/addresults | Add new results(Teacher) |
| PATCH           | /api/v1/results/update | Update results(Teacher) |
| GET             | /api/v1/results/toplevel | View results(Teacher) |
| DELETE          | /api/v1/results/delete | Delete results(Teacher) |
| POST            | /api/v1/schools/create | Create School(Admin) |
| DELETE          | /api/v1/users/delete | Delete users (Admin) |
| POST            | /api/v1/users/addusers | Add Students (Admin) |
| PATCH            | /api/v1/user/verify/ | Verifies users email |


## Running the project

    $ npm start

## Simple build for production

    $ npm build

## Technologies
    - Postgres
    - Express
    - Sequelize
    - Node
    - Mocha and Chai

