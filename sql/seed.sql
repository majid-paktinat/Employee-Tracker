use employeetracker;

insert into employee(first_name, last_name, role_id, manager_id) values("Jackie", "Deckar", 17,null);
insert into employee(first_name, last_name, role_id, manager_id) values("Tamer", "Gala", 16,39);
insert into employee(first_name, last_name, role_id, manager_id) values("Alec", "Dier", 18,40);
insert into employee(first_name, last_name, role_id, manager_id) values("Don", "Green", 21,39);
insert into employee(first_name, last_name, role_id, manager_id) values("Steve", "Smith", 22,44);
insert into employee(first_name, last_name, role_id, manager_id) values("Melanie", "Gilbert", 22,39);




insert into role(title, salary, department_id) values("Web Development - Team Lead", "100", 9);
insert into role(title, salary, department_id) values("Business Analyst", "80", 10);
insert into role(title, salary, department_id) values("Juior Developer", "70", 9);
insert into role(title, salary, department_id) values("Finance Specialist", "85", 13);
insert into role(title, salary, department_id) values("Customer Service Agent", "55", 14);
insert into role(title, salary, department_id) values("Region Sales Specialist", "70", 11);
insert into role(title, salary, department_id) values("Branding Specialist", "65", 10);



insert into department(name) values("IT")
insert into department(name) values("Marketing")
insert into department(name) values("Sales")
insert into department(name) values("Procurement")
insert into department(name) values("Finance")
insert into department(name) values("Customer Relations")