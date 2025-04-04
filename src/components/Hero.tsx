
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Background dots pattern */}
      <div className="absolute inset-0 opacity-50 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern-dots" />
      </div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-16">
          <div className="md:w-1/2 mb-10 md:mb-0 animate-fade-in-right">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-6">
              World-class AI Education
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Master Artificial Intelligence with Expert Guidance
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Our comprehensive courses are designed to transform beginners into AI professionals. Learn from industry experts and gain hands-on experience with cutting-edge technologies.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                asChild
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all"
              >
                <Link to="/courses">
                  Explore Courses <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline" 
                className="border-gray-300 hover:border-primary hover:bg-primary/5 text-gray-900 hover:text-primary text-base px-8 py-6"
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          
          <div className="md:w-1/2 animate-fade-in-left">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 to-blue-500/20 blur-2xl opacity-70" />
              <div className="relative glass rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://assets.iderdex.com/newwork/new-work-4.jpg" 
                  alt="KI Bootcamp" 
                  className="w-full h-auto rounded-2xl"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 pb-6">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm font-semibold text-white/90">Jetzt anmelden</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">KI Bootcamp</h3>
                  <p className="text-white/80">Start: 16. April, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
