import os
from werkzeug.wrappers import Request, Response
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from app import app

def handler(request):
    environ = request.environ
    with app.request_context(environ):
        try:
            response = app.full_dispatch_request()
        except Exception as e:
            app.logger.error(f"Error: {str(e)}")
            return Response(str(e), status=500)
        return Response(
            response=response.get_data(),
            status=response.status_code,
            headers=dict(response.headers)
        )

# For local testing
if __name__ == '__main__':
    app.run(port=5000)
