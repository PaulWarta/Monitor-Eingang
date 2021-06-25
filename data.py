import requests
from datetime import date, datetime, time, timedelta
import json
url = "https://tanzschule-ritter.nimbuscloud.at/api/json/v1/timetable/data"
api_key = "db7a5918390d7c70d3ea9bc02afa667c3147097664ad5e9ee4a772f42c7259da"
current_date = datetime.now() - timedelta(days=1)
timestamp = int(current_date.timestamp())
parameter = {
    "apikey" : "db7a5918390d7c70d3ea9bc02afa667c3147097664ad5e9ee4a772f42c7259da",
    "date" : timestamp,
    "days" : "2",
    "programOnlyNew" : "false"
}
response = requests.post(url=url, data=parameter)
response = response.text
response = json.loads(response)


response = response["content"]
response = response["events"]
timetable = {}

for i in range(len(response)):
    current_response = response[i]
    timetable[i] = {}
    timetable[i]["start"] = datetime.strftime(datetime.strptime(current_response["start_date"], '%Y-%m-%d %H:%M'), '%H:%M')
    timetable[i]["end"] = datetime.strftime(datetime.strptime(current_response["end_date"], '%Y-%m-%d %H:%M'), '%H:%M')
    timetable[i]["name"] = current_response["level"]
    timetable[i]["teacher"] = current_response["allTeachers"][0]["firstname"]
    timetable[i]["room"] = current_response["room"]

timetable = json.dumps(timetable)

f = open("timetable.txt", "w")
f.write(timetable)
f.close()
    
