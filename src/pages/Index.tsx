
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  HeartPulse, 
  Droplets, 
  Brain, 
  ChevronRight, 
  BarChart3, 
  FileText, 
  ArrowRight 
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import HealthMetricCard from '@/components/ui/HealthMetricCard';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';

const Home = () => {
  const [activeTab, setActiveTab] = useState('diabetes');
  const navigate = useNavigate();
  
  const handleStartAssessment = () => {
    // Scroll to the "Our Disease Risk Assessments" section instead of navigating to diabetes page
    document.getElementById('disease-assessments')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewSampleReport = () => {
    navigate('/reports');
  };
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-sehat-light to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-sehat-dark mb-4">
                AI-Powered Health Risk Assessment
              </h1>
              <p className="text-lg text-black mb-8">
                Predict your risk for diabetes, heart disease, and Parkinson's disease
                with our advanced AI algorithms. Get personalized insights and actionable
                recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-sehat-primary hover:bg-sehat-secondary"
                  onClick={handleStartAssessment}
                >
                  Start Assessment <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-6 -left-6 bg-health-info rounded-full h-16 w-16 flex items-center justify-center animate-pulse-gentle">
                  <HeartPulse className="h-8 w-8 text-health-ocean" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-health-low rounded-full h-16 w-16 flex items-center justify-center animate-pulse-gentle" style={{ animationDelay: '0.5s' }}>
                  <Brain className="h-8 w-8 text-green-500" />
                </div>
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                    alt="AI Health Assessment" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Disease Assessment Cards */}
      <section id="disease-assessments" className="py-16 scroll-mt-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Disease Risk Assessments
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Diabetes Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:scale-105">
              <div className="h-3 bg-health-ocean"></div>
              <div className="p-6">
                <div className="bg-health-info bg-opacity-20 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                  <Droplets className="h-8 w-8 text-health-ocean" />
                </div>
                <h3 className="text-xl font-bold mb-3">Diabetes Risk Assessment</h3>
                <p className="text-gray-600 mb-4">
                  Analyze key health metrics like glucose levels, BMI, and family history to predict your risk of developing diabetes.
                </p>
                <Link to="/diabetes" className="block">
                  <Button className="w-full bg-health-info text-health-ocean hover:bg-health-info/80">
                    Take Assessment <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Heart Disease Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:scale-105">
              <div className="h-3 bg-health-high"></div>
              <div className="p-6">
                <div className="bg-health-elevated bg-opacity-20 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                  <HeartPulse className="h-8 w-8 text-health-high" />
                </div>
                <h3 className="text-xl font-bold mb-3">Heart Disease Risk Assessment</h3>
                <p className="text-gray-600 mb-4">
                  Evaluate cholesterol levels, blood pressure, age, and lifestyle factors to estimate your heart disease risk.
                </p>
                <Link to="/heart-disease" className="block">
                  <Button className="w-full bg-health-elevated text-health-high hover:bg-health-elevated/80">
                    Take Assessment <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Parkinson's Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:scale-105">
              <div className="h-3 bg-green-500"></div>
              <div className="p-6">
                <div className="bg-health-low bg-opacity-20 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Parkinson's Risk Assessment</h3>
                <p className="text-gray-600 mb-4">
                  Analyze voice patterns, tremor data, and other biomarkers to assess your risk for Parkinson's disease.
                </p>
                <Link to="/parkinsons" className="block">
                  <Button className="w-full bg-health-low text-green-700 hover:bg-health-low/80">
                    Take Assessment <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            How Sehat AI Works
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Our AI-powered platform uses advanced machine learning algorithms to analyze your health data and provide accurate risk assessments.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-sehat-light rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-sehat-primary font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter Health Data</h3>
              <p className="text-gray-600">
                Input your health metrics, medical history, and lifestyle information.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-sehat-light rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-sehat-primary font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Our AI algorithms analyze your data against verified medical models.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-sehat-light rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-sehat-primary font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Risk Assessment</h3>
              <p className="text-gray-600">
                Receive a personalized risk score and detailed breakdown.
              </p>
            </div>
            
            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-sehat-light rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-sehat-primary font-bold text-xl">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Report</h3>
              <p className="text-gray-600">
                Download a comprehensive report with visualizations and recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Tab Section for Disease Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="diabetes">Diabetes</TabsTrigger>
              <TabsTrigger value="heart">Heart Disease</TabsTrigger>
              <TabsTrigger value="parkinsons">Parkinson's</TabsTrigger>
            </TabsList>
            
            <TabsContent value="diabetes" className="bg-white p-6 rounded-lg shadow-md mt-4">
              <h3 className="text-2xl font-bold mb-4 text-health-ocean">Diabetes Risk Factors</h3>
              <p className="mb-4">
                Diabetes is a chronic condition that affects how your body processes blood sugar. Key risk factors include:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>High blood glucose (sugar) levels</li>
                <li>Family history of diabetes</li>
                <li>Being overweight or obese</li>
                <li>Physical inactivity</li>
                <li>Age (risk increases with age)</li>
                <li>High blood pressure</li>
                <li>History of gestational diabetes</li>
              </ul>
              <div className="mt-6">
                <Link to="/diabetes">
                  <Button className="bg-health-ocean">
                    Take Diabetes Assessment <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="heart" className="bg-white p-6 rounded-lg shadow-md mt-4">
              <h3 className="text-2xl font-bold mb-4 text-health-high">Heart Disease Risk Factors</h3>
              <p className="mb-4">
                Heart disease refers to various conditions that affect the heart. Major risk factors include:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>High blood pressure</li>
                <li>High cholesterol</li>
                <li>Smoking</li>
                <li>Obesity</li>
                <li>Diabetes</li>
                <li>Family history of heart disease</li>
                <li>Age (risk increases with age)</li>
                <li>Sedentary lifestyle</li>
              </ul>
              <div className="mt-6">
                <Link to="/heart-disease">
                  <Button className="bg-health-high">
                    Take Heart Disease Assessment <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="parkinsons" className="bg-white p-6 rounded-lg shadow-md mt-4">
              <h3 className="text-2xl font-bold mb-4 text-green-600">Parkinson's Disease Risk Factors</h3>
              <p className="mb-4">
                Parkinson's disease is a progressive disorder that affects movement. Common risk factors include:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Age (risk increases with age)</li>
                <li>Family history of Parkinson's</li>
                <li>Gender (more common in men)</li>
                <li>Environmental toxins exposure</li>
                <li>Head injuries</li>
                <li>Certain genetic mutations</li>
              </ul>
              <div className="mt-6">
                <Link to="/parkinsons">
                  <Button className="bg-green-600">
                    Take Parkinson's Assessment <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-sehat-primary bg-opacity-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Take Control of Your Health Today
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
            Early detection is key to managing health risks. Use our AI-powered tools to 
            gain valuable insights about your health and take proactive steps toward prevention.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-sehat-primary hover:bg-sehat-secondary"
              onClick={handleStartAssessment}
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Start Assessment
            </Button>
            
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
