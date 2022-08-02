# BE Reminder

API Rest project using express(ES), mysql, nodemail + etherial.email, db-migrate, nodemon, and JWT

---
## Requirement
| Name    | Version    |
| ----------- | ------------- |
| MySQL  | v8.0.28    |
| Node     | v14.18.1  |
| Npm      | v6.14.15  |


## Installation

    $ git clone https://github.com/arifkhri/be-reminder/
    $ cd be-reminder
    $ npm i

## Credentials
> copy env.example to .env before installation
> set credential inside .env file

## Migration

    $ npm run dbl up

## Usage
- change .env.example to .env and configure it 
- create directory public/export/employee & public/picture/employee
## Running the project

    $ npm run start
    $ npm run watch:dev

---
### Todo:
- Import feature on a several list page
- Integration a notif 3rd party
- Background job for sending an email reminder
