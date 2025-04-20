from flask import Blueprint, request, jsonify
import os
import re
import json
import logging
import io
import PyPDF2
from transformers import MarianMTModel, MarianTokenizer
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

# Create blueprint
sehat = Blueprint('sehat', __name__)

# Initialize Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Load translation models once to avoid reloading every request
translation_models = {
    "hi": {
        "tokenizer": MarianTokenizer.from_pretrained("Helsinki-NLP/opus-mt-en-hi"),
        "model": MarianMTModel.from_pretrained("Helsinki-NLP/opus-mt-en-hi")
    },
    # Add other languages here like "mr", "kn" if needed
}

def extract_text_from_pdf(file_data):
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_data))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        logger.error(f"PDF extraction error: {e}")
        return ""

def translate_text_list(text_list, lang_code):
    tokenizer = translation_models[lang_code]["tokenizer"]
    model = translation_models[lang_code]["model"]
    inputs = tokenizer(text_list, return_tensors="pt", padding=True, truncation=True)
    outputs = model.generate(**inputs)
    return [tokenizer.decode(t, skip_special_tokens=True) for t in outputs]

# AI extraction functions (your existing logic)
def parse_ai_response(ai_response):
    try:
        match = re.search(r"\{[\s\S]+\}", ai_response)
        if match:
            cleaned = match.group(0)
            return json.loads(cleaned)
    except Exception as e:
        logger.error(f"Parsing AI response failed: {e}")
    return {"raw_response": ai_response}

def get_ai_extracted_metrics(text, extraction_type="diabetes"):
    try:
        if extraction_type == "diabetes":
            prompt = f"""You are an AI assistant helping to extract health-related metrics from lab reports.

From the given lab report text, extract these values only if they are explicitly mentioned:
- Age
- Gender
- Glucose (mg/dL)
- Skin Thickness (mm)
- BMI
- Blood Pressure 
- Insulin (μU/mL)
- Diabetes Pedigree Function

Return the result strictly as JSON.

Lab Report:
{text[:2000]}
"""
        # Define prompts for other extraction types...
        # For simplicity, we assume 'diabetes' here, add others as necessary.

        chat_completion = client.chat.completions.create(
            messages=[{"role": "system", "content": "You are a medical data extractor."},
                      {"role": "user", "content": prompt}],
            model="llama3-70b-8192",
            temperature=0.3,
        )

        ai_response = chat_completion.choices[0].message.content
        metrics = parse_ai_response(ai_response)

        expected_keys = ["Age", "Gender", "Glucose", "Skin Thickness", "BMI", "Blood Pressure", "Insulin", "Diabetes Pedigree Function"]

        for key in expected_keys:
            if key not in metrics:
                metrics[key] = "Not Found"

        return metrics

    except Exception as e:
        logger.error(f"AI metric extraction error: {e}")
        return {"error": "AI extraction failed"}

@sehat.route('/extract-health-metrics', methods=['POST'])
def extract_metrics():
    try:
        if 'file' not in request.files:
            return jsonify({"success": False, "error": "No file provided"}), 400

        file = request.files['file']
        file_data = file.read()

        if not file.filename.lower().endswith('.pdf'):
            return jsonify({"success": False, "error": "Only PDF supported"}), 400

        # Step 1: Extract raw text
        text = extract_text_from_pdf(file_data)
        if not text:
            return jsonify({"success": False, "error": "Text extraction failed"}), 500

        # Step 2: Determine extraction type (diabetes, heart disease, or parkinsons)
        extraction_type = request.args.get('type', 'diabetes')  # default to diabetes if no type is specified

        # Step 3: Use AI to extract metrics based on type
        metrics = get_ai_extracted_metrics(text, extraction_type)

        return jsonify({
            "success": True,
            "data": {
                "metrics": metrics,
                "text_preview": text[:1000]
            }
        })

    except Exception as e:
        logger.error(f"Health metric extraction error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@sehat.route('/translate', methods=['POST'])
def translate():
    try:
        data = request.json
        insights = data.get("insights", [])
        recommendations = data.get("recommendations", [])
        risk = data.get("risk", "")
        score = data.get("score", 0)
        lang_code = data.get("lang_code", "hi")

        if lang_code not in translation_models:
            return jsonify({"error": "Unsupported language code"}), 400

        # Combine for batch translation
        text_list = insights + recommendations + [risk]

        translated = translate_text_list(text_list, lang_code)

        # Unpack the translated content
        translated_insights = translated[:len(insights)]
        translated_recommendations = translated[len(insights):-1]
        translated_risk = translated[-1]

        return jsonify({
            "success": True,
            "risk": translated_risk,
            "score": score,
            "insights": translated_insights,
            "recommendations": translated_recommendations
        })

    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500
