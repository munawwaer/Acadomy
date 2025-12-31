import os
import django
import random

# إعداد بيئة Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings') # تأكد من اسم مجلد الإعدادات
django.setup()

from projects.models import Project # تأكد من مسار الموديل
from django.contrib.auth import get_user_model

User = get_user_model()

def seed_projects():
    user = User.objects.first() # سيقوم بربط المشاريع بأول مستخدم مسجل (أنت)
    if not user:
        print("لا يوجد مستخدمين في النظام!")
        return

    sectors = ["التقنية", "العقارات", "المطاعم", "التعليم", "الصحة"]
    stages = ["IDEA", "RESEARCH_COMPLETED", "STRATEGY_SET", "PUBLISHED"]

    for i in range(10): # سيضيف 10 مشاريع
        Project.objects.create(
            user=user,
            title=f"مشروع تجريبي رقم {i+1}",
            target_sector=random.choice(sectors),
            stage=random.choice(stages),
            description="هذا وصف تجريبي للمشروع المضاف آلياً.",
            # يمكنك إضافة بيانات وهمية للتقرير هنا
            research_report={"status": "completed", "summary": "تحليل تجريبي"} 
        )
    print("تم إضافة 10 مشاريع بنجاح!")

if __name__ == "__main__":
    seed_projects()