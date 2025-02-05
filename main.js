// ملف main.js
(function() {
    "use strict";
  
    /* ========================
       دالة Debounce لتقليل عدد الاستدعاءات
    ======================== */
    function debounce(func, wait, immediate) {
      let timeout;
      return function() {
        const context = this,
          args = arguments;
        const later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    }
  
    /* ========================
       تنفيذ Lazy Loading للصور
    ======================== */
    document.addEventListener("DOMContentLoaded", function() {
      const lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
      
      if ("IntersectionObserver" in window) {
        const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              const lazyImage = entry.target;
              lazyImage.src = lazyImage.dataset.src;
              lazyImage.classList.remove("lazy");
              lazyImageObserver.unobserve(lazyImage);
            }
          });
        });
        
        lazyImages.forEach(function(lazyImage) {
          lazyImageObserver.observe(lazyImage);
        });
      } else {
        // بديل للمتصفحات القديمة باستخدام دالة debounce
        const lazyLoad = debounce(function() {
          for (let i = 0; i < lazyImages.length; i++) {
            if (lazyImages[i].getBoundingClientRect().top < window.innerHeight &&
                lazyImages[i].getBoundingClientRect().bottom > 0) {
              lazyImages[i].src = lazyImages[i].dataset.src;
              lazyImages[i].classList.remove("lazy");
              lazyImages.splice(i, 1);
              i--;
            }
          }
          if (lazyImages.length === 0) {
            document.removeEventListener("scroll", lazyLoad);
            window.removeEventListener("resize", lazyLoad);
            window.removeEventListener("orientationchange", lazyLoad);
          }
        }, 200);
        
        document.addEventListener("scroll", lazyLoad);
        window.addEventListener("resize", lazyLoad);
        window.addEventListener("orientationchange", lazyLoad);
      }
    });
  
    /* ========================
       استخدام Web Worker للمهام الثقيلة
    ======================== */
    if (window.Worker) {
      const myWorker = new Worker("worker.js");
      myWorker.onmessage = function(e) {
        console.log("نتيجة العملية من الويب ووركر:", e.data);
        // يمكن استخدام e.data لتحديث الواجهة بعد انتهاء الحسابات الثقيلة
      };
      // مثال: إرسال بيانات لمعالجة حسابية
      myWorker.postMessage({ task: "calculateSum", payload: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] });
    } else {
      console.warn("المتصفح لا يدعم Web Workers");
    }
  
    /* ========================
       استخدام requestAnimationFrame للأنيميشن
    ======================== */
    function smoothAnimation() {
      // هنا يمكن وضع تحديثات الأنيميشن أو أي تحديثات تتعلق بالواجهة
      // على سبيل المثال: تحديث موضع عنصر متحرك
      // document.getElementById("animatedElement").style.transform = ...;
  
      // استدعاء الدالة مرة أخرى في الإطار التالي
      requestAnimationFrame(smoothAnimation);
    }
    // بدء الحلقة السلسة للأنيميشن
    smoothAnimation();
  
    /* ========================
       تحسين أداء الأحداث (مثال: تحديث عند التمرير)
    ======================== */
    window.addEventListener("scroll", debounce(function() {
      // يمكن وضع كود لتحديث عناصر الواجهة أثناء التمرير دون التأثير على الأداء
      console.log("تم التمرير بنجاح دون تعليق الموقع.");
    }, 100));
  })();
  