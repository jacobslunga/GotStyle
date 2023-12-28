from base64 import b64decode
from io import BytesIO
from PIL import Image, ImageFilter, ImageEnhance
from core.config import (
    BUCKET_NAME,
    AWS_ACCESS_KEY,
    AWS_SECRET_KEY,
    CLOUDFRONT_DOMAIN,
    CLOUDFRONT_DISTRIBUTION_ID,
)
from flask import jsonify
from datetime import datetime
import boto3
import uuid


def upload_to_s3(photo_base64: str, id: str, img_type: str) -> str:
    def get_image_format(image_bytes: bytes) -> str:
        magic_numbers = {
            b"\xff\xd8": "JPEG",
            b"\x89PNG": "PNG",
            b"GIF8": "GIF",
            b"BM": "BMP",
            b"\x00\x00\x01\x00": "ICO",
        }

        for magic, format_name in magic_numbers.items():
            if image_bytes.startswith(magic):
                return format_name

        return "UNKNOWN"

    image_data = b64decode(photo_base64)
    image_format = get_image_format(image_data[:8])

    if image_format == "UNKNOWN":
        return jsonify({"message": "Unknown image format"}), 400

    image = Image.open(BytesIO(image_data))

    enhancer = ImageEnhance.Sharpness(image)
    image = enhancer.enhance(2)

    aspect_ratio = image.width / image.height
    new_width = 800 if img_type != "profile_picture" else 400
    new_height = int(new_width / aspect_ratio)
    image = image.resize((new_width, new_height), Image.LANCZOS)

    buffer = BytesIO()
    image.save(buffer, format=image_format, quality=80)
    compressed_image_data = buffer.getvalue()

    s3 = boto3.client(
        "s3",
        aws_access_key_id=AWS_ACCESS_KEY,
        aws_secret_access_key=AWS_SECRET_KEY,
    )

    file_name = f"{img_type}_{id}_{uuid.uuid4()}.{image_format.lower()}"

    try:
        s3.delete_object(Bucket=BUCKET_NAME, Key=file_name)

        cloudfront = boto3.client(
            "cloudfront",
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_KEY,
        )
        cloudfront.create_invalidation(
            DistributionId=CLOUDFRONT_DISTRIBUTION_ID,
            InvalidationBatch={
                "Paths": {
                    "Quantity": 1,
                    "Items": [
                        f"/{file_name}",
                    ],
                },
                "CallerReference": str(datetime.now()),
            },
        )

    except Exception as e:
        print(f"No existing file to delete: {e}")

    try:
        _ = s3.put_object(
            Bucket=BUCKET_NAME,
            Key=file_name,
            Body=compressed_image_data,
            ContentType="image/jpeg",
        )
        return f"{CLOUDFRONT_DOMAIN}/{file_name}"
    except Exception as e:
        return jsonify({"message": f"Error uploading file to S3: {e}"}), 400
