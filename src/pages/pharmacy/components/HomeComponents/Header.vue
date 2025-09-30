<template>
  <div class="flex flex-col md:flex-row items-center justify-center bg-gradient-to-r from-[#F6FAFF] to-[#F6FAFF] rounded-lg">
    <div
      class="flex flex-col items-start p-12 md:p-16 w-full md:w-1/2 text-right rounded-lg rtl:text-right h-[85vh]"
      dir="rtl"
    >
      <div class="flex flex-col h-full justify-between w-full md:w-[90%]">
        <div class="flex flex-col">
          <span class="text-base font-bold text-red-600 mb-2">
            عرض خاص!
          </span>
          <h2 class="mt-2 text-2xl md:text-4xl font-bold text-blue-900 leading-snug">
            توصيل مجاني من جميع المستودعات الشريكة هذا الأسبوع.
          </h2>
          <p class="mt-6 text-lg text-blue-800 leading-relaxed">
            استمتع بهذا الأسبوع توصيل مجاني من جميع المستودعات الشريكة إلى صيدليتك المفضلة عبر منصتنا.
            نسهلها في الطلب، وسرعة في التوصيل – لأن راحتك وصحتك أولويتنا.
          </p>
        </div>
        <button
          class="flex items-center justify-center px-8 py-3 mt-8 font-bold text-white transition-colors rounded-full bg-green-600 hover:bg-green-700 w-fit"
        >
          اطلب الآن
          <i class="ml-2 pi pi-arrow-left"></i>
        </button>
      </div>
    </div>
    <div class="md:flex items-center justify-center w-full md:w-1/2 p-4 hidden">
      <img
        src="../../../../assets/home/header.png"
        alt="كبسولة طبية مع أيقونات"
        class="object-contain drop-shadow-lg"
      />
    </div>
  </div>
</template>

<script setup>
import 'primeicons/primeicons.css';
</script>

<style scoped>
/* لا حاجة لأنماط مخصصة، Tailwind يكفي */
</style>
