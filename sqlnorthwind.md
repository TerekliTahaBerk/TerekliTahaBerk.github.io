---
layout: default
title: SQL NorthWind Exercises
permalink: /sqlnorthwind/
---

# Northwind Exercises (SQL Practice)

This repository contains SQL exercises based on the classic **Northwind** database. These exercises cover fundamental SQL concepts such as data retrieval, filtering, aggregation, joins, subqueries, and database modifications. Working through these challenges helps improve SQL skills and prepares for real-world database queries.

## Exercises

### [Querying the Database – Part 1](https://github.com/TerekliTahaBerk/sql-portfolio/blob/main/Northwind%20Exercises/SQL%20Practice%20Exercises%20General%20-%20Part%201.sql)

1. Retrieve all category names with their descriptions from the **Categories** table.  
2. List the contact name, customer ID, and company name of all customers in **London**.  
3. Select all suppliers that have a **FAX number**.  
4. Retrieve a list of customer IDs from the **Orders** table with required dates between **Jan 1, 1997 – Jan 1, 1998** and freight under **100 units**.  
5. List the **company names and contact names** of all **Owners** from Mexico, Sweden, and Germany.  
6. Count the number of **discontinued products** in the **Products** table.  
7. Retrieve category names and descriptions of all categories beginning with **'Co'**.  
8. List **company names, city, country, and postal code** of suppliers with the word **'rue'** in their address, ordered alphabetically.  
9. Retrieve **product ID and total quantities ordered** for each product from the **Order Details** table.  
10. Get customer names and addresses for orders shipped using **Speedy Express**.  
11. List suppliers with **company name, contact name, contact title, and region description**.  
12. Retrieve product names from the **Products** table that are classified as **condiments**.  
13. List customer names who have **no orders** in the **Orders** table.  
14. Add a **shipper named 'Amazon'** to the **Shippers** table.  
15. Update **'Amazon'** to **'Amazon Prime Shipping'** in the **Shippers** table.  
16. Retrieve all **shippers** with freight totals rounded to the nearest whole number for shippers with orders.  
17. Display all employee names in the format **'LastName, FirstName'**.  
18. Add yourself to the **Customers** table with an order for **'Grandma's Boysenberry Spread'**.  
19. Remove yourself and your order from the database.  
20. Retrieve **products with total stock** greater than **100**, using alias **'TotalUnits'**.  

### [Querying the Database – Part 2](https://github.com/TerekliTahaBerk/sql-portfolio/blob/main/Northwind%20Exercises/SQL%20Practice%20Exercises%20General%20-%20Part%202.sql)

21. Select **name, address, city, and region** of employees.  
22. Retrieve the same data but only for employees **living in the USA**.  
23. Select employees **older than 50 years**.  
24. Find employees who **placed orders to be delivered in Belgium** (write two versions: with and without JOIN).  
25. Retrieve employee names and customer names for orders **shipped by 'Speedy Express'** to **Brussels**.  
26. Find employees who sold at least one of **'Gravad Lax'** or **'Mishi Kobe Niku'**.  
27. List employees and their **supervisors (or NULL if they have none)**.  
28. Find customers in **London** who buy from suppliers **'Pavlova, Ltd.'** or **'Karkki Oy'**.  
29. Retrieve product names **bought or sold by people in London** (two versions: with and without UNION).  
30. Find employees older than **(a) any employee in London, (b) all employees in London**.  
31. List employees who work **longer than any employee in London**.  
32. Retrieve employees who have **sold to customers in their own city**.  
33. Find customers who **have not purchased any product**.  
34. Find customers who **bought all products with a price less than $5**.  
35. List products **sold by all employees**.  
36. Retrieve customers who **bought all products purchased by customer 'LAZYK'**.  
37. Retrieve customers who **bought exactly the same products as 'LAZYK'**.  
38. Calculate **average product price per category**.  
39. Display category names alongside their **average product prices**.  
40. Find suppliers that provide **more than 3 products**.  
41. Retrieve employees alongside their **number of orders** (ordered by employee ID).  
42. Retrieve employees alongside the **number of distinct products sold** (ordered by employee ID).  
43. Retrieve employees alongside their **total sales** (ordered by employee ID).  
44. Retrieve employees who have sold **more than 70 different products**.  
45. Find employees who sell **products from more than 7 suppliers**.  
46. Retrieve customer-product pairs where **the customer bought more than 5 times the average quantity of that product in a single order**.  

## 🛠️ Tools Used

- **PostgreSQL**  
- **SQL Server**  
- **Microsoft SQL Server Studio**  
- **Northwind Database**  

## ☕️ Support My Work

If this project helped you practice SQL or provided inspiration for your own learning, consider [buying me a coffee](https://www.buymeacoffee.com/tahaberkterekli) ❤️. Your support encourages me to continue sharing SQL exercises and real-world data analysis projects!
