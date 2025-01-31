export const validateWithSchema = (schema) => {
  return (req, res, next) => {
    // التحقق من المدخلات باستخدام الـ schema
    const { error } = schema.validate(req.body, { abortEarly: false }); // { abortEarly: false } لعرض جميع الأخطاء دفعة واحدة

    if (error) {
      // إذا كان هناك خطأ، يتم إرسال استجابة تحتوي على التفاصيل
      return res.status(400).json({ 
        errors: error.details.map(detail => ({
          message: detail.message,
          path: detail.path,
        }))
      });
    }

    // إذا كانت المدخلات صحيحة، انتقل إلى الـ middleware التالي
    next();
  };
};
