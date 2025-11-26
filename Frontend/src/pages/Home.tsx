import { Search, BookOpen, GraduationCap, Users, Sparkles, Heart, Star, Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Home = () => {
  return (
    <div className="bg-white text-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-[#fdecee] py-20 md:py-32">
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-snug">
            <span className="text-[#B3261E]">Discover</span> Your Future with Us
          </h1>

          {/* Hero Search/CTA Card */}
          <div className="bg-white rounded-3xl py-6 px-8 md:px-12 shadow-xl max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 transition duration-300 hover:scale-105 hover:shadow-2xl">
            <Search className=" p-3 rounded-xl w-14 h-14 md:mr-6 " />
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-200 mb-2">
                Find Your Perfect Course
              </h2>
            </div>
          </div>

          {/* Optional small decorative text below */}
          <p className="text-gray-500 text-sm mt-6">
            Trusted by over <span className="font-semibold">10,000+</span> students worldwide.
          </p>
        </div>
      </section>


      {/* Divider */}
      <div className="container mx-auto px-4 my-10">
        <hr className="border-t-[3px] border-[#B3261E]" />
      </div>

      {/* Feature Section */}
      <section className="container mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <BookOpen className="w-12 h-12 text-[#B3261E]" />,
            title: 'Rich Learning Resources',
            desc: 'Thousands of materials, books, and guides at your fingertips.',
          },
          {
            icon: <GraduationCap className="w-12 h-12 text-[#B3261E]" />,
            title: 'Track Academic Progress',
            desc: 'Visualize your learning journey with analytics and feedback.',
          },
          {
            icon: <Users className="w-12 h-12 text-[#B3261E]" />,
            title: 'Join Expert Communities',
            desc: 'Collaborate with top learners and educators worldwide.',
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-red-100 rounded-2xl p-6 shadow-md text-center transition duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 cursor-pointer"
          >
            <div className="flex justify-center mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Courses Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Popular Courses
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              title: "Introduction to Databases",
              desc: "Learn SQL, relational models, and how to design efficient databases.",
              color: "#fdecee",
              abbrev: "DB",
            },
            {
              title: "Web Development with React",
              desc: "Build modern web apps using React, JSX, and component-driven design.",
              color: "#fff0f2",
              abbrev: "WR",
            },
            {
              title: "Machine Learning Basics",
              desc: "Understand supervised & unsupervised learning, and predictive models.",
              color: "#fde7e9",
              abbrev: "ML",
            },
            {
              title: "Data Structures & Algorithms",
              desc: "Master arrays, trees, graphs, sorting, and algorithmic problem solving.",
              color: "#fff0f0",
              abbrev: "DSA",
            },
          ].map((course, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-5 transition duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 cursor-pointer"
            >
              <div
                className="h-40 rounded-2xl mb-4 flex items-center justify-center text-4xl font-bold text-[#B3261E]"
                style={{ backgroundColor: course.color }}
              >
                {course.abbrev}
              </div>
              <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-600 text-sm">{course.desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="bg-[#fdecee] py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">What Students Say</h2>
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[1,2,3].map((idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-md p-6 transition duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105">
              <div className="flex items-center gap-4 mb-4">
                <Heart className="w-6 h-6 text-[#B3261E]" />
                <span className="font-semibold">Student {idx}</span>
              </div>
              <p className="text-gray-700 text-sm">"This platform helped me improve my grades and connect with great teachers!"</p>
              <div className="flex mt-4 gap-1 text-[#b3261e]">
                {Array(5).fill(<Star className="w-4 h-4"/>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 mt-10 fade-in">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Begin Your Learning Journey?
        </h2>
        <p className="text-gray-700 mb-8">
          Join thousands of students improving their academic life every day.
        </p>
        <button className="bg-[#B3261E] text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-md transition duration-300 hover:bg-[#8c1f19] hover:scale-105 active:scale-95">
          Get Started <Sparkles className="inline-block ml-2" />
        </button>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
