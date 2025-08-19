import React from 'react';
import { FileText, Download, Calendar, FormInput } from 'lucide-react';

const Documents = React.memo(() => {
  const documents = [
    {
      title: "CC&Rs",
      description: "Covenants, Conditions & Restrictions",
      icon: <FileText className="w-8 h-8 text-primary-600 mb-4" />,
      action: "Download PDF"
    },
    {
      title: "Bylaws", 
      description: "HOA Governing Bylaws",
      icon: <Download className="w-8 h-8 text-primary-600 mb-4" />,
      action: "Download PDF"
    },
    {
      title: "Meeting Minutes",
      description: "Board Meeting Minutes", 
      icon: <Calendar className="w-8 h-8 text-primary-600 mb-4" />,
      action: "View Archive"
    },
    {
      title: "Forms",
      description: "Architectural Review & Other Forms",
      icon: <FormInput className="w-8 h-8 text-primary-600 mb-4" />,
      action: "Download Forms"
    }
  ];

  return (
    <section id="documents" className="py-20 bg-secondary-100">
      <div className="max-w-6xl mx-auto px-5">
        <h2 className="text-4xl md:text-5xl mb-12 text-center text-primary-600">Important Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {documents.map((doc, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="flex justify-center">
                {doc.icon}
              </div>
              <h3 className="text-xl mb-3 text-primary-700 font-semibold">{doc.title}</h3>
              <p className="text-gray-600 mb-4 text-sm">{doc.description}</p>
              <button 
                className="inline-block bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:from-primary-700 hover:to-primary-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-600/30"
                aria-label={`${doc.action} for ${doc.title}`}
              >
                {doc.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

Documents.displayName = 'Documents';

export default Documents;