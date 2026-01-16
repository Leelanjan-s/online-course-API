// Elements
const usersTable = document.getElementById("usersTable");
const teacherSelect = document.getElementById("teacherSelect");
const studentSelect = document.getElementById("studentSelect");
const coursesTable = document.getElementById("coursesTable");
const courseSelect = document.getElementById("courseSelect");
const enrollmentsTable = document.getElementById("enrollmentsTable");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const roleSelect = document.getElementById("role");
const courseTitleInput = document.getElementById("courseTitle");

// Users
async function fetchUsers() {
  const res = await fetch("/users/");
  const users = await res.json();

  usersTable.innerHTML = "<tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th></tr>";
  teacherSelect.innerHTML = "";
  studentSelect.innerHTML = "";

  users.forEach(u => {
    usersTable.innerHTML += `<tr><td>${u.id}</td><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td></tr>`;
    if (u.role === "Teacher") teacherSelect.innerHTML += `<option value="${u.id}">${u.name}</option>`;
    if (u.role === "Student") studentSelect.innerHTML += `<option value="${u.id}">${u.name}</option>`;
  });
}

async function addUser() {
  await fetch("/users/", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      name: nameInput.value,
      email: emailInput.value,
      role: roleSelect.value
    })
  });
  nameInput.value = "";
  emailInput.value = "";
  fetchUsers();
}

// Courses
async function fetchCourses() {
  const res = await fetch("/courses/");
  const courses = await res.json();

  coursesTable.innerHTML = "<tr><th>ID</th><th>Title</th><th>Teacher</th></tr>";
  courseSelect.innerHTML = "";

  courses.forEach(c => {
    coursesTable.innerHTML += `<tr><td>${c.id}</td><td>${c.title}</td><td>${c.teacher}</td></tr>`;
    courseSelect.innerHTML += `<option value="${c.id}">${c.title}</option>`;
  });
}

async function createCourse() {
  await fetch("/courses/", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      title: courseTitleInput.value,
      teacher_id: teacherSelect.value
    })
  });
  courseTitleInput.value = "";
  fetchCourses();
}

// Enrollments
async function fetchEnrollments() {
  const res = await fetch("/enrollments/");
  const data = await res.json();

  enrollmentsTable.innerHTML = "<tr><th>Student</th><th>Course</th><th>Teacher</th></tr>";
  data.forEach(e => {
    enrollmentsTable.innerHTML += `<tr><td>${e.student}</td><td>${e.course}</td><td>${e.teacher}</td></tr>`;
  });
}

async function enrollStudent() {
  await fetch(`/enrollments/?student_id=${studentSelect.value}&course_id=${courseSelect.value}`, { method: "POST" });
  fetchEnrollments();
}

// Initial load
fetchUsers();
fetchCourses();
fetchEnrollments();
