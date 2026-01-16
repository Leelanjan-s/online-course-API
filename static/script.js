const usersTable = document.getElementById("usersTable");
const teacherSelect = document.getElementById("teacherSelect");
const studentSelect = document.getElementById("studentSelect");
const coursesTable = document.getElementById("coursesTable");
const courseSelect = document.getElementById("courseSelect");
const enrollmentsTable = document.getElementById("enrollmentsTable");

// --- USERS ---
async function fetchUsers() {
  const res = await fetch("/users");
  const users = await res.json();

  usersTable.innerHTML = `<tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr>`;
  teacherSelect.innerHTML = `<option disabled selected>Select Teacher</option>`;
  studentSelect.innerHTML = `<option disabled selected>Select Student</option>`;

  users.forEach(u => {
    usersTable.innerHTML += `
      <tr>
        <td>${u.id}</td>
        <td><strong>${u.name}</strong></td>
        <td>${u.email}</td>
        <td><span style="background:${u.role === 'Teacher' ? '#e0e7ff' : '#d1fae5'}; color:${u.role === 'Teacher' ? '#4338ca' : '#065f46'}; padding: 2px 8px; border-radius: 10px; font-size: 0.8em;">${u.role}</span></td>
        <td><button class="btn-danger" onclick="deleteUser(${u.id})">Delete</button></td>
      </tr>`;

    if (u.role === "Teacher") teacherSelect.innerHTML += `<option value="${u.id}">${u.name}</option>`;
    if (u.role === "Student") studentSelect.innerHTML += `<option value="${u.id}">${u.name}</option>`;
  });
}

async function addUser() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const role = document.getElementById("role").value;
  if(!name || !email) return alert("Fill details");

  await fetch("/users", {
    method: "POST", 
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, email, role })
  });
  fetchUsers();
}

async function deleteUser(id) {
  if(!confirm("Are you sure? This will delete their courses/enrollments too.")) return;
  await fetch(`/users/${id}`, { method: "DELETE" });
  fetchUsers();
  fetchCourses();     
  fetchEnrollments(); 
}

// --- COURSES ---
async function fetchCourses() {
  const res = await fetch("/courses");
  const courses = await res.json();

  coursesTable.innerHTML = `<tr><th>ID</th><th>Title</th><th>Teacher</th><th>Action</th></tr>`;
  courseSelect.innerHTML = `<option disabled selected>Select Course</option>`;

  courses.forEach(c => {
    coursesTable.innerHTML += `
      <tr>
        <td>${c.id}</td>
        <td><strong>${c.title}</strong></td>
        <td>${c.teacher}</td>
        <td><button class="btn-danger" onclick="deleteCourse(${c.id})">Delete</button></td>
      </tr>`;
    courseSelect.innerHTML += `<option value="${c.id}">${c.title}</option>`;
  });
}

async function createCourse() {
  const title = document.getElementById("courseTitle").value;
  const teacher_id = teacherSelect.value;
  if (!title.trim()) return alert("Title required");

  await fetch("/courses", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ title, teacher_id })
  });
  fetchCourses();
}

async function deleteCourse(id) {
  if(!confirm("Delete this course?")) return;
  await fetch(`/courses/${id}`, { method: "DELETE" });
  fetchCourses();
  fetchEnrollments();
}

// --- ENROLLMENTS ---
async function fetchEnrollments() {
  const res = await fetch("/enrollments");
  const data = await res.json();

  enrollmentsTable.innerHTML = `<tr><th>Student</th><th>Course</th><th>Teacher</th><th>Action</th></tr>`;
  
  data.forEach(e => {
    enrollmentsTable.innerHTML += `
      <tr>
        <td><strong>${e.student}</strong></td>
        <td>${e.course}</td>
        <td>${e.teacher}</td>
        <td><button class="btn-danger" onclick="deleteEnrollment(${e.id})">Un-enroll</button></td>
      </tr>`;
  });
}

async function enrollStudent() {
  const s_id = studentSelect.value;
  const c_id = courseSelect.value;
  await fetch(`/enrollments?student_id=${s_id}&course_id=${c_id}`, { method: "POST" });
  fetchEnrollments();
}

async function deleteEnrollment(id) {
  await fetch(`/enrollments/${id}`, { method: "DELETE" });
  fetchEnrollments();
}

fetchUsers();
fetchCourses();
fetchEnrollments();