FROM ubuntu:16.04
MAINTAINER Corwin Brown <corwin@corwinbrown.com>

RUN  apt-get update && \
     apt-get -y install python-software-properties build-essential npm python-pip && \
     pip install --upgrade pip && \
     mkdir -p /opt/oac_resizer

COPY app /opt/oac_resizer/app
COPY requirements.txt /opt/oac_resizer/requirements.txt
COPY package.json /opt/oac_resizer/package.json

WORKDIR /opt/oac_resizer

RUN pip install -r requirements.txt && \
    npm install

EXPOSE 9001
CMD ["/usr/bin/python2.7", "app/run.py", "--production"]
