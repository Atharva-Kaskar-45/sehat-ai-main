
// Risk assessment utility functions for different disease models

// Diabetes risk assessment based on input parameters
export const calculateDiabetesRisk = (data: {
  age: number;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  diabetesPedigree: number;
  pregnant?: boolean;
  pregnancies?: number;
  gender: string;
}): { risk: 'low' | 'medium' | 'high'; score: number; insights: string[] } => {
  // Initialize base risk score
  let score = 0;
  const insights: string[] = [];
  
  // Age factor (risk increases with age)
  if (data.age > 45) {
    score += 10;
    insights.push('Age above 45 increases diabetes risk');
  } else if (data.age > 35) {
    score += 5;
  }
  
  // Glucose level (major factor)
  if (data.glucose >= 200) {
    score += 30;
    insights.push('High blood glucose levels (≥200 mg/dL) indicate possible diabetes');
  } else if (data.glucose >= 140) {
    score += 20;
    insights.push('Elevated blood glucose (140-199 mg/dL) suggests prediabetes');
  } else if (data.glucose >= 100) {
    score += 10;
    insights.push('Slightly elevated glucose levels (100-139 mg/dL)');
  }
  
  // BMI factor
  if (data.bmi >= 30) {
    score += 15;
    insights.push('Obesity (BMI ≥30) increases insulin resistance risk');
  } else if (data.bmi >= 25) {
    score += 7;
    insights.push('Overweight BMI (25-29.9) slightly increases risk');
  }
  
  // Blood pressure
  if (data.bloodPressure >= 90) {
    score += 8;
    insights.push('Elevated blood pressure may indicate metabolic syndrome');
  }
  
  // Family history (diabetes pedigree function)
  if (data.diabetesPedigree > 0.8) {
    score += 15;
    insights.push('Strong family history of diabetes increases risk');
  } else if (data.diabetesPedigree > 0.5) {
    score += 8;
    insights.push('Family history shows moderate diabetes risk');
  }
  
  // Pregnancy history (for women)
  if (data.gender === 'female' && data.pregnant && data.pregnancies && data.pregnancies > 0) {
    score += 5 * Math.min(data.pregnancies, 4); // Cap at 20 points
    if (data.pregnancies > 2) {
      insights.push('Multiple pregnancies increase gestational diabetes risk');
    }
  }
  
  // Insulin resistance indicators
  if (data.insulin > 160) {
    score += 10;
    insights.push('High insulin levels may indicate insulin resistance');
  }
  
  // Skin thickness as proxy for body fat distribution
  if (data.skinThickness > 35) {
    score += 5;
  }
  
  // Normalize score to 0-100 range (cap at 100)
  const normalizedScore = Math.min(Math.round(score), 100);
  
  // Determine risk category
  let risk: 'low' | 'medium' | 'high';
  if (normalizedScore < 30) {
    risk = 'low';
  } else if (normalizedScore < 60) {
    risk = 'medium';
  } else {
    risk = 'high';
  }
  
  return { risk, score: normalizedScore, insights };
};

// Heart disease risk assessment
export const calculateHeartDiseaseRisk = (data: {
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
}): { risk: 'low' | 'medium' | 'high'; score: number; insights: string[] } => {
  // Initialize base risk score
  let score = 0;
  const insights: string[] = [];
  
  // Age factor (risk increases significantly with age)
  if (data.age > 65) {
    score += 20;
    insights.push('Age above 65 significantly increases cardiovascular risk');
  } else if (data.age > 45) {
    score += 10;
    insights.push('Age above 45 increases cardiovascular risk');
  }
  
  // Gender factor (statistically higher risk in males until older age)
  if (data.gender === 'male') {
    score += 5;
  }
  
  // Cholesterol level
  if (data.cholesterol >= 240) {
    score += 20;
    insights.push('High cholesterol (≥240 mg/dL) significantly increases heart disease risk');
  } else if (data.cholesterol >= 200) {
    score += 10;
    insights.push('Borderline high cholesterol (200-239 mg/dL)');
  }
  
  // Blood pressure
  if (data.bloodPressure >= 140) {
    score += 20;
    insights.push('High blood pressure (≥140 mm Hg) is a major risk factor');
  } else if (data.bloodPressure >= 120) {
    score += 10;
    insights.push('Elevated blood pressure (120-139 mm Hg)');
  }
  
  // Lifestyle factors
  if (data.exercise < 2) {
    score += 10;
    insights.push('Limited physical activity increases risk');
  }
  
  // Smoking (major risk factor)
  if (data.smoker) {
    score += 20;
    insights.push('Smoking substantially increases heart disease risk');
  }
  
  // Diabetes (comorbidity)
  if (data.diabetic) {
    score += 15;
    insights.push('Diabetes increases cardiovascular risk');
  }
  
  // Family history
  if (data.familyHistory) {
    score += 15;
    insights.push('Family history of heart disease is a significant risk factor');
  }
  
  // BMI if available
  if (data.bmi && data.bmi >= 30) {
    score += 10;
    insights.push('Obesity increases heart disease risk');
  }
  
  // Resting heart rate (if unusually high)
  if (data.heartRate > 100) {
    score += 5;
    insights.push('Elevated resting heart rate may indicate decreased cardiovascular fitness');
  }
  
  // Normalize score to 0-100 range
  const normalizedScore = Math.min(Math.round(score), 100);
  
  // Determine risk category
  let risk: 'low' | 'medium' | 'high';
  if (normalizedScore < 30) {
    risk = 'low';
  } else if (normalizedScore < 65) {
    risk = 'medium';
  } else {
    risk = 'high';
  }
  
  return { risk, score: normalizedScore, insights };
};

// Parkinson's disease risk assessment
export const calculateParkinsonsRisk = (data: {
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
}): { risk: 'low' | 'medium' | 'high' | 'unknown'; score: number; insights: string[] } => {
  // Initialize base risk score
  let score = 0;
  const insights: string[] = [];
  
  // Jitter (variation in fundamental frequency)
  // Higher values may indicate Parkinson's
  if (data.MDVP_Jitter > 0.012) {
    score += 20;
    insights.push('Elevated vocal jitter is associated with Parkinson\'s disease');
  } else if (data.MDVP_Jitter > 0.008) {
    score += 10;
  }
  
  // Shimmer (variation in amplitude)
  if (data.MDVP_Shimmer > 0.06) {
    score += 15;
    insights.push('Increased vocal shimmer is observed in Parkinson\'s disease');
  } else if (data.MDVP_Shimmer > 0.04) {
    score += 8;
    insights.push('Slightly elevated vocal shimmer detected');
  }
  
  // Harmonics-to-noise ratio (HNR)
  // Lower values may indicate Parkinson's
  if (data.HNR < 15) {
    score += 15;
    insights.push('Reduced harmonics-to-noise ratio is linked to vocal impairment');
  } else if (data.HNR < 20) {
    score += 8;
    insights.push('Slightly reduced harmonics-to-noise ratio');
  }
  
  // RPDE (Recurrence Period Density Entropy)
  // Higher values closer to 1 may indicate Parkinson's
  if (data.RPDE > 0.65) {
    score += 15;
    insights.push('Elevated RPDE indicates increased vocal complexity');
  } else if (data.RPDE > 0.5) {
    score += 8;
    insights.push('Moderately elevated RPDE value');
  }
  
  // DFA (Detrended Fluctuation Analysis)
  // Lower values in Parkinson's
  if (data.DFA < 0.60) {
    score += 10;
    insights.push('Low DFA value may indicate vocal pattern changes');
  } else if (data.DFA < 0.70) {
    score += 5;
  }
  
  // PPE (Pitch Period Entropy)
  // Higher values in Parkinson's
  if (data.PPE > 0.2) {
    score += 15;
    insights.push('Increased PPE suggests vocal impairment');
  } else if (data.PPE > 0.15) {
    score += 8;
    insights.push('Slightly elevated PPE detected');
  }
  
  // NHR (Noise-to-Harmonics Ratio)
  // Higher values may indicate Parkinson's
  if (data.NHR > 0.02) {
    score += 10;
    insights.push('Elevated noise-to-harmonics ratio in voice');
  } else if (data.NHR > 0.015) {
    score += 5;
  }
  
  // Fundamental frequency variations
  const freqRange = data.MDVP_Fhi - data.MDVP_Flo;
  if (freqRange < 60) {
    score += 10;
    insights.push('Reduced vocal frequency range may indicate reduced expressiveness');
  } else if (freqRange < 80) {
    score += 5;
  }
  
  // Spread1 and Spread2 parameters
  // Typically abnormal in Parkinson's
  if (data.spread1 < -6.0) {
    score += 10;
    insights.push('Abnormal nonlinear measure (spread1) detected');
  }
  
  if (data.spread2 < 0.2) {
    score += 5;
  }
  
  // D2 parameter
  // Lower correlation dimension in PD
  if (data.D2 < 2.0) {
    score += 10;
    insights.push('Reduced signal complexity measure (D2)');
  } else if (data.D2 < 2.3) {
    score += 5;
  }
  
  // Normalize score to 0-100 range
  const normalizedScore = Math.min(Math.round(score), 100);
  
  // If we don't have enough insights, the assessment might be inconclusive
  if (insights.length < 2 && normalizedScore < 40) {
    insights.push('Assessment shows borderline indicators, clinical evaluation recommended for confirmation');
  }
  
  // Determine risk category
  let risk: 'low' | 'medium' | 'high' | 'unknown';
  if (normalizedScore < 30) {
    risk = 'low';
  } else if (normalizedScore < 60) {
    risk = 'medium';
  } else {
    risk = 'high';
  }
  
  return { risk, score: normalizedScore, insights };
};

// Generate recommendations based on risk assessment
export const generateRecommendations = (
  type: 'diabetes' | 'heartDisease' | 'parkinsons',
  risk: 'low' | 'medium' | 'high' | 'unknown'
): string[] => {
  const commonRecommendations = [
    'Maintain a balanced diet rich in fruits, vegetables, and whole grains',
    'Exercise regularly for at least 150 minutes per week',
    'Get adequate sleep (7-9 hours nightly)',
    'Manage stress through relaxation techniques or mindfulness',
    'Schedule regular check-ups with your healthcare provider'
  ];
  
  // Disease-specific recommendations
  switch (type) {
    case 'diabetes':
      if (risk === 'high') {
        return [
          'Consult with a healthcare professional promptly for blood glucose testing',
          'Consider meeting with a registered dietitian for personalized meal planning',
          'Monitor carbohydrate intake and focus on low glycemic index foods',
          'Aim for weight loss of 5-10% if overweight',
          'Incorporate regular physical activity focusing on both aerobic and resistance exercises',
          ...commonRecommendations
        ];
      } else if (risk === 'medium') {
        return [
          'Schedule routine blood glucose screening with your doctor',
          'Limit intake of refined carbohydrates and added sugars',
          'Aim for 30 minutes of moderate exercise daily',
          'Maintain a healthy weight or work toward weight loss if needed',
          ...commonRecommendations
        ];
      } else {
        return [
          'Continue regular health screenings as recommended by your doctor',
          'Maintain a healthy weight',
          'Limit sugary beverages and processed foods',
          ...commonRecommendations
        ];
      }
      
    case 'heartDisease':
      if (risk === 'high') {
        return [
          'Consult with a cardiologist for comprehensive cardiovascular assessment',
          'If you smoke, seek support to quit immediately',
          'Closely monitor and manage blood pressure and cholesterol with medical supervision',
          'Consider a heart-healthy diet like the Mediterranean or DASH diet',
          'Discuss appropriate medications with your doctor if needed',
          'Limit sodium intake to less than 1,500 mg daily',
          ...commonRecommendations
        ];
      } else if (risk === 'medium') {
        return [
          'Schedule a cardiovascular health check with your doctor',
          'Monitor blood pressure and cholesterol regularly',
          'Limit saturated fats and trans fats in your diet',
          'If you smoke, develop a plan to quit',
          'Aim for at least 150 minutes of moderate aerobic activity weekly',
          ...commonRecommendations
        ];
      } else {
        return [
          'Continue heart-healthy habits including regular exercise',
          'Maintain a diet low in saturated fat, trans fat, and sodium',
          'Know your family history of heart disease',
          ...commonRecommendations
        ];
      }
      
    case 'parkinsons':
      if (risk === 'high') {
        return [
          'Consult with a neurologist for proper evaluation and diagnosis',
          'Consider speech therapy to address potential voice and speech concerns',
          'Engage in regular exercise, particularly activities that enhance balance and coordination',
          'Join a support group to connect with others and learn coping strategies',
          'Stay mentally active with cognitive exercises and social engagement',
          ...commonRecommendations
        ];
      } else if (risk === 'medium') {
        return [
          'Schedule a check-up with your primary care physician to discuss your concerns',
          'Engage in activities that promote neurological health like balance exercises',
          'Stay physically active with regular exercise',
          'Consider voice exercises to maintain vocal strength',
          ...commonRecommendations
        ];
      } else {
        return [
          'Maintain regular physical and vocal exercises',
          'Stay mentally active with puzzles, reading, and social activities',
          'Be aware of early Parkinson\'s symptoms for future reference',
          ...commonRecommendations
        ];
      }
      
    default:
      return commonRecommendations;
  }
};
