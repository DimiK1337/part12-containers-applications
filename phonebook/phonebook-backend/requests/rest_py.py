import requests

url = "http://localhost:3001/api/persons"
info_url = "http://localhost:3001/info"

body = {
    "content": "This is a note created using the requests library in Python.",
    "important": True
}

# Delete 

del_res = requests.delete(f"{url}/4")
print(del_res.status_code)

# GET info
get_res = requests.get(info_url)
print(get_res.status_code)
print(get_res.content)