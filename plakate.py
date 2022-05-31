import json
import re
import subprocess


files = re.findall('Plakate/.*', subprocess.getoutput('git ls-tree -r --name-only HEAD'))
files.pop(files.index('Plakate/Plakate.json'))

print(files)

# f = open("Plakate/Plakate.json", "w")
# f.write(json.dumps(files))

