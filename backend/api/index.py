import sys
import os

# Add parent directory to path to import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app

# This makes Vercel happy with the serverless function
def handler(request):
    from werkzeug.wrappers import Request, Response
    
    wsgi_environ = request.environ
    wsgi_request = Request(wsgi_environ)
    
    with app.request_context(wsgi_environ):
        try:
            response = app.full_dispatch_request()
        except Exception as e:
            print(f"Error: {str(e)}")
            return Response(str(e), status=500)
        return response