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


// need inquirer package for questions
const inquirer = require('inquirer');
// need File System library to use writeFile
const fs = require('fs');
// Import and require mysql2
// mysql2 will hepl to create a connection to the database
const mysql = require('mysql2');





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
            console.table(department);
            // rerun the baseQuestion function
            baseQuestion();
        }
        if (answer.options === 'view all roles') {
            console.table(role);
        }
        if (answer.options === 'view all employees') {
            console.table(employee);
        }
        if (answer.options === 'add a department') {
            // addDepartment();
        }
        if (answer.options === 'add a role') {
            // addRole();
        }
        if (answer.options === 'add a employee') {
            // addEmployee();
        }
        if (answer.options === 'update an employee role') {
            // updateEmployeeRole(employee);
        }
        if (answer.options === 'quit') {
            console.log('Quit selected');
            process.exit(0);
        }
    });
};

// call the baseQuestion function to start the program
baseQuestion();


// ????????????????
// How do I print the SQL tables out the the console?
// How do I connect with the SQL database?
