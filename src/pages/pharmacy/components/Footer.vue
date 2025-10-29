<template>
  <!-- Main container for the footer, with RTL direction -->
  <footer class="bg-green-700 text-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3  gap-8 justify-items-center ">

       <!-- Logo and Copyright Section -->
        <div class="  flex  ">
          <img class="h-32 w-auto mb-4" src="../../../assets/media.png" alt="Pharma Bank Logo">

        </div>
        <!-- Main Links Section -->
        <div class="">
          <h3 class="text-xl font-bold mb-4">الرئيسية</h3>
          <ul class="space-y-2">
            <li><a href="/" class="hover:underline">الرئيسية</a></li>
            <li><a href="/pharmacy-offers" class="hover:underline">العروض</a></li>
            <li><a href="/pharmacy-warehouses" class="hover:underline">المستودعات</a></li>
            <li><a href="/" class="hover:underline">الاكثر طلبا</a></li>
            <li><a href="/pharmacy-categories" class="hover:underline">التصنيفات</a></li>
          </ul>
        </div>


  <!-- Contact Information Section -->
        <div class="">
          <h3 class="text-xl font-bold mb-4">بيانات التواصل</h3>
          <ul class="space-y-2">
            <li class="flex  ">
              <i class="pi pi-map-marker my-auto mx-1 text-white"></i>
              <span class="">123 Road, Dhaka, Bangladesh</span>

            </li>
            <li class="flex ">
              <i class="pi pi-phone my-auto mx-1 text-white"></i>
              <span class="">+88017010767000</span>

            </li>
            <li class="flex ">
               <i class="pi pi-envelope my-auto mx-1 text-white"></i>
              <span class="">sajibourdemo121@gmail.com</span>
            </li>
          </ul>
        </div>


      </div>

      <!-- Footer Divider -->
      <hr class="border-t border-green-500 my-8">

      <!-- Bottom Bar with Copyright and Legal Links -->
      <div class="flex flex-col md:flex-row items-center justify-between text-sm text-center md:text-right space-y-4 md:space-y-0">
        <div class="flex space-x-4 space-x-reverse">
          <a href="/Politics-privacy" class="hover:underline">سياسة الخصوصية</a>
          <a href="/terms-condition" class="hover:underline">الشروط والأحكام</a>
        </div>
        <p>&copy; 2024 Pharma Bank جميع الحقوق محفوظة</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No script logic is needed for this static footer component.
</script>

<style scoped>
/* All styles are handled by Tailwind CSS classes. */
</style>
