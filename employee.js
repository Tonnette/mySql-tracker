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
    database: "employee_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

// roleArray = ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Accountant", "Legal Team Lead", "Lawyer"];
// deptArray = ["Sales", "Engineering", "Finance", "Legal"]
managerArray = [];
deptArray = [];
roleArray = [];
newRoleArray = [];
newDeptArray = [];
addDeptArray = [];


// const validateRole = async (whatRole) => {
//     if (whatRole == "Sales Lead" || whatRole == "Salesperson" || whatRole == "Lead Engineer" || whatRole == "Software Engineer" || whatRole == "Accountant" || whatRole == "Legal Team Lead" || whatRole == "Lawyer") {
//         return 'Role already exists';
//     }
//     else {
//         return true;
//     }
// }


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
                "Add department",
                "update employee roles",
                "update employee's manager",
                "delete a department",
                "delete a role",
                "delete an employee"
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

                case "Add department":
                    addDept();
                    break;

                case "update employee roles":
                    updateEmployeeRole();
                    break;

                case "update employee's manager":
                    updateEmployeeManager();
                    break;

                case "delete a department":
                    deleteDept();
                    break;

                case "delete a role":
                    deleteRole();
                    break;

                case "delete an employee":
                    deleteEmployee();
                    break;

                case "Exit":
                    connection.end();
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


function addDept() {
    const deptQuestion = [
        {
            name: "add_dept",
            type: "input",
            message: "What is the name of the department you want to add?"
        }
    ]
    inquirer.prompt(deptQuestion)
        .then(function (answer) {
            let query = "insert into dept set ?";
            connection.query(query,

                {
                    dept: answer.add_dept

                },
                function (err, res) {

                    if (err) throw err;
                    console.log("role added!");

                    start()

                })



        })





}

function addEmployee() {
    let query = "select role_id, title from role";
    connection.query(query, function (err, res) {
        if (err) throw err;

        res.forEach(database => {
            roleArray.push(database.title)

        }
        )

    })

    let managerQuery = "select manager_id, manager from manager";
    connection.query(managerQuery, function (err, res) {
        if (err) throw err;

        res.forEach(database => {
            managerArray.push(database.manager)

        })

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
            },
            {
                name: "manager",
                type: "list",
                message: "Who is their manager?",
                choices: managerArray
                // "Accountant", "Legal Team Lead", "Lawyer"]
                // validate: role()
            }
        ]


        inquirer.prompt(employeeQuestions)
            .then(function (answer) {
                let query = "select manager_id, manager from manager";
                connection.query(query, function (err, res) {
                    if (err) throw err;

                    res.forEach(database => {
                        if (answer.manager === database.manager) {
                            managerid = database.manager_id;
                        } else if (answer.manager == "null") {
                            managerid = 1;
                        }

                    })

                    let query = "select role_id, title from role";
                    connection.query(query, function (err, res) {
                        if (err) throw err;

                        res.forEach(database => {
                            if (answer.role == database.title) {
                                databasePos = database.role_id;

                            }
                        })
                        var query = "insert into employee set ?";
                        connection.query(query,
                            {
                                first_name: answer.first_name,
                                last_name: answer.last_name,
                                role_id: databasePos,
                                manager_id: managerid

                            },
                            function (err, res) {

                                if (err) throw err;
                                console.log("employee added!");

                                start()

                            })

                    })
                })

            })

    })
}

const roleQuestion = [
    {
        name: "whatRole",
        type: "input",
        message: "What role do you want to add?"
        // validate: validateRole,

    }
];

const nextRoleQuests = [
    {
        name: "salary",
        type: "input",
        message: "What is this role's salary?"
    },
    {
        name: "department",
        type: "rawlist",
        message: "What is the department of the role?",
        choices: deptArray
    }
]

function addRole() {
    let query = "select dept_id, dept.dept from dept";
    connection.query(query, function (err, res) {
        if (err) throw err;

        res.forEach(database => {
            deptArray.push(database.dept)

        })
        console.log("what is deptArray" + deptArray)

        inquirer.prompt(roleQuestion)
            .then((answer) => {
                let query = "select role_id, role.title from role";
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    // const dataRoleArray = [];
                    var roleTitle = answer.whatRole

                    res.forEach(databaseRole => {
                        newRoleArray.push(databaseRole.title)

                    })

                    for (var i = 0; i < newRoleArray.length; i++) {
                        if (answer.whatRole == newRoleArray[i]) {

                            console.log("role already exists. Try again!")
                            start();
                            return;
                        }
                    }


                    inquirer.prompt(nextRoleQuests)
                        .then((answer) => {
                            var query = "Select dept_id, dept.dept from dept";
                            connection.query(query, function (err, res) {
                                if (err) throw err;


                                res.forEach(databaseRole => {
                                    if (answer.department === databaseRole.dept) {
                                        // whatIsID = databaseRole.dept_id;
                                        console.log("whats the id" + databaseRole.dept_id)
                                        foundRoleID = databaseRole.dept_id
                                    }

                                })

                                var query = "insert into role set ?";
                                connection.query(query,
                                    {
                                        title: roleTitle,
                                        salary: answer.salary,
                                        dept_id: foundRoleID

                                    },

                                    function (err, res) {

                                        if (err) throw err;
                                        console.log("role added!\n");
                                        start();
                                    }
                                )
                            })
                        })
                })
            })
    })
}

var employeeFirstNameArray = [];
var employeeArray = [];
var employeeRoleIdArray = [];
var roleIdNum = [];

function updateEmployeeRole() {
    let query = "select dept_id, dept from dept";
    connection.query(query, function (err, res) {
        if (err) throw err;
        const newDeptArray = [];

        res.forEach(database => {
            newDeptArray.push(database.dept)
        })


        var query = "SELECT employee_id, first_name, last_name, role_id FROM employee e ";
        connection.query(query, function (err, res) {
            if (err) throw err;

            connection.query(query, function (err, res) {
                if (err) throw err;

                res.forEach(database => {
                    employeeArray.push(`${database.first_name} ${database.last_name}`)
                    employeeRoleIdArray.push(`${database.role_id}`)
                    employeeFirstNameArray.push(`${database.first_name}`)
                })

                const updateEmployeeRoleQuests = [
                    {
                        name: "who",
                        type: "rawlist",
                        message: "Whose role do you want to update?",
                        choices: employeeArray

                    },
                ]
                const roleUpdate = [
                    {
                        name: "whatRoleNow",
                        type: "input",
                        message: "What role are they now?",
                    },
                    {
                        name: "whatSalaryNow",
                        type: "input",
                        message: "What is their new salary?",

                    },

                    {
                        name: "whatDeptNow",
                        type: "rawlist",
                        message: "What is the department of the role?",
                        choices: newDeptArray

                    }


                ]

                inquirer.prompt(updateEmployeeRoleQuests)
                    .then((answer) => {
                        // console.log("what is the array? " + employeeArray)
                        console.log("you want to update " + answer.who)
                        chosenName = answer.who
                        // console.log("chosen anem " + chosenName)
                        // console.log("array " + employeeFirstNameArray)
                        connection.query(query, function (err, res) {
                            if (err) throw err;

                            res.forEach(database => {
                                var bothNames = database.first_name + " " + database.last_name;
                                // console.log(bothNames)
                                if (bothNames == chosenName) {
                                    // console.log(bothNames + " " + database.role_id)

                                    var query = "SELECT role_id, title FROM role";
                                    connection.query(query, function (err, res) {
                                        if (err) throw err;

                                        res.forEach(databaseRole => {
                                            if (database.role_id == databaseRole.role_id) {
                                                roleIdNum.push(databaseRole.role_id);
                                                console.log(chosenName + "'s role is " + databaseRole.title)
                                            }

                                        })
                                        inquirer.prompt(roleUpdate)
                                            .then((answer) => {
                                                let query = "select dept_id, dept from dept";
                                                connection.query(query, function (err, res) {
                                                    if (err) throw err;

                                                    res.forEach(databaseDept => {
                                                        newDeptArray.push(databaseDept.dept)
                                                        if (answer.whatDeptNow === databaseDept.dept) {
                                                            console.log("what's the id? " + databaseDept.dept_id)
                                                            foundRoleID = databaseDept.dept_id
                                                        }


                                                    })
                                                    var nextquery = "UPDATE role SET ? WHERE ? ";
                                                    connection.query(nextquery,
                                                        [
                                                            {
                                                                title: answer.whatRoleNow,
                                                                salary: answer.whatSalaryNow,
                                                                dept_id: foundRoleID


                                                            },
                                                            {
                                                                role_id: roleIdNum
                                                            }
                                                        ],
                                                        function (err, res) {

                                                            if (err) throw err;
                                                            console.log("role updated!\n");
                                                            start();
                                                        }
                                                    )
                                                })

                                            })
                                    }

                                    )
                                }

                            })

                        })
                    })
            })
        })
    })
}
var managerEmployeeArray = [];
var newManagerArray = [];
var grabRoleId = [];
var grabFirstName = [];
var foundManagerId = [];
var EmployeeBothNames = []

function updateEmployeeManager() {
    let query = "select manager_id, manager from manager";
    connection.query(query, function (err, res) {
        if (err) throw err;

        res.forEach(database => {
            newManagerArray.push(database.manager)
        })

        var query = "SELECT employee_id, first_name, last_name, role_id FROM employee e ";
        connection.query(query, function (err, res) {
            if (err) throw err;

            connection.query(query, function (err, res) {
                if (err) throw err;

                res.forEach(database => {
                    managerEmployeeArray.push(`${database.first_name} ${database.last_name}`)
                })

                const managerQuestions = [
                    {
                        name: "who",
                        type: "rawlist",
                        message: "Whose manager do you want to update?",
                        choices: managerEmployeeArray

                    },
                    {
                        name: "newManager",
                        type: "rawlist",
                        message: "Who is their new manager?",
                        choices: newManagerArray

                    }

                ]
                inquirer.prompt(managerQuestions)
                    .then((answer) => {
                        let query = "select manager_id, manager from manager";
                        connection.query(query, function (err, res) {
                            if (err) throw err;

                            res.forEach(database => {
                                if (answer.newManager === database.manager) {
                                    foundManagerId.push(database.manager_id)
                                }


                            })
                        })

                        let EmployeeQuery = "select first_name, last_name, manager_id from employee";
                        connection.query(EmployeeQuery, function (err, res) {
                            if (err) throw err;

                            chosenName = answer.who

                            connection.query(EmployeeQuery, function (err, res) {
                                if (err) throw err;

                                res.forEach(database => {
                                    var bothNames = database.first_name + " " + database.last_name;
                                    // console.log(bothNames)
                                    if (bothNames == chosenName) {
                                        firstnameIs = database.first_name;
                                        // console.log(firstnameIs)
                                        grabFirstName.push(firstnameIs)




                                    }




                                })
                                console.log("what is first name? " + firstnameIs)

                                var nextquery = "UPDATE employee SET ? WHERE ?";
                                connection.query(nextquery,
                                    [
                                        {
                                            manager_id: foundManagerId

                                        },
                                        {

                                            first_name: firstnameIs
                                        }


                                    ],

                                    function (err, res) {

                                        if (err) throw err;
                                        console.log("Manager updated!\n");
                                        start();
                                    }
                                )



                            })
                        })

                    })
            })
        })
    })

}
var deleteDeptArray = [];

function deleteDept() {
    let query = "select dept_id, dept from dept";
    connection.query(query, function (err, res) {
        if (err) throw err;

        res.forEach(database => {
            deleteDeptArray.push(database.dept)

        })

        const deleteDeptQuestion = [
            {
                name: "whichDept",
                type: "rawlist",
                message: "Which dept do you want to delete?",
                choices: deleteDeptArray

            }
        ]

        inquirer.prompt(deleteDeptQuestion)
            .then((answer) => {
                var query = "DELETE FROM dept WHERE ?";
                connection.query(query,
                    [
                        {
                            dept: answer.whichDept

                        },
                    ],

                    function (err, res) {

                        if (err) throw err;
                        console.log("Department deleted!\n");
                        start();
                    }
                )
            })

    })

}
var deleteRoleArray = [];

function deleteRole() {
    let query = "select role_id, title from role";
    connection.query(query, function (err, res) {
        if (err) throw err;

        res.forEach(database => {
            deleteRoleArray.push(database.title)

        })

        const deleteRoleQuestion = [
            {
                name: "whichRole",
                type: "rawlist",
                message: "Which role do you want to delete?",
                choices: deleteRoleArray

            }
        ]

        inquirer.prompt(deleteRoleQuestion)
            .then((answer) => {
                var query = "DELETE FROM role WHERE ?";
                connection.query(query,
                    [
                        {
                            title: answer.whichRole

                        },
                    ],

                    function (err, res) {

                        if (err) throw err;
                        console.log("Role deleted!\n");
                        start();
                    }
                )
            })

    })

}
var deleteNamesBoth = [];
var deleteNamesFirst = [];

function deleteEmployee() {
    let query = "select employee_id, first_name, last_name from employee";
    connection.query(query, function (err, res) {
        if (err) throw err;

        connection.query(query, function (err, res) {
            if (err) throw err;

            res.forEach(database => {
                deleteNamesBoth.push(`${database.first_name} ${database.last_name}`)
            })

            const deleteRoleQuestion = [
                {
                    name: "whoDelete",
                    type: "rawlist",
                    message: "Which role do you want to delete?",
                    choices: deleteNamesBoth

                }
            ]

            inquirer.prompt(deleteRoleQuestion)
                .then((answer) => {
                    let EmployeeQuery = "select first_name, last_name from employee";
                    connection.query(EmployeeQuery, function (err, res) {
                        if (err) throw err;

                        chosenName = answer.whoDelete;

                        connection.query(EmployeeQuery, function (err, res) {
                            if (err) throw err;

                            res.forEach(database => {
                                var bothNames = database.first_name + " " + database.last_name;
                                // console.log(bothNames)
                                if (bothNames == chosenName) {
                                    firstnameIs = database.first_name;
                                }

                            })
                            console.log("what is first name? " + firstnameIs)
                                var query = "DELETE FROM employee WHERE ?";
                                connection.query(query,
                                    [
                                        {
                                            first_name: firstnameIs

                                        },
                                    ],

                                    function (err, res) {

                                        if (err) throw err;
                                        console.log("Employee deleted!\n");
                                        start();
                                    }
                                )
                            })




                        

                    })

                })
        })

    })
} 