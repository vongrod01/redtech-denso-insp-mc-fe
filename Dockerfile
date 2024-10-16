# Pull official base image frorm python version run on linux alpine
FROM python:3.8.10

# Set container working dir == cd ~ home 
WORKDIR /usr/src/app

# Set container environment viables
#   this prevents Python from writing out pyc files
ENV PYTHONDONTWRITEBYTECODE 1
#   this keeps Python from buffering stdin/stdout
ENV PYTHONUNBUFFERED 1
# Install dependecies
# RUN pip install --upgrade pip
COPY ./req.txt .
RUN python -m pip install --upgrade pip
RUN pip install -r req.txt

# Copy projects
COPY . .
EXPOSE 8080
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]
CMD ["gunicorn", "--bind", ":8080", "RTDensoInspMachineMachine_Frontend.wsgi:application"]
# CMD python manage.py runserver 0.0.0.0:8001
# EXPOSE 1434