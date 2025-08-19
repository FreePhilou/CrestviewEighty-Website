import React from 'react';

const About = React.memo(() => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <h2 className="text-4xl md:text-5xl mb-12 text-center text-primary-600">About Our Community</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-2xl mb-4 text-primary-700">Prime Location</h3>
            <p className="text-gray-700 leading-relaxed">
              Located in beautiful Bigfork, Montana, our community offers easy access to outdoor recreation, 
              dining, and cultural attractions while maintaining a peaceful residential atmosphere.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-2xl mb-4 text-primary-700">Natural Beauty</h3>
            <p className="text-gray-700 leading-relaxed">
              Surrounded by the pristine wilderness of Northwest Montana, residents enjoy breathtaking views 
              of Flathead Lake and the nearby mountain ranges.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-2xl mb-4 text-primary-700">Community Standards</h3>
            <p className="text-gray-700 leading-relaxed">
              Our HOA maintains high standards for property maintenance and community appearance, ensuring 
              property values and quality of life for all residents.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

About.displayName = 'About';

export default About;