# blog.adrianrubico.com
![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/docker-2496ED.svg?style=for-the-badge&logo=docker&logoColor=white)

## Introduction

This is my personal blog site, built with Django framework, Ajax, and Recaptcha. Additionally, it is SEO-friendly with a sitemap.xml implemented. You can check out my blog site [blog.adrianrubico.com](https://blog.adrianrubico.com/)

# Table of Content
  * [Introduction](#introduction)
  * [Deploy Locally](#deploy-locally)
  * [Installation](#installation)
  * [Edit Post](#edit-post)
  * [Techonology Used](#technology-used)
  * [Features](#features)
  * [Website Screenshots](#website-screenshots)
  * [Admin Screenshots](#admin-screenshots)
  * [Deployment](#deployment)
  * [Credits](#credits)
  * [License](#License)
  * [Author](#author)

## Deploy Locally
If you want to try this 

## Installation
#### 1. Clone the repository:
```bash
git clone https://github.com/git-adrianrubico/blog.adrianrubico.com
```
#### 2. Create and activate virtual environment:
```bash
cd blog.adrianrubico.com
python -m venv env
source env/bin/activate
```

#### 3. Next, Install all the components
```python
pip install -r requirements.txt
```
#### 4. Make a migration and migrate
```python
python manage.py makemigrations
python manage.py migrate
```
#### 5. Once the data is migrated, create a superuser to entry a data into DB.
```python
python manage.py createsuperuser
```

Primary Modules used
  - Django==5.0.7 
  - django-recaptcha==4.0.0

## Edit Post
To edit post follow this format in ckeditor admin page. <br>
In the style tag, represent the blur effect on your images. <br>
Then, img tag your full resolution img.
In addition, I include `postdetail-text_container` to align center of your texts.

You can use this as reference if you like 😉

```html
<div class="main-photo-container">
    <div class="blur-load" style="background-image:url(https://bucket-adrianrubico28.s3.us-east-1.amazonaws.com/blog_app/blog_photo_main/blog-3-smallv2.jpg);">
        <img class="blurry-load" src="https://bucket-adrianrubico28.s3.us-east-1.amazonaws.com/blog_app/blog_photo_main/blog-3.jpg" loading="lazy">
    </div>
</div>
<div class="postdetail-text_container">
    <p>
        TEXT HERE
    </p>
    <div class="postdetail_subimage">
        <div class="blur-load" style="background-image:url(https://bucket-adrianrubico28.s3.us-east-1.amazonaws.com/blog_app/blog_photo_main/blog-3-smallv2.jpg);">
            <img src="https://bucket-adrianrubico28.s3.us-east-1.amazonaws.com/blog_app/blog_photo_main/blog-3.jpg" id="zoom-background" loading="lazy">
        </div>
    </div>
</div>
```

## Technology Used
- Python
- HTML
- CSS
- Javascript

## Features
1. **Django-Powered**: A robust portfolio leveraging Django for dynamic content and seamless interactivity.

2. **Google Recaptcha**: Prevent bots and enhance security with Google Recaptcha, ensuring a secure and spam-free communication experience.

3. **SEO-Friendly**: Optimized for search engines with an implemented sitemap.xml, enhancing visibility and ranking on search engine results pages (SERPs).

## Website Screenshots
![image1](<Website Screenshots/Main_Page_DV.png>)
![image2](<Website Screenshots/Main_Page_MV.png>)
![image3](<Website Screenshots/Post_Detail_DV.png>)

## Admin Screenshots
![image4](<AdminSite Screenshots/Basic_info.png>)
![image5](<AdminSite Screenshots/Posts.png>)

## Deployment
In the deployment you may 

## Credits
- Blog Template Design: https://github.com/deepjyoti30/blog.deepjyoti30.dev
- Django Recaptcha Setup: https://www.youtube.com/@bugbytes3923
- Simple Icons: https://cdn.simpleicons.org
- Highlight JS: https://highlightjs.org
- Medium Zoom: https://github.com/francoischalifour/medium-zoom

## License 
This project is licensed under the [MIT License](LICENSE).

## Author
 - GitHub - [git-adrianrubico](https://github.com/git-adrianrubico)
 - LinkedIn - [Adrian Rubico]([git-adrianrubico](https://www.linkedin.com/in/adrianrubico))