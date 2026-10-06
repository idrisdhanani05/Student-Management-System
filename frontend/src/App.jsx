import { useEffect, useState } from "react";

import axios from "axios";

import "./App.css";



const API_URL = "https://student-management-system-jj4s.onrender.com/api/students";



const emptyForm = {

  studentId: "",

  name: "",

  email: "",

  mobile: "",

  branch: "",

  customBranch: "",

  semester: "",

  cgpa: "",

};



function App () {

  const [darkMode, setDarkMode] = useState(false);



  const [students, setStudents] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);



  const [search, setSearch] = useState("");

  const [branchFilter, setBranchFilter] = useState("All");



  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);



const fetchStudents = async () => {
  try {
    setLoading(true);

    const response = await axios.get(API_URL);
    setStudents(response.data);

  } catch (error) {
    console.error("Failed to fetch students:", error);
    alert("Failed to load students.");

  } finally {
    setLoading(false);
  }
};




  useEffect(() => {

    fetchStudents();

  }, []);



  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value,

    });

  };



  const openAddForm = () => {

    setEditingId(null);

    setForm(emptyForm);

    setShowForm(true);

  };



  const openEditForm = (student) => {

  setEditingId(student._id);



  setForm({

    studentId: student.studentId,

    name: student.name,

    email: student.email,

    mobile: student.mobile,



    branch: [

      "Information Technology",

      "Computer Engineering",

      "Electronics",

      "AI & Data Science",

      "Mechanical Engineering",

      "Civil Engineering",

    ].includes(student.branch)

      ? student.branch

      : "Other",



    customBranch: [

      "Information Technology",

      "Computer Engineering",

      "Electronics",

      "AI & Data Science",

      "Mechanical Engineering",

      "Civil Engineering",

    ].includes(student.branch)

      ? ""

      : student.branch,



    semester: student.semester,

    cgpa: student.cgpa,

  });



  setShowForm(true);

};



  const closeForm = () => {

    setShowForm(false);

    setEditingId(null);

    setForm(emptyForm);

  };



  const handleSubmit = async (e) => {

    e.preventDefault();



    try {

      const studentData = {

  ...form,

  branch: form.branch === "Other" ? form.customBranch : form.branch,

  semester: Number(form.semester),

  cgpa: Number(form.cgpa),

};



delete studentData.customBranch;



      if (editingId) {

        await axios.put(`${API_URL}/${editingId}`, studentData);

        alert("Student updated successfully!");

      } else {

        await axios.post(API_URL, studentData);

        alert("Student added successfully!");

      }



      closeForm();

      fetchStudents();

    } catch (error) {

      console.error(error);

      alert(

        error.response?.data?.error ||

          error.response?.data?.message ||

          "Something went wrong."

      );

    }

  };



  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(

      "Are you sure you want to delete this student?"

    );



    if (!confirmDelete) return;



    try {

      await axios.delete(`${API_URL}/${id}`);

      alert("Student deleted successfully!");

      fetchStudents();

    } catch (error) {

      console.error(error);

      alert("Failed to delete student.");

    }

  };



  const branches = [

    "Information Technology",

    "Computer Engineering",

    "Electronics",

    "AI & Data Science",

    "Mechanical Engineering",

    "Civil Engineering",

  ];



  const filteredStudents = students.filter((student) => {

    const searchText = search.toLowerCase();



    const matchesSearch =

      student.studentId.toLowerCase().includes(searchText) ||

      student.name.toLowerCase().includes(searchText) ||

      student.email.toLowerCase().includes(searchText);



    const matchesBranch =

      branchFilter === "All" || student.branch === branchFilter;



    return matchesSearch && matchesBranch;

  });



  return (

   <div className={`app ${darkMode ? "dark-mode" : "light-mode"}`}>

      {/* Sidebar */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-icon">🎓</div>

          <div>

            <h2>StudentHub</h2>

            <span>Management System</span>

          </div>

        </div>



        <nav className="sidebar-nav">

          <div className="nav-item active">

            <span>▣</span>

            Dashboard

          </div>



          <div className="nav-item" onClick={openAddForm}>

            <span>＋</span>

            Add Student

          </div>

        </nav>



        <div className="sidebar-bottom">

          <div className="sidebar-info">

            <span>●</span>

            System Online

          </div>

        </div>

      </aside>



      {/* Main Content */}

      <main className="main-content">

       <header className="topbar">

  <div>





    <h1>Student Management System</h1>



    <p className="subtitle">

      Manage student records from one simple dashboard.

    </p>

  </div>



  <div className="topbar-actions">

    <button

      className="theme-toggle"

      onClick={() => setDarkMode(!darkMode)}

    >

      {darkMode ? "☀️ Light" : "🌙 Dark"}

    </button>



    <button className="primary-btn" onClick={openAddForm}>

      ＋ Add Student

    </button>

  </div>

</header>



        {/* Statistics */}

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon blue">👥</div>

            <div>

              <p>Total Students</p>

              <h2>{students.length}</h2>

            </div>

          </div>



          <div className="stat-card">

            <div className="stat-icon green">🎓</div>

            <div>

              <p>Branches</p>

              <h2>{new Set(students.map((s) => s.branch)).size}</h2>

            </div>

          </div>



          <div className="stat-card">

            <div className="stat-icon purple">📚</div>

            <div>

              <p>Displayed</p>

              <h2>{filteredStudents.length}</h2>

            </div>

          </div>

        </section>



        {/* Student Section */}

        <section className="students-section">

          <div className="section-header">

            <div>

              <h2>All Students</h2>

              <p>View, search, edit and manage student records.</p>

            </div>

          </div>



          {/* Search + Filter */}

          <div className="toolbar">

            <div className="search-box">

              <span>🔍</span>

              <input

                type="text"

                placeholder="Search by ID, name or email..."

                value={search}

                onChange={(e) => setSearch(e.target.value)}

              />

            </div>



            <select

              value={branchFilter}

              onChange={(e) => setBranchFilter(e.target.value)}

              className="filter-select"

            >

              <option value="All">All Branches</option>



              {branches.map((branch) => (

                <option key={branch} value={branch}>

                  {branch}

                </option>

              ))}

            </select>

          </div>



          {/* Table */}

          <div className="table-wrapper">

            {loading ? (

              <div className="empty-state">

                <div className="empty-icon">⏳</div>

                <h3>Loading students...</h3>

              </div>

            ) : filteredStudents.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">📭</div>

                <h3>No students found</h3>

                <p>Try changing your search or add a new student.</p>

              </div>

            ) : (

              <table>

                <thead>

                  <tr>

                    <th>Student ID</th>

                    <th>Name</th>

                    <th>Email</th>

                    <th>Mobile</th>

                    <th>Branch</th>

                    <th>Semester</th>

                    <th>CGPA</th>

                    <th>Actions</th>

                  </tr>

                </thead>



                <tbody>

                  {filteredStudents.map((student) => (

                    <tr key={student._id}>

                      <td>

                        <span className="student-id">

                          {student.studentId}

                        </span>

                      </td>



                      <td>

                        <div className="student-name">

                          <div className="avatar">

                            {student.name.charAt(0).toUpperCase()}

                          </div>

                          {student.name}

                        </div>

                      </td>



                      <td>{student.email}</td>



                      <td>{student.mobile}</td>



                      <td>

                        <span className="branch-badge">

                          {student.branch}

                        </span>

                      </td>



                      <td>{student.semester}</td>



                      <td>

                        <span className="cgpa">{student.cgpa}</span>

                      </td>



                      <td>

                        <div className="action-buttons">

                          <button

                            className="edit-btn"

                            onClick={() => openEditForm(student)}

                          >

                            Edit

                          </button>



                          <button

                            className="delete-btn"

                            onClick={() => handleDelete(student._id)}

                          >

                            Delete

                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </div>

        </section>

      </main>



      {/* Add/Edit Modal */}

      {showForm && (

        <div className="modal-overlay" onClick={closeForm}>

          <div

            className="modal"

            onClick={(e) => e.stopPropagation()}

          >

            <div className="modal-header">

              <div>

                <h2>{editingId ? "Edit Student" : "Add Student"}</h2>

                <p>

                  {editingId

                    ? "Update student information."

                    : "Enter the student's details below."}

                </p>

              </div>



              <button className="close-btn" onClick={closeForm}>

                ×

              </button>

            </div>



            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                <div className="form-group">

                  <label>Student ID</label>

                  <input

                    type="text"

                    name="studentId"

                    placeholder="e.g. STU002"

                    value={form.studentId}

                    onChange={handleChange}

                    required

                  />

                </div>



                <div className="form-group">

                  <label>Full Name</label>

                  <input

                    type="text"

                    name="name"

                    placeholder="Enter full name"

                    value={form.name}

                    onChange={handleChange}

                    required

                  />

                </div>



                <div className="form-group">

                  <label>Email</label>

                  <input

                    type="email"

                    name="email"

                    placeholder="student@gmail.com"

                    value={form.email}

                    onChange={handleChange}

                    required

                  />

                </div>



                <div className="form-group">

                  <label>Mobile Number</label>

                 <input
  type="tel"
  name="mobile"
  placeholder="10-digit mobile number"
  value={form.mobile}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);

    setForm({
      ...form,
      mobile: value,
    });
  }}
  maxLength={10}
  inputMode="numeric"
  required
/>

                </div>



               <div className="form-group">

  <label>Branch</label>



  <select

    name="branch"

    value={form.branch}

    onChange={(e) => {

      const value = e.target.value;



      setForm({

        ...form,

        branch: value,

        customBranch: value === "Other" ? form.customBranch : "",

      });

    }}

    required

  >

    <option value="">Select Branch</option>

    <option value="Information Technology">

      Information Technology

    </option>

    <option value="Computer Engineering">

      Computer Engineering

    </option>

    <option value="Electronics">

      Electronics

    </option>

    <option value="AI & Data Science">

      AI & Data Science

    </option>

    <option value="Mechanical Engineering">

      Mechanical Engineering

    </option>

    <option value="Civil Engineering">

      Civil Engineering

    </option>

    <option value="Other">Other</option>

  </select>



  {form.branch === "Other" && (

    <input

      type="text"

      name="customBranch"

      placeholder="Enter your branch name"

      value={form.customBranch}

      onChange={(e) =>

        setForm({

          ...form,

          customBranch: e.target.value,

        })

      }

      required

    />

  )}

</div>



                <div className="form-group">

                  <label>Semester</label>

                  <input

                    type="number"

                    name="semester"

                    min="1"

                    max="8"

                    placeholder="1 - 8"

                    value={form.semester}

                    onChange={handleChange}

                    required

                  />

                </div>



                <div className="form-group">

                  <label>CGPA</label>

                  <input

                    type="number"

                    name="cgpa"

                    min="0"

                    max="10"

                    step="0.01"

                    placeholder="e.g. 8.5"

                    value={form.cgpa}

                    onChange={handleChange}

                    required

                  />

                </div>

              </div>



              <div className="modal-actions">

                <button

                  type="button"

                  className="cancel-btn"

                  onClick={closeForm}

                >

                  Cancel

                </button>



                <button type="submit" className="save-btn">

                  {editingId ? "Update Student" : "Add Student"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );
}

export default App;
