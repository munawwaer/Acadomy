# نستخدم بايثون كأساس
FROM python:3.12-slim

# منع بايثون من كتابة ملفات pyc ومنع التخزين المؤقت للمخرجات
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# مجلد العمل داخل الحاوية
WORKDIR /app

# تثبيت متطلبات النظام (من أجل مكتبات قواعد البيانات)
RUN apt-get update && apt-get install -y libpq-dev gcc

# نسخ ملف المتطلبات وتثبيتها
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# نسخ باقي الكود
COPY . /app/
CMD [ "python","manage.py","runserver","0.0.0.0:8000" ]

# # ========== المرحلة الأولى: البناء (Builder) ==========
# FROM python:3.9-slim as builder

# WORKDIR /app

# # 1. تثبيت أدوات بناء ثقيلة (نحتاجها فقط للتثبيت ولن نحتاجها للتشغيل)
# # مثلاً: gcc لتجميع المكتبات المعقدة
# RUN apt-get update && apt-get install -y \
#     gcc \
#     libpq-dev \
#     python3-dev

# # 2. إنشاء بيئة افتراضية (Virtual Environment)
# # سنعزل كل المكتبات داخل مجلد واحد اسمه /opt/venv
# RUN python -m venv /opt/venv
# # تفعيل البيئة
# ENV PATH="/opt/venv/bin:$PATH"

# # 3. تثبيت المكتبات داخل هذه البيئة
# COPY requirements.txt .
# RUN pip install -r requirements.txt


# ========== المرحلة الثانية: التشغيل (Final) ==========
# FROM python:3.9-slim

# WORKDIR /app

# # 1. نسخ البيئة الافتراضية الجاهزة من المرحلة الأولى
# # لاحظ: نحن لم نثبت gcc هنا! وفرنا مساحة وحمينا النظام
# COPY --from=builder /opt/venv /opt/venv

# # 2. تفعيل البيئة في الصورة النهائية
# ENV PATH="/opt/venv/bin:$PATH"

# # 3. نسخ كود جانجو الخاص بك
# COPY . .

# # 4. التشغيل
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

