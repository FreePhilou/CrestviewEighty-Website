import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Contact = React.memo(() => {
  const contacts = [
    {
      title: "HOA Board",
      email: "board@crestvieweighty.com",
      phone: "(406) 555-0123",
      icon: <Mail className="w-8 h-8 text-primary-600 mb-4" />
    },
    {
      title: "Property Management", 
      email: "management@crestvieweighty.com",
      phone: "(406) 555-0124",
      icon: <Phone className="w-8 h-8 text-primary-600 mb-4" />
    },
    {
      title: "Emergency Contacts",
      phone: "(406) 555-0125",
      description: "For urgent maintenance issues",
      icon: <Clock className="w-8 h-8 text-primary-600 mb-4" />
    }
  ];

  return (
    <section id="contact" className="py-20 bg-secondary-50">
      <div className="max-w-6xl mx-auto px-5">
        <h2 className="text-4xl md:text-5xl mb-12 text-center text-primary-600">Contact Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 mb-12">
          {contacts.map((contact, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center">
                {contact.icon}
              </div>
              <h3 className="text-xl mb-4 text-primary-700 font-semibold text-center">{contact.title}</h3>
              {contact.email && (
                <p className="text-gray-700 mb-2 text-center">
                  <span className="font-medium">Email:</span>{' '}
                  <a href={`mailto:${contact.email}`} className="text-primary-600 hover:text-primary-700 transition-colors">
                    {contact.email}
                  </a>
                </p>
              )}
              {contact.phone && (
                <p className="text-gray-700 mb-2 text-center">
                  <span className="font-medium">Phone:</span>{' '}
                  <a href={`tel:${contact.phone}`} className="text-primary-600 hover:text-primary-700 transition-colors">
                    {contact.phone}
                  </a>
                </p>
              )}
              {contact.description && (
                <p className="text-gray-600 text-sm text-center mt-2">{contact.description}</p>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md max-w-md mx-auto text-center">
          <div className="flex justify-center mb-4">
            <MapPin className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-xl mb-5 text-primary-700 font-semibold">Mailing Address</h3>
          <address className="text-gray-700 not-italic leading-relaxed">
            Crestview Eighty HOA<br />
            P.O. Box 123<br />
            Bigfork, MT 59911
          </address>
        </div>
      </div>
    </section>
  );
});

Contact.displayName = 'Contact';

export default Contact;