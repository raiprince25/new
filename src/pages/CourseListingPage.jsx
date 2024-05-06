import React, { useState, useEffect } from "react";

const CourseListingPage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    fetch("https://www.udemy.com/api-2.0/discovery-units/all_courses/?page_size=16&subcategory=&instructional_level=&lang=&price=&duration=&closed_captions=&subs_filter_type=&subcategory_id=8&source_page=subcategory_page&locale=en_US&currency=inr&navigation_locale=en_US&skip_price=true&sos=ps&fl=scat")
      .then((response) => response.json())
      .then((data) => {
        const coursesWithImages = data?.unit?.items.map((course) => {
          const imageUrl = course.image_240x135;
          return { ...course, imageUrl };
        });
        setCourses(coursesWithImages);
        setFilteredCourses(coursesWithImages);
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterCourses(term);
  };

  const filterCourses = (term) => {
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(term) ||
      course.visible_instructors[0]?.display_name.toLowerCase().includes(term)
    );
    setFilteredCourses(filtered);
  };

  const handleVisitWebsite = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-semibold my-4">Course Listing Page</h1>
      <input
        type="text"
        placeholder="Search by course name or instructor..."
        className="border border-gray-300 rounded px-4 py-2 mb-4"
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCourses.map((course) => (
          <div key={course.id} className="border border-gray-300 rounded p-4 hover:shadow-lg" onClick={() => handleVisitWebsite(`https://www.udemy.com${course.url}`)}>
            <img src={course.imageUrl} alt={course.title} className="w-full h-40 object-cover mb-4" />
            <h2 className="text-lg font-semibold">{course.title}</h2>
            <p className="text-gray-600">
              <a href={course.visible_instructors[0]?.url} target="_blank" rel="noopener noreferrer">
                {course.visible_instructors[0]?.display_name}
              </a>
            </p>
            <p>
              <span className="text-gray-600 ml-2">
                {course.visible_instructors[0]?.job_title}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseListingPage;