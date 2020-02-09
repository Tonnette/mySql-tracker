var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "souths81",
    database: "employeeDB"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View all Employees",
                "view all departments",
                "view all roles",
                "Add Employee",
                "Add role",
                "add department",
                "update employee roles"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View all Employees":
                    viewEmployees();
                    break;

                case "view all departments":
                    viewDepartments();
                    break;

                case "view all roles":
                    viewRoles();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Add role":
                    addRole();
                    break;

                case "add department":
                    addDepartment();
                    break;

                case "update employee roles":
                    updateEmployeeRole();
                    break;

            }
        });
}

function viewEmployees() {
    var query = "SELECT employee_id, first_name, last_name, title, salary, dept, manager FROM employee e ";
    query += "JOIN role r ON e.role_id=r.role_id JOIN manager m ";
    query += "ON e.manager_id=m.manager_id JOIN dept d ON r.dept_id=d.dept_id";

    connection.query(query, function (err, res) {
        console.table(res)

        start();
    })

}






