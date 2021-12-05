
FROM python:3.9

ENV AppHome=/home/app/webapp  
RUN mkdir -p $AppHome 
WORKDIR $AppHome


ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1  
RUN pip install --upgrade pip
COPY . $AppHome
RUN pip install -r requirements.txt  
  
EXPOSE 80
CMD python manage.py runserver 80