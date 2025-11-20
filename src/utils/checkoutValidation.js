export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatPhoneNumber = (value) => {
  const digits = value.replace(/\D/g, "");

  if (digits.length > 0 && digits[0] !== "0") {
    return "";
  }

  const limitedDigits = digits.slice(0, 10);

  let formatted = "";
  if (limitedDigits.length > 0) {
    formatted = limitedDigits[0]; // 0
  }
  if (limitedDigits.length > 1) {
    formatted += limitedDigits.slice(1, 3); // XX
  }
  if (limitedDigits.length > 3) {
    formatted += " " + limitedDigits.slice(3, 6); // XXX
  }
  if (limitedDigits.length > 6) {
    formatted += " " + limitedDigits.slice(6, 8); // XX
  }
  if (limitedDigits.length > 8) {
    formatted += " " + limitedDigits.slice(8, 10); // XX
  }

  return formatted;
};

export const validatePhone = (phone) => {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 && digits[0] === "0";
};

export const formatCardNumber = (value) => {
  const digits = value.replace(/\D/g, "");

  const limitedDigits = digits.slice(0, 16);

  const formatted = limitedDigits.match(/.{1,4}/g)?.join(" ") || "";

  return formatted;
};

export const validateCardNumber = (cardNumber) => {
  const digits = cardNumber.replace(/\D/g, "");
  return digits.length === 16;
};

export const formatCardExpiry = (value) => {
  const digits = value.replace(/\D/g, "");

  const limitedDigits = digits.slice(0, 4);

  let formatted = "";
  if (limitedDigits.length > 0) {
    formatted = limitedDigits.slice(0, 2); // MM
  }
  if (limitedDigits.length > 2) {
    formatted += "/" + limitedDigits.slice(2, 4); // YY
  }

  return formatted;
};

export const validateCardExpiry = (expiry) => {
  const digits = expiry.replace(/\D/g, "");

  if (digits.length !== 4) {
    return { valid: false, error: "Формат: MM/YY" };
  }

  const month = parseInt(digits.slice(0, 2), 10);
  const year = parseInt(digits.slice(2, 4), 10);

  if (month < 1 || month > 12) {
    return { valid: false, error: "Невірний місяць (01-12)" };
  }

  const now = new Date();
  const currentYear = now.getFullYear() % 100; // Last 2 digits
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { valid: false, error: "Картка прострочена" };
  }

  return { valid: true, error: "" };
};

export const formatCVV = (value) => {
  const digits = value.replace(/\D/g, "");
  return digits.slice(0, 3);
};

export const validateCVV = (cvv) => {
  const digits = cvv.replace(/\D/g, "");
  return digits.length === 3;
};

export const validateCardHolder = (name) => {
  return name.trim().length >= 2;
};

export const formatEDRPOU = (value) => {
  const digits = value.replace(/\D/g, "");
  return digits.slice(0, 8);
};

export const validateEDRPOU = (edrpou) => {
  const digits = edrpou.replace(/\D/g, "");
  return digits.length === 8;
};

export const validateCompanyName = (name) => {
  return name.trim().length >= 2;
};

export const validateAddress = (address) => {
  return address.trim().length >= 5;
};

export const validateFullName = (name) => {
  return name.trim().length >= 2;
};

export const clearFieldError = (errors, fieldName) => {
  const newErrors = { ...errors };
  delete newErrors[fieldName];
  return newErrors;
};

export const validateContactData = (contactData) => {
  const errors = {};

  if (!validateFullName(contactData.fullName)) {
    errors.fullName = "Введіть ваше ПІБ (мінімум 2 символи)";
  }

  if (!contactData.phone.trim()) {
    errors.phone = "Введіть номер телефону";
  } else if (!validatePhone(contactData.phone)) {
    errors.phone = "Введіть коректний телефон (0XX XXX XX XX)";
  }

  if (!contactData.email.trim()) {
    errors.email = "Введіть email";
  } else if (!validateEmail(contactData.email)) {
    errors.email = "Введіть коректний email";
  }

  return errors;
};

export const validateDeliveryData = (
  deliveryMethod,
  deliveryCity,
  deliveryAddress,
  deliveryWarehouse
) => {
  const errors = {};

  if (!deliveryMethod) {
    errors.deliveryMethod = "Оберіть спосіб доставки";
    return errors;
  }

  if (deliveryMethod !== "pickup" && !deliveryCity) {
    errors.deliveryCity = "Оберіть місто доставки";
  }

  // Валідація для кур'єрської доставки - тільки Київ
  if (deliveryMethod === "courier") {
    if (deliveryCity && !deliveryCity.toLowerCase().includes("київ")) {
      errors.deliveryCity = "Кур'єрська доставка доступна тільки в межах Києва";
    }

    if (!deliveryAddress.trim()) {
      errors.deliveryAddress = "Введіть адресу доставки";
    } else if (!validateAddress(deliveryAddress)) {
      errors.deliveryAddress = "Введіть повну адресу (мінімум 5 символів)";
    }
  }

  if (
    deliveryMethod !== "courier" &&
    deliveryMethod !== "pickup" &&
    !deliveryWarehouse
  ) {
    errors.deliveryWarehouse = "Оберіть відділення або поштомат";
  }

  return errors;
};

export const validatePaymentData = (paymentMethod, paymentData) => {
  const errors = {};

  if (!paymentMethod) {
    errors.paymentMethod = "Оберіть спосіб оплати";
    return errors;
  }

  if (paymentMethod === "card-online") {
    // Card number validation
    if (!paymentData.cardNumber.trim()) {
      errors.cardNumber = "Введіть номер картки";
    } else if (!validateCardNumber(paymentData.cardNumber)) {
      errors.cardNumber = "Картка має містити 16 цифр";
    }

    if (!paymentData.cardExpiry.trim()) {
      errors.cardExpiry = "Введіть термін дії";
    } else {
      const expiryValidation = validateCardExpiry(paymentData.cardExpiry);
      if (!expiryValidation.valid) {
        errors.cardExpiry = expiryValidation.error;
      }
    }

    if (!paymentData.cardCvv.trim()) {
      errors.cardCvv = "Введіть CVV код";
    } else if (!validateCVV(paymentData.cardCvv)) {
      errors.cardCvv = "CVV має містити 3 цифри";
    }

    if (!paymentData.cardHolder.trim()) {
      errors.cardHolder = "Введіть ім'я власника картки";
    } else if (!validateCardHolder(paymentData.cardHolder)) {
      errors.cardHolder = "Введіть повне ім'я (мінімум 2 символи)";
    }
  }

  if (paymentMethod === "invoice") {
    if (!paymentData.companyName.trim()) {
      errors.companyName = "Введіть назву компанії";
    } else if (!validateCompanyName(paymentData.companyName)) {
      errors.companyName = "Введіть повну назву (мінімум 2 символи)";
    }

    if (!paymentData.edrpou.trim()) {
      errors.edrpou = "Введіть ЄДРПОУ";
    } else if (!validateEDRPOU(paymentData.edrpou)) {
      errors.edrpou = "ЄДРПОУ має містити 8 цифр";
    }

    if (!paymentData.companyAddress.trim()) {
      errors.companyAddress = "Введіть юридичну адресу";
    } else if (!validateAddress(paymentData.companyAddress)) {
      errors.companyAddress = "Введіть повну адресу (мінімум 5 символів)";
    }
  }

  return errors;
};

export const validateTermsAgreement = (agreeToTerms) => {
  const errors = {};

  if (!agreeToTerms) {
    errors.agreeToTerms =
      "Погодьтесь з умовами оферти та політикою конфіденційності";
  }

  return errors;
};

export const validateCheckoutForm = (formData) => {
  const {
    contactData,
    deliveryMethod,
    deliveryCity,
    deliveryAddress,
    deliveryWarehouse,
    paymentMethod,
    paymentData,
    agreeToTerms,
  } = formData;

  const errors = {
    ...validateContactData(contactData),
    ...validateDeliveryData(
      deliveryMethod,
      deliveryCity,
      deliveryAddress,
      deliveryWarehouse
    ),
    ...validatePaymentData(paymentMethod, paymentData),
    ...validateTermsAgreement(agreeToTerms),
  };

  return errors;
};
