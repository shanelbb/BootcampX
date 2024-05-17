const { Pool } = require("pg");
const cohortName = process.argv[2];
const limit = process.argv[3] || 5;
const args = [`%${cohortName}%`, limit];

const pool = new Pool({
  user: "development",
  password: "development",
  host: "localhost",
  database: "bootcampx",
  port: 5432,
});

const queryString = `
SELECT DISTINCT teachers.name as teacher, cohorts.name as cohort
FROM teachers
JOIN assistance_requests ON teacher_id = teachers.id
JOIN students ON student_id = students.id
JOIN cohorts ON cohort_id = cohorts.id
WHERE cohorts.name = $1 || 'JUL02'
ORDER BY teacher
LIMIT $2;
`;

pool
  .query(queryString, args)
  .then((res) => {
    res.rows.forEach((row) => {
      console.log(`${row.cohort}: ${row.teacher}`);
    });
  })
  .catch((err) => console.error("query error", err.stack));
