const mongoose = require('mongoose');
require('dotenv').config();
const Assignment = require('./models/Assignment');
const connectDB = require('./config/db');
const pgPool = require('./config/pg');

const employeesTableSchema = `CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    department VARCHAR(100),
    salary DECIMAL(10, 2),
    hire_date DATE
);

INSERT INTO employees (name, department, salary, hire_date) VALUES
('Alice Johnson', 'Engineering', 85000.00, '2022-01-15'),
('Bob Smith', 'Marketing', 60000.00, '2021-06-20'),
('Charlie Brown', 'Engineering', 92000.00, '2020-03-10'),
('Diana Ross', 'HR', 55000.00, '2023-05-01'),
('Edward Norton', 'Engineering', 78000.00, '2022-11-12'),
('Fiona Apple', 'Marketing', 65000.00, '2021-02-28');`;

const projectsTableSchema = `CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    budget DECIMAL(12, 2)
);

INSERT INTO projects (name, budget) VALUES 
('Apollo', 500000.00), 
('Zeus', 250000.00), 
('Hermes', 120000.00),
('Athena', 300000.00);

CREATE TABLE employee_projects (
    employee_id INT REFERENCES employees(id),
    project_id INT REFERENCES projects(id)
);

INSERT INTO employee_projects (employee_id, project_id) VALUES
(1, 1), (3, 1), (1, 2), (5, 2), (2, 3);`;

const fullSchema = `${employeesTableSchema}\n\n${projectsTableSchema}`;

const initialAssignments = [
    {
        title: "1. Basic SELECT: All Columns",
        slug: "select-all-columns",
        description: "Retrieve every detail from the employees table.",
        difficulty: "Easy",
        question: "Select all columns and rows from the 'employees' table.",
        sampleDataSchema: employeesTableSchema,
        expectedResult: [
            { id: 1, name: 'Alice Johnson', department: 'Engineering', salary: '85000.00', hire_date: '2022-01-15T00:00:00.000Z' },
            { id: 2, name: 'Bob Smith', department: 'Marketing', salary: '60000.00', hire_date: '2021-06-20T00:00:00.000Z' },
            { id: 3, name: 'Charlie Brown', department: 'Engineering', salary: '92000.00', hire_date: '2020-03-10T00:00:00.000Z' },
            { id: 4, name: 'Diana Ross', department: 'HR', salary: '55000.00', hire_date: '2023-05-01T00:00:00.000Z' },
            { id: 5, name: 'Edward Norton', department: 'Engineering', salary: '78000.00', hire_date: '2022-11-12T00:00:00.000Z' },
            { id: 6, name: 'Fiona Apple', department: 'Marketing', salary: '65000.00', hire_date: '2021-02-28T00:00:00.000Z' }
        ]
    },
    {
        title: "2. Specific Columns: Name and Salary",
        slug: "select-specific-columns",
        description: "Learn to limit the data you retrieve.",
        difficulty: "Easy",
        question: "Select only the 'name' and 'salary' columns for all employees.",
        sampleDataSchema: employeesTableSchema,
        expectedResult: [
            { name: 'Alice Johnson', salary: '85000.00' },
            { name: 'Bob Smith', salary: '60000.00' },
            { name: 'Charlie Brown', salary: '92000.00' },
            { name: 'Diana Ross', salary: '55000.00' },
            { name: 'Edward Norton', salary: '78000.00' },
            { name: 'Fiona Apple', salary: '65000.00' }
        ]
    },
    {
        title: "3. Simple Filtering: WHERE Department",
        slug: "filter-by-department",
        description: "Filter rows using a condition.",
        difficulty: "Easy",
        question: "Select all columns for employees in the 'Marketing' department.",
        sampleDataSchema: employeesTableSchema,
        expectedResult: [
            { id: 2, name: 'Bob Smith', department: 'Marketing', salary: '60000.00', hire_date: '2021-06-20T00:00:00.000Z' },
            { id: 6, name: 'Fiona Apple', department: 'Marketing', salary: '65000.00', hire_date: '2021-02-28T00:00:00.000Z' }
        ]
    },
    {
        title: "4. Numeric Filtering: High Salary",
        slug: "filter-by-salary",
        description: "Use comparison operators.",
        difficulty: "Easy",
        question: "Select the names of employees with a salary greater than 80,000.",
        sampleDataSchema: employeesTableSchema,
        expectedResult: [
            { name: 'Alice Johnson' },
            { name: 'Charlie Brown' }
        ]
    },
    {
        title: "5. Compound Logic: AND Operator",
        slug: "compound-logic-and",
        description: "Combine multiple filters.",
        difficulty: "Easy",
        question: "Select names of employees in 'Engineering' who earn more than 80,000.",
        sampleDataSchema: employeesTableSchema,
        expectedResult: [
            { name: 'Alice Johnson' },
            { name: 'Charlie Brown' }
        ]
    },
    {
        title: "6. Text Patterns: LIKE Operator",
        slug: "text-pattern-like",
        description: "Searching for partial strings.",
        difficulty: "Easy",
        question: "Select all employees whose names start with the letter 'A'.",
        sampleDataSchema: employeesTableSchema,
        expectedResult: [
            { id: 1, name: 'Alice Johnson', department: 'Engineering', salary: '85000.00', hire_date: '2022-01-15T00:00:00.000Z' }
        ]
    },
    {
        title: "7. Sorting: ORDER BY Salary",
        slug: "sorting-results-salary",
        description: "Organize your data output.",
        difficulty: "Easy",
        question: "Select all employees ordered by salary in descending order (highest first).",
        sampleDataSchema: employeesTableSchema,
        expectedResult: [
            { id: 3, name: 'Charlie Brown', department: 'Engineering', salary: '92000.00', hire_date: '2020-03-10T00:00:00.000Z' },
            { id: 1, name: 'Alice Johnson', department: 'Engineering', salary: '85000.00', hire_date: '2022-01-15T00:00:00.000Z' },
            { id: 5, name: 'Edward Norton', department: 'Engineering', salary: '78000.00', hire_date: '2022-11-12T00:00:00.000Z' },
            { id: 6, name: 'Fiona Apple', department: 'Marketing', salary: '65000.00', hire_date: '2021-02-28T00:00:00.000Z' },
            { id: 2, name: 'Bob Smith', department: 'Marketing', salary: '60000.00', hire_date: '2021-06-20T00:00:00.000Z' },
            { id: 4, name: 'Diana Ross', department: 'HR', salary: '55000.00', hire_date: '2023-05-01T00:00:00.000Z' }
        ]
    },
    {
        title: "8. Aggregation: COUNT Employees",
        slug: "aggregation-count",
        description: "Counting records.",
        difficulty: "Easy",
        question: "Count the total number of employees in the company. Name the result 'total_count'.",
        sampleDataSchema: employeesTableSchema,
        expectedResult: [{ total_count: '6' }]
    },
    {
        title: "9. Grouping: COUNT by Department",
        slug: "grouping-count-dept",
        description: "Aggregating groups of data.",
        difficulty: "Medium",
        question: "Show the count of employees in each department. Returns 'department' and 'employee_count'.",
        sampleDataSchema: employeesTableSchema,
        expectedResult: [
            { department: 'Engineering', employee_count: '3' },
            { department: 'Marketing', employee_count: '2' },
            { department: 'HR', employee_count: '1' }
        ]
    },
    {
        title: "10. Math: AVERAGE Salary",
        slug: "aggregation-avg-salary",
        description: "Calculate averages.",
        difficulty: "Medium",
        question: "Calculate the average salary across the whole company. ROUND to 2 decimal places. Name it 'avg_salary'.",
        sampleDataSchema: employeesTableSchema,
        expectedResult: [{ avg_salary: '72500.00' }]
    },
    {
        title: "11. High Level Filtering: HAVING Clause",
        slug: "grouping-having",
        description: "Filter groups after aggregation.",
        difficulty: "Medium",
        question: "List departments that have more than 2 employees.",
        sampleDataSchema: employeesTableSchema,
        expectedResult: [{ department: 'Engineering' }]
    },
    {
        title: "12. Date Queries: Hire Year",
        slug: "date-filtering-extract",
        description: "Working with year/month data.",
        difficulty: "Medium",
        question: "Select names of employees hired in the year 2021.",
        sampleDataSchema: employeesTableSchema,
        expectedResult: [{ name: 'Bob Smith' }, { name: 'Fiona Apple' }]
    },
    {
        title: "13. Joins: Employees and Projects",
        slug: "joins-inner-basic",
        description: "Combining tables.",
        difficulty: "Medium",
        question: "Select employee names and the project names they are assigned to. Sort by employee name.",
        sampleDataSchema: fullSchema,
        expectedResult: [
            { name: 'Alice Johnson', name: 'Apollo' },
            { name: 'Alice Johnson', name: 'Zeus' },
            { name: 'Bob Smith', name: 'Hermes' },
            { name: 'Charlie Brown', name: 'Apollo' },
            { name: 'Edward Norton', name: 'Zeus' }
        ]
    },
    {
        title: "14. Set Operations: IN Subquery",
        slug: "subquery-in-basic",
        description: "Queries within queries.",
        difficulty: "Hard",
        question: "Find employees who are working on projects with a budget over 200,000.",
        sampleDataSchema: fullSchema,
        expectedResult: [{ name: 'Alice Johnson' }, { name: 'Charlie Brown' }, { name: 'Edward Norton' }]
    },
    {
        title: "15. Distinct Values: Departments",
        slug: "select-distinct-depts",
        description: "Find unique entries.",
        difficulty: "Easy",
        question: "List all unique department names in the company.",
        sampleDataSchema: employeesTableSchema,
        expectedResult: [{ department: 'Engineering' }, { department: 'Marketing' }, { department: 'HR' }]
    },
    {
        title: "16. Outer Joins: LEFT JOIN",
        slug: "joins-left-nulls",
        description: "Include records with no match.",
        difficulty: "Hard",
        question: "Select all employees and their project names. If an employee has no project, show NULL for project name.",
        sampleDataSchema: fullSchema,
        expectedResult: [
            { name: 'Alice Johnson', name: 'Apollo' },
            { name: 'Alice Johnson', name: 'Zeus' },
            { name: 'Bob Smith', name: 'Hermes' },
            { name: 'Charlie Brown', name: 'Apollo' },
            { name: 'Diana Ross', name: null },
            { name: 'Edward Norton', name: 'Zeus' },
            { name: 'Fiona Apple', name: null }
        ]
    },
    {
        title: "17. Conditional Logic: CASE Statement",
        slug: "logic-case-status",
        description: "Adding custom labels.",
        difficulty: "Hard",
        question: "Categorize salary: 'High' if > 80k, 'Medium' if > 60k, 'Low' otherwise. Return 'id', 'name', 'salary_bracket'.",
        sampleDataSchema: employeesTableSchema,
        expectedResult: [
            { id: 1, name: 'Alice Johnson', salary_bracket: 'High' },
            { id: 2, name: 'Bob Smith', salary_bracket: 'Low' },
            { id: 3, name: 'Charlie Brown', salary_bracket: 'High' },
            { id: 4, name: 'Diana Ross', salary_bracket: 'Low' },
            { id: 5, name: 'Edward Norton', salary_bracket: 'Medium' },
            { id: 6, name: 'Fiona Apple', salary_bracket: 'Medium' }
        ]
    },
    {
        title: "18. String Formatting: CONCAT",
        slug: "string-concat-label",
        description: "Format your text results.",
        difficulty: "Easy",
        question: "Return a single column 'info' that says: '[Name] works in [Department]'. Sort by id.",
        sampleDataSchema: employeesTableSchema,
        expectedResult: [
            { info: 'Alice Johnson works in Engineering' },
            { info: 'Bob Smith works in Marketing' },
            { info: 'Charlie Brown works in Engineering' },
            { info: 'Diana Ross works in HR' },
            { info: 'Edward Norton works in Engineering' },
            { info: 'Fiona Apple works in Marketing' }
        ]
    },
    {
        title: "19. Advanced Math: Salary Increase",
        slug: "math-expressions-calc",
        description: "Calculate values on the fly.",
        difficulty: "Medium",
        question: "Show employee ID and what their salary would be after a 10% raise. Name the column 'new_salary'.",
        sampleDataSchema: employeesTableSchema,
        expectedResult: [
            { id: 1, new_salary: '93500.00' },
            { id: 2, new_salary: '66000.00' },
            { id: 3, new_salary: '101200.00' },
            { id: 4, new_salary: '60500.00' },
            { id: 5, new_salary: '85800.00' },
            { id: 6, new_salary: '71500.00' }
        ]
    },
    {
        title: "20. Subquery: MAX Salary",
        slug: "subquery-max-global",
        description: "Find a specific record based on aggregate.",
        difficulty: "Hard",
        question: "Find the name of the highest-paid employee using a subquery.",
        sampleDataSchema: employeesTableSchema,
        expectedResult: [{ name: 'Charlie Brown' }]
    },
    {
        title: "21. Set Operations: UNION",
        slug: "set-op-union",
        description: "Combine multiple results.",
        difficulty: "Medium",
        question: "Combine the list of department names and project names into a single column 'title'. List Engineering, Marketing, HR, Apollo, Zeus, Hermes, Athena.",
        sampleDataSchema: fullSchema,
        expectedResult: [
            { title: 'Athena' }, { title: 'Apollo' }, { title: 'Engineering' },
            { title: 'HR' }, { title: 'Hermes' }, { title: 'Marketing' }, { title: 'Zeus' }
        ]
    },
    {
        title: "22. Complex Join: Total Project Cost",
        slug: "join-agg-complex",
        description: "Calculate sums across relationships.",
        difficulty: "Hard",
        question: "For each project, calculate the combined salary of all employees working on it. Return 'project_name', 'total_resources_cost'.",
        sampleDataSchema: fullSchema,
        expectedResult: [
            { project_name: 'Apollo', total_resources_cost: '177000.00' },
            { project_name: 'Hermes', total_resources_cost: '60000.00' },
            { project_name: 'Zeus', total_resources_cost: '163000.00' }
        ]
    }
];

const seedPG = async () => {
    console.log('Seeding PostgreSQL Sandbox...');
    const client = await pgPool.connect();
    try {
        await client.query('DROP TABLE IF EXISTS employee_projects CASCADE;');
        await client.query('DROP TABLE IF EXISTS projects CASCADE;');
        await client.query('DROP TABLE IF EXISTS employees CASCADE;');

        await client.query(`
            ${employeesTableSchema}
            ${projectsTableSchema}
        `);
        console.log('PostgreSQL Sandbox seeded successfully!');
    } catch (err) {
        console.error('Error seeding PostgreSQL:', err);
    } finally {
        client.release();
    }
};

const seedData = async () => {
    try {
        await connectDB();
        await Assignment.deleteMany();
        await Assignment.insertMany(initialAssignments);
        console.log('MongoDB Seed data inserted successfully!');

        await seedPG();

        console.log('All seeding completed!');
        process.exit();
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
