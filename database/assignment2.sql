--Task 1 queries 
--t1 s5.1
INSERT INTO account (
	account_firstname,
	account_lastname,
	account_email,
	account_password) 
VALUES (
	'Tony', 
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n');
	
--test successful
--select * from account;
	
--t1 s5.2
UPDATE account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

--test succesful
--select * from account; -- test to make sure tony stark is in the db

--t1 s5.3 Delete tony stark
DELETE FROM account 
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

--test successful
--select * from account; -- test to make sure tony stark is deleted


--t1 s5.4 change GM Hummer record to have "a huge interior" instead of "the small interior"
UPDATE inventory
SET inv_description = REPLACE(inv_description ,'the small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';

--test succesful
-- SELECT inv_description
-- FROM inventory
-- WHERE inv_model = 'Hummer';




SELECT * from classification;-- class_id, name
select * from inventory; -- inv_id,make,model,year,descip,image,thumbnail,price,miles,color,classid

--t1 s5.5 
--Use inner join to select the make and model fields from inventory and classification name from classification for items in the "sport" category
SELECT inv_make, inv_model,classification_name
FROM inventory inv
	JOIN classification cla 
		ON inv.classification_id = cla.classification_id
WHERE inv.classification_id = 2;
--Test: Run this query, successful



--t1 s5.6 Update all records in inventory table to add "/vehicles" to the middle of the file path of inv_image and inv_thumbnail columns using a single query
UPDATE inventory
SET 
	inv_image = REPLACE(inv_image ,'/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/','/images/vehicles/');
	
--test succesful
--select * from inventory;


	