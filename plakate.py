import json
import os

files = os.listdir('./Plakate')

files.remove("Plakate.json")

print(files)

f = open("Plakate/Plakate.json", "w")
f.write(json.dumps(files))

