const express = require( "express" );
const bodyParser = require('body-parser');
const mysql = require( 'mysql' );

const PORT = 8080;
const app = express();

class Database {
    constructor( config ) {
        this.connection = mysql.createConnection( config );
    }
    query( sql, args=[] ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
  }

// at top INIT DB connection
const db = new Database({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "12345678",
    database: "employeetracker"
  });


// to serve static content from the 'html' directory
//app.use(express.static('html'));

// needed for POST FORM decoding
app.use(bodyParser.urlencoded({ extended: false }));

// app.listen(PORT, function() {
//     console.log(`App running on: http://localhost:${PORT}`);
// });

// initial sample data

let myTableList = [];
const selectQuery = `select 
                        emp.id, emp.first_name, emp.last_name, rol.title, rol.salary, dep.name as department, CONCAT(manager.first_name, " ", manager.last_name) as manager
                        from employee as emp 
                        inner join role as rol on emp.role_id = rol.id
                        inner join department as dep on rol.department_id = dep.id
                        inner join employee as manager on manager.id = emp.manager_id `
async function init(){
    try {
        myTableList = await db.query( selectQuery );
        console.log( `[init] starting up, found a table reservation file:`, myTableList );
        //console.table(myTableList, ["id", "first_name", "last_name", "role", "department"]);
        console.table(myTableList);
    } catch( e ){
        console.log( `Sorry had a problem with the database!` );
    }
};
init();
