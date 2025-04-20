import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Droplets, Info, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const DiabetesAssessment = () => {
  const [file, setFile] = useState(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  
  // Form state
  const [formData, setFormData] = useState({
    age: 45,
    gender: 'male',
    glucose: 120,
    bloodPressure: 80,
    skinThickness: 20,
    insulin: 79,
    bmi: 25,
    diabetesPedigree: 0.52,
    pregnant: false,
    pregnancies: 0,
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  // Handle slider changes
  const handleSliderChange = (name: string, value: number[]) => {
    setFormData({
      ...formData,
      [name]: value[0],
    });
  };
  
  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };
  
  // Handle gender change
  const handleGenderChange = (gender: string) => {
    setFormData({
      ...formData,
      gender,
      pregnant: gender === 'female' ? formData.pregnant : false,
    });
  };
  const handleGetMetrics = async (file: any) => {
    if (!file) return;
  
    const form = new FormData();
    form.append("file", file);
  
    try {
      const res = await fetch("/api/extract-health-metrics", {
        method: "POST",
        body: form,
      });
  
      const result = await res.json();
  
      if (result.success) {
        const metrics = result.data.metrics;
  
        // If metrics are nested inside raw_response, try to parse it
        const parsed =
          typeof metrics === "string"
            ? JSON.parse(metrics)
            : metrics?.raw_response
            ? JSON.parse(metrics.raw_response.replace(/```(json)?/g, ""))
            : metrics;
  
        setFormData((prevData) => ({
          age: parsed.Age ?? prevData.age,
          gender: parsed.Gender ?? prevData.gender,
          glucose: parsed.Glucose ?? parsed["Glucose (mg/dL)"] ?? prevData.glucose,
          bloodPressure: parsed["Blood Pressure"] ?? prevData.bloodPressure,
          skinThickness: parsed["Skin Thickness"] ?? parsed["Skin Thickness (mm)"] ?? prevData.skinThickness,
          insulin: parsed.Insulin ?? parsed["Insulin (μU/mL)"] ?? prevData.insulin,
          bmi: parsed.BMI ?? prevData.bmi,
          diabetesPedigree:
            parsed["Diabetes Pedigree Function"] ?? prevData.diabetesPedigree,
          pregnant: prevData.pregnant,
          pregnancies: prevData.pregnancies,
        }));
      } else {
        console.error("Backend error:", result.error);
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here would be the API call to send the data for processing
    console.log('Form submitted:', formData);
    
    // Save to localStorage for the reports page to use
    localStorage.setItem('diabetesAssessment', JSON.stringify({ diabetes: formData }));
    
    // Show toast notification
    toast({
      title: 'Assessment Submitted',
      description: 'Your diabetes risk assessment is being processed.',
    });
    
    // Redirect to the specific diabetes report page
    setTimeout(() => {
      navigate('/reports?type=diabetes');
    }, 1500);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDelete = () => {
    setFile(null);
    const input = document.getElementById('input-file') as HTMLInputElement;
    if (input) input.value = ''; 
  };

  const handleDragOver = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  };
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <div className="bg-health-info rounded-full p-3 mr-4">
              <Droplets className="h-8 w-8 text-health-ocean" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Diabetes Risk Assessment</h1>
              <p className="text-gray-600">
                Enter your health information to assess your diabetes risk
              </p>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Health Information</CardTitle>
              <CardDescription>
                Please provide accurate information for a more precise assessment.
                All data is kept confidential and secure.
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Age */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="age" className="health-label">Age (years)</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button type='button' variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                <HelpCircle className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Age is a significant risk factor for diabetes. Risk increases with age.</p>
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
                      <Label className="health-label">Gender</Label>
                      <div className="flex space-x-4">
                        <Button
                          type="button"
                          variant={formData.gender === 'male' ? 'default' : 'outline'}
                          onClick={() => handleGenderChange('male')}
                          className={formData.gender === 'male' ? 'bg-sehat-primary' : ''}
                        >
                          Male
                        </Button>
                        <Button
                          type="button"
                          variant={formData.gender === 'female' ? 'default' : 'outline'}
                          onClick={() => handleGenderChange('female')}
                          className={formData.gender === 'female' ? 'bg-sehat-primary' : ''}
                        >
                          Female
                        </Button>
                      </div>
                    </div>
                    
                    {/* Pregnancies (Female only) */}
                    {formData.gender === 'female' && (
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Label className="health-label">Have you been pregnant?</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button type='button' variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                  <HelpCircle className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">Pregnancy history can affect diabetes risk.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={formData.pregnant}
                            onCheckedChange={(checked) => handleSwitchChange('pregnant', checked)}
                          />
                          <Label>{formData.pregnant ? 'Yes' : 'No'}</Label>
                        </div>
                      </div>
                    )}

                    {/* Number of Pregnancies */}
                    {formData.gender === 'female' && formData.pregnant && (
                      <div className="space-y-2">
                        <Label htmlFor="pregnancies" className="health-label">
                          Number of Pregnancies
                        </Label>
                        <Input
                          id="pregnancies"
                          name="pregnancies"
                          type="number"
                          min="0"
                          max="20"
                          value={formData.pregnancies}
                          onChange={handleInputChange}
                          className="health-input"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Clinical Measurements */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Clinical Measurements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Glucose */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="glucose" className="health-label">
                          Glucose (mg/dL)
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button type='button' variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                <HelpCircle className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Fasting blood glucose level. Normal range: 70-99 mg/dL</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Slider
                          name="glucose"
                          min={70}
                          max={300}
                          step={1}
                          value={[formData.glucose]}
                          onValueChange={(value) => handleSliderChange('glucose', value)}
                          className="flex-1"
                        />
                        <span className="w-12 text-right">{formData.glucose}</span>
                      </div>
                      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            formData.glucose < 100 
                              ? 'bg-green-500' 
                              : formData.glucose < 126 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, (formData.glucose / 300) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Normal</span>
                        <span>Prediabetic</span>
                        <span>Diabetic</span>
                      </div>
                    </div>
                    
                    {/* Blood Pressure */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="bloodPressure" className="health-label">
                          Blood Pressure (diastolic, mm Hg)
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button type='button' variant="ghost" size="icon" className="h-5 w-5 ml-1 ">
                                <HelpCircle className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Diastolic blood pressure. Normal range: below 80 mm Hg</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="bloodPressure"
                        name="bloodPressure"
                        type="number"
                        min="40"
                        max="180"
                        value={formData.bloodPressure}
                        onChange={handleInputChange}
                        className="health-input"
                      />
                    </div>
                    
                    {/* Skin Thickness */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="skinThickness" className="health-label">
                          Skin Thickness (triceps, mm)
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button type='button' variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                <HelpCircle className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Triceps skin fold thickness. Indicator of body fat.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="skinThickness"
                        name="skinThickness"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.skinThickness}
                        onChange={handleInputChange}
                        className="health-input"
                      />
                    </div>
                    
                    {/* Insulin */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="insulin" className="health-label">
                          Insulin (mu U/ml)
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button type='button' variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                <HelpCircle className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">2-Hour serum insulin level. Normal fasting range: 2-25 mu U/ml</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="insulin"
                        name="insulin"
                        type="number"
                        min="0"
                        max="300"
                        value={formData.insulin}
                        onChange={handleInputChange}
                        className="health-input"
                      />
                    </div>
                    
                    {/* BMI */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="bmi" className="health-label">
                          BMI (kg/m²)
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button  type='button' variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                <HelpCircle className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Body Mass Index. Normal range: 18.5-24.9</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Slider
                          name="bmi"
                          min={15}
                          max={50}
                          step={0.1}
                          value={[formData.bmi]}
                          onValueChange={(value) => handleSliderChange('bmi', value)}
                          className="flex-1"
                        />
                        <span className="w-12 text-right">{formData.bmi.toFixed(1)}</span>
                      </div>
                      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            formData.bmi < 18.5 
                              ? 'bg-yellow-500' 
                              : formData.bmi < 25 
                                ? 'bg-green-500' 
                                : formData.bmi < 30 
                                  ? 'bg-yellow-500' 
                                  : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, (formData.bmi / 50) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Underweight</span>
                        <span>Normal</span>
                        <span>Overweight</span>
                        <span>Obese</span>
                      </div>
                    </div>
                    
                    {/* Diabetes Pedigree Function */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="diabetesPedigree" className="health-label">
                          Diabetes Pedigree
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button type='button' variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                <HelpCircle className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Diabetes pedigree function scores the likelihood of diabetes based on family history.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Slider
                          name="diabetesPedigree"
                          min={0.078}
                          max={2.42}
                          step={0.001}
                          value={[formData.diabetesPedigree]}
                          onValueChange={(value) => handleSliderChange('diabetesPedigree', value)}
                          className="flex-1"
                        />
                        <span className="w-12 text-right">{formData.diabetesPedigree.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className='py-5 flex flex-col'>
                  
                  <h1 className=' file-label py-5'>Upload your Lab Report</h1>
                  <label htmlFor="input-file" id='drop-area'>
                    <input type='file' accept='pdf/*' id='input-file' hidden></input>
                    <div id='image-view' className='flex px-5 items-center justify-center'>
                      <img src='public\508-icon.png' height={10} width={120}></img>
                      <p className='px-16 file-label'>Drag and drop or click here<br/>to upload lab report</p>
                    </div>
                  </label>
                </div> */}
                <div className='py-5 flex flex-col'>
                    <h1 className='file-label py-5'>Upload your Lab Report</h1>

                    {!file ? (
                      <label 
                        htmlFor="input-file" 
                        id='drop-area'
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="border-2 border-dashed border-gray-400 p-4 rounded-lg cursor-pointer"
                      >
                        <input 
                          type='file' 
                          accept='application/pdf' 
                          id='input-file' 
                          hidden 
                          onChange={handleFileChange}
                        />
                        <div className='flex flex-col items-center justify-center'>
                          <img src='/508-icon.png' height={60} width={60} alt="upload" />
                          <p className='pt-4 text-center text-black '>
                            Drag and drop or click here<br/>to upload lab report
                          </p>
                        </div>
                      </label>
                    ) : (
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded border border-gray-300">
                        <span className="text-sm text-gray-800">{file.name}</span>
                        <button 
                          onClick={handleDelete} 
                          className="text-red-500 hover:text-red-700 text-sm font-semibold ml-4"
                        >
                          ✕ Remove
                        </button>
                      </div>
                    )}
                </div>
                <Button  type="button" onClick={()=>{handleGetMetrics(file)}} className="bg-health-ocean hover:bg-blue-700">
                 Get Metrics
                </Button>
                
                <div className="px-4 py-3 bg-blue-50 border border-blue-100 rounded-md flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    Your data will be processed using our AI model to predict your risk of diabetes. 
                    This assessment is for informational purposes only and does not replace medical advice. 
                    Always consult with a healthcare professional for proper diagnosis and treatment.
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end space-x-4">
                <Button type="button" variant="outline">
                  Reset Form
                </Button>
                <Button type="submit" className="bg-health-ocean hover:bg-blue-700">
                  Calculate My Risk
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default DiabetesAssessment;
