# frontend/Dockerfile

# نستخدم صورة Node.js خفيفة
FROM node:22-alpine

# نحدد مجلد العمل
WORKDIR /app

# ننسخ ملف الحزم أولاً (للاستفادة من الكاش)
COPY package.json package-lock.json ./

# نثبت المكتبات
RUN npm install

# ننسخ باقي ملفات المشروع
COPY . .

# نفتح المنفذ 3000
EXPOSE 5173

# أمر التشغيل
CMD ["npm", "run","dev"]
# # 1. سمينا هذه المرحلة "builder" لنشير إليها لاحقاً
# FROM node:18 AS builder

# WORKDIR /app
# COPY package.json .
# RUN npm install        # تحميل معدات البناء الثقيلة
# COPY . .
# RUN npm run build      # عملية البناء (أنتجت مجلد اسمه build)

# # 2. نبدأ من جديد بصورة خفيفة جداً (Nginx)
# FROM nginx:alpine

# # 3. السحر هنا: انسخ فقط المجلد الجاهز من المرحلة السابقة
# # --from=builder : تعني اذهب للمرحلة الأولى
# COPY --from=builder /app/build /usr/share/nginx/html

# # 4. المرحلة الأولى (node) يتم تدميرها تلقائياً ولا تدخل في الصورة النهائية
