# v9-bears-team-21
This project is titled Edugate. The idea behind this project centers around providing result management system to schools expecially high school around the globe.| Voyage-9 | https://chingu.io/

[![Build Status](https://travis-ci.org/chingu-voyages/v9-bears-team-21.svg?branch=develop)](https://travis-ci.org/chingu-voyages/v9-bears-team-21)
---
## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environement.

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
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###
### Yarn installation
  After installing node, this project will need yarn too, so just run the following command.

      $ npm install -g yarn

---

## Install

    $ git clone https://github.com/chingu-voyages/v9-bears-team-21
    $ cd v9-bears-team-21
    $ yarn install

## Technologies
    - Postgres
    - Express
    - React
    - Node
    - Redux

## Running the project

    $ yarn start

## Simple build for production

    $ yarn build


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
