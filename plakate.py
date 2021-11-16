import os
import json

files = os.listdir('./Plakate')

files.remove("Plakate.json")

print(files)

f = open("Plakate/Plakate.json", "w")
f.write(json.dumps(files))

