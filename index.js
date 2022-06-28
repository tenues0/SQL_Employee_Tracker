// Acceptance Criteria
// ----------------------------------------------------------------
// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids

// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database

// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database 

require('dotenv').config();
// need inquirer package for questions
const inquirer = require('inquirer');
// need File System library to use writeFile
const fs = require('fs');
// Import and require mysql2
// mysql2 will hepl to create a connection to the database
const mysql = require('mysql2');

// Using multipleStatements: true to enable multiple database queries
// https://stackoverflow.com/questions/23266854/node-mysql-multiple-statements-in-one-query
// Support for multiple statements is disabled for security reasons (it allows for SQL injection attacks if values are not properly escaped).
// How would I code in some security to cover for the multiple statements??????????

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: process.env.DB_USER,
      // TODO: Add MySQL password here
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true
    },
    console.log(`Connected to the employees_db database.`)
  );



// This function reruns the baseQuestion function after an answer is selected
const doMore = () => {
    inquirer.prompt([{
        type: 'confirm',
        name: 'continue',
        message: 'Would you like to do more?',
    }]).then(answer => {
        if (answer.continue) {
            // start the first question for the program over again
            baseQuestion();
        } else {
            console.log('Quit selected');
            process.exit(0);
        }
    });
};




// function for database questions
const baseQuestion = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'What would you like to do?',
            choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'quit'],
        },
    ]).then(answer => {
        console.log(answer);
        // do some more stuff with the answers
        if (answer.options === 'view all departments') {
            // print department table to the console
            db.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
                db.query(`SELECT * FROM department`, function (err, result) {
                  if (err) throw err;
                  console.table(result);
                    // rerun the baseQuestion function
                    doMore();
                });
              });
        }
        if (answer.options === 'view all roles') {
            db.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
                db.query(`SELECT * FROM role`, function (err, result) {
                  if (err) throw err;
                  console.table(result);
                    // rerun the baseQuestion function
                    doMore();
                });
              });
            }
        if (answer.options === 'view all employees') {
            db.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
                db.query(`SELECT * FROM employee`, function (err, result) {
                  if (err) throw err;
                  console.table(result);
                    // rerun the baseQuestion function
                    doMore();
                });
              });
        }
        if (answer.options === 'add a department') {
            addDepartment();
        }
        if (answer.options === 'add a role') {
            addRole();
        }
        if (answer.options === 'add an employee') {
            addEmployee();
        }
        if (answer.options === 'update an employee role') {
            updateEmployeeRole();
        }
        if (answer.options === 'quit') {
            console.log('Quit selected');
            process.exit(0);
        }
        // Do I need a catch all statement here? else if?
    });
};

// function for adding a department to the department table 
const addDepartment = () => {
    inquirer.prompt([{
        type: 'input',
        name: 'adding_new_department',
        message: 'What is the name of the department?',
    }]).then(answer => {
        console.log(answer);
        db.query(`INSERT INTO department (name) VALUES (?)`,[answer.adding_new_department],  function (err, result) {
            if (err) throw err;
              // rerun the baseQuestion function
              doMore();
        });
    });
};

// function for adding a role to the role table
const addRole = () => {
    const department_list = [];
        db.query(`SELECT name FROM department;`,  function (err, departments) {
          if (err) throw err;
          for (let i = 0; i < departments.length; i++) {
            department_list.push(departments[i].name);
          }
          console.log(department_list);
        });
    inquirer.prompt([
        {
        type: 'input',
        name: 'adding_new_role',
        message: 'What is the name of the new role?',
        },
        {
        type: 'input',
        name: 'adding_new_salary',
        message: 'What is the salary of the new role?',
        },
        {
        type: 'list',
        name: 'adding_role_to_department',
        message: 'What department does the role belong to?',
        choices: department_list,
        },
    ]).then(answer => {
        console.log(answer);
            db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,[answer.adding_new_role, answer.adding_new_salary, department_list.indexOf(answer.adding_role_to_department)+1],  function (err, result) {
              if (err) throw err;
              console.table(result);
                // rerun the baseQuestion function
                doMore();
            });
    });
};

const addEmployee = () => {
    const manager_list = [];
    const role_list = [];
        db.query(`SELECT title FROM role;`,  function (err, roles) {
          if (err) throw err;
          for (let i = 0; i < roles.length; i++) {
            role_list.push(roles[i].title);
          }
        //   console.log('\n', role_list);
        });
        // everyone can be a manager, so the manager list needs to be everyone from the start
        // if the employee turns out to be a manager, then their manager is set to NULL
        db.query(`SELECT first_name, last_name, id FROM employee;`, function (err, managers) {
            if (err) throw err;
            for (let j = 0; j < managers.length; j++) {
                // populating the array with the managers
                manager_list.push(managers[j].first_name + ' ' + managers[j].last_name + ', The employee\'s ID is:' + managers[j].id);
                // adding null to the list of choices for managers
                // manager_list.push('null');
            }
            // console.log('\n', manager_list);
        });
    inquirer.prompt([
        {
        type: 'input',
        name: 'first_name',
        message: 'What is the employee\'s first name?',
        },
        {
        type: 'input',
        name: 'last_name',
        message: 'What is the employee\'s last name?',
        },
        {
        type: 'list',
        name: 'adding_employee_role',
        message: 'What is the employee\'s role?',
        choices: role_list,
        },
        {
        type: 'list',
        name: 'adding_employees_manager',
        message: 'Who is the employee\'s manager?',
        choices: manager_list,
        },
    ]).then(answers => {
        console.log(answers);
            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
                [answers.first_name, answers.last_name, role_list.indexOf(answers.adding_employee_role)+1, manager_list.indexOf(answers.adding_employees_manager)+1],  function (err, result) {
              if (err) throw err;
              console.table(result);
                // rerun the baseQuestion function
                doMore();
            });
    });
};




// + ', Employee Role ID is:' + employees[k].role_id
// this funciton won't display choices for the user to select
const updateEmployeeRole = () => {
    const employee_list = [];
    const e_role_list = [];
    db.query(`SELECT first_name, last_name FROM employee;`, function (err, employees) {
        if (err) throw err;
        for (let k = 0; k < employees.length; k++) {
            employee_list.push(employees[k].first_name + ' ' + employees[k].last_name);
        }
        console.log('\n', employee_list);
        db.query(`SELECT title FROM role;`,  function (err, roles) {
          if (err) throw err;
          for (let i = 0; i < roles.length; i++) {
            e_role_list.push(roles[i].title);
          }
          console.log("****",employee_list)
          inquirer.prompt([
              {
                  type: 'list',
                  name: 'which_employee',
                  message: 'Which employee\'s role do you want to update?',
                  choices: employee_list,
              },
              {
                  type: 'list',
                  name: 'new_employee_role',
                  message: 'What is the employee\'s new role?',
                  choices: e_role_list,
              },
          ]).then(ans => {
              console.log(ans);
                  db.query(`UPDATE employee SET role_id = (role_id) WHERE id = (id)  VALUES (?, ?)`,
                      [e_role_list.indexOf(ans.new_employee_role)+1, employee_list.indexOf(ans.which_employee)+1],  function (err, result) {
                    if (err) throw err;
                    console.table(result);
                      // rerun the baseQuestion function
                      doMore();
                  });
          });
    });
    });

};

// call the baseQuestion function to start the program
baseQuestion();
