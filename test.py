import requests

res = requests.get("http://api.openweathermap.org/data/2.5/weather?q=muelheim&units=metric&appid=2e9c5036920dde9cf253e5f1581328c2")

print(res.json())