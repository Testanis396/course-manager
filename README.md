# course-manager
Course Manager MySQL/Express/React/Node App that allows the user manage courses with a database. 

Database schema is 'course_system' and table is 'courses'.

Courses are in the format:
- subject: "",
- number: 0,
- name: "",
- credits: 0,
- grade: "A",
- date: new Date()

with a unique (id :) being added to the course in the backend.

User can get, add, edit, and delete any course. User can sort database by multiple parameters, and filter by key.

Client on localhost:3000

user % npm start 

Server on localhost:(env.port or 3001).

user % npm start 

Operations:
- GET /api/courses => returns list of all courses.
- GET /api/courses/{query} => returns a list of desired courses based on query parameters.
- POST /api/create => add course, returns new course Id.
- PUT /api/courses/:id => edits course with id.
- DELETE /api/courses/:id => deletes course with id.

To do: 
- create tests
- implement pagination
- display average GPA
- group by school year
- search by partial string
- calculate credits
- responsive design on the client
- tailwind/bootstrap?
- large course entries
- input validation
- multiple tables?