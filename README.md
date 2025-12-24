# Hiki Shop - Báo cáo đồ án

## Goals and Objectives
- Goal: Xây dựng nền tảng marketplace 2 chiều cho phép khách hàng mua sắm end-to-end và người bán tự vận hành shop của họ.
- Objectives:
  - Cung cấp đầy đủ luồng mua sắm: đăng ký/đăng nhập, tìm kiếm & duyệt sản phẩm, giỏ hàng, đặt hàng, thanh toán, vận chuyển, đánh giá/Q&A.
  - Cung cấp portal cho seller: đăng ký/xác duyệt seller, tạo shop, đăng sản phẩm, quản lý tồn kho, xử lý đơn, cấu hình phí ship, theo dõi doanh thu.
  - Đảm bảo vận hành ổn định: hạ tầng docker-compose, lưu trữ tệp với MinIO, gửi mail OTP qua Mailhog, quản trị DB/Redis qua pgAdmin & Redis Commander, bảo mật bằng JWT/Redis.
  - Hỗ trợ đa kênh: seller web, admin web, mobile app khách hàng, API backend thống nhất.

## Kiến trúc tổng quan
- Monorepo: `server` (Node.js + Express + TypeScript + Sequelize/PostgreSQL, Redis, MinIO, Mailhog), `seller` (portal seller, React + Vite + Tailwind), `admin` (dashboard vận hành, React + Vite + Tailwind), `mobile` (React Native, Redux Toolkit, React Navigation).
- Hạ tầng theo `docker-compose.yaml`: backend (port 8888), PostgreSQL, Redis + Redis Commander, pgAdmin, MinIO (9000/9001), Mailhog (8025), Nginx (reverse proxy cho backend, seller, admin), Certbot.
- API REST tại `/api/v1`, response thống nhất qua `utils/response`; hỗ trợ i18n trong `server/src/locales`.

## Dự án đang làm gì
- Xây dựng marketplace 2 chiều (người bán / người mua) với portal seller riêng và app mobile cho khách hàng.
- Cho phép seller tự đăng ký, gửi hồ sơ xác duyệt, tạo shop, đăng sản phẩm, quản lý tồn kho, xử lý đơn và giao vận.
- Cho phép khách hàng duyệt sản phẩm, thêm giỏ hàng, đặt hàng, theo dõi vận chuyển, đánh giá và hỏi đáp sản phẩm.

## Chức năng chính
- Xác thực & bảo mật: OTP email, đăng nhập mật khẩu, Google/Facebook, refresh token trên Redis, logout, quên mật khẩu qua OTP, quản lý device token cho push notification.
- Người dùng & người bán: hồ sơ cá nhân, địa chỉ giao hàng (tỉnh/TP - phường/xã), nộp hồ sơ seller, xác duyệt seller, tạo shop riêng.
- Sản phẩm: danh mục, biến thể/option, tồn kho, lưu trữ ảnh MinIO, Q&A sản phẩm, đánh giá, khởi tạo 100 loyalty points cho khách hàng mới.
- Giỏ hàng & đơn hàng: thêm/xóa/cập nhật giỏ, đặt đơn, theo dõi trạng thái, tính tổng tiền.
- Vận chuyển & thanh toán: tạo shipment, bảng giá vận chuyển, cập nhật trạng thái giao hàng; payment sẵn sàng tích hợp cổng thanh toán.
- Portal seller (web): đăng nhập, dashboard đơn hàng/doanh thu, quản lý sản phẩm & danh mục, thêm sản phẩm, Q&A/review, cấu hình phí vận chuyển, tạo shipment, cập nhật tồn kho, trang cài đặt.
- Ứng dụng mobile (khách hàng): đăng nhập/đăng ký, đa ngôn ngữ, duyệt sản phẩm, giỏ hàng, đặt hàng, live/flash sale, hồ sơ người dùng; dùng Redux + AsyncStorage cho phiên.
- Trang admin: quản trị vận hành, giám sát seller, sản phẩm, đơn hàng và cấu hình hệ thống.

## Công nghệ chính
- Backend: Node.js, Express 5, TypeScript, Sequelize (PostgreSQL), Redis, MinIO (S3 compatible), JWT, Nodemailer/Mailhog, Joi/Zod validate, i18next đa ngôn ngữ.
- Seller web: React 19, Vite (Rolldown), Tailwind CSS, React Router, Axios, Chart.js/Recharts, Lucide icons.
- Admin web: React 19, Vite (Rolldown), Tailwind CSS, React Router, Axios, Chart.js/Recharts, Lucide icons.
- Mobile: React Native 0.78, React Navigation, Redux Toolkit, AsyncStorage, i18next, Axios, Image Picker, Google/Facebook SDK.
- DevOps: Docker Compose, PostgreSQL, Redis Commander, pgAdmin, Mailhog, Nginx reverse proxy, Certbot; script migrate/seed DB.

## Cấu trúc thư mục
- `server/`: dịch vụ API; `src/module` (auth, user, product, cart, order, shipment, payment, shop, location ...); `src/routers` khai báo route; `src/models` Sequelize; `src/seeders` dữ liệu mẫu.
- `seller/`: portal web cho seller; `src/pages` (Dashboard, Product, AddProduct, AddCategory, QA, Shipping, ShippingRates, CreateShipment, UpdateStock, Settings); `src/api` client axios.
- `admin/`: dashboard vận hành; `src/pages` tương tự seller để giám sát/điều phối; `src/api` client axios.
- `mobile/`: ứng dụng React Native; `src/screens` (auth, commerce, product, profile, sale, live, scanner), `src/redux` (store, slice), `src/navigators/AppRouters`.
- `nginx/`: cấu hình reverse proxy cho backend, seller, admin, chứng chỉ.
- `docker-compose.yaml`: định nghĩa toàn bộ dịch vụ cục bộ.

## Hướng dẫn chạy nhanh bằng Docker
1) Chuẩn bị: cài Docker + Docker Compose, Node 18+ nếu muốn chạy cục bộ.
2) Backend env: copy `server/.env.example` thành `server/.env`, điền DB, Redis, AWS/MinIO, mail.
3) Khởi chạy: từ thư mục gốc chạy `docker compose up -d --build`.
4) Truy cập (tùy cấu hình Nginx):
   - API backend: `http://localhost:8888` (hoặc qua proxy: `http://localhost`).
   - Seller web: `http://localhost` (hoặc subdomain nội bộ theo `nginx/seller-internal.conf`).
   - Trang admin: `http://localhost` (hoặc subdomain nội bộ theo `nginx/admin-internal.conf`).
   - Công cụ hỗ trợ: Mailhog `http://localhost:8025`, pgAdmin `http://localhost:5050`, Redis Commander `http://localhost:6380`.

## Chạy development thủ công
- Backend: `cd server && cp .env.example .env && npm install && npm run migrate && npm run seed && npm run dev` (port 8888).
- Seller web: `cd seller && npm install && npm run dev` (Vite mặc định 5173 hoặc 5174 tùy cổng trống).
- Admin web: `cd admin && npm install && npm run dev` (Vite mặc định 5173 hoặc 5175 tùy cổng trống).
- Mobile: `cd mobile && npm install` (hoặc `yarn`), `npm start` khởi Metro, `npm run android` / `npm run ios` để build; đặt biến API trong `.env` (dùng `react-native-dotenv`).


## Ghi chú & khuyến nghị
- Kiểm tra CORS, JWT secret, Redis secret trước khi deploy production.
- MinIO đang local; lên cloud cần cập nhật endpoint/bucket và policy public/TTL ảnh.
- Chưa có bộ test tự động; nên bổ sung test API (Postman/Newman hoặc Jest) cho các luồng auth, giỏ hàng, đặt hàng, shipment.
- Nếu dùng SSL thật, cập nhật mount cert và rule Nginx trước khi chạy Certbot.

---

# Tài liệu Ứng dụng Di động

## SE2525 Mobile App

Đây là ứng dụng mobile client cho dự án SE2525, được xây dựng bằng React Native. Ứng dụng cung cấp trải nghiệm thương mại điện tử trọn vẹn bao gồm xác thực, duyệt sản phẩm, quản lý giỏ hàng và hồ sơ người dùng.

### Mục lục
- [Yêu cầu tiên quyết](#yêu-cầu-tiên-quyết)
- [Cài đặt](#cài-đặt)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Ảnh chụp màn hình](#ảnh-chụp-màn-hình)
- [Khắc phục sự cố](#khắc-phục-sự-cố)

### Yêu cầu tiên quyết

Đảm bảo bạn đã cài đặt các công cụ sau trên máy phát triển:
- **Node.js** (>= 18)
- **Yarn** (Trình quản lý gói ưu tiên)
- **Java Development Kit (JDK)** (phiên bản 17 được khuyến nghị cho React Native 0.78)
- **Android Studio** (kèm Android SDK và Emulator)
- **Xcode** (để phát triển iOS, chỉ dành cho Mac)
- **CocoaPods** (cho các thư viện phụ thuộc của iOS)

### Cài đặt

1.  **Clone repository:**
    ```bash
    git clone <repository_url>
    cd se2525-13.2/mobile
    ```

2.  **Cài đặt các gói phụ thuộc:**
    ```bash
    yarn install
    ```

3.  **Dành riêng cho iOS (chỉ trên Mac):**
    ```bash
    cd ios
    pod install
    cd ..
    ```

### Chạy ứng dụng

#### Android

Để chạy ứng dụng Android:

1.  Khởi động Metro bundler:
    ```bash
    yarn start
    ```

2.  Trong một terminal khác, chạy ứng dụng Android:
    ```bash
    yarn android
    ```

   *Lưu ý: Lệnh này sẽ tự động tạo `debug.keystore` nếu chưa có trong `android/app`.*

#### iOS

Để chạy ứng dụng iOS:

1.  Khởi động Metro bundler:
    ```bash
    yarn start
    ```

2.  Chạy ứng dụng iOS:
    ```bash
    yarn ios
    ```

### Cấu trúc dự án

Dự án tuân theo cấu trúc thư mục chuẩn của React Native:

```
mobile/
├── android/            # Mã nguồn native Android
├── ios/                # Mã nguồn native iOS
├── src/
│   ├── apis/           # Tích hợp API
│   ├── assets/         # Hình ảnh, phông chữ và tài nguyên tĩnh khác
│   ├── components/     # Các UI component tái sử dụng
│   ├── constants/      # Hằng số ứng dụng (màu sắc, phông chữ, kích thước)
│   ├── models/         # TypeScript interfaces/types
│   ├── navigators/     # Cấu hình React Navigation (Stack, Tab, Drawer)
│   ├── redux/          # Quản lý trạng thái Redux (slices, store)
│   ├── screens/        # Các màn hình (Xác thực, Thương mại, Hồ sơ, v.v.)
│   ├── styles/         # Styles toàn cục
│   └── utils/          # Các hàm tiện ích (validation, v.v.)
├── App.tsx             # Component gốc
└── package.json        # Các gói phụ thuộc và scripts
```

### Tính năng chính

-   **Xác thực**: Đăng nhập, Đăng ký, **Xác thực Email (OTP)**, Quên mật khẩu, Đăng nhập mạng xã hội.
-   **Thương mại**: Danh sách sản phẩm, Chi tiết sản phẩm, Giỏ hàng, Thanh toán.
-   **Hồ sơ**: Cài đặt người dùng, Quản lý địa chỉ, và **Bảng điều khiển Người bán (Seller Dashboard)**.
-   **Khuyến mãi**: Màn hình Sale chuyên biệt làm nổi bật các sản phẩm giảm giá cho người dùng.
-   **Điều hướng**: Sử dụng `@react-navigation/native` với Stack và Tab navigators.
-   **Quản lý trạng thái**: Sử dụng `@reduxjs/toolkit` cho trạng thái toàn cục.
-   **Đa ngôn ngữ**: Hỗ trợ đa ngôn ngữ (Anh/Việt) thông qua `react-i18next`.

### Cập nhật gần đây (Giao diện Sáng & Thiết kế mới)

Ứng dụng đã trải qua một cuộc đại tu giao diện người dùng để áp dụng **Giao diện Sáng (Clean Light Theme)** hiện đại:
-   **Màn hình chính**: Giao diện sáng, sạch sẽ với các thẻ sản phẩm và banner carousel.
-   **Màn hình hồ sơ**: Được thiết kế lại theo phong cách "Cài đặt hệ thống", với các thẻ được nhóm lại, biểu tượng đầy màu sắc và typography rõ ràng.
-   **Màn hình giỏ hàng**: Cải thiện "Trạng thái trống" với hình minh họa trực quan và nền trắng sạch.
-   **Quản lý địa chỉ**: Tinh chỉnh màn hình "Thêm/Sửa địa chỉ" với khoảng cách hợp lý và biểu mẫu nhập liệu rõ ràng hơn.
-   **Xác thực người dùng**: Đã thêm **Màn hình Xác thực** chuyên dụng trong quá trình đăng ký hợp lệ. Người dùng hiện nhận được mã OTP 4 chữ số qua email để xác nhận tài khoản trước khi đăng nhập.


### Ảnh chụp màn hình

#### Onboarding (Giới thiệu)

Luồng Onboarding giới thiệu cho người dùng các giá trị cốt lõi của ứng dụng thông qua hướng dẫn vuốt 3 bước:
1.  **Duyệt sản phẩm**: Khám phá đa dạng các mặt hàng.
2.  **Đặt hàng dễ dàng**: Quy trình thanh toán liền mạch.
3.  **Giao hàng nhanh chóng**: Nhận hàng nhanh chóng.

Người dùng có thể điều hướng qua hướng dẫn bằng cách nhấn "Tiếp theo" hoặc bỏ qua bằng "Bỏ qua" để chuyển trực tiếp đến màn hình Đăng nhập.

<p float="left">
  <img src="mobile/readme_file/onboarding-1.png" width="200" />
  <img src="mobile/readme_file/onboarding-2.png" width="200" />
  <img src="mobile/readme_file/onboarding-3.png" width="200" />
</p>

#### Xác thực (Authentication)

Luồng quản lý người dùng toàn diện bao gồm hướng dẫn sử dụng bảo mật và xử lý lỗi.

<p float="left">
  <img src="mobile/readme_file/login_ui.png" width="200" />
  <img src="mobile/readme_file/signup_ui.png" width="200" />
  <img src="mobile/readme_file/verify_user.png" width="200" />
  <img src="mobile/readme_file/forgot_password_ui.png" width="200" />
</p>

##### 1. Đăng nhập (Login)
*   **Mô tả**: Truy cập tài khoản của bạn bằng email và mật khẩu hoặc Đăng nhập mạng xã hội (Google/Facebook).
*   **Cách dùng**: Nhập thông tin đăng nhập và nhấn "Đăng nhập". Sử dụng "Ghi nhớ đăng nhập" để duy trì trạng thái đăng nhập.
*   **Lỗi thường gặp**:
    *   *"Email hoặc mật khẩu không hợp lệ"*: Kiểm tra lại thông tin đăng nhập.
    *   *"Lỗi mạng"*: Kiểm tra kết nối internet.

##### 2. Đăng ký (Sign Up)
*   **Mô tả**: Tạo tài khoản mới để bắt đầu mua sắm.
*   **Cách dùng**: Cung cấp Thông tin cá nhân hợp lệ (Tên, Email) và Mật khẩu mạnh.
*   **Xác thực**: Email phải là duy nhất. Mật khẩu phải có tối thiểu 6 ký tự.

##### 3. Xác thực (Verification)
*   **Mô tả**: Bước bảo mật để xác thực quyền sở hữu email.
*   **Cách dùng**: Nhập **mã OTP 4 chữ số** được gửi đến email đăng ký của bạn.
*   **Khắc phục sự cố**:
    *   *Không nhận được mã?*: Kiểm tra thư mục Spam hoặc đợi 30 giây để yêu cầu mã mới.
    *   *Mã hết hạn*: Yêu cầu mã OTP mới.

##### 4. Quên mật khẩu (Forgot Password)
*   **Mô tả**: Khôi phục quyền truy cập vào tài khoản của bạn.
*   **Cách dùng**: Nhập email đã đăng ký để nhận liên kết/OTP đặt lại mật khẩu.


#### Ứng dụng chính (Main Application)
Khám phá sản phẩm, quản lý giỏ hàng và hoàn tất mua hàng một cách liền mạch.

<p float="left">
  <img src="mobile/readme_file/home_ui.png" width="200" />
  <img src="mobile/readme_file/product_detail.png" width="200" />
  <img src="mobile/readme_file/cart.png" width="200" />
  <img src="mobile/readme_file/bill.png" width="200" />
</p>

##### 1. Màn hình chính (Home Screen)
*   **Mô tả**: Trung tâm khám phá sản phẩm.
*   **Tính năng**:
    *   **Danh mục**: Truy cập nhanh vào các loại sản phẩm khác nhau.
    *   **Carousels**: Banner nổi bật và khuyến mãi.
    *   **Tìm kiếm**: Tìm mặt hàng cụ thể ngay lập tức.

##### 2. Chi tiết sản phẩm (Product Detail)
*   **Mô tả**: Chế độ xem chi tiết của một mặt hàng đã chọn.
*   **Cách dùng**: Chọn kích thước/màu sắc, xem hình ảnh và đọc thông số kỹ thuật.
*   **Hành động**: "Thêm vào giỏ hàng" hoặc "Mua ngay".

##### 3. Giỏ hàng (Shopping Cart)
*   **Mô tả**: Xem lại các mặt hàng đã chọn trước khi mua.
*   **Cách dùng**: Điều chỉnh số lượng hoặc xóa mặt hàng.
*   **Trạng thái trống**: Thông báo trực quan để bắt đầu mua sắm nếu giỏ hàng trống.

##### 4. Thanh toán (Checkout/Bill)
*   **Mô tả**: Hoàn tất đơn hàng của bạn.
*   **Cách dùng**: Chọn địa chỉ giao hàng và phương thức thanh toán.
*   **Xác nhận**: Xem lại tổng chi phí bao gồm phí vận chuyển.

#### Hồ sơ người dùng & Cài đặt
Quản lý tùy chọn cá nhân và địa chỉ.

<p float="left">
  <img src="mobile/readme_file/profile_screen.png" width="200" />
  <img src="mobile/readme_file/tab_profile.png" width="200" />
  <img src="mobile/readme_file/address.png" width="200" />
  <img src="mobile/readme_file/address_create.png" width="200" />
</p>

##### Tính năng hồ sơ
*   **Dashboard**: Truy cập thông tin cá nhân, lịch sử đơn hàng và cài đặt.
*   **Quản lý địa chỉ**: Thêm nhiều địa chỉ giao hàng.
*   **Cài đặt**: Chuyển đổi các tùy chọn như Ngôn ngữ (EN/VI) hoặc Thông báo.

#### Tính năng Sale & Người bán
Ưu đãi đặc biệt và công cụ cho người bán.

<p float="left">
  <img src="mobile/readme_file/sale_screen.png" width="200" />
  <img src="mobile/readme_file/seller_registration.png" width="200" />
</p>

##### Tính năng
*   **Màn hình Sale**: Danh sách chọn lọc các mặt hàng giảm giá.
*   **Đăng ký người bán**: Luồng để người dùng đăng ký trở thành người bán.

### Khắc phục sự cố

#### Vấn đề Build Android

*   **Thiếu `debug.keystore`**: Ứng dụng yêu cầu debug keystore để ký APK. Nếu bạn thấy lỗi log về keystore, hãy đảm bảo `android/app/debug.keystore` tồn tại. Bạn có thể tạo nó bằng cách dùng lệnh:
    ```bash
    keytool -genkey -v -keystore android/app/debug.keystore -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000
    ```
    *(Mật khẩu: `android`)*

*   **Lỗi `react-native-screens`**: Dự án này yêu cầu `react-native-screens` phiên bản **4.18.0** để tương thích với các thư viện điều hướng khác. Đừng nâng cấp gói này mà không kiểm tra tính tương thích.

#### Lỗi Runtime

*   **"No bundle URL present"**: Đảm bảo Metro bundler đang chạy (`yarn start`).
*   **"INSTALL_FAILED_INSUFFICIENT_STORAGE"**: Giải phóng dung lượng trên emulator hoặc thiết bị của bạn bằng cách gỡ cài đặt các ứng dụng không sử dụng.

