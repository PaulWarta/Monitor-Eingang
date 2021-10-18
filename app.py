# -*- coding: utf-8 -*-

import requests
import json
from datetime import date, datetime, time, timedelta
import os
from urllib.parse import unquote

os.system('clear')

lehrerAbkürzungen = {
    "PW": "Paul Warta",
    "CB": "Christopher Bischoff",
    "CR": "Claudia Ritter",
    "TR": "Thorsten Ritter",
    "LR": "Linda Ritter"
}


def Stundenplan ():
    response = requests.post('https://anmeldung.tanzhaus-muelheim.de/saalbelegung/', data={'apikey':'db7a5918390d7c70d3ea9bc02afa667c3147097664ad5e9ee4a772f42c7259da'})

    response = response.text
    response = json.loads(response)


    if response != None:
        for i in range(len(response)):
            response[i].pop("Datum")

            response[i].pop("Grund")

            response[i]["Saal"] = int(response[i]["Saal"])

            if response[i]["exLehrer"] != "":
                response[i]["Lehrer"] = response[i]["exLehrer"].replace('+', ' ')
                response[i].pop("exLehrer")
            else: 
                response[i].pop("exLehrer")
                response[i]["Lehrer"] = lehrerAbkürzungen[response[i]["Lehrer"]]
            
            if response[i]["exBez"] != "":
                response[i]["Bem"] = response[i]["exBez"]
                response[i].pop("exBez")
            else: 
                response[i].pop("exBez")

            response[i]["Bem"] = response[i]["Bem"].replace('+', ' ')

            response[i].pop("Wochentag")

        response = json.dumps(response)
        response = unquote(response)
        return response
    else:
        response = ""
        return response
    
def Nimbuscloud ():
    current_date = datetime.now() - timedelta(days=1)
    timestamp = int(current_date.timestamp())
    
    response = requests.post("https://tanzschule-ritter.nimbuscloud.at/api/json/v1/timetable/data", data={"apikey":"db7a5918390d7c70d3ea9bc02afa667c3147097664ad5e9ee4a772f42c7259da", "date":timestamp, "days": "2", "programOnlyNew": "false"})
    response = response.text
    response = json.loads(response)
    response = response["content"]
    response = response["events"]

    timetable = []

    for i in range(len(response)):
        timetable.append({})
        timetable[i]["Von"] = datetime.strftime(datetime.strptime(response[i]["start_date"], '%Y-%m-%d %H:%M'), '%H:%M')
        timetable[i]["Bis"] = datetime.strftime(datetime.strptime(response[i]["end_date"], '%Y-%m-%d %H:%M'), '%H:%M')
        timetable[i]["Saal"] = response[i]["room_id"]
        timetable[i]["Bem"] = response[i]["level"]
        timetable[i]["Lehrer"] = response[i]["teacher"]

    timetable = json.dumps(timetable)
    return timetable

nimbusdata = Nimbuscloud()
stundenplandata = Stundenplan()

stundenplandata = nimbusdata + stundenplandata
stundenplandata = stundenplandata.replace('][', ', ')
stundenplandata = json.loads(stundenplandata)

start = {}

for i in range(len(stundenplandata)):
    start[i] = stundenplandata[i]["Von"].replace(':', '')

start = sorted(start.items(), key=lambda x: x[1]) 

stundenplandataNew = []

for i in range(len(start)):
    stundenplandataNew.append(stundenplandata[start[i][0]])

stundenplandata = stundenplandataNew

saal1 = []
saal2 = []
saal3 = []
saal4 = []

for i in range(len(stundenplandata)):
    if stundenplandata[i]["Saal"] == 1:
        saal1.append(stundenplandata[i])
    if stundenplandata[i]["Saal"] == 2:
        saal2.append(stundenplandata[i])
    if stundenplandata[i]["Saal"] == 3:
        saal3.append(stundenplandata[i])
    if stundenplandata[i]["Saal"] == 4:
        saal4.append(stundenplandata[i])
    if stundenplandata[i]["Saal"] == 5:
        saal3.append(stundenplandata[i])
        saal2.append(stundenplandata[i])

saal1 = json.dumps(saal1)
saal2 = json.dumps(saal2)
saal3 = json.dumps(saal3)
saal4 = json.dumps(saal4)

print(saal1)
print(saal2)
print(saal3)
print(saal4)



f = open("stundenplan1.json", "w")
f.write(saal1)
f.close()

f = open("stundenplan2.json", "w")
f.write(saal2)
f.close()

f = open("stundenplan3.json", "w")
f.write(saal3)
f.close()

f = open("stundenplan4.json", "w")
f.write(saal4)
f.close()





