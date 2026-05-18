# ColorPixer - Professional Ranglar Palitrasi Generatori

ColorPixer — bu sun'iy intellekt yordamida yoki tasodifiy usulda ranglar palitrasini yaratish uchun zamonaviy veb-ilova. Ilova "High Density" dizayn interfeysiga ega va foydalanuvchilar uchun ranglar bilan ishlashda maksimal qulaylik yaratadi.

## 🚀 Xususiyatlari

- **AI Generatsiya:** Shunchaki mavzuni yozing (masalan: "Okean", "Kuz", "Cyberpunk") va Gemini AI sizga mos ranglarni tanlab beradi.
- **Tasodifiy palitra:** Probel (Space) tugmasini bosib cheksiz yangi ranglar palitrasini yarating.
- **Ranglarni tahrirlash:** Har bir rang ustiga bosib, maxsus ranglar palitrasi (color picker) orqali o'zingizga yoqqan rangni tanlang.
- **Qulflash (Lock):** O'zingizga yoqqan rangni qulflab qo'ying, shunda yangilash paytida u o'zgarmaydi.
- **Copy & Export:** Rang kodi ustiga bosib HEX kodni ko'chiring yoki butun palitirani JSON formatida yuklab oling.
- **Tarix (History):** Oxirgi yaratilgan 5 ta palitirani saqlab qoladi.

## 🛠 Texnologiyalar

- **Frontend:** React 19, Vite, Tailwind CSS 4.
- **Backend:** Express.js (Vite middleware bilan).
- **AI:** Google Gemini API (@google/genai).
- **Animatsiyalar:** Motion (framer-motion).
- **Ikonkalar:** Lucide React.

## ⚙️ O'rnatish va Ishga tushirish

Loyiha mahaliy (local) kompyuterda ishlashi uchun quyidagi qadamlarni bajaring:

### 1. Loyihani yuklab olish
Loyihani ZIP formatida ko'chirib oling va papkaga joylang.

### 2. Bog'liqliklarni o'rnatish
Terminalda quyidagi buyruqni bering:
```bash
npm install
```

### 3. API Key sozlash
Loyihaning ildiz (root) papkasida `.env` faylini yarating va unga o'zingizning Gemini API kalitingizni quyidagicha yozing:
```env
GEMINI_API_KEY="SIZNING_API_KALITINGIZ"
```
*(Siz bergan kalitni shu yerga qo'ysangiz bo'ladi)*

### 4. Loyihani ishga tushirish
Dasturni ishga tushirish uchun:
```bash
npm run dev
```

Keyin brauzeringizda `http://localhost:3000` manziliga kiring.

## ⚠️ EADDRINUSE Xatosini tuzatish

Agar sizda `Error: listen EADDRINUSE: address already in use 0.0.0.0:3000` xatosi chiqsa, demak 3000-port boshqa dastur (masalan, boshqa bir terminalda yoniq turgan loyiha) tomonidan band qilingan.

**Yechimi:**
1. Hamma ochiq terminallarni yopib, qaytadan urinib ko'ring.
2. Yoki `server.ts` faylidagi `const PORT = 3000;` qatorini `const PORT = 3001;` ga o'zgartiring.

## 🎨 Foydalanish bo'yicha ko'rsatma
- **Space (Probel):** Yangi tasodifiy palitra.
- **Rang Ustiga Bosish:** HEX kodini nusxalash.
- **AI Input:** Pastki qismdagi maydonga tavsif yozib AI yordamida rang olish.
- **Qulf Ikonkasi:** Rangni o'zgarmas qilish.

---
Yaratuvchi: **Mohidilbekova** 

