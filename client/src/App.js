import "./App.css"
import { useState, useEffect } from "react"
import Axios from "axios"

function App() {

  const gradeOptions = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F", "P", "W"]

  const [courseData, setCourseData] = useState([])
  const [filterKey, setFilterKey] = useState("")
  const [filterValue, setFilterValue] = useState("")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [sortParams, setSortParams] = useState([{ sortKey: "", sortOrder: "" }])
  
  const [loaded, setLoaded] = useState(false);
  const [isGridView, setIsGridView] = useState(false)
  const [showAllClicked, setShowAllClicked] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)

  const [formData, setFormData] = useState({
    subject: "",
    number: 0,
    name: "",
    credits: 0,
    grade: "A",
    date: new Date()
  })

  const handleAddSortParam = () => {
    setSortParams([...sortParams, { sortKey: "", sortOrder: "" }])
  }

  const toggleView = () => {
    setIsGridView(prevState => !prevState)
  }

  const addCourse = () => {
    setShowAddModal(true)
  }

  const submitCourse = () => {
    Axios.post("http://localhost:3001/api/courses", formData)
      .then((response) => {
        const newCourse = { ...formData, id: response.data.id }
        setCourseData([...courseData, newCourse])
        setShowAddModal(false)
        alert("Course successfully added!")
      })
      .catch(error => {
        console.error(error)
        alert("Failed to add course")
      })
  }

  const deleteCourse = (id) => {
    Axios.delete(`http://localhost:3001/api/courses/${id}`)
      .then(() => {
        setCourseData(courseData => courseData.filter(course => course.id !== id))
        alert("Course successfully deleted!")
      })
      .catch(error => {
        console.error(error)
        alert("Failed to delete course")
      })
  }

  const editCourse = (id) => {
    const course = courseData.find(course => course.id === id)
    setFormData(course)
    setShowEditModal(true)
  }

  const updateCourse = (id) => {
    Axios.put(`http://localhost:3001/api/courses/${id}`, formData)
      .then(() => {
        const updatedIndex = courseData.findIndex(course => course.id === id)
        const updatedCourses = [...courseData]
        updatedCourses[updatedIndex] = formData
        setCourseData(updatedCourses)
        setShowEditModal(false)
        alert("Course successfully updated!")
      })
      .catch(error => {
        console.error(error)
        alert("Failed to update course")
      })
  }

  const filterCourse = () => {
    console.log("hello")
    setShowFilterModal(true)
  }

  const handleGetCourses = (page, limit) => {
    let query = ""
    if (sortParams.length > 0) {
      query += `&sortParams=${encodeURIComponent(JSON.stringify(sortParams))}`
    }
    if (filterKey && filterValue) {
      query += `&filterKey=${filterKey}&filterValue=${filterValue}`
    }
    query += `&page=${page}&limit=${limit}`

    Axios.get(`http://localhost:3001/api/courses?${query}`)
      .then(response => {
        setCourseData(response.data.result)
        setShowFilterModal(false)
        alert("Successfully retrieved course data!")
      })
      .catch(error => {
        console.error(error)
        alert("Failed to retrieve course data")
      })
  }

  useEffect(() => {
    if (showAllClicked) {
      setPage(1)
      handleGetCourses(1, limit)
      setShowAllClicked(false)
    }
  }, [showAllClicked])

  const resetFilter = () => {
    setFilterKey("")
    setFilterValue("")
    setSortParams([{ sortKey: "", sortOrder: "" }])
    setShowAllClicked(true)
  }

  useEffect(() => {
    if (loaded) {
      handleGetCourses(page, limit);
    } else {
      setLoaded(true);
    }
  }, [limit, page, loaded]);  

  return (
    <div className="App">
      <div className="actions">
        <button onClick={() => addCourse()}>Add Course</button>
        <button onClick={() => resetFilter()}>Show All Courses</button>
        <button onClick={() => filterCourse()}>Query Course List</button>
      </div>

      <div className="courses">
        <div className="pagination">
          <button onClick={() => {
            setPage(Math.max(page - 1, 1))
          }}>Prev</button>
          <span>Page {page}</span>
          <button onClick={() => {
            setPage(page + 1)
          }}>Next</button>
          <select value={limit} onChange={e => setLimit(e.target.value)}>
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={30}>30 per page</option>
          </select>
        </div>

        <button onClick={() => toggleView()}>{isGridView ? "List View" : "Grid View"}</button>
        {isGridView ? (
          <div className="grid-view">
            <div className="course header">
              <div>Id</div>
              <div>Subject</div>
              <div>Number</div>
              <div>Name</div>
              <div>Credits</div>
              <div>Grade</div>
              <div>Date</div>
            </div>

            {Array.isArray(courseData) && courseData.map(course => (
              <div key={course.id} className="grid-view-item">
                <div>{course.id}</div>
                <div>{course.subject}</div>
                <div>{course.number}</div>
                <div>{course.name}</div>
                <div>{course.credits}</div>
                <div>{course.grade}</div>
                <div>{course.date}</div>
                <button onClick={() => editCourse(course.id)}>Edit</button>
                <button onClick={() => deleteCourse(course.id)}>Delete</button>
              </div>
            ))}
          </div>

        ) : (
          <div className="list-view">
            {Array.isArray(courseData) && courseData.map(course => (
              <div key={course.id} className="list-view-item">
                <div><strong>Id:</strong> {course.id}</div>
                <div><strong>Subject:</strong> {course.subject}</div>
                <div><strong>Number:</strong> {course.number}</div>
                <div><strong>Name:</strong> {course.name}</div>
                <div><strong>Credits:</strong> {course.credits}</div>
                <div><strong>Grade:</strong> {course.grade}</div>
                <div><strong>Date:</strong> {course.date}</div>
                <button onClick={() => editCourse(course.id)}>Edit</button>
                <button onClick={() => deleteCourse(course.id)}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-content">
              <h2>Add Course</h2>
              <div className="information-add">
                <label>Subject:</label>
                <input onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  type="text" name="subject" id="subject" />

                <label>Number:</label>
                <input onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  type="number" name="number" id="number" />

                <label>Name:</label>
                <input onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  type="text" name="name" id="name" />

                <label>Credits:</label>
                <input onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                  type="number" name="credits" id="credits" />

                <label>Grade:</label>
                <select onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                >
                  {gradeOptions.map((grade) => (
                    <option value={grade} key={grade}>{grade}</option>
                  ))}
                </select>

                <label>Date:</label>
                <input onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  type="date" name="date" id="date" />

                <button onClick={() => submitCourse()}>Submit Course</button>
                <button onClick={() => setShowAddModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal &&
        <div className="overlay">
          <div className="modal">
            <div className="modal-content">
              <h2>Edit Course</h2>
              <div className="information-edit">
                <label>Subject:</label>
                <input onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  type="text" name="subject" id="subject" value={formData.subject} />

                <label>Number:</label>
                <input onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  type="number" name="number" id="number" value={formData.number} />

                <label>Name:</label>
                <input onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  type="text" name="name" id="name" value={formData.name} />

                <label>Credits:</label>
                <input onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                  type="number" name="credits" id="credits" value={formData.credits} />

                <label>Grade:</label>
                <select onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  value={formData.grade}>
                  {gradeOptions.map((grade) => (
                    <option value={grade} key={grade}>{grade}</option>
                  ))}
                </select>

                <label>Date:</label>
                <input onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  type="date" name="date" id="date" value={formData.date} />

                <button onClick={() => updateCourse(formData.id)}>Save changes</button>
                <button onClick={() => setShowEditModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      }

      {showFilterModal &&
        <div className="overlay">
          <div className="modal">
            <div className="modal-content">
              <h2>Filter Courses</h2>
              <div className="information-filter">
                {sortParams.map((param, index) => (
                  <div key={index}>
                    <label htmlFor={`sort-key-select-${index}`}>Sort By:</label>
                    <select id={`sort-key-select-${index}`} value={param.sortKey} onChange={(e) => {
                      const updatedSortParams = [...sortParams]
                      updatedSortParams[index].sortKey = e.target.value
                      setSortParams(updatedSortParams)
                    }}>
                      <option value="">-- Select a Key --</option>
                      <option value="id">Id</option>
                      <option value="subject">Subject</option>
                      <option value="number">Number</option>
                      <option value="name">Name</option>
                      <option value="credits">Credits</option>
                      <option value="grade">Grade</option>
                      <option value="date">Date</option>
                    </select>

                    <label htmlFor={`sort-order-select-${index}`}>Order By:</label>
                    <select id={`sort-order-select-${index}`} value={param.sortOrder} onChange={(e) => {
                      const updatedSortParams = [...sortParams]
                      updatedSortParams[index].sortOrder = e.target.value
                      setSortParams(updatedSortParams)
                    }}>
                      <option value="">-- Select an Order --</option>
                      <option value="ASC">Ascending</option>
                      <option value="DESC">Descending</option>
                    </select>
                  </div>
                ))}
                <label htmlFor="filter-key-select">Filter Key:</label>
                <select id="filter-key-select" value={filterKey} onChange={(e) => setFilterKey(e.target.value)}>
                  <option value="">-- Select a Key --</option>
                  <option value="id">Id</option>
                  <option value="subject">Subject</option>
                  <option value="number">Number</option>
                  <option value="name">Name</option>
                  <option value="credits">Credits</option>
                  <option value="grade">Grade</option>
                  <option value="date">Date</option>
                </select>

                <label htmlFor="filter-value-input">Filter Value:</label>
                <input type="text" id="filter-value-input" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />

                <button onClick={() => handleAddSortParam()}>Add Sort Parameter</button>
                <button onClick={() => resetFilter()}>Clear Parameters</button>
                <button onClick={() => {
                  setPage(1)
                }}>Submit</button>
                <button onClick={() => setShowFilterModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default App