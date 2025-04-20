from transformers import MarianMTModel, MarianTokenizer

def load_translation_model(lang_code):
    model_name = {
        "hi": "Helsinki-NLP/opus-mt-en-hi",
    }[lang_code]

    tokenizer = MarianTokenizer.from_pretrained(model_name)
    model = MarianMTModel.from_pretrained(model_name)
    return tokenizer, model

def translate_text_list(text_list, lang_code):
    tokenizer, model = load_translation_model(lang_code)
    inputs = tokenizer(text_list, return_tensors="pt", padding=True, truncation=True)
    outputs = model.generate(**inputs)
    return [tokenizer.decode(t, skip_special_tokens=True) for t in outputs]

# Example usage
report_text = [
    "Your blood pressure is slightly above the normal range.",
    "Please consult your doctor."
]

translated_sentences = translate_text_list(report_text, "hi")
full_translation = " ".join(translated_sentences)


print("Hindi:", full_translation)

