<template>
 <div class="bg-gray-50">
    <div class="bg-gray-50 min-h-screen py-10 px-4 md:px-8 max-w-7xl m-auto" >

    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

      <div class="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
        <div class="p-3 rounded-full mb-2">
          <i class="pi pi-building text-red-500 text-5xlxl"></i>
        </div>
        <h3 class="text-lg font-bold text-gray-800 mb-2">موقع الشركة</h3>
        <p class="text-sm text-gray-600 mb-1">اسم المنطقة، اسم المدينة</p>
        <p class="text-sm text-gray-500">جوارنا متواجدون من الأحد للخميس</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
        <div class=" p-3 rounded-full mb-2">
          <i class="pi pi-envelope text-yellow-500 text-4xl"></i>
        </div>
        <h3 class="text-lg font-bold text-gray-800 mb-2">راسلنا عبر الإيميل</h3>
        <a href="mailto:info@abc.cab" class="text-sm text-green-600 hover:underline mb-1">info@abc.cab</a>
        <p class="text-sm text-gray-500">احصل على الرد خلال 24 ساعة</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
        <div class="bg-orange-100 p-3 rounded-full mb-4">
          <i class="pi pi-phone text-orange-500 text-3xl"></i>
        </div>
        <h3 class="text-lg font-bold text-gray-800 mb-2">قم بالاتصال بنا</h3>
        <a href="tel:+966505299925" class="text-sm text-green-600 hover:underline mb-1">+966 50 529 99 25</a>
        <p class="text-sm text-gray-500">من الساعة 9 صباحًا حتى 5 مساءً</p>
      </div>

    </div>

    <div class="max-w-7xl mx-auto bg-white rounded-lg shadow-md flex flex-col-reverse lg:flex-row items-center p-8 lg:p-12 gap-10">

      <div class="w-full lg:w-1/2 text-right">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">هل لديك سؤال أو تعليق؟ املأ النموذج أدناه.</h2>
        <p class="text-base text-gray-700 mb-6">
          وسنقوم بالرد عليك في أقرب وقت ممكن.
          <br>
          هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة. لقد تم توليد هذا النص من مولد النص العربي.
        </p>

        <form @submit.prevent="submitForm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="الاسم كامل" class="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-right">
            <input type="email" placeholder="البريد الالكتروني" class="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-right">
          </div>
          <div class="mb-6">
            <textarea placeholder="رسالتك..." rows="5" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-right resize-none"></textarea>
          </div>
          <button type="submit" class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
            إرسال الرسالة
          </button>
        </form>
      </div>

      <div class="w-full lg:w-1/2 flex justify-center lg:justify-start">
        <img src="../../../assets/contact.png" alt="Contact Us Illustration" class="max-w-full h-auto object-contain">
      </div>

    </div>

  </div>
 </div>
</template>

<script setup>
import 'primeicons/primeicons.css';

// You would typically handle form submission logic here
const submitForm = () => {
  alert('Form submitted!');
  // Implement your actual form submission logic (e.g., API call)
};
</script>

<style scoped>
/* All styles are handled by Tailwind CSS classes. */
</style>
