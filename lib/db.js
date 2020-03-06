const mysql = require( 'mysql' );

let depList = [];
let manList = [];
let rolList = [];

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


async function initializer(){
    depList = await db.query( "SELECT * FROM department" ); // hatman id, name bayad bashe!
    manList = await db.query( "SELECT id, Concat(first_name, ' ', last_name) as name FROM employee"); // hatman id, name bayad bashe!
    rolList = await db.query( "SELECT id, title as name FROM role"); // hatman id, name bayad bashe!
    
}


module.exports = {
    
    database: db, // Normal variable 
    depList: () => depList, // getFunc() -- intori kardam chon 'pass by value' behave mikard va update ke mishod oonvar reflect nemikard!
    manList: () => manList, // getFunc()
    rolList: () => rolList, // getFunc()
    initializer // Normal Func

  }
