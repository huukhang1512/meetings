FROM ubuntu:18.04

RUN apt-get update 
RUN apt-get install curl -y
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash 
RUN apt-get install nodejs -y
RUN npm i -g serverless@1.54.0
RUN apt-get install python3.7 -y
RUN apt-get install python3-pip -y

WORKDIR /github/workspace

ENTRYPOINT ["/github/workspace/entrypoint.sh"]