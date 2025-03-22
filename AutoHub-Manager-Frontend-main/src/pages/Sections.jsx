import React from 'react';
import { ArrowRight, Car, Users, Star, PhoneCall } from 'lucide-react';

const Section = () => {
  const features = [
    {
      icon: <Car className="w-8 h-8" />,
      title: "Premium Vehicles",
      description: "Access our exclusive collection of high-quality vehicles from trusted manufacturers."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Team",
      description: "Our experienced professionals provide personalized service to meet your needs."
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Quality Assured",
      description: "Every vehicle undergoes thorough inspection and certification process."
    }
  ];

  return (
    <div className="w-full">
      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-gray-600 to-gray-800 py-20 px-4">
        <div className="container mx-auto text-center text-white">
          <h4 className="text-lg font-medium mb-3">Brand New Experience</h4>
          <h2 className="text-4xl font-bold mb-8">Welcome to AutoHub Manager</h2>
          <p className="max-w-2xl mx-auto mb-8 text-gray-100">
            Discover a new way to manage your automotive business with our comprehensive platform. 
            We provide cutting-edge solutions for inventory management, customer relationships, and sales optimization.
          </p>
          <button className="bg-white text-blue-800 px-8 py-3 rounded-lg font-medium
                           hover:bg-blue-50 transition-colors duration-300
                           flex items-center gap-2 mx-auto">
            Explore Our Services
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md
                                        hover:shadow-lg transition-shadow duration-300">
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Banner */}
      <section className="bg-gray-200 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Business?</h2>
            <p className="mb-8 text-gray-700">
              Join thousands of successful dealerships who have elevated their business with AutoHub Manager.
              Our team is ready to help you get started.
            </p>
            <div className="flex items-center justify-center gap-6">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg
                               hover:bg-blue-700 transition-colors duration-300
                               flex items-center gap-2">
                <PhoneCall className="w-5 h-5" />
                Contact Sales
              </button>
              <button className="border border-white text-gray-700 px-8 py-3 rounded-lg
                               hover:bg-white hover:text-gray-900 transition-colors duration-300">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Section;