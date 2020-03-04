const mysql = require( 'mysql' );
const inquirer = require( 'inquirer' );

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

// async function listThumbnails(){
//     const myList = await db.query( "SELECT * FROM thumbnails ORDER BY id" );
//     return myList;
// }

// async function saveThumbnail( myPost ){
//     const myResult = await db.query( 
//         "INSERT INTO thumbnails (name,image_url,tags) VALUES(?,?,?)",
//         [ myPost.name, myPost.image_url, myPost.tags ] );
//     return myResult;
// }

// async function selectAll(){
//     const selectQuery = `select 
//                         emp.id, emp.first_name, emp.last_name, rol.title, rol.salary, dep.name as department, CONCAT(manager.first_name, " ", manager.last_name) as manager
//                         from employee as emp 
//                         inner join role as rol on emp.role_id = rol.id
//                         inner join department as dep on rol.department_id = dep.id
//                         inner join employee as manager on manager.id = emp.manager_id `

//                         async function init(){
//     try {
//         myList = await db.query( selectQuery );
//         console.log( `[init] starting up, found a table reservation file:`, myList );
//         //console.table(myTableList, ["id", "first_name", "last_name", "role", "department"]);
//         console.table(myList);
//     } catch( e ){
//         console.log( `Sorry had a problem with the database!` );
//     }

// }

// }

let depList = [];
let manList = [];
let rolList = [];


async function init(){
    const menu = await inquirer.prompt([
        { name: 'item', type: 'list', message: `What do you want to do ?\n`, choices: ["Add role", "Add employee", "Add department", "View role", "View employee", "View department", "Update role", "Update employee"], 'default': 'Add role'}
    ]);

    //console.log(menu.item);
    depList = await db.query( "SELECT * FROM department" );
    manList = await db.query( "SELECT id, Concat(first_name, ' ', last_name) as name FROM employee");
    rolList = await db.query( "SELECT id, title as name FROM role");
    console.log(manList);
    console.log(rolList);

    switch (menu.item) {
        case "Add role":
            const inq_answers_AR = await inquirer.prompt([
                { name: 'title', type: 'input', message: `What is the role's title ?\n`},
                { name: 'salary', type: 'input', message: `What is the role's salary?\n` },
                { name: 'department', type: 'list', choices: depList, message: `What is the role's department?\n`}
            ]);
            callMySqlDb( menu.item, inq_answers_AR ); break;
        
        case "Add employee":  
            const inq_answers_AE = await inquirer.prompt([
                { name: 'employeefname', type: 'input', message: `What is the employee's first name ?\n`},
                { name: 'employeelname', type: 'input', message: `What is the employee's last name?\n` },
                { name: 'employeerole', type: 'list', choices: rolList, message: `What is the employee's role?\n`},
                { name: 'employeemanager', type: 'list', choices: manList, message: `who is employee's manager?\n`}
            ]);
            callMySqlDb( menu.item, inq_answers_AE ); break;

        case "Add department" :
            const inq_answers_AD = await inquirer.prompt([
                { name: 'name', type: 'input', message: `What is the department's name ?\n`}
            ]);
            callMySqlDb( menu.item, inq_answers_AD ); break;
    }

}


    // try{
    //     //await writeFileAsync( "Team.html", html );
    //     await db.query( `insert into employee(first_name, last_name, role_id, manager_id) values("Jared", "Deckar", 1,1);` );
    //     console.log(employee);
    //     console.log("Successfully done!");
        
    // } catch (err) {
    //     console.log(err);
    // }


    async function callMySqlDb(action, item){

        try{
            switch (action) {
                        case "Add role": 
                                await db.query( "INSERT INTO role (title, salary, department_id) VALUES(?,?,?)", 
                                [ item.title, item.salary, depList.find(o => o.name === item.department).id] ); break;

                        case "Add employee":  
                                await db.query( "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)", 
                                [ item.employeefname, item.employeelname, rolList.find(o => o.name === item.employeerole).id, manList.find(o => o.name === item.employeemanager).id ] ); break;
                                
                        case "Add department" :
                                await db.query( "INSERT INTO department(name) VALUES(?)", 
                                [ item.name] );break;
                                

                    }
        }
        catch(err){
            console.log(err);
        }
        finally{
            db.close();
        console.log("db updated!");
        }
        
        
        
    }




init();

// convert addad be text va barax (when capture role and dep)