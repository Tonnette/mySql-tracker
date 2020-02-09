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

roleArray = ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Accountant", "Legal Team Lead", "Lawyer"];

deptArray = ["Sales", "Engineering", "Finance", "Legal"]
function start() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "Exit",
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

                case "Exit":
                    connection.end();
                    break;

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

function viewDepartments() {
    var query = "SELECT * FROM dept";
    connection.query(query, function (err, res) {
        console.table(res)
        start();
    })
}

function viewRoles() {
    var query = "SELECT role_id, title, salary, dept FROM role r ";
    query += "JOIN dept d ON r.dept_id=d.dept_id";
    connection.query(query, function (err, res) {
        console.table(res)
        start();
    })
}


function addEmployee() {
    const employeeQuestions = [
        {
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?"
        },
        {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name?"
        },
        {
            name: "role",
            type: "list",
            message: "What is the employee's role?",
            choices: roleArray
            // "Accountant", "Legal Team Lead", "Lawyer"]
            // validate: role()
        }
    ]


    inquirer.prompt(employeeQuestions)
        .then(function (answer) {
            for (var i = 0; i < roleArray.length; i++) {
                if (answer.role == roleArray[i]) {
                    var position = i + 1;
                    var query = "insert into employee set ?";
                    connection.query(query,
                        {
                            first_name: answer.first_name,
                            last_name: answer.last_name,
                            role_id: position

                        },
                        function (err, res) {
                            if (err) throw err;
                            console.log("employee added!");

                            start()
                        })
                }
            }
        });
}

function addRole() {
    inquirer
        .prompt([
            {
                name: "whatRole",
                type: "input",
                message: "What role do you want to add?",
                // validate: validateRole,

            },
            {
                name: "salary",
                type: "input",
                message: "What is this role's salary?"
            },
            {
                name: "department",
                type: "input",
                message: "What is the department of the role?"
            },

        ])

        .then(function (answer) {
            // roleArray.push(answer.whatRole);
            let greatestID = 1;
            for (var i = 0; i < deptArray.length; i++) {
                greatestID = deptArray.length
            }

            let deptId = greatestID + 1;
            console.log("what is deptID " + deptId)
            var query = "insert into dept set ?";
            connection.query(query,
                {
                    dept: answer.department,
                    dept_id: deptId

                },
            )
            var query = "insert into role set ?";
            connection.query(query,
                {
                    title: answer.whatRole,
                    salary: answer.salary,
                    dept_id: deptId

                },
                function (err, res) {
                    if (err) throw err;
                    console.log("role added!\n");
                    start();
                }
            )



        });
};


























