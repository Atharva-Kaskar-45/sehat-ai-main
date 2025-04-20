from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://sehat-ai-main.vercel.app",
            "http://localhost:3000"
        ]
    }
})
