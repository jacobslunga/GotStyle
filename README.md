# GotStyle

An OOTD (Outfit Of The Day) app that lets people share their daily outfits with each other.

## Features

- Post up to 5 outfit images
- Like, save & comment on outfits
- Add links to the clothes in the outfit

and more

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file (located in the gotstyle-server folder)

`AWS_ACCESS_KEY`

`AWS_SECRET_KEY`

`JWT_SECRET`

`DATABASE_URL_DEV`

## Run Locally

Clone the project

```bash
git clone https://github.com/jacobslunga/gotstyle
```

Go to the project directory

```bash
cd gotstyle
```

Open 2 terminals

Go to the app directory in one terminal

```bash
cd gotstyle-app
```

Go to the server directory in one terminal

```bash
cd gotstyle-server
```

In the app directory run:

```bash
npm install
```

and then:

```bash
npm start
```

In the server directory run:

```bash
virtualenv venv
```

Then source the virtual environment and run:

```bash
pip install -r requirements.txt
```

and then:

```bash
gunicorn -w 4 -b 0.0.0.0:8001 wsgi:app
```

## Tech Stack

**Client:** React Native, Axios, Expo

**Server:** Python, Flask

**Other:** AWS: S3, Cloudfront, EC2

## Screenshots

![App Screenshot](https://gotstyle-bucket.s3.eu-central-1.amazonaws.com/app-mockup.png)
