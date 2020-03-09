const inquirer = require( 'inquirer' );
const dbhandler = require( './lib/db' );
const util = require( './lib/util' );

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

            choicesArr = await view('employee', true); //console.log(choicesArr);
            const inq_answers_UE_record = await inquirer.prompt([
                { name: 'empRecToUpdate', type: 'list', choices: choicesArr , message: `Which employee do you want to update ?\n`}
            ]);
            //console.log(inq_answers_UE_record);

            employeeCols = await findTableColumns('employee'); //console.log(employeeCols);
            destinationArr = util.arr_obj_To_arr(employeeCols); //console.log(destinationArr);
            choicesArr = destinationArr.filter(function checkAdult(el, index) { return (index != 1 && index < destinationArr.length-2); });
            choicesArr.push("role name");
            choicesArr.push("manager name");

            const inq_answers_UE_column = await inquirer.prompt([
                { name: 'colNameToUpdate', type: 'list', choices: choicesArr , message: `Which field do you want to update ?\n`},
                { name: 'colValToUpdate', type: 'list', choices: await view('role', true), message: `Please select new role ?\n`, 'when': (inq_answers_UE_column) => inq_answers_UE_column.colNameToUpdate === 'role name' },
                { name: 'colValToUpdate', type: 'list', choices: await view('employee', true), message: `Please select new manager ?\n`, 'when': (inq_answers_UE_column) => inq_answers_UE_column.colNameToUpdate === 'manager name' },
                { name: 'colValToUpdate', type: 'input', message: `Please provide value ?\n`, 'when': (inq_answers_UE_column) => (inq_answers_UE_column.colNameToUpdate !== 'role name' && inq_answers_UE_column.colNameToUpdate !== 'manager name') }
            ]);
            //console.log(inq_answers_UE_column); 
            updateDatabaseUE(inq_answers_UE_record, inq_answers_UE_column);
            break;
;

        case "Update role" : 
            choicesArr = await view('role', true); //console.log(choicesArr);
            const inq_answers_UR_record = await inquirer.prompt([
                { name: 'roleRecToUpdate', type: 'list', choices: choicesArr , message: `Which role do you want to update ?\n`}
            ]);
            // console.log(inq_answers_UR_record);
            
            roleCols = await findTableColumns('role'); //console.log(roleCols);
            destinationArr = util.arr_obj_To_arr(roleCols); //console.log(destinationArr);
            choicesArr = destinationArr.filter(function checkAdult(el, index) { return (index > 1); });
            choicesArr.push("department name");

            const inq_answers_UR_column = await inquirer.prompt([
                { name: 'colNameToUpdate', type: 'list', choices: choicesArr , message: `Which field do you want to update ?\n`},
                { name: 'colValToUpdate', type: 'list', choices: await view('department', true), message: `Please select new department ?\n`, 'when': (inq_answers_UR_column) => inq_answers_UR_column.colNameToUpdate === 'department name' },
                { name: 'colValToUpdate', type: 'input', message: `Please provide value ?\n`, 'when': (inq_answers_UR_column) => inq_answers_UR_column.colNameToUpdate !== 'department name' }
            ]);
            // console.log(inq_answers_UR_column); 

            updateDatabase(inq_answers_UR_record, inq_answers_UR_column);
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
    catch(err){ console.log(err); }
    finally{ console.log("database updated!"); util.pressAnyKeyFunc(init); }
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
                selectQuery = (needReturn) ?
                            `select CONCAT(first_name, " ", last_name) as name from employee` : 
                            `select 
                            emp.id, emp.first_name, emp.last_name, rol.title, rol.salary, dep.name as department, CONCAT(manager.first_name, " ", manager.last_name) as manager
                            from employee as emp 
                            inner join role as rol on emp.role_id = rol.id
                            inner join department as dep on rol.department_id = dep.id
                            left join employee as manager on manager.id = emp.manager_id`;
                break;
        case "department" : 
                selectQuery = (needReturn) ? `select name from department` : `select * from department`; 
                break;                
    }
    async function runQuery(){
        try {
            const myList = await  dbhandler.database.query( selectQuery );
            if (needReturn){ return myList; } else { console.table(myList); }
        } catch( e ){ console.log( `database had problem!` ); }
    }
    try{ return await runQuery();} catch(e){console.log( `A database problem !` );}
    finally{ if (!needReturn) util.pressAnyKeyFunc(init); }
}

async function updateDatabase(Record, Column){
    let selectQuery = ` UPDATE role SET ${Column.colNameToUpdate} = '${Column.colValToUpdate}' WHERE title = '${Record.roleRecToUpdate}'`;
    
    if (Column.colNameToUpdate=='department name'){
        myId = await dbhandler.database.query( `select id from department where name='${Column.colValToUpdate}'` ); 
        selectQuery = `UPDATE role SET department_id = ${util.arr_obj_To_arr(myId)[0]} WHERE title = '${Record.roleRecToUpdate}'`;
    }

    async function runQuery(){
        try {
            const myList = await dbhandler.database.query( selectQuery );
            return myList;
        } catch( e ){
            console.log( `Sorry had a problem with the database !` );
        }
    }
    try{ return await runQuery(); } catch(e){console.log( e );}
    finally{ console.log("database updated!"); util.pressAnyKeyFunc(init); }
}



async function updateDatabaseUE(Record, Column){
/*
    { colNameToUpdate: 'first_name', colValToUpdate: 'new name' }
    { colNameToUpdate: 'last_name', colValToUpdate: 'new name' }
    { colNameToUpdate: 'role name', colValToUpdate: 'Test Role' }
    { colNameToUpdate: 'manager name', colValToUpdate: 'majid paktinat' }
            
*/

let selectQuery = ` UPDATE employee SET ${Column.colNameToUpdate} = '${Column.colValToUpdate}' WHERE CONCAT(first_name ," ", last_name) = '${Record.empRecToUpdate}'`;
if (Column.colNameToUpdate=='role name'){
    myId = await dbhandler.database.query( `select id from role where title='${Column.colValToUpdate}'` ); 
    selectQuery = `UPDATE employee SET role_id = ${util.arr_obj_To_arr(myId)[0]} WHERE CONCAT(first_name ," ", last_name) = '${Record.empRecToUpdate}'`;
} else if (Column.colNameToUpdate=='manager name'){
    myId = await dbhandler.database.query( `select id from employee where CONCAT(first_name ," ", last_name) = '${Column.colValToUpdate}'` ); 
    selectQuery = `UPDATE employee SET manager_id = ${util.arr_obj_To_arr(myId)[0]} WHERE CONCAT(first_name ," ", last_name) = '${Record.empRecToUpdate}'`;
}

async function runQuery(){
    try {
        const myList = await dbhandler.database.query( selectQuery );
        return myList;
    } catch( e ){
        console.log( `Sorry had a problem with the database !` );
    }
}
try{ return await runQuery(); } catch(e){console.log( e );}
finally{ console.log("database updated!"); util.pressAnyKeyFunc(init); }
}


async function findTableColumns(entity){
let selectQuery = ` SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${entity}'`;
    async function runQuery(){
        try {
            const myList = await  dbhandler.database.query( selectQuery );
            return myList;
        } catch( e ){ console.log( `problem with the database !` );}
    }
    try{ return await runQuery(); } catch(e){console.log( `Sorry... database had a problem!` );}
}

init();
