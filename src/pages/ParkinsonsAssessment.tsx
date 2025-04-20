import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
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
import { 
  Brain, 
  Info, 
  HelpCircle,
  Mic,
  AudioWaveform
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const ParkinsonsAssessment = () => {
  const { toast } = useToast();
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  
  // Form state for voice features
  const [formData, setFormData] = useState({
    // Voice features
    MDVP_Fo: 154.23, // Average vocal fundamental frequency
    MDVP_Fhi: 197.11, // Maximum vocal fundamental frequency
    MDVP_Flo: 116.32, // Minimum vocal fundamental frequency
    MDVP_Jitter: 0.00662, // Measure of variation in fundamental frequency
    MDVP_Shimmer: 0.04374, // Measure of variation in amplitude
    NHR: 0.01395, // Noise-to-harmonics ratio
    HNR: 21.64, // Harmonics-to-noise ratio
    RPDE: 0.54867, // Nonlinear dynamical complexity measure
    DFA: 0.68561, // Signal fractal scaling exponent
    spread1: -5.684, // Nonlinear measure of fundamental frequency variation
    spread2: 0.226285, // Nonlinear measure of fundamental frequency variation
    D2: 2.301442, // Correlation dimension
    PPE: 0.164053, // Nonlinear measure of fundamental frequency variation
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
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here would be the API call to send the data for processing
    console.log('Form submitted:', formData);
    
    // Save to localStorage for the reports page to use
    localStorage.setItem('parkinsonsAssessment', JSON.stringify({ 
      parkinsons: formData,
      date: new Date().toISOString()
    }));
    
    // Show toast notification
    toast({
      title: 'Assessment Submitted',
      description: "Your Parkinson's disease risk assessment is being processed.",
    });
    
    // Navigate to results page
    setTimeout(() => {
      navigate('/reports?type=parkinsons');
    }, 1500);
  };

  // Reset form handler
  const handleResetForm = () => {
    setFormData({
      MDVP_Fo: 154.23,
      MDVP_Fhi: 197.11,
      MDVP_Flo: 116.32,
      MDVP_Jitter: 0.00662,
      MDVP_Shimmer: 0.04374,
      NHR: 0.01395,
      HNR: 21.64,
      RPDE: 0.54867,
      DFA: 0.68561,
      spread1: -5.684,
      spread2: 0.226285,
      D2: 2.301442,
      PPE: 0.164053,
    });
    
    toast({
      title: 'Form Reset',
      description: "All values have been reset to defaults.",
    });
  };

  // Simplified voice recording simulation
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    // Simulate recording with timer
    const timer = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 5) {
          clearInterval(timer);
          setIsRecording(false);
          
          // Simulate analysis completion
          toast({
            title: 'Voice Analysis Complete',
            description: 'Your voice parameters have been analyzed and updated.',
          });
          
          // Simulate updating values with random variations
          setFormData(prev => ({
            ...prev,
            MDVP_Fo: prev.MDVP_Fo + (Math.random() * 10 - 5),
            MDVP_Jitter: Math.max(0.001, prev.MDVP_Jitter + (Math.random() * 0.002 - 0.001)),
            MDVP_Shimmer: Math.max(0.01, prev.MDVP_Shimmer + (Math.random() * 0.01 - 0.005)),
            HNR: Math.max(5, prev.HNR + (Math.random() * 4 - 2)),
            RPDE: Math.max(0.2, Math.min(0.8, prev.RPDE + (Math.random() * 0.1 - 0.05))),
          }));
          
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
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
  
  const handleGetParkinsonsMetrics = async (file: any) => {
    if (!file) return;
  
    const form = new FormData();
    form.append("file", file);
  
    try {
      const res = await fetch("http://localhost:5000/api/extract-health-metrics?type=parkinsons", {
        method: "POST",
        body: form,
      });
  
      const result = await res.json();
  
      if (result.success) {
        const metrics = result.data.metrics;
  
        const parsed =
          typeof metrics === "string"
            ? JSON.parse(metrics)
            : metrics?.raw_response
            ? JSON.parse(metrics.raw_response.replace(/```(json)?/g, ""))
            : metrics;
            const parseIfValid = (val: any, fallback: number) =>
              val !== undefined && val !== null && val !== "" && !Number.isNaN(Number(val))
                ? parseFloat(val)
                : fallback;
                
            setFormData((prevData) => ({
              ...prevData,
              MDVP_Fo: parseIfValid(parsed.MDVP_Fo, prevData.MDVP_Fo),
              MDVP_Fhi: parseIfValid(parsed.MDVP_Fhi, prevData.MDVP_Fhi),
              MDVP_Flo: parseIfValid(parsed.MDVP_Flo, prevData.MDVP_Flo),
              MDVP_Jitter: parseIfValid(parsed.MDVP_Jitter, prevData.MDVP_Jitter),
              MDVP_Shimmer: parseIfValid(parsed.MDVP_Shimmer, prevData.MDVP_Shimmer),
              NHR: parseIfValid(parsed.NHR, prevData.NHR),
              HNR: parseIfValid(parsed.HNR, prevData.HNR),
              RPDE: parseIfValid(parsed.RPDE, prevData.RPDE),
              DFA: parseIfValid(parsed.DFA, prevData.DFA),
              spread1: parseIfValid(parsed.spread1, prevData.spread1),
              spread2: parseIfValid(parsed.spread2, prevData.spread2),
              D2: parseIfValid(parsed.D2, prevData.D2),
              PPE: parseIfValid(parsed.PPE, prevData.PPE),
            }));
      } else {
        console.error("Backend error:", result.error);
      }
    } catch (error) {
      console.error("Error fetching Parkinson's metrics:", error);
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <div className="bg-health-low bg-opacity-50 rounded-full p-3 mr-4">
              <Brain className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Parkinson's Disease Risk Assessment</h1>
              <p className="text-gray-600">
                Enter voice parameters or record your voice for Parkinson's disease risk assessment
              </p>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Voice Analysis Parameters</CardTitle>
              <CardDescription>
                Parkinson's disease can affect speech. Our AI analyzes voice biomarkers to assess potential risk.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="mb-8 bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                  <Mic className="h-5 w-5 mr-2" />
                  Voice Recording
                </h3>
                <p className="text-green-700 mb-4">
                  Record your voice saying "aaah" at a steady tone for 5 seconds to automatically 
                  calculate your voice parameters. Or manually adjust the parameters below.
                </p>
                
                <div className="flex items-center justify-between mb-2">
                  <Button 
                    type="button" 
                    className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
                    onClick={startRecording}
                    disabled={isRecording}
                  >
                    {isRecording ? (
                      <>
                        <AudioWaveform className="h-4 w-4 mr-2 animate-pulse" />
                        Recording... ({recordingTime}s)
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-2" />
                        Start Voice Recording
                      </>
                    )}
                  </Button>
                  
                  {isRecording && (
                    <div className="flex space-x-1">
                      {[...Array(10)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-1.5 h-8 bg-green-500 rounded-full animate-pulse"
                          style={{ 
                            animationDelay: `${i * 0.1}s`,
                            height: `${Math.random() * 24 + 8}px`
                          }}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Voice Parameters</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Fundamental Frequency (Fo) */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="MDVP_Fo" className="health-label">
                          Average Vocal Frequency (Hz)
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                <HelpCircle className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Average fundamental frequency of the voice (MDVP:Fo). Normal range for men: 85-180 Hz, women: 165-255 Hz.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Slider
                          name="MDVP_Fo"
                          min={85}
                          max={255}
                          step={0.01}
                          value={[formData.MDVP_Fo]}
                          onValueChange={(value) => handleSliderChange('MDVP_Fo', value)}
                          className="flex-1"
                        />
                        <span className="w-16 text-right">{formData.MDVP_Fo.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {/* Maximum Frequency (Fhi) */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="MDVP_Fhi" className="health-label">
                          Maximum Frequency (Hz)
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                <HelpCircle className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Maximum fundamental frequency of the voice (MDVP:Fhi).</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="MDVP_Fhi"
                        name="MDVP_Fhi"
                        type="number"
                        step="0.01"
                        value={formData.MDVP_Fhi}
                        onChange={handleInputChange}
                        className="health-input"
                      />
                    </div>
                    
                    {/* Minimum Frequency (Flo) */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="MDVP_Flo" className="health-label">
                          Minimum Frequency (Hz)
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                <HelpCircle className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Minimum fundamental frequency of the voice (MDVP:Flo).</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="MDVP_Flo"
                        name="MDVP_Flo"
                        type="number"
                        step="0.01"
                        value={formData.MDVP_Flo}
                        onChange={handleInputChange}
                        className="health-input"
                      />
                    </div>
                    
                    {/* Jitter */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="MDVP_Jitter" className="health-label">
                          Jitter (%)
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                <HelpCircle className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Measure of variation in fundamental frequency. Higher values may indicate vocal instability common in Parkinson's.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Slider
                          name="MDVP_Jitter"
                          min={0.001}
                          max={0.02}
                          step={0.00001}
                          value={[formData.MDVP_Jitter]}
                          onValueChange={(value) => handleSliderChange('MDVP_Jitter', value)}
                          className="flex-1"
                        />
                        <span className="w-16 text-right">{formData.MDVP_Jitter.toFixed(5)}</span>
                      </div>
                    </div>
                    
                    {/* Shimmer */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="MDVP_Shimmer" className="health-label">
                          Shimmer (%)
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                <HelpCircle className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Measure of variation in amplitude. Higher values may indicate vocal instability common in Parkinson's.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Slider
                          name="MDVP_Shimmer"
                          min={0.01}
                          max={0.1}
                          step={0.0001}
                          value={[formData.MDVP_Shimmer]}
                          onValueChange={(value) => handleSliderChange('MDVP_Shimmer', value)}
                          className="flex-1"
                        />
                        <span className="w-16 text-right">{formData.MDVP_Shimmer.toFixed(5)}</span>
                      </div>
                    </div>
                    
                    {/* NHR */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="NHR" className="health-label">
                          Noise-to-Harmonics Ratio
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                <HelpCircle className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Ratio of noise to harmonic components in the voice. Higher values may indicate vocal disorders.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="NHR"
                        name="NHR"
                        type="number"
                        step="0.0001"
                        value={formData.NHR}
                        onChange={handleInputChange}
                        className="health-input"
                      />
                    </div>
                    
                    {/* HNR */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="HNR" className="health-label">
                          Harmonics-to-Noise Ratio (dB)
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                <HelpCircle className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Ratio of harmonic components to noise in the voice. Lower values may indicate vocal disorders.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="HNR"
                        name="HNR"
                        type="number"
                        step="0.01"
                        value={formData.HNR}
                        onChange={handleInputChange}
                        className="health-input"
                      />
                    </div>
                    
                    {/* RPDE */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="RPDE" className="health-label">
                          RPDE
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                <HelpCircle className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Recurrence Period Density Entropy, a nonlinear measure of vocal dynamics. Values closer to 1 may indicate increased complexity in Parkinson's.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Slider
                          name="RPDE"
                          min={0.1}
                          max={0.9}
                          step={0.00001}
                          value={[formData.RPDE]}
                          onValueChange={(value) => handleSliderChange('RPDE', value)}
                          className="flex-1"
                        />
                        <span className="w-16 text-right">{formData.RPDE.toFixed(5)}</span>
                      </div>
                    </div>
                    
                    {/* Advanced Parameters Section */}
                    <div className="col-span-1 md:col-span-2">
                      <div className="text-gray-600 text-sm mb-2 flex items-center">
                        <Info className="h-4 w-4 mr-1" />
                        Advanced parameters (typically computer-generated from voice analysis)
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* DFA */}
                        <div className="space-y-2">
                          <Label htmlFor="DFA" className="health-label">
                            DFA
                          </Label>
                          <Input
                            id="DFA"
                            name="DFA"
                            type="number"
                            step="0.00001"
                            value={formData.DFA}
                            onChange={handleInputChange}
                            className="health-input"
                          />
                        </div>
                        
                        {/* spread1 */}
                        <div className="space-y-2">
                          <Label htmlFor="spread1" className="health-label">
                            Spread1
                          </Label>
                          <Input
                            id="spread1"
                            name="spread1"
                            type="number"
                            step="0.00001"
                            value={formData.spread1}
                            onChange={handleInputChange}
                            className="health-input"
                          />
                        </div>
                        
                        {/* spread2 */}
                        <div className="space-y-2">
                          <Label htmlFor="spread2" className="health-label">
                            Spread2
                          </Label>
                          <Input
                            id="spread2"
                            name="spread2"
                            type="number"
                            step="0.00001"
                            value={formData.spread2}
                            onChange={handleInputChange}
                            className="health-input"
                          />
                        </div>
                        
                        {/* D2 */}
                        <div className="space-y-2">
                          <Label htmlFor="D2" className="health-label">
                            D2
                          </Label>
                          <Input
                            id="D2"
                            name="D2"
                            type="number"
                            step="0.00001"
                            value={formData.D2}
                            onChange={handleInputChange}
                            className="health-input"
                          />
                        </div>
                        
                        {/* PPE */}
                        <div className="space-y-2">
                          <Label htmlFor="PPE" className="health-label">
                            PPE
                          </Label>
                          <Input
                            id="PPE"
                            name="PPE"
                            type="number"
                            step="0.00001"
                            value={formData.PPE}
                            onChange={handleInputChange}
                            className="health-input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
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
                <Button  type="button" onClick={()=>{handleGetParkinsonsMetrics(file)}} className="bg-health-ocean hover:bg-blue-700">
                 Get Metrics
                </Button>

                  <div className="px-4 py-3 bg-green-50 border border-green-100 rounded-md flex items-start">
                    <Info className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-700">
                      Your voice data will be processed using our AI model to predict your Parkinson's disease risk. 
                      This assessment is for informational purposes only and does not replace medical advice. 
                      Always consult with a healthcare professional for proper diagnosis and treatment.
                    </p>
                  </div>
                </div>
                
                <CardFooter className="flex justify-end space-x-4 mt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleResetForm}
                  >
                    Reset Form
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
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

export default ParkinsonsAssessment;
