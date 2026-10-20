# رفع الموقع على VPS (هوستنجر)

الموقع بيشتغل على السيرفر بنفس بيئة التشغيل اللي بيشتغل فيها على ChatGPT Sites (workerd)، وقاعدة البيانات والصور المرفوعة بتنحفظ على السيرفر نفسه داخل `/srv/almohtarifoon-site/.wrangler`. دخول لوحة الإدارة بيكون بإيميل وكلمة سر بتختارهم وقت الإعداد.

## قبل ما تبدأ

- VPS بنظام **Ubuntu 22.04 أو 24.04**، بذاكرة 1 GB على الأقل (السكربت بيضيف ذاكرة احتياطية swap إذا لزم).
- الدومين `spaprofacademy.com` على هوستنجر.

## 1. وجّه الدومين للسيرفر

من hPanel: **Domains ← spaprofacademy.com ← DNS / Nameservers**:

| النوع | الاسم | القيمة |
| --- | --- | --- |
| A | `@` | عنوان IP تبع الـ VPS |
| A | `www` | عنوان IP تبع الـ VPS |

احذف أي سجل `A` أو `AAAA` قديم على `@` أو `www`. **لا تلمس سجلات `MX`** إذا عندك إيميل على الدومين. التفعيل بياخد من دقائق لساعات.

## 2. شغّل الإعداد (مرة وحدة)

افتح الطرفية: من hPanel ← **VPS ← Browser terminal**، أو من جهازك `ssh root@IP`. ثم:

```bash
curl -fsSL https://raw.githubusercontent.com/mohgraphic-ux/almohtarifoon-site/main/deploy/setup-vps.sh -o setup-vps.sh
sudo bash setup-vps.sh spaprofacademy.com your-email@example.com
```

السكربت بيسألك عن **إيميل المدير** و**كلمة سر** (12 حرف أو أكثر، ما بتظهر وإنت بتكتبها). وبيعمل لحاله:
تثبيت Node 22 خاص بالموقع داخل `/opt/node22` (بدون ما يلمس نسخة Node الموجودة)، تنزيل الكود من GitHub، البناء، تشغيل الموقع كخدمة بترجع تشتغل لحالها، موقع Nginx خاص بالدومين، شهادة HTTPS مجانية (Let's Encrypt)، ونسخة احتياطية يومية. السكربت ما بيغيّر الجدار الناري وما بيلمس أي موقع ثاني على نفس السيرفر.

> الإيميل الثاني بالأمر هو لتنبيهات شهادة HTTPS فقط.
> شهادة HTTPS بتنجح بس بعد ما يكون الدومين موجّه للسيرفر (الخطوة 1).

## 3. جرّب

- الموقع: `https://spaprofacademy.com`
- لوحة الإدارة: `https://spaprofacademy.com/admin` (بالإيميل وكلمة السر اللي اخترتهم)

## نقل المحتوى من ChatGPT Sites (اختياري)

من لوحة الإدارة القديمة: **الهوية والتواصل والإعدادات ← تصدير المحتوى**. ارفع الملف للسيرفر، ثم:

```bash
sudo bash /srv/almohtarifoon-site/deploy/import-content.sh /root/محتوى-المحترفون.json
```

بينقل النصوص والصفحات والأخبار والفريق والإعدادات. **طلبات التواصل والصور اللي انرفعت على المنصة القديمة ما بتنتقل**، فارفع الصور من جديد من «مكتبة الوسائط».

## تحديث الموقع لاحقاً

بعد أي تعديل على الكود ورفعه على GitHub (`git push`)، على السيرفر:

```bash
sudo bash /srv/almohtarifoon-site/deploy/update.sh
```

## أوامر مفيدة

- حالة الموقع: `systemctl status almohtarifoon`
- السجلات: `journalctl -u almohtarifoon -n 100 --no-pager`
- إعادة تشغيل: `sudo systemctl restart almohtarifoon`
- تغيير إيميل أو كلمة سر المدير: `sudo bash /srv/almohtarifoon-site/deploy/make-admin.sh spaprofacademy.com` ثم `sudo bash /srv/almohtarifoon-site/deploy/update.sh`.
- النسخ الاحتياطية: `/var/backups/almohtarifoon` (يومياً، آخر 14 يوم). للاسترجاع: أوقف الخدمة، فك الأرشيف داخل `/srv/almohtarifoon-site`، وشغّلها.

## ملاحظات

- إعدادات السيرفر السرية في `/etc/almohtarifoon/site.env`، وهي مش موجودة بالكود ولا على GitHub.
- نفس الكود بيضل يشتغل على ChatGPT Sites كمان؛ وضع السيرفر بيتفعّل بس لما `SELF_HOSTED=1`.
