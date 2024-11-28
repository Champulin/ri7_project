create virtual environment

```python3
python3 -m venv venv
```

use this command to activate the virtual environment

```source
source venv/bin/activate

```

install and setup postgreSQL database

```
sudo apt update
sudo apt install postgresql postgresql-contrib

```

start the service

```
sudo service postgresql start

```

switch to postgres user and open the sql shell

```
sudo -i -u postgres
psql


```

create the database and their user

```
CREATE DATABASE book_reviews_db;
CREATE USER book_user WITH PASSWORD 'book_password';
GRANT ALL PRIVILEGES ON DATABASE book_reviews_db TO book_user;
\q
exit
```

to run the docker container

```
docker-compose build
docker-compose up
```

to run the initial migrations inside the container

first with the container running we verify our container name

```
docker ps

```

then we use it to run the migrations

```

docker exec -it <container_name> python manage.py migrate

docker exec -it <container_name> python manage.py createsuperuser

```

we test user creation with

``» coverage run --omit='*/venv/*' manage.py test ``		

to seed the database with users books and authors run from the root of the project

```python
python manage.py seed_data 
```
