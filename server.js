const inquirer = require( 'inquirer' );
const dbhandler = require( './db' );
const pressAnyKey = require('press-any-key');


async function init(){
    console.clear();
    const menu = await inquirer.prompt([
        { name: 'item', type: 'list', message: `What do you want to do ?\n`, choices: ["Add role", "Add employee", "Add department", "View role", "View employee", "View department", "Update role", "Update employee", "Exit"], 'default': 'Add role'}
    ]);
    
    await dbhandler.initializer(); // await call shode chon ghable esmesh async darim va khodesh ham promise return mikone!

    switch (menu.item) {
        case "Add role":
            const inq_answers_AR = await inquirer.prompt([
                { name: 'title', type: 'input', message: `What is the role's title ?\n`},
                { name: 'salary', type: 'input', message: `What is the role's salary?\n` },
                { name: 'department', type: 'list', choices: dbhandler.depList(), message: `What is the role's department?\n`}
            ]);
            addToDatabase( menu.item, inq_answers_AR ); break;
        
        case "Add employee":  
            const inq_answers_AE = await inquirer.prompt([
                { name: 'employeefname', type: 'input', message: `What is the employee's first name ?\n`},
                { name: 'employeelname', type: 'input', message: `What is the employee's last name?\n` },
                { name: 'employeerole', type: 'list', choices: dbhandler.rolList(), message: `What is the employee's role?\n`},
                { name: 'employeemanager', type: 'list', choices: dbhandler.manList(), message: `who is employee's manager?\n`}
            ]);
            addToDatabase( menu.item, inq_answers_AE ); break;

        case "Add department" :
            const inq_answers_AD = await inquirer.prompt([
                { name: 'name', type: 'input', message: `What is the department's name ?\n`}
            ]);
            addToDatabase( menu.item, inq_answers_AD ); break;

        case "View role" : view('role'); break;
        case "View employee" : view('employee'); break;
        case "View department" : view('department'); break;
        

        case "Exit" : process.exit();

    }
}

async function addToDatabase(action, item){
    try{
        switch (action) {
                    case "Add role": 
                            await dbhandler.database.query( "INSERT INTO role (title, salary, department_id) VALUES(?,?,?)", 
                            [ item.title, item.salary, dbhandler.depList().find(o => o.name === item.department).id] ); break;

                    case "Add employee":  
                            await dbhandler.database.query( "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)", 
                            [ item.employeefname, item.employeelname, dbhandler.rolList().find(o => o.name === item.employeerole).id, dbhandler.manList().find(o => o.name === item.employeemanager).id ] ); break;
                            
                    case "Add department" :
                            await dbhandler.database.query( "INSERT INTO department(name) VALUES(?)", 
                            [ item.name] );break;
                            

                }
    }
    catch(err){ console.log(err);}
    finally{
        console.log("database updated!");
        pressAnyKeyFunc();
    }

}

async function view(entity){
    let selectQuery;
    switch (entity) {
        case "role" : 
                selectQuery = `select rol.title, rol.salary, dep.name as department 
                from role as rol 
                inner join department as dep on rol.department_id = dep.id`; 
                break;
        case "employee" : 
                selectQuery = `select 
                                    emp.id, emp.first_name, emp.last_name, rol.title, rol.salary, dep.name as department, CONCAT(manager.first_name, " ", manager.last_name) as manager
                                    from employee as emp 
                                    inner join role as rol on emp.role_id = rol.id
                                    inner join department as dep on rol.department_id = dep.id
                                    inner join employee as manager on manager.id = emp.manager_id`;
                break;
        case "department" : 
                selectQuery = `select * from department`;
                break;

    }
    async function runQuery(){
        try {
            const myList = await  dbhandler.database.query( selectQuery );
            console.table(myList);
            return myList;
        } catch( e ){
            console.log( `Sorry had a problem with the database!` );
        }
    }

    try{ await runQuery();} catch(e){console.log( `Sorry had a problem with the database!` );}
    finally{pressAnyKeyFunc();}

}




function pressAnyKeyFunc(){
	pressAnyKey("Press any key to resolve, or CTRL+C to exit", {
		ctrlC: "reject"
		})
		.then(() => {
			init();
		})
		.catch(() => {
            console.log('You pressed CTRL+C')
            dbhandler.database.close(); 
	  })
}

init();
