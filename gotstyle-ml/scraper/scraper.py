from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
import urllib.request
import os

# Create download directory if it doesn't exist
if not os.path.exists("downloaded_images2"):
    os.makedirs("downloaded_images2")

# Initialize WebDriver
driver = webdriver.Chrome()


try:
    driver.get("https://www.pinterest.se/pin/36169603250655584/")

    # Scroll down
    for _ in range(5):
        driver.find_element(By.TAG_NAME, "body").send_keys(Keys.END)
        time.sleep(2)

    # Locate and download images
    containers = driver.find_elements(By.CSS_SELECTOR, "div.PinCard__imageWrapper")
    for index, container in enumerate(containers):
        img_element = container.find_element(By.TAG_NAME, "img")
        img_url = img_element.get_attribute("src")
        if img_url:
            urllib.request.urlretrieve(
                img_url,
                f"downloaded_images2/image_{str(index) + os.urandom(8).hex()}.jpg",
            )

    print("Downloaded images")
except Exception as e:
    print(f"An error occurred: {e}")

# Quit WebDriver
driver.quit()
