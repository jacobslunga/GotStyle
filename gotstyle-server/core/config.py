from dotenv import load_dotenv
import os

load_dotenv()

AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")
BUCKET_NAME = os.getenv("BUCKET_NAME")
CLOUDFRONT_DOMAIN = os.getenv("CLOUDFRONT_DOMAIN")
CLOUDFRONT_DISTRIBUTION_ID = os.getenv("CLOUDFRONT_DISTRIBUTION_ID")
