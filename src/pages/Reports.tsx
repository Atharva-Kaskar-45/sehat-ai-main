import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import RiskIndicator from '@/components/ui/RiskIndicator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { Printer, Info } from 'lucide-react';
import { 
  calculateDiabetesRisk, 
  calculateHeartDiseaseRisk, 
  calculateParkinsonsRisk,
  generateRecommendations 
} from '@/utils/riskAssessment';

interface AssessmentData {
  diabetes?: {
    age: number;
    gender: string;
    glucose: number;
    bloodPressure: number;
    skinThickness: number;
    insulin: number;
    bmi: number;
    diabetesPedigree: number;
    pregnant: boolean;
    pregnancies: number;
  };
  heartDisease?: {
    age: number;
    gender: string;
    cholesterol: number;
    bloodPressure: number;
    heartRate: number;
    exercise: number;
    smoker: boolean;
    diabetic: boolean;
    familyHistory: boolean;
    bmi?: number;
  };
  parkinsons?: {
    MDVP_Fo: number;
    MDVP_Fhi: number;
    MDVP_Flo: number;
    MDVP_Jitter: number;
    MDVP_Shimmer: number;
    NHR: number;
    HNR: number;
    RPDE: number;
    DFA: number;
    spread1: number;
    spread2: number;
    D2: number;
    PPE: number;
  };
}

interface AssessmentResult {
  risk: 'low' | 'medium' | 'high' | 'unknown';
  score: number;
  insights: string[];
  recommendations: string[];
}

const Reports = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const assessmentType = params.get('type') || 'diabetes';
  
  const printRef = useRef<HTMLDivElement>(null);
  
  const [assessmentData, setAssessmentData] = useState<AssessmentData>(() => {
    const storedData = localStorage.getItem(`${assessmentType}Assessment`);
    
    if (storedData) {
      try {
        return JSON.parse(storedData);
        return parsed.formData ? { [assessmentType]: parsed.formData } : parsed;
      } catch (e) {
        console.error('Error parsing stored assessment data:', e);
      }
    }
    
    return {
      diabetes: {
        age: 45,
        gender: 'female',
        glucose: 120,
        bloodPressure: 80,
        skinThickness: 20,
        insulin: 79,
        bmi: 25,
        diabetesPedigree: 0.52,
        pregnant: false,
        pregnancies: 0,
      },
      heartDisease: {
        age: 50,
        gender: 'male',
        cholesterol: 210,
        bloodPressure: 130,
        heartRate: 75,
        exercise: 3,
        smoker: false,
        diabetic: false,
        familyHistory: true,
      },
      parkinsons: {
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
      }
    };
  });
  
  const [result, setResult] = useState<AssessmentResult>({
    risk: 'unknown',
    score: 0,
    insights: [],
    recommendations: []
  });
  
  useEffect(() => {
    let calculatedResult: {
      risk: 'low' | 'medium' | 'high' | 'unknown';
      score: number;
      insights: string[];
    };
    
    switch (assessmentType) {
      case 'diabetes':
        if (assessmentData.diabetes) {
          calculatedResult = calculateDiabetesRisk(assessmentData.diabetes);
        } else {
          return;
        }
        break;
        
      case 'heartDisease':
        if (assessmentData.heartDisease) {
          calculatedResult = calculateHeartDiseaseRisk(assessmentData.heartDisease);
        } else {
          return;
        }
        break;
        
      case 'parkinsons':
        if (assessmentData.parkinsons) {
          calculatedResult = calculateParkinsonsRisk(assessmentData.parkinsons);
        } else {
          return;
        }
        break;
        
      default:
        calculatedResult = {
          risk: 'unknown',
          score: 0,
          insights: ['Unable to determine risk without valid assessment data.']
        };
    }
    
    const recommendations = generateRecommendations(
      assessmentType as 'diabetes' | 'heartDisease' | 'parkinsons', 
      calculatedResult.risk
    );
    
    setResult({
      ...calculatedResult,
      recommendations
    });
  }, [assessmentType, assessmentData]);
  
  const getKeyMetricsData = () => {
    switch (assessmentType) {
      case 'diabetes': {
        const data = assessmentData.diabetes;
        if (!data) return [];
        
        return [
          { name: 'Glucose', value: data.glucose, color: '#00BFFF', unit: 'mg/dL' },
          { name: 'BMI', value: data.bmi, color: '#FFA500', unit: 'kg/m²' },
          { name: 'Blood Pressure', value: data.bloodPressure, color: '#FF6347', unit: 'mmHg' },
          { name: 'Insulin', value: data.insulin, color: '#2E8B57', unit: 'μU/mL' },
          { name: 'Diabetes Pedigree', value: data.diabetesPedigree, color: '#9370DB', unit: 'score' }
        ];
      }
      
      case 'heartDisease': {
        const data = assessmentData.heartDisease;
        if (!data) return [];
        
        return [
          { name: 'Cholesterol', value: data.cholesterol, color: '#FF6347', unit: 'mg/dL' },
          { name: 'Blood Pressure', value: data.bloodPressure, color: '#00BFFF', unit: 'mmHg' },
          { name: 'Heart Rate', value: data.heartRate, color: '#FFA500', unit: 'bpm' },
          { name: 'Exercise Level', value: data.exercise, color: '#2E8B57', unit: 'days/week' },
          { name: 'Age Factor', value: data.age, color: '#9370DB', unit: 'years' }
        ];
      }
      
      case 'parkinsons': {
        const data = assessmentData.parkinsons;
        if (!data) return [];
        
        return [
          { name: 'MDVP_Fo', value: data.MDVP_Fo, color: '#00BFFF', unit: 'Hz' },
          { name: 'MDVP_Jitter', value: data.MDVP_Jitter * 1000, color: '#FF6347', unit: '×10⁻³' },
          { name: 'MDVP_Shimmer', value: data.MDVP_Shimmer * 100, color: '#FFA500', unit: '%' },
          { name: 'HNR', value: data.HNR, color: '#2E8B57', unit: 'dB' },
          { name: 'PPE', value: data.PPE, color: '#9370DB', unit: '' }
        ];
      }
      
      default:
        return [];
    }
  };
  
  const getMetricsTable = (): { parameter: string; value: number | string; normalRange: string; status: string; statusColor: string }[] => {
    switch (assessmentType) {
      case 'diabetes': {
        const data = assessmentData.diabetes;
        if (!data) return [];
        
        return [
          { 
            parameter: 'Glucose', 
            value: `${data.glucose} mg/dL`, 
            normalRange: '70-99 mg/dL', 
            status: data.glucose >= 126 ? 'Elevated' : data.glucose >= 100 ? 'Elevated' : 'Normal',
            statusColor: data.glucose >= 126 ? '#ff4500' : data.glucose >= 100 ? '#ffad33' : '#2ecc71'
          },
          { 
            parameter: 'BMI', 
            value: data.bmi.toFixed(1), 
            normalRange: '18.5-24.9', 
            status: data.bmi >= 30 ? 'Obese' : data.bmi >= 25 ? 'Overweight' : data.bmi < 18.5 ? 'Underweight' : 'Normal',
            statusColor: data.bmi >= 30 ? '#ff4500' : data.bmi >= 25 ? '#ffad33' : data.bmi < 18.5 ? '#3498db' : '#2ecc71'
          },
          { 
            parameter: 'Blood Pressure', 
            value: `${data.bloodPressure} mmHg`, 
            normalRange: '120/80 mmHg', 
            status: data.bloodPressure >= 140 ? 'Elevated' : data.bloodPressure >= 130 ? 'Elevated' : 'Normal',
            statusColor: data.bloodPressure >= 140 ? '#ff4500' : data.bloodPressure >= 130 ? '#ffad33' : '#2ecc71'
          },
          { 
            parameter: 'Insulin', 
            value: `${data.insulin} μU/mL`, 
            normalRange: '2-25 μU/mL', 
            status: data.insulin > 25 ? 'Elevated' : 'Normal',
            statusColor: data.insulin > 25 ? '#ff4500' : '#2ecc71' 
          },
          { 
            parameter: 'Diabetes Pedigree', 
            value: data.diabetesPedigree.toFixed(2), 
            normalRange: '<0.5', 
            status: data.diabetesPedigree >= 0.8 ? 'Elevated' : data.diabetesPedigree >= 0.5 ? 'Elevated' : 'Normal',
            statusColor: data.diabetesPedigree >= 0.8 ? '#ff4500' : data.diabetesPedigree >= 0.5 ? '#ffad33' : '#2ecc71'
          }
        ];
      }
      
      case 'heartDisease': {
        const data = assessmentData.heartDisease;
        if (!data) return [];
        
        return [
          { 
            parameter: 'Cholesterol', 
            value: `${data.cholesterol} mg/dL`, 
            normalRange: '<200 mg/dL', 
            status: data.cholesterol >= 240 ? 'Elevated' : data.cholesterol >= 200 ? 'Elevated' : 'Normal',
            statusColor: data.cholesterol >= 240 ? '#ff4500' : data.cholesterol >= 200 ? '#ffad33' : '#2ecc71'
          },
          { 
            parameter: 'Blood Pressure', 
            value: `${data.bloodPressure} mmHg`, 
            normalRange: '120/80 mmHg', 
            status: data.bloodPressure >= 140 ? 'Elevated' : data.bloodPressure >= 130 ? 'Elevated' : 'Normal',
            statusColor: data.bloodPressure >= 140 ? '#ff4500' : data.bloodPressure >= 130 ? '#ffad33' : '#2ecc71'
          },
          { 
            parameter: 'Heart Rate', 
            value: `${data.heartRate} bpm`, 
            normalRange: '60-100 bpm', 
            status: data.heartRate > 100 ? 'Elevated' : data.heartRate < 60 ? 'Low' : 'Normal',
            statusColor: data.heartRate > 100 ? '#ff4500' : data.heartRate < 60 ? '#3498db' : '#2ecc71'
          },
          { 
            parameter: 'Exercise Level', 
            value: `${data.exercise} days/week`, 
            normalRange: '3-5 days/week', 
            status: data.exercise < 2 ? 'Low' : 'Normal',
            statusColor: data.exercise < 2 ? '#ff4500' : '#2ecc71'
          },
          { 
            parameter: 'Smoking Status', 
            value: data.smoker ? 'Yes' : 'No', 
            normalRange: 'No', 
            status: data.smoker ? 'Elevated Risk' : 'Normal',
            statusColor: data.smoker ? '#ff4500' : '#2ecc71'
          }
        ];
      }
      
      case 'parkinsons': {
        const data = assessmentData.parkinsons;
        if (!data) return [];
        
        return [
          { 
            parameter: 'Vocal Jitter (MDVP_Jitter)', 
            value: data.MDVP_Jitter.toFixed(5), 
            normalRange: '<0.006', 
            status: data.MDVP_Jitter >= 0.01 ? 'Elevated' : data.MDVP_Jitter >= 0.006 ? 'Elevated' : 'Normal',
            statusColor: data.MDVP_Jitter >= 0.01 ? '#ff4500' : data.MDVP_Jitter >= 0.006 ? '#ffad33' : '#2ecc71'
          },
          { 
            parameter: 'Vocal Shimmer (MDVP_Shimmer)', 
            value: data.MDVP_Shimmer.toFixed(5), 
            normalRange: '<0.04', 
            status: data.MDVP_Shimmer >= 0.06 ? 'Elevated' : data.MDVP_Shimmer >= 0.04 ? 'Elevated' : 'Normal',
            statusColor: data.MDVP_Shimmer >= 0.06 ? '#ff4500' : data.MDVP_Shimmer >= 0.04 ? '#ffad33' : '#2ecc71'
          },
          { 
            parameter: 'Harmonics-to-Noise Ratio (HNR)', 
            value: `${data.HNR.toFixed(2)} dB`, 
            normalRange: '>20 dB', 
            status: data.HNR <= 15 ? 'Low' : data.HNR <= 20 ? 'Low' : 'Normal',
            statusColor: data.HNR <= 15 ? '#ff4500' : data.HNR <= 20 ? '#ffad33' : '#2ecc71'
          },
          { 
            parameter: 'RPDE', 
            value: data.RPDE.toFixed(5), 
            normalRange: '<0.5', 
            status: data.RPDE >= 0.65 ? 'Elevated' : data.RPDE >= 0.5 ? 'Elevated' : 'Normal',
            statusColor: data.RPDE >= 0.65 ? '#ff4500' : data.RPDE >= 0.5 ? '#ffad33' : '#2ecc71'
          },
          { 
            parameter: 'PPE (Pitch Period Entropy)', 
            value: data.PPE.toFixed(5), 
            normalRange: '<0.15', 
            status: data.PPE >= 0.2 ? 'Elevated' : data.PPE >= 0.15 ? 'Elevated' : 'Normal',
            statusColor: data.PPE >= 0.2 ? '#ff4500' : data.PPE >= 0.15 ? '#ffad33' : '#2ecc71'
          }
        ];
      }
      
      default:
        return [];
    }
  };
  
  const getRiskFactorData = () => {
    switch (assessmentType) {
      case 'diabetes': {
        const data = assessmentData.diabetes;
        if (!data) return [];
        
        const glucoseRisk = data.glucose >= 200 ? 100 : data.glucose >= 140 ? 70 : data.glucose >= 100 ? 40 : 20;
        const bmiRisk = data.bmi >= 30 ? 100 : data.bmi >= 25 ? 60 : data.bmi >= 18.5 ? 20 : 40;
        const bpRisk = data.bloodPressure >= 90 ? 80 : data.bloodPressure >= 80 ? 50 : 20;
        const familyRisk = data.diabetesPedigree >= 0.8 ? 100 : data.diabetesPedigree >= 0.5 ? 60 : 30;
        const ageRisk = data.age > 65 ? 90 : data.age > 45 ? 70 : data.age > 35 ? 40 : 20;
        
        return [
          { name: 'Blood Glucose', value: glucoseRisk, actual: data.glucose, unit: 'mg/dL' },
          { name: 'BMI', value: bmiRisk, actual: data.bmi, unit: 'kg/m²' },
          { name: 'Blood Pressure', value: bpRisk, actual: data.bloodPressure, unit: 'mmHg' },
          { name: 'Family History', value: familyRisk, actual: data.diabetesPedigree.toFixed(2), unit: 'score' },
          { name: 'Age Factor', value: ageRisk, actual: data.age, unit: 'years' }
        ];
      }
      
      case 'heartDisease': {
        const data = assessmentData.heartDisease;
        if (!data) return [];
        
        const cholesterolRisk = data.cholesterol >= 240 ? 100 : data.cholesterol >= 200 ? 70 : 30;
        const bpRisk = data.bloodPressure >= 140 ? 100 : data.bloodPressure >= 120 ? 70 : 30;
        const ageRisk = data.age > 65 ? 100 : data.age > 45 ? 70 : 30;
        const heartRateRisk = data.heartRate > 100 ? 80 : data.heartRate > 80 ? 50 : 20;
        const exerciseRisk = data.exercise < 2 ? 80 : data.exercise < 4 ? 40 : 20;
        const geneticRisk = data.familyHistory ? 90 : 10;
        
        return [
          { name: 'Cholesterol', value: cholesterolRisk, actual: data.cholesterol, unit: 'mg/dL' },
          { name: 'Blood Pressure', value: bpRisk, actual: data.bloodPressure, unit: 'mmHg' },
          { name: 'Age Factor', value: ageRisk, actual: data.age, unit: 'years' },
          { name: 'Heart Rate', value: heartRateRisk, actual: data.heartRate, unit: 'bpm' },
          { name: 'Exercise Level', value: exerciseRisk, actual: data.exercise, unit: 'days/week' },
          { name: 'Family History', value: geneticRisk, actual: data.familyHistory ? 'Yes' : 'No', unit: '' }
        ];
      }
      
      case 'parkinsons': {
        const data = assessmentData.parkinsons;
        if (!data) return [];
        
        const jitterRisk = data.MDVP_Jitter >= 0.01 ? 90 : data.MDVP_Jitter >= 0.006 ? 60 : 30;
        const shimmerRisk = data.MDVP_Shimmer >= 0.06 ? 90 : data.MDVP_Shimmer >= 0.04 ? 60 : 30;
        const hnrRisk = data.HNR <= 15 ? 90 : data.HNR <= 20 ? 60 : 30;
        const rpdeRisk = data.RPDE >= 0.65 ? 90 : data.RPDE >= 0.5 ? 60 : 30;
        const dfaRisk = data.DFA <= 0.6 ? 90 : data.DFA <= 0.7 ? 50 : 30;
        const ppeRisk = data.PPE >= 0.2 ? 90 : data.PPE >= 0.15 ? 60 : 30;
        
        return [
          { name: 'Vocal Jitter', value: jitterRisk, actual: data.MDVP_Jitter.toFixed(5), unit: '' },
          { name: 'Vocal Shimmer', value: shimmerRisk, actual: data.MDVP_Shimmer.toFixed(5), unit: '' },
          { name: 'Voice HNR', value: hnrRisk, actual: data.HNR.toFixed(2), unit: 'dB' },
          { name: 'RPDE', value: rpdeRisk, actual: data.RPDE.toFixed(5), unit: '' },
          { name: 'DFA', value: dfaRisk, actual: data.DFA.toFixed(5), unit: '' },
          { name: 'PPE', value: ppeRisk, actual: data.PPE.toFixed(5), unit: '' }
        ];
      }
      
      default:
        return [];
    }
  };
  
  const getAssessmentTitle = () => {
    switch (assessmentType) {
      case 'diabetes':
        return 'Diabetes Risk Assessment';
      case 'heartDisease':
        return 'Heart Disease Risk Assessment';
      case 'parkinsons':
        return 'Parkinson\'s Disease Risk Assessment';
      default:
        return 'Health Assessment Report';
    }
  };
  
  const handlePrint = () => {
    document.documentElement.classList.add('force-light-print');
    window.print();
    setTimeout(() => {
      document.documentElement.classList.remove('force-light-print');
    }, 500);
  };
  
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const riskFactorData = getRiskFactorData();
  const metricsTable = getMetricsTable();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 print:py-0 print:px-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6 print:hidden">
            <h1 className="text-2xl font-bold">{getAssessmentTitle()} Results</h1>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print Report
              </Button>
            </div>
          </div>
          
          <div 
            ref={printRef}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border print:border-none print:shadow-none"
          >
            <div className="p-6 border-b print:hidden dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{getAssessmentTitle()}</h1>
                  <p className="text-gray-600 dark:text-gray-300">Report generated on {formattedDate}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{result.score}/100</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium capitalize">{result.risk} Risk</div>
                </div>
              </div>
            </div>
            
            <div className="p-6 print:p-0">
              <div className="hidden print:flex print:justify-between print:items-center print:mb-4 print:pb-2 print:border-b print:border-gray-300">
                <div>
                  <h1 className="text-2xl font-bold text-black">{getAssessmentTitle()}</h1>
                  <p className="text-gray-700">Report generated on {formattedDate}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-black">{result.score}/100</div>
                  <div className="text-sm text-gray-700 font-medium capitalize">{result.risk} Risk</div>
                </div>
              </div>
              
              <div className="print:block mb-8 print:mb-6 print:break-inside-avoid">
                <h2 className="text-xl font-semibold mb-4 print:text-lg print:text-black">Your Risk Assessment</h2>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg print:bg-gray-100">
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="print:text-black">Risk Level:</span>
                      <span className="font-medium capitalize print:text-black">{result.risk}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-1 print:bg-gray-300">
                      <div 
                        className={`h-2.5 rounded-full print:!bg-opacity-100 ${
                          result.risk === 'low' 
                            ? 'bg-green-500 print:bg-green-600' 
                            : result.risk === 'medium' 
                              ? 'bg-yellow-500 print:bg-yellow-600' 
                              : 'bg-red-500 print:bg-red-600'
                        }`}
                        style={{ 
                          width: `${result.score}%`,
                          WebkitPrintColorAdjust: 'exact',
                          colorAdjust: 'exact',
                          printColorAdjust: 'exact'
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs print:text-black">
                      <span>Low Risk</span>
                      <span>Medium Risk</span>
                      <span>High Risk</span>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <p className="mb-2 print:text-black"><strong>Your score:</strong> {result.score} out of 100</p>
                    <p className="text-gray-700 dark:text-gray-300 print:text-black">
                      This assessment is based on the information you provided and should not replace professional medical advice.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8 print:mb-6 print:break-inside-avoid">
                <h2 className="text-xl font-semibold mb-4 print:text-lg">Key Insights</h2>
                <div className="space-y-2">
                  {result.insights.length > 0 ? (
                    result.insights.map((insight, index) => (
                      <div key={index} className="flex items-start">
                        <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="dark:text-gray-200">{insight}</p>
                      </div>
                    ))
                  ) : (
                    <p className="dark:text-gray-200">No specific insights available for this assessment.</p>
                  )}
                </div>
              </div>
              
              <div className="mb-8 print:mb-6 print:break-inside-avoid">
                <Card className="p-4 print:p-3 print:border print:border-gray-300 dark:border-gray-700">
                  <h3 className="text-lg font-medium mb-2 print:text-base">Key Risk Factors</h3>
                  <div className="h-64 print:h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={riskFactorData}
                        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                        barSize={20}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#555" strokeOpacity={0.2} />
                        <XAxis 
                          dataKey="name" 
                          fontSize={11} 
                          angle={-45} 
                          textAnchor="end"
                          height={60}
                          tick={{ fill: '#555' }}
                          tickLine={{ stroke: '#555' }}
                        />
                        <YAxis 
                          domain={[0, 100]} 
                          fontSize={12} 
                          tick={{ fill: '#555' }}
                          tickLine={{ stroke: '#555' }}
                          label={{ 
                            value: 'Risk Level (%)', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { fontSize: '12px', fill: '#555' }
                          }} 
                        />
                        <Tooltip
                          formatter={(value: number, name: string, props: any) => {
                            const item = props.payload;
                            return [`${item.actual} ${item.unit}`, 'Actual Value'];
                          }}
                          contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', color: '#333', border: '1px solid #ddd' }}
                        />
                        <Bar 
                          dataKey="value" 
                          name="Risk Factor"
                          fill="#8884d8" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
              
              <div className="mb-8 print:mb-6 grid grid-cols-1 gap-6 print:gap-4 print:break-inside-avoid">
                <Card className="p-4 print:p-3 print:border print:border-gray-300 dark:border-gray-700 overflow-x-auto">
                  <h3 className="text-lg font-medium mb-4 print:text-base">Parameters Analysis</h3>
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Parameter</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Value</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Normal Range</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {metricsTable.map((metric, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-200">{metric.parameter}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{metric.value}</td>
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">{metric.normalRange}</td>
                          <td className="px-4 py-3 text-sm">
                            <span 
                              className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white" 
                              style={{ 
                                backgroundColor: metric.statusColor,
                                padding: '0.25rem 0.75rem'
                              }}
                            >
                              {metric.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
              
              <div className="mb-8 print:mb-6 print:break-inside-avoid">
                <h2 className="text-xl font-semibold mb-4 print:text-lg">Recommendations</h2>
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg print:bg-blue-50 print:border print:border-blue-100">
                  <ul className="list-disc pl-5 space-y-2 dark:text-gray-200">
                    {result.recommendations && result.recommendations.length > 0 ? (
                      result.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))
                    ) : (
                      <li>No specific recommendations available for this assessment.</li>
                    )}
                  </ul>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-8 border-t dark:border-gray-700 pt-4 print:text-xs print:mt-4">
                <p><strong>Disclaimer:</strong> This health assessment is provided for informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for any health-related concerns or before making any changes to your health regimen.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;
