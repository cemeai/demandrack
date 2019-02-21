import requests
import MySQLdb

# MySQL Connection
db = MySQLdb.connect(user="carlos",passwd="jonajo123",db="demandrack")
c=db.cursor()

c.execute("""SELECT COUNT(name) FROM warehouses""")
num = c.fetchone()
# Initialize the API
r = requests.get('https://api.webflow.com/collections/5b8d5ccbcbd055b63724f24d/items?api_version=1.0.0&access_token=06b555feedd3c4eaa17899dc043b26309925af48eb448e2eb4f25fb2bbaf8611')

json_data = r.json()
total = json_data['total']
items = json_data['items']
count = json_data['count']
# print(total)
# print(items[0])

if total == num[0]:
	c.close()
	db.close()
	print("No updates available. Closing connections.")
else:
	offset = 0	
	c.execute("""TRUNCATE TABLE warehouses""")
	db.commit()
	for i in range(count):
		c.execute("""INSERT INTO warehouses (name, slug, unit_price, measurement, company, phone, address, state, city, zip_code, labor_hours, approve, latitude, longitude) 
			VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""", (items[i]['name'], items[i]['slug'], items[i]['unit-price'], items[i]['measurement'], 
				items[i]['company'], items[i]['phone'], items[i]['address'], items[i]['state'], items[i]['city'], items[i]['zip-code'], items[i]['labor-hours'], 
				items[i]['approved'], items[i]['latitud-2'], items[i]['longitude-2']))
	db.commit()
	offset += 100
	while offset < total:
		req_string = 'https://api.webflow.com/collections/5b8d5ccbcbd055b63724f24d/items?api_version=1.0.0&access_token=06b555feedd3c4eaa17899dc043b26309925af48eb448e2eb4f25fb2bbaf8611'
		req_string += '&offset='
		req_string += str(offset)
		r = requests.get(req_string)
		json_data = r.json()
		items = json_data['items']
		count = json_data['count']
		for i in range(count):
			if 'latitud-2' in items[i]:
				a = 1
			else:
				items[i]['latitud-2'] = 0

			if 'longitude-2' in items[i]:
				a = 1
			else:
				items[i]['longitude-2'] = 0

			c.execute("""INSERT INTO warehouses (name, slug, unit_price, measurement, company, phone, address, state, city, zip_code, labor_hours, approve, latitude, longitude) 
				VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""", (items[i]['name'], items[i]['slug'], items[i]['unit-price'], items[i]['measurement'], 
					items[i]['company'], items[i]['phone'], items[i]['address'], items[i]['state'], items[i]['city'], items[i]['zip-code'], items[i]['labor-hours'], 
					items[i]['approved'], items[i]['latitud-2'], items[i]['longitude-2']))
		db.commit()
		offset += 100
		pass
	c.close()
	db.close()
	print("Warehouses updated.")

#https://api.webflow.com/collections/5b8d5ccbcbd055b63724f24d/items?api_version=1.0.0&access_token=06b555feedd3c4eaa17899dc043b26309925af48eb448e2eb4f25fb2bbaf8611
