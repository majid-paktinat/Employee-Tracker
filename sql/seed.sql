use employeetracker;

insert into employee(first_name, last_name, role_id, manager_id) values("Jared", "Deckar", 1,1);
insert into employee(first_name, last_name, role_id, manager_id) values("Tamer", "Gala", 2,3);
insert into employee(first_name, last_name, role_id, manager_id) values("Alec", "Dier", 4,2);
insert into employee(first_name, last_name, role_id, manager_id) values("Don", "Green", 3,4);
insert into employee(first_name, last_name, role_id, manager_id) values("Steve", "Smith", 5,1);


insert into role(title, salary, department_id) values("team lead", "100", 1);
insert into role(title, salary, department_id) values("business analyst", "80", 2);
insert into role(title, salary, department_id) values("juior developer", "70", 1);
insert into role(title, salary, department_id) values("DBA", "90", 1);
insert into role(title, salary, department_id) values("senior developer", "90", 1);


insert into department(name) values("IT")
insert into department(name) values("Marketing")
insert into department(name) values("Sales")
insert into department(name) values("Procurement")
insert into department(name) values("Customer Relations")