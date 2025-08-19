import React from 'react';
import { MapPin, Wrench, Waves } from 'lucide-react';

const Amenities = React.memo(() => {
  const amenities = [
    {
      title: "Recreation Areas",
      description: "Walking trails and common areas for residents to enjoy",
      icon: <MapPin className="w-10 h-10 text-primary-600 mb-4" />
    },
    {
      title: "Maintenance Services",
      description: "Professional landscaping and snow removal services",
      icon: <Wrench className="w-10 h-10 text-primary-600 mb-4" />
    },
    {
      title: "Lake Access",
      description: "Close proximity to Flathead Lake recreation opportunities",
      icon: <Waves className="w-10 h-10 text-primary-600 mb-4" />
    }
  ];

  return (
    <section id="amenities" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <h2 className="text-4xl md:text-5xl mb-12 text-center text-primary-600">Community Amenities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {amenities.map((amenity, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="flex justify-center">
                {amenity.icon}
              </div>
              <h3 className="text-2xl mb-4 text-primary-700 font-semibold">{amenity.title}</h3>
              <p className="text-gray-700 leading-relaxed">{amenity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

Amenities.displayName = 'Amenities';

export default Amenities;