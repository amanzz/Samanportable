import React from 'react';
import { Star, Quote } from 'lucide-react';
import QuoteFormTrigger from './QuoteFormTrigger';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Amarnath Babu',
      company: 'Arvind Infrastructure',
      rating: 5,
      text: 'We ordered 6 cabins for two Karnataka sites. SAMAN coordinated both deliveries together and had everything erected in a single day. Our teams were operational that same evening.'
    },
    {
      id: 2,
      name: 'Harikrishna Pasupuleti',
      company: 'Azim Premji University, Bangalore',
      rating: 5,
      text: 'Our concern was how a prefab cabin would look on a university campus. Two years later it still looks good, staff use it daily, and we have had zero maintenance calls. Good decision.'
    },
    {
      id: 3,
      name: 'Sambalingamoorthy S',
      company: 'URC Construction (P) Ltd, Chennai',
      rating: 5,
      text: 'Third supplier I have tried for site cabins. SAMAN is the first where the quote matched the final invoice. Quality was consistent across all units and delivery to Chennai was on schedule.'
    },
    {
      id: 4,
      name: 'Shantha Kumar',
      company: 'NCC Limited, Bengaluru',
      rating: 5,
      text: 'We have ordered from SAMAN twice for NCC projects in Bengaluru. Same quality both times, same response time, same billing with no surprises. That consistency is what keeps us coming back.'
    },
    {
      id: 5,
      name: 'Ashoka A',
      company: 'HAL India, Bengaluru',
      rating: 5,
      text: 'HAL has strict procurement standards. SAMAN came prepared — full documentation, material specs, and test certificates provided upfront. Eighteen months of use and not one structural complaint.'
    }
  ];

  return (
    <section className="section-padding bg-muted/30">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our satisfied customers have to say about 
            our portable office solutions and service quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-card rounded-lg p-6 shadow-card hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <Quote className="w-8 h-8 text-primary mr-3" />
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6 italic">
                &quot;{testimonial.text}&quot;
              </p>
              
              <div className="border-t border-border pt-4">
                <h3 className="font-semibold text-foreground">
                  {testimonial.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-[#0A3D2A] rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Join Our Happy Customers?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Get started with your portable office project today and experience the Saman Portable difference.
            </p>
            <QuoteFormTrigger variant="white" size="lg" className="px-8 py-3">
              Start Your Project
            </QuoteFormTrigger>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

