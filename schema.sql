DROP DATABASE IF EXISTS employee_DB;
CREATE database employee_DB;

USE employee_DB;


CREATE TABLE dept (
  dept_id INT NOT NULL AUTO_INCREMENT,
  dept VARCHAR(30) NULL,
  PRIMARY KEY (dept_id)
 

);

CREATE TABLE manager (
manager_id INT NOT NULL AUTO_INCREMENT,
  manager VARCHAR(30) NOT NULL,
  PRIMARY KEY (manager_id)

);
CREATE TABLE role (
  role_id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  dept_id INT NOT NULL,
  PRIMARY KEY (role_id),
  FOREIGN KEY (dept_id) REFERENCES dept (dept_id)
  

);

CREATE TABLE employee (
  employee_id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT (10) NULL,
  PRIMARY KEY (employee_id),
  FOREIGN KEY (role_id) REFERENCES role(role_id),
   FOREIGN KEY (manager_id) REFERENCES manager(manager_id)
);