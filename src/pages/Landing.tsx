
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Leaf, 
  Shield, 
  Users, 
  Zap, 
  CloudRain, 
  BarChart3, 
  Globe, 
  MessageSquare, 
  ChevronDown,
  Beaker,
  Sprout
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const Landing = () => {
  const { user } = useAuth();
  const featuresRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const partnersRef = useRef<HTMLDivElement>(null);

  const featureInView = useIntersectionObserver(featuresRef, { threshold: 0.1 });
  const benefitsInView = useIntersectionObserver(benefitsRef, { threshold: 0.1 });
  const partnersInView = useIntersectionObserver(partnersRef, { threshold: 0.1 });

  const scrollToSection = (elementRef: React.RefObject<HTMLDivElement>) => {
    elementRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <Sprout className="h-6 w-6" />
          </div>
          <span className="ml-2 text-xl font-heading font-bold">AgriConnect</span>
        </div>
        <div className="hidden md:flex space-x-4">
          <Button variant="ghost" onClick={() => scrollToSection(featuresRef)}>Features</Button>
          <Button variant="ghost" onClick={() => scrollToSection(benefitsRef)}>Benefits</Button>
          <Button variant="ghost" onClick={() => scrollToSection(partnersRef)}>Partners</Button>
        </div>
        <div>
          {user ? (
            <Button asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/auth?mode=login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth?mode=signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/20 -z-10" />
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold font-heading tracking-tight">
              Transforming Agriculture with <span className="text-primary">AI Technology</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              AgriConnect empowers farmers with AI-driven insights, real-time analytics, and a 
              collaborative marketplace for sustainable and profitable agriculture.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/auth?mode=signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollToSection(featuresRef)}>
                Learn More
              </Button>
            </div>
            
            <div className="pt-8 flex gap-8">
              <div>
                <p className="text-3xl font-bold text-primary">AI-Powered</p>
                <p className="text-muted-foreground">Technology</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">95%</p>
                <p className="text-muted-foreground">Success Rate</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">24/7</p>
                <p className="text-muted-foreground">Support</p>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative animate-fade-in delay-300">
            <div className="relative aspect-video overflow-hidden rounded-xl shadow-2xl animate-fade-in">
              <img 
                src="https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=2000" 
                alt="Digital farming" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl font-bold">Smart Farming Solutions</h3>
                <p>AI-powered crop diagnostics and recommendations</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto mt-16 text-center">
          <Button 
            variant="ghost" 
            size="lg" 
            onClick={() => scrollToSection(featuresRef)}
            className="animate-bounce-slow mx-auto flex items-center"
          >
            <ChevronDown className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div ref={featuresRef} className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Comprehensive Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how AgriConnect transforms traditional farming with cutting-edge technology
            </p>
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${featureInView ? 'animate-fade-in' : ''}`}>
            <FeatureCard 
              icon={Leaf}
              title="AI Crop Diagnostics"
              description="Instantly identify crop diseases with our CNN model and get recommendations for treatment."
            />
            <FeatureCard 
              icon={Beaker}
              title="Soil Analysis"
              description="Analyze soil health data to make informed decisions about fertilizers and crop selection."
            />
            <FeatureCard 
              icon={CloudRain}
              title="Weather Insights"
              description="Real-time weather alerts and forecasts tailored to your farm's location."
            />
            <FeatureCard 
              icon={MessageSquare}
              title="AI Chatbot"
              description="24/7 personalized assistance for all your farming questions and concerns."
            />
            <FeatureCard 
              icon={Users}
              title="Expert Network"
              description="Connect with botanists and agricultural experts for professional advice."
            />
            <FeatureCard 
              icon={Globe}
              title="Multilingual Support"
              description="Access all features in your preferred language for better understanding."
            />
            <FeatureCard 
              icon={BarChart3}
              title="IoT Integration"
              description="Monitor soil nutrients in real-time by connecting IoT devices to our platform."
            />
            <FeatureCard 
              icon={Shield}
              title="Community Forum"
              description="Share knowledge and get help from a community of experienced farmers."
            />
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div ref={benefitsRef} className="py-24 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Why Choose AgriConnect
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how our platform benefits farmers and improves agricultural outcomes
            </p>
          </div>
          
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${benefitsInView ? 'animate-fade-in' : ''}`}>
            <BenefitCard
              number="01"
              title="Increased Crop Yield"
              description="Our AI recommendations have helped farmers increase their crop yields by up to 30% through early disease detection and optimal treatment suggestions."
            />
            <BenefitCard
              number="02"
              title="Reduced Resource Waste"
              description="Smart soil analysis helps farmers use the right amount of water and fertilizer, reducing waste and environmental impact while saving costs."
            />
            <BenefitCard
              number="03"
              title="Better Market Access"
              description="Our virtual marketplace connects farmers directly with buyers, eliminating middlemen and increasing profit margins by up to 25%."
            />
            <BenefitCard
              number="04"
              title="Knowledge Empowerment"
              description="Access to expert advice and community knowledge helps farmers implement best practices and stay updated with modern techniques."
            />
            <BenefitCard
              number="05"
              title="Time & Cost Savings"
              description="Automated diagnostics and recommendations save farmers valuable time and reduce the cost of unnecessary treatments or consultations."
            />
            <BenefitCard
              number="06"
              title="Risk Mitigation"
              description="Weather alerts and predictive analytics help farmers prepare for adverse conditions, protecting crops and reducing losses."
            />
          </div>
        </div>
      </div>

      {/* Removed Partners Section */}

      {/* CTA Section */}
      <div className="py-24 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Join thousands of farmers who are already benefiting from AgriConnect's powerful tools
          </p>
          <Button size="lg" className="px-8" asChild>
            <Link to="/auth?mode=signup">Get Started Today</Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card text-card-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <Sprout className="h-6 w-6" />
                </div>
                <span className="ml-2 text-xl font-bold font-heading">AgriConnect</span>
              </div>
              <p className="text-muted-foreground">
                Empowering farmers with AI technology for sustainable and profitable agriculture.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Features</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-muted-foreground hover:text-primary">Crop Diagnostics</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-primary">Soil Analysis</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-primary">Weather Insights</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-primary">AI Chatbot</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-muted-foreground hover:text-primary">Blog</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-primary">Help Center</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-primary">Community</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-primary">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-primary">Careers</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-primary">Partners</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-primary">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">© 2025 AgriConnect. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <Link to="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">Terms of Service</Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
}) => {
  return (
    <div className="p-6 bg-card rounded-xl border hover:border-primary/50 transition-all hover:shadow-lg hover-scale">
      <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold mb-2 font-heading">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const BenefitCard = ({
  number,
  title,
  description
}: {
  number: string;
  title: string;
  description: string;
}) => {
  return (
    <div className="p-6 bg-card rounded-xl border hover:border-primary/30 transition-all hover:shadow-lg">
      <div className="text-4xl font-bold text-primary/30 font-heading mb-4">{number}</div>
      <h3 className="text-xl font-bold mb-3 font-heading">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Landing;
