// ملف worker.js
// هذا الملف يعمل في خلفية المتصفح لمعالجة العمليات الثقيلة دون التأثير على الواجهة
onmessage = function(e) {
    if (e.data.task === "calculateSum") {
      // مثال على عملية حسابية: جمع عناصر المصفوفة
      const result = e.data.payload.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      postMessage(result);
    } else {
      // يمكن إضافة مهام أخرى حسب الحاجة
      postMessage("المهمة غير معروفة");
    }
  };
  