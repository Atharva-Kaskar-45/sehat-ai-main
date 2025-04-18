
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Heart,
  Info,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { calculateHeartDiseaseRisk } from '@/utils/riskAssessment';

const HeartDiseaseAssessment = () => {
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();
  
  // Form state for heart disease assessment
  const [formData, setFormData] = useState({
    // Personal information
    age: 45,
    gender: 'male',
    // Vital statistics
    cholesterol: 190,
    bloodPressure: 120,
    heartRate: 72,
    // Health factors
    exercise: 3,
    smoker: false,
    diabetic: false,
    familyHistory: false,
    bmi: 24.5,
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0,
    });
  };
  
  // Handle slider changes
  const handleSliderChange = (name: string, value: number[]) => {
    setFormData({
      ...formData,
      [name]: value[0],
    });
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate risk assessment using the utility function
    const riskAssessment = calculateHeartDiseaseRisk(formData);
    
    // Save both form data and results to localStorage
    localStorage.setItem('heartDiseaseAssessment', JSON.stringify({
      formData: formData,
      results: riskAssessment
    }));
    
    // Log data for debugging
    console.log('Form submitted:', formData);
    console.log('Risk assessment results:', riskAssessment);
    
    // Show toast notification using both UI methods for better visibility
    uiToast({
      title: 'Assessment Submitted',
      description: "Your heart disease risk assessment is being processed.",
    });
    
    toast.success("Assessment complete!", {
      description: "Your heart disease risk assessment has been calculated.",
      duration: 3000,
    });
    
    // Navigate to results page
    setTimeout(() => {
      navigate('/reports?type=heartDisease');
    }, 1500);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <div className="bg-red-100 rounded-full p-3 mr-4">
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Heart Disease Risk Assessment</h1>
              <p className="text-gray-600">
                Complete this assessment to evaluate your heart disease risk factors
              </p>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Cardiovascular Health Assessment</CardTitle>
              <CardDescription>
                Heart disease is a leading cause of death globally. Understanding your risk factors can help you make informed health decisions.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Age */}
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Label htmlFor="age">Age (years)</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                  <HelpCircle className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">Risk of heart disease increases with age, especially after 45 for men and 55 for women.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Slider
                            name="age"
                            min={18}
                            max={100}
                            step={1}
                            value={[formData.age]}
                            onValueChange={(value) => handleSliderChange('age', value)}
                            className="flex-1"
                          />
                          <span className="w-12 text-right">{formData.age}</span>
                        </div>
                      </div>
                      
                      {/* Gender */}
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) => handleSelectChange('gender', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* BMI */}
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Label htmlFor="bmi">Body Mass Index (BMI)</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                  <HelpCircle className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">BMI: Normal (18.5-24.9), Overweight (25-29.9), Obese (≥30)</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Slider
                            name="bmi"
                            min={15}
                            max={45}
                            step={0.1}
                            value={[formData.bmi]}
                            onValueChange={(value) => handleSliderChange('bmi', value)}
                            className="flex-1"
                          />
                          <span className="w-12 text-right">{formData.bmi.toFixed(1)}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formData.bmi < 18.5 && "Underweight"}
                          {formData.bmi >= 18.5 && formData.bmi < 25 && "Normal weight"}
                          {formData.bmi >= 25 && formData.bmi < 30 && "Overweight"}
                          {formData.bmi >= 30 && "Obese"}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Cardiovascular Metrics Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Cardiovascular Metrics</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Cholesterol */}
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Label htmlFor="cholesterol">Total Cholesterol (mg/dL)</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                  <HelpCircle className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">Desirable: Below 200 mg/dL, Borderline high: 200-239 mg/dL, High: 240 mg/dL and above</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Slider
                            name="cholesterol"
                            min={100}
                            max={350}
                            step={1}
                            value={[formData.cholesterol]}
                            onValueChange={(value) => handleSliderChange('cholesterol', value)}
                            className="flex-1"
                          />
                          <span className="w-12 text-right">{formData.cholesterol}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formData.cholesterol < 200 && "Desirable"}
                          {formData.cholesterol >= 200 && formData.cholesterol < 240 && "Borderline high"}
                          {formData.cholesterol >= 240 && "High"}
                        </div>
                      </div>
                      
                      {/* Blood Pressure */}
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Label htmlFor="bloodPressure">Systolic Blood Pressure (mm Hg)</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                  <HelpCircle className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">Normal: Below 120, Elevated: 120-129, Stage 1 hypertension: 130-139, Stage 2 hypertension: 140+</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Slider
                            name="bloodPressure"
                            min={80}
                            max={200}
                            step={1}
                            value={[formData.bloodPressure]}
                            onValueChange={(value) => handleSliderChange('bloodPressure', value)}
                            className="flex-1"
                          />
                          <span className="w-12 text-right">{formData.bloodPressure}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formData.bloodPressure < 120 && "Normal"}
                          {formData.bloodPressure >= 120 && formData.bloodPressure < 130 && "Elevated"}
                          {formData.bloodPressure >= 130 && formData.bloodPressure < 140 && "Stage 1 hypertension"}
                          {formData.bloodPressure >= 140 && "Stage 2 hypertension"}
                        </div>
                      </div>
                      
                      {/* Heart Rate */}
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Label htmlFor="heartRate">Resting Heart Rate (bpm)</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                  <HelpCircle className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">Normal resting heart rate for adults: 60-100 beats per minute. Athletes may have lower rates.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Slider
                            name="heartRate"
                            min={40}
                            max={150}
                            step={1}
                            value={[formData.heartRate]}
                            onValueChange={(value) => handleSliderChange('heartRate', value)}
                            className="flex-1"
                          />
                          <span className="w-12 text-right">{formData.heartRate}</span>
                        </div>
                      </div>
                      
                      {/* Exercise Frequency */}
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Label htmlFor="exercise">Exercise (days per week)</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                  <HelpCircle className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">Recommendation: 150 minutes of moderate exercise or 75 minutes of vigorous exercise per week.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Slider
                            name="exercise"
                            min={0}
                            max={7}
                            step={1}
                            value={[formData.exercise]}
                            onValueChange={(value) => handleSliderChange('exercise', value)}
                            className="flex-1"
                          />
                          <span className="w-12 text-right">{formData.exercise}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Health History Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Health History</h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {/* Smoking Status */}
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <Label htmlFor="smoker">Current Smoker</Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                    <HelpCircle className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">Smoking significantly increases risk of heart disease.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <p className="text-sm text-muted-foreground">Do you currently smoke tobacco products?</p>
                        </div>
                        <Switch
                          id="smoker"
                          checked={formData.smoker}
                          onCheckedChange={(checked) => handleSwitchChange('smoker', checked)}
                        />
                      </div>
                      
                      {/* Diabetes Status */}
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <Label htmlFor="diabetic">Diabetes</Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                    <HelpCircle className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">Having diabetes doubles your risk of heart disease.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <p className="text-sm text-muted-foreground">Have you been diagnosed with diabetes?</p>
                        </div>
                        <Switch
                          id="diabetic"
                          checked={formData.diabetic}
                          onCheckedChange={(checked) => handleSwitchChange('diabetic', checked)}
                        />
                      </div>
                      
                      {/* Family History */}
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <Label htmlFor="familyHistory">Family History</Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                    <HelpCircle className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">Family history of heart disease increases your risk, especially in first-degree relatives.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <p className="text-sm text-muted-foreground">Do you have a family history of heart disease?</p>
                        </div>
                        <Switch
                          id="familyHistory"
                          checked={formData.familyHistory}
                          onCheckedChange={(checked) => handleSwitchChange('familyHistory', checked)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4 py-3 bg-blue-50 border border-blue-100 rounded-md flex items-start">
                    <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-700">
                      This assessment is for informational purposes only and does not replace medical advice. 
                      Always consult with a healthcare professional for proper diagnosis and treatment recommendations.
                    </p>
                  </div>
                </div>
                
                <CardFooter className="flex justify-end space-x-4 mt-6">
                  <Button type="button" variant="outline" onClick={() => window.location.href = '/'}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">
                    Calculate My Risk
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default HeartDiseaseAssessment;
