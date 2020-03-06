const inquirer = require( 'inquirer' );
const dbhandler = require( './db' );
const pressAnyKey = require('press-any-key');

let employeeCols = [];
let roleCols = [];

async function init(){
    console.clear();
    const menu = await inquirer.prompt([
        { name: 'item', type: 'list', message: `What do you want to do ?\n`, choices: ["Add role", "Add employee", "Add department", "View role", "View employee", "View department", "Update role", "Update employee", "* Exit *\n"], 'default': 'Add role'}
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
        
        case "Update employee" : 
            employeeCols = await findTableColumns('employee'); // console.log(employeeCols);
            destinationArr = arr_obj_To_arr(employeeCols); // console.log(destinationArr);
            choicesArr = destinationArr.filter(function checkAdult(el, index) { return (index > 0); });
            const inq_answers_UE = await inquirer.prompt([
                { name: 'colToUpdate', type: 'list', choices: choicesArr, message: `What do you want to update ?\n`}
            ]);
            break;
        case "Update role" : 
            choicesArr = await view('role', true);
            //console.log(choicesArr);
            const inq_answers_UR_record = await inquirer.prompt([
                { name: 'titleRecToUpdate', type: 'list', choices: choicesArr , message: `What do you want to update ?\n`}
            ]);
            //console.log(inq_answers_UR_record);
            
            roleCols = await findTableColumns('role'); // console.log(roleCols);
            destinationArr = arr_obj_To_arr(roleCols); // console.log(destinationArr);
            choicesArr = destinationArr.filter(function checkAdult(el, index) { return (index > 0); });

            const inq_answers_UR_column = await inquirer.prompt([
                { name: 'colNameToUpdate', type: 'list', choices: choicesArr , message: `Which field do you want to update ?\n`},
                { name: 'colValToUpdate', type: 'input', message: `Please provide value ?\n`}
            ]);
            //console.log(inq_answers_UR_column); 

            updateRecord(inq_answers_UR_record, inq_answers_UR_column);
            break;

        case "* Exit *\n" : console.log("Process is ended !"); process.exit();
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

async function view(entity, needReturn = false){
    let selectQuery;
    switch (entity) {
        case "role" : 
                // as 'name' is needed for 'choiceArr' inside the inquirer
                selectQuery = (needReturn) ? 
                `select rol.title as name, rol.salary, dep.name as department from role as rol 
                inner join department as dep on rol.department_id = dep.id` : 
                `select rol.title, rol.salary, dep.name as department from role as rol 
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
    }
    async function runQuery(){
        try {
            const myList = await  dbhandler.database.query( selectQuery );
            if (needReturn){ return myList; } else { console.table(myList); }
        } catch( e ){ console.log( `Sorry had a problem with the database!` ); }
    }
    try{ return await runQuery();} catch(e){console.log( `Sorry had a problem with the database!` );}
    finally{ if (!needReturn) pressAnyKeyFunc(); }
}

async function updateRecord(Record, Column){
    let selectQuery = ` UPDATE role SET ${Column.colNameToUpdate} = '${Column.colValToUpdate}' WHERE title = '${Record.titleRecToUpdate}'`;
        async function runQuery(){
            try {
                const myList = await dbhandler.database.query( selectQuery );
                return myList;
            } catch( e ){
                console.log( `Sorry had a problem with the database !` );
            }
        }
        try{ return await runQuery(); } catch(e){console.log( e );}
        finally{ console.log("database updated!"); pressAnyKeyFunc(); }
}

async function findTableColumns(entity){
let selectQuery = ` SELECT COLUMN_NAME
                        FROM INFORMATION_SCHEMA.COLUMNS
                        WHERE TABLE_NAME = '${entity}'`;
    async function runQuery(){
        try {
            const myList = await  dbhandler.database.query( selectQuery );
            return myList;
        } catch( e ){
            console.log( `Sorry had a problem with the database B!` );
        }
    }
    try{ return await runQuery(); } catch(e){console.log( `Sorry had a problem with the database C!` );}
}

function arr_obj_To_arr(sourceArr){
    let middleArr = sourceArr.map(obj => Object.values(obj));
    let desArr = [].concat.apply([], middleArr.map(obj => Object.values(obj)));
    return desArr;
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
