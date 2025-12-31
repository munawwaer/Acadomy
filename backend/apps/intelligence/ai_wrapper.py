# intelligence/ai_wrapper.py
from notifications.services import Notify
from notifications.models import NotificationEvent
import google.generativeai as genai
import json
import os
from dotenv import load_dotenv     #dotenv   تحميل من ملف .env
load_dotenv()
import re

GENAI_API_KEY = os.getenv("GEMINI_API_KEY")

class GeminiBrain:
    def __init__(self):
        try:
            genai.configure(api_key=GENAI_API_KEY)
            self.model = genai.GenerativeModel('models/gemini-flash-latest')
            self.is_active = True
        except:
            self.is_active = False
# ai_wrapper.py

    def generate_landing_copy(self, project_title, raw_description, approved_solutions_list):
        """
        توليد محتوى صفحة الهبوط بناءً على الوصف الخام + الحلول التي اعتمدها المستخدم.
        """
        
        # تحويل قائمة الحلول إلى نص مقروء للذكاء الاصطناعي
        # الشكل: المشكلة: ... -> الحل: ...
        solutions_text = "\n".join([
            f"- المشكلة: {item['problem']} -> الحل المعتمد: {item['solution']}" 
            for item in approved_solutions_list
        ])

        prompt = f"""
        أنت كاتب محتوى إعلاني (Copywriter) محترف جداً ومختص في صفحات الهبوط (Landing Pages).
        
        لدينا مشروع بالبيانات التالية:
        1. اسم المشروع: {project_title}
        2. وصف المشروع الخام: {raw_description}
        3. المشاكل التي يحلها والحلول التقنية المعتمدة:
        {solutions_text}

        المطلوب منك:
        قم بإعادة صياغة هذه المعلومات لتخلق محتوى تسويقي جذاب جداً (لا تنسخ الكلام، بل أبدع في صياغته).
        
        المخرجات المطلوبة (JSON فقط):
        1. "suggested_brand_name": اقترح اسماً تجارياً (Brand Name) إبداعياً، قصيراً، وجذاباً يعكس الحلول الذكية (لا يتجاوز كلمتين).

        2. "main_headline": عنوان رئيسي لا يزيد عن 10 كلمات. يجب أن يكون جذاباً (Catchy) ويركز على الفائدة النهائية للعميل.
        3. "sub_headline": عنوان فرعي يشرح فكرة المشروع بوضوح وكيف يحل المشاكل المذكورة أعلاه.
        4. "features": قائمة (Array) تحتوي على 3 ميزات رئيسية مستخلصة من "الحلول المعتمدة". 
           - لكل ميزة ضع "title" (اسم الميزة التسويقي) و "desc" (وصف الميزة وكيف تفيد العميل).

        الرد يجب أن يكون JSON Valid تماماً بهذا الشكل:
        {{
            "suggested_brand_name":"...",
            "main_headline": "...",
            "sub_headline": "...",
            "features": [
                {{"title": "...", "desc": "..."}},
                {{"title": "...", "desc": "..."}},
                {{"title": "...", "desc": "..."}}
            ]
        }}
        """

        try:
            response = self.model.generate_content(prompt)
            clean_text = response.text.replace('```json', '').replace('```', '').strip()
            return json.loads(clean_text)
        except Exception as e:
            print(f"AI Error: {e}")
            Notify.send_to_admins(
            event_type=NotificationEvent.SYSTEM_ALERT,
            context={
                'error_msg': str(e)[:100] # نرسل أول 100 حرف من الخطأ فقط
                },
                icon="server"
            )
            # في حال الخطأ نرجع بيانات افتراضية بسيطة
            return {
                "suggested_brand_name": project_title, # في حال الفشل نرجع الاسم الأصلي
                "main_headline": f"اكتشف {project_title}",
                "sub_headline": raw_description[:100],
                "features": []
            }
  # ai_wrapper.py
    # تأكد من استيراد هذه المكتبة في بداية الملف

    def suggest_solutions_for_problems(self, problems_list, project_title, project_description):
        """
        نسخة محسنة: تعطي حلولاً تقنية وميزات حقيقية بدلاً من كلام عام.
        """
        # إذا كان المودل غير مفعل (بسبب خطأ في المفتاح) نرجع الحلول الافتراضية
        if not self.is_active:
            print("Warning: AI Model is not active. Check API Key.")
            return [{"problem": p, "solution": "نعمل على حلها (النظام غير متصل)"} for p in problems_list]

        # 1. التلقين الذكي (Prompt Engineering)
        prompt = f"""
        أنت مدير منتج تقني (Product Manager) ومهندس برمجيات خبير.
        
        سياق المشروع:
        - الاسم: {project_title}
        - الوصف: {project_description}
        
        المشاكل التي يشتكي منها العملاء:
        {json.dumps(problems_list, ensure_ascii=False)}

        المطلوب منك:
        لكل مشكلة، اقترح "ميزة برمجية" (Feature) أو "حلاً تقنياً" محدداً يحلها جذرياً.
        
        قواعد صارمة جداً:
        1. ⛔ يمنع منعاً باتاً الإجابات العامة مثل: "سوف نقوم بحل المشكلة" أو "نعمل على التحسين".
        2. ✅ يجب أن يكون الحل تقنياً أو إجرائياً. 
           - مثال سيء: "حل مشكلة التأخير".
           - مثال ممتاز: "إضافة نظام تتبع مباشر للسائق عبر GPS".
           - مثال سيء: "تقليل السعر".
           - مثال ممتاز: "توفير باقات اشتراك شهرية مخفضة وكوبونات خصم".
        3. الحل يجب أن يكون مختصراً (أقل من 15 كلمة).

        شكل المخرجات (JSON Array Only):
        [
            {{"problem": "نص المشكلة الأصلي", "solution": "الحل التقني المقترح"}}
        ]
        """
        
        try:
            # إرسال الطلب
            response = self.model.generate_content(prompt)
            
            # 2. تنظيف الرد (Robust JSON Parsing)
            # هذه الخطوة تستخرج النص الموجود بين [ و ] فقط لتتجاهل أي مقدمات يكتبها الذكاء
            match = re.search(r'\[.*\]', response.text, re.DOTALL)
            if match:
                clean_json = match.group()
                return json.loads(clean_json)
            else:
                # محاولة أخيرة للتنظيف العادي
                clean_text = response.text.replace('```json', '').replace('```', '').strip()
                return json.loads(clean_text)

        except Exception as e:
            # 3. طباعة الخطأ بوضوح في التيرمينال لنعرف السبب
            print(f"🔴 AI CRITICAL ERROR: {e}") 
            
            # إرسال تنبيه للأدمن
            Notify.send_to_admins(
                event_type=NotificationEvent.SYSTEM_ALERT,
                context={'error_msg': f"فشل توليد الحلول: {str(e)[:100]}"},
                icon="server"
            )
            
            # الرد الافتراضي في حالة الفشل التام
            return [{"problem": p, "solution": "جاري تحليل المشكلة تقنياً..."} for p in problems_list]




