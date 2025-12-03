import React, { createContext, useContext, useState, useEffect } from 'react';

// Language Context
const LanguageContext = createContext();

// Available languages
export const LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
  },
  vi: {
    code: 'vi',
    name: 'Tiếng Việt',
    flag: '🇻🇳',
  },
};

// Language Provider Component
export function LanguageProvider({ children }) {
  // Get saved language from localStorage or default to English
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'en';
  });

  // Save to localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
    // Update HTML lang attribute for accessibility
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (lang) => {
    if (LANGUAGES[lang]) {
      setLanguage(lang);
    }
  };

  const value = {
    language,
    changeLanguage,
    languages: LANGUAGES,
    currentLanguage: LANGUAGES[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

// Helper hook to get translated text
export function useTranslation() {
  const { language } = useLanguage();

  const t = (key, params = {}) => {
    // Get translation from translations object
    const translation = getNestedTranslation(translations[language], key);

    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return key;
    }

    // Replace parameters in translation
    return replaceParams(translation, params);
  };

  return { t, language };
}

// Helper function to get nested translation
function getNestedTranslation(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Helper function to replace parameters in translation
function replaceParams(text, params) {
  return Object.keys(params).reduce((result, key) => {
    return result.replace(new RegExp(`{${key}}`, 'g'), params[key]);
  }, text);
}

// Translations object
const translations = {
  en: {
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      search: 'Search',
      filter: 'Filter',
      clear: 'Clear',
      apply: 'Apply',
      total: 'Total',
      subtotal: 'Subtotal',
      retry: 'Retry',
    },

    // Navigation
    nav: {
      home: 'Home',
      cart: 'Cart',
      login: 'Login',
      logout: 'Logout',
      logout_confirmation: 'Sign out of your account',
      profile: 'My Profile',
      orders: 'My Orders',
      settings: 'Settings',
      backToHome: 'Back to Home',
      continueAsGuest: 'Continue as guest',
      browseCategories: 'Browse Categories',
      title: 'BookStore',
      view_edit_profile: 'View and edit profile',
      track_orders: 'Track your orders',
      account_preferences: 'Account preferences',
      choose_lang: 'Choose Language',
      select_preferred_lang: 'Select your preferred language',
      lang_saved_auto: 'Language preference saved automatically',
    },

    // Home Page
    home: {
      title: 'Discover Your Next Great Read',
      noBooks: 'No books found in this category.',
      loadingBooks: 'Loading books...',
      errorLoading: 'Error Loading Books',
      categories: 'Categories',
      findBooks: 'Find books by genre',
      viewing: 'Viewing',
      exploreCategories: 'Explore Book Categories',
      chooseCategory: 'Choose a category to discover amazing books',
      mainCategories: 'MAIN CATEGORIES',
      viewAll: 'View All',
      browseEverything: 'Browse everything',
      popular: 'Popular',
      trending: 'Trending now',
      newReleases: 'New Releases',
      latestBooks: 'Latest books',
      categoriesAvailable: '{count} Categories Available',
      updatedDaily: 'Updated daily',
    },

    // Book Detail
    book: {
      by: 'by',
      isbn: 'ISBN',
      publisher: 'Publisher',
      pages: 'Pages',
      price: 'Price',
      stock: 'Stock',
      quantity: 'Quantity',
      max: 'Max',
      inStock: '{count} in stock',
      onlyLeft: 'Only {count} left',
      outOfStock: 'Out of Stock',
      addToCart: 'Add to Cart',
      addedToCart: 'Added to Cart!',
      adding: 'Adding...',
      notifyMe: 'Notify Me When Available',
      maxQuantity: 'Maximum available quantity reached',
      noDescription: 'No description available',
      notFound: 'Book Not Found',
      bookNotExist: 'The book you are looking for does not exist.',
      loadingDetails: 'Loading book details...',
    },

    // Cart & Checkout
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      emptyMessage: 'Add some books to get started!',
      browseBooks: 'Browse Books',
      continueShopping: 'Continue Shopping',
      proceedToCheckout: 'Proceed to Checkout',
      loginToCheckout: 'Login to Checkout',
      guestWarning: 'Guest Cart',
      guestMessage: "You're browsing as a guest. Your cart is saved locally.",
      loginSync: 'to sync your cart and place orders.',
      itemsCount: '{count} items',
      itemRemoved: 'Item removed from cart',
      cartMerged: 'Cart items merged successfully!',
    },

    // Checkout
    checkout: {
      title: 'Shipping Information',
      fullName: 'Full Name',
      phone: 'Phone',
      address: 'Address',
      city: 'City',
      state: 'State',
      postalCode: 'Postal Code',
      country: 'Country',
      paymentMethod: 'Payment Method',
      creditCard: 'Credit Card',
      debitCard: 'Debit Card',
      paypal: 'PayPal',
      cashOnDelivery: 'Cash on Delivery',
      orderTotal: 'Order Total',
      placeOrder: 'Place Order',
      processing: 'Processing...',
      fillRequired: 'Please fill in all required fields',
      backToCart: 'Back to Cart',
      orderSuccess: 'Order Placed Successfully!',
      thankYou: 'Thank you for your order',
      orderDetails: 'Order Details',
      orderNumber: 'Order Number',
      status: 'Status',
      deliveryAddress: 'Delivery Address',
      continueShopping: 'Continue Shopping',
      tax: 'Tax',
      shipping: 'Shipping',
    },

    // Auth
    auth: {
      signIn: 'Sign in to your account',
      create_account: 'Create your account',
      email: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
      createAccount: 'Create Account',
      creatingAccount: 'Creating account...',
      signingIn: 'Signing in...',
      welcomeBack: 'Welcome back!',
      accountCreated: 'Account created successfully! Welcome to BookStore.',
      loginRequired: 'Please login to continue',
      sessionExpired: 'Session expired. Please login again.',
      invalidCredentials: 'Invalid email or password',
      passwordsMatch: 'Passwords match',
      passwordStrength: 'Use at least 6 characters with letters and numbers',
      acceptTerms: 'I agree to the',
      termsConditions: 'Terms and Conditions',
      privacyPolicy: 'Privacy Policy',
      and: 'and',
      forgotPasswordSoon: 'Forgot password feature coming soon!',
      googleLoginSoon: 'Google login coming soon!',
      facebookLoginSoon: 'Facebook login coming soon!',
      termsSoon: 'Terms and Conditions page coming soon!',
      privacySoon: 'Privacy Policy page coming soon!',
      enterEmail: 'Enter your email',
      enterPassword: 'Enter your password',
      continueWith: 'Or continue with',
      signUp: 'Sign up',
    },

    // Profile
    profile: {
      title: 'My Profile',
      information: 'Profile Information',
      editProfile: 'Edit Profile',
      cancelEdit: 'Cancel Edit',
      changePassword: 'Change Password',
      saveChanges: 'Save Changes',
      saving: 'Saving...',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm New Password',
      changing: 'Changing...',
      updated: 'Profile updated successfully!',
      passwordChanged: 'Password changed successfully!',
      updateFailed: 'Failed to update profile',
      passwordFailed: 'Failed to change password',
      allFieldsRequired: 'All password fields are required',
      passwordMinLength: 'New password must be at least 6 characters',
      passwordsNotMatch: 'New passwords do not match',
      nameEmailRequired: 'Name and email are required',
      validEmail: 'Please enter a valid email address',
      changingPassword: 'Changing password...',
    },

    // Orders
    orders: {
      title: 'My Orders',
      track: 'Track and manage your orders',
      orderCount: '{count} Order',
      orderCountPlural: '{count} Orders',
      noOrders: 'No Orders Yet',
      startShopping: 'Start shopping to see your orders here!',
      loadingOrders: 'Loading your orders...',
      errorLoading: 'Error Loading Orders',
      viewDetails: 'View Details',
      hideDetails: 'Hide Details',
      order: 'Order',
      items: 'items',
      item: 'item',
      shippingAddress: 'Shipping Address',
      paymentDetails: 'Payment Details',
      paymentMethod: 'Payment Method',
      orderItems: 'Order Items',
      cancelOrder: 'Cancel Order',
      trackOrder: 'Track Order',
      downloadInvoice: 'Download Invoice',
      cancelSoon: 'Order cancellation feature coming soon!',
      trackSoon: 'Order tracking feature coming soon!',
      invoiceSoon: 'Download invoice feature coming soon!',
      statusPending: 'Pending',
      statusProcessing: 'Processing',
      statusShipped: 'Shipped',
      statusDelivered: 'Delivered',
      statusCancelled: 'Cancelled',
      statusCompleted: 'Completed',
    },

    // Toast Messages
    toast: {
      addedToCart: 'Added to cart!',
      failedToAdd: 'Failed to add to cart',
      outOfStock: 'This book is currently out of stock',
      maxStock: 'Only {max} items available in stock',
      orderPlaced: 'Order placed successfully!',
      orderFailed: 'Failed to place order',
      loginToOrder: 'Please login to place an order',
      loginToCart: 'Please login to add items to cart',
      loggedOut: 'Logged out successfully',
      notifyFeature: 'Notification feature coming soon! We will notify you when this book is back in stock.',
    },

    // Validation
    validation: {
      required: 'This field is required',
      emailInvalid: 'Please enter a valid email address',
      phoneInvalid: 'Please enter a valid phone number (at least 10 digits)',
      passwordMin: 'Password must be at least {min} characters long',
      passwordMatch: 'Passwords do not match',
      nameMin: 'Please enter your full name',
      termsRequired: 'Please accept the Terms and Conditions',
    },

    // Categories
    categories: {
      all: 'All',
      allDescription: 'Browse all available books',
      fiction: 'Fiction',
      fictionDescription: 'Imaginative stories and novels',
      scienceFiction: 'Science Fiction',
      scienceFictionDescription: 'Futuristic and sci-fi adventures',
      business: 'Business',
      businessDescription: 'Management and entrepreneurship',
      biography: 'Biography',
      biographyDescription: 'Life stories and memoirs',
      selfHelp: 'Self-Help',
      selfHelpDescription: 'Personal growth and wellness',
    },
  },

  vi: {
    // Common (Vietnamese)
    common: {
      loading: 'Đang tải...',
      error: 'Lỗi',
      success: 'Thành công',
      cancel: 'Hủy',
      save: 'Lưu',
      delete: 'Xóa',
      edit: 'Chỉnh sửa',
      close: 'Đóng',
      back: 'Quay lại',
      next: 'Tiếp',
      previous: 'Trước',
      search: 'Tìm kiếm',
      filter: 'Lọc',
      clear: 'Xóa',
      apply: 'Áp dụng',
      total: 'Tổng cộng',
      subtotal: 'Tạm tính',
      retry: 'Thử lại',
    },

    // Navigation (Vietnamese)
    nav: {
      home: 'Trang chủ',
      cart: 'Giỏ hàng',
      login: 'Đăng nhập',
      logout: 'Đăng xuất',
      logout_confirmation: 'Đăng xuất tài khoản',
      profile: 'Hồ sơ',
      orders: 'Đơn hàng',
      settings: 'Cài đặt',
      backToHome: 'Về trang chủ',
      continueAsGuest: 'Tiếp tục với tư cách khách',
      browseCategories: 'Duyệt danh mục',
      title: 'Nhà sách',
      view_edit_profile: 'Xem & chỉnh sửa hồ sơ',
      track_orders: 'Theo dõi đơn hàng',
      account_preferences: 'Cài đặt tài khoản',
      choose_lang: 'Chọn ngôn ngữ',
      select_preferred_lang: 'Chọn ngôn ngữ phù hợp',
      lang_saved_auto: 'Ngôn ngữ sẽ được lưu tự động',
    },

    // Home Page (Vietnamese)
    home: {
      title: 'Khám phá cuốn sách tiếp theo của bạn',
      noBooks: 'Không tìm thấy sách trong danh mục này.',
      loadingBooks: 'Đang tải sách...',
      errorLoading: 'Lỗi khi tải sách',
      categories: 'Danh mục',
      findBooks: 'Tìm sách theo thể loại',
      viewing: 'Đang xem',
      exploreCategories: 'Khám phá danh mục sách',
      chooseCategory: 'Chọn danh mục để khám phá những cuốn sách tuyệt vời',
      mainCategories: 'DANH MỤC CHÍNH',
      viewAll: 'Xem tất cả',
      browseEverything: 'Duyệt tất cả',
      popular: 'Phổ biến',
      trending: 'Đang thịnh hành',
      newReleases: 'Mới phát hành',
      latestBooks: 'Sách mới nhất',
      categoriesAvailable: '{count} Danh mục có sẵn',
      updatedDaily: 'Cập nhật hàng ngày',
    },

    // Book Detail (Vietnamese)
    book: {
      by: 'bởi',
      isbn: 'ISBN',
      publisher: 'Nhà xuất bản',
      pages: 'Số trang',
      price: 'Giá',
      stock: 'Kho',
      quantity: 'Số lượng',
      max: 'Tối đa',
      inStock: '{count} còn hàng',
      onlyLeft: 'Chỉ còn {count}',
      outOfStock: 'Hết hàng',
      addToCart: 'Thêm vào giỏ',
      addedToCart: 'Đã thêm vào giỏ!',
      adding: 'Đang thêm...',
      notifyMe: 'Báo cho tôi khi có hàng',
      maxQuantity: 'Đã đạt số lượng tối đa',
      noDescription: 'Không có mô tả',
      notFound: 'Không tìm thấy sách',
      bookNotExist: 'Cuốn sách bạn tìm không tồn tại.',
      loadingDetails: 'Đang tải thông tin sách...',
    },

    // Cart & Checkout (Vietnamese)
    cart: {
      title: 'Giỏ hàng',
      empty: 'Giỏ hàng trống',
      emptyMessage: 'Thêm sách để bắt đầu!',
      browseBooks: 'Duyệt sách',
      continueShopping: 'Tiếp tục mua sắm',
      proceedToCheckout: 'Thanh toán',
      loginToCheckout: 'Đăng nhập để thanh toán',
      guestWarning: 'Giỏ hàng khách',
      guestMessage: 'Bạn đang duyệt với tư cách khách. Giỏ hàng được lưu cục bộ.',
      loginSync: 'để đồng bộ giỏ hàng và đặt hàng.',
      itemsCount: '{count} sản phẩm',
      itemRemoved: 'Đã xóa khỏi giỏ hàng',
      cartMerged: 'Đã gộp giỏ hàng thành công!',
    },

    // Checkout (Vietnamese)
    checkout: {
      title: 'Thông tin giao hàng',
      fullName: 'Họ và tên',
      phone: 'Số điện thoại',
      address: 'Địa chỉ',
      city: 'Thành phố',
      state: 'Tỉnh/Thành',
      postalCode: 'Mã bưu điện',
      country: 'Quốc gia',
      paymentMethod: 'Phương thức thanh toán',
      creditCard: 'Thẻ tín dụng',
      debitCard: 'Thẻ ghi nợ',
      paypal: 'PayPal',
      cashOnDelivery: 'Thanh toán khi nhận hàng',
      orderTotal: 'Tổng đơn hàng',
      placeOrder: 'Đặt hàng',
      processing: 'Đang xử lý...',
      fillRequired: 'Vui lòng điền đầy đủ thông tin bắt buộc',
      backToCart: 'Quay lại giỏ hàng',
      orderSuccess: 'Đặt hàng thành công!',
      thankYou: 'Cảm ơn bạn đã đặt hàng',
      orderDetails: 'Chi tiết đơn hàng',
      orderNumber: 'Số đơn hàng',
      status: 'Trạng thái',
      deliveryAddress: 'Địa chỉ giao hàng',
      continueShopping: 'Tiếp tục mua sắm',
      tax: 'Thuế',
      shipping: 'Phí vận chuyển',
    },

    // Auth (Vietnamese)
    auth: {
      signIn: 'Đăng nhập tài khoản',
      create_account: 'Tạo tài khoản mới',
      email: 'Địa chỉ email',
      password: 'Mật khẩu',
      confirmPassword: 'Xác nhận mật khẩu',
      rememberMe: 'Ghi nhớ đăng nhập',
      forgotPassword: 'Quên mật khẩu?',
      noAccount: 'Chưa có tài khoản?',
      haveAccount: 'Đã có tài khoản?',
      createAccount: 'Tạo tài khoản',
      creatingAccount: 'Đang tạo tài khoản...',
      signingIn: 'Đang đăng nhập...',
      welcomeBack: 'Chào mừng trở lại!',
      accountCreated: 'Tạo tài khoản thành công! Chào mừng đến với BookStore.',
      loginRequired: 'Vui lòng đăng nhập để tiếp tục',
      sessionExpired: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.',
      invalidCredentials: 'Email hoặc mật khẩu không đúng',
      passwordsMatch: 'Mật khẩu khớp',
      passwordStrength: 'Dùng ít nhất 6 ký tự với chữ và số',
      acceptTerms: 'Tôi đồng ý với',
      termsConditions: 'Điều khoản và Điều kiện',
      privacyPolicy: 'Chính sách Bảo mật',
      and: 'và',
      forgotPasswordSoon: 'Tính năng quên mật khẩu sắp ra mắt!',
      googleLoginSoon: 'Đăng nhập Google sắp ra mắt!',
      facebookLoginSoon: 'Đăng nhập Facebook sắp ra mắt!',
      termsSoon: 'Trang Điều khoản sắp ra mắt!',
      privacySoon: 'Trang Chính sách Bảo mật sắp ra mắt!',
      enterEmail: 'Nhập địa chỉ email của bạn',
      enterPassword: 'Nhập mật khẩu của bạn',
      continueWith: 'Hoặc tiếp tục với',
      signUp: 'Đăng ký Tài khoản',
    },

    // Profile (Vietnamese)
    profile: {
      title: 'Hồ sơ của tôi',
      information: 'Thông tin hồ sơ',
      editProfile: 'Chỉnh sửa hồ sơ',
      cancelEdit: 'Hủy chỉnh sửa',
      changePassword: 'Đổi mật khẩu',
      saveChanges: 'Lưu thay đổi',
      saving: 'Đang lưu...',
      fullName: 'Họ và tên',
      email: 'Địa chỉ email',
      phone: 'Số điện thoại',
      currentPassword: 'Mật khẩu hiện tại',
      newPassword: 'Mật khẩu mới',
      confirmPassword: 'Xác nhận mật khẩu mới',
      changing: 'Đang đổi...',
      updated: 'Cập nhật hồ sơ thành công!',
      passwordChanged: 'Đổi mật khẩu thành công!',
      updateFailed: 'Cập nhật hồ sơ thất bại',
      passwordFailed: 'Đổi mật khẩu thất bại',
      allFieldsRequired: 'Vui lòng điền đầy đủ các trường mật khẩu',
      passwordMinLength: 'Mật khẩu mới phải có ít nhất 6 ký tự',
      passwordsNotMatch: 'Mật khẩu mới không khớp',
      nameEmailRequired: 'Tên và email là bắt buộc',
      validEmail: 'Vui lòng nhập địa chỉ email hợp lệ',
    },

    // Orders (Vietnamese)
    orders: {
      title: 'Đơn hàng của tôi',
      track: 'Theo dõi và quản lý đơn hàng',
      orderCount: '{count} Đơn hàng',
      orderCountPlural: '{count} Đơn hàng',
      noOrders: 'Chưa có đơn hàng',
      startShopping: 'Bắt đầu mua sắm để xem đơn hàng!',
      loadingOrders: 'Đang tải đơn hàng...',
      errorLoading: 'Lỗi khi tải đơn hàng',
      viewDetails: 'Xem chi tiết',
      hideDetails: 'Ẩn chi tiết',
      order: 'Đơn hàng',
      items: 'sản phẩm',
      item: 'sản phẩm',
      shippingAddress: 'Địa chỉ giao hàng',
      paymentDetails: 'Chi tiết thanh toán',
      paymentMethod: 'Phương thức thanh toán',
      orderItems: 'Sản phẩm đặt hàng',
      cancelOrder: 'Hủy đơn hàng',
      trackOrder: 'Theo dõi đơn hàng',
      downloadInvoice: 'Tải hóa đơn',
      cancelSoon: 'Tính năng hủy đơn sắp ra mắt!',
      trackSoon: 'Tính năng theo dõi sắp ra mắt!',
      invoiceSoon: 'Tính năng tải hóa đơn sắp ra mắt!',
      statusPending: 'Chờ xử lý',
      statusProcessing: 'Đang xử lý',
      statusShipped: 'Đã gửi hàng',
      statusDelivered: 'Đã giao',
      statusCancelled: 'Đã hủy',
      statusCompleted: 'Hoàn thành',
    },

    // Toast Messages (Vietnamese)
    toast: {
      addedToCart: 'Đã thêm vào giỏ hàng!',
      failedToAdd: 'Thêm vào giỏ hàng thất bại',
      outOfStock: 'Sách này hiện đã hết hàng',
      maxStock: 'Chỉ còn {max} sản phẩm',
      orderPlaced: 'Đặt hàng thành công!',
      orderFailed: 'Đặt hàng thất bại',
      loginToOrder: 'Vui lòng đăng nhập để đặt hàng',
      loginToCart: 'Vui lòng đăng nhập để thêm vào giỏ hàng',
      loggedOut: 'Đăng xuất thành công',
      notifyFeature: 'Tính năng thông báo sắp ra mắt! Chúng tôi sẽ thông báo khi sách có hàng trở lại.',
    },

    // Validation (Vietnamese)
    validation: {
      required: 'Trường này là bắt buộc',
      emailInvalid: 'Vui lòng nhập địa chỉ email hợp lệ',
      phoneInvalid: 'Vui lòng nhập số điện thoại hợp lệ (ít nhất 10 chữ số)',
      passwordMin: 'Mật khẩu phải có ít nhất {min} ký tự',
      passwordMatch: 'Mật khẩu không khớp',
      nameMin: 'Vui lòng nhập họ tên đầy đủ',
      termsRequired: 'Vui lòng chấp nhận Điều khoản và Điều kiện',
    },

    // Categories (Vietnamese)
    categories: {
      all: 'Tất cả',
      allDescription: 'Duyệt tất cả sách có sẵn',
      fiction: 'Tiểu thuyết',
      fictionDescription: 'Truyện tưởng tượng và tiểu thuyết',
      scienceFiction: 'Khoa học viễn tưởng',
      scienceFictionDescription: 'Phiêu lưu tương lai và khoa học',
      business: 'Kinh doanh',
      businessDescription: 'Quản lý và khởi nghiệp',
      biography: 'Tiểu sử',
      biographyDescription: 'Câu chuyện cuộc đời và hồi ký',
      selfHelp: 'Tự giúp bản thân',
      selfHelpDescription: 'Phát triển cá nhân và sức khỏe',
    },
  },
};

export default translations;