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

# Tài liệu Ứng dụng Di động - Trải nghiệm Mua sắm Đỉnh cao

## SE2525 Mobile App - Nơi Khởi Nguồn Cảm Hứng Mua Sắm

Chào mừng bạn đến với ứng dụng **SE2525 Mobile Client** – kiệt tác công nghệ được xây dựng trên nền tảng **React Native** mạnh mẽ. Không chỉ đơn thuần là một ứng dụng thương mại điện tử, chúng tôi mang đến một hành trình mua sắm trọn vẹn, mượt mà và đầy cảm xúc. Từ những bước chạm đầu tiên khi đăng nhập, đến cảm giác hân hoan lúc "chốt đơn", mọi thứ đều được chăm chút tỉ mỉ cho trải nghiệm người dùng tuyệt vời nhất.

### Mục lục
- [Yêu cầu tiên quyết](#yêu-cầu-tiên-quyết)
- [Cài đặt & Khởi chạy](#cài-đặt--khởi-chạy)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Hành trình Trải nghiệm (Screenshots)](#hành-trình-trải-nghiệm-screenshots)
- [Khắc phục sự cố](#khắc-phục-sự-cố)

### Yêu cầu tiên quyết

Để bắt đầu hành trình chinh phục mã nguồn này, "hành trang" của bạn cần có:
- **Node.js** (>= 18): Nền tảng runtime vững chắc.
- **Yarn**: "Người quản gia" tận tụy quản lý các gói thư viện.
- **Java Development Kit (JDK) 17**: Chìa khóa vàng để tương thích hoàn hảo với React Native 0.78.
- **Android Studio** (kèm SDK & Emulator): Phòng thí nghiệm Android của bạn.
- **Xcode** & **CocoaPods** (Mac only): Bộ đôi hoàn hảo cho hệ sinh thái Apple.

### Cài đặt & Khởi chạy

Chỉ với vài thao tác đơn giản, thế giới mua sắm sẽ hiện ra trước mắt bạn:

1.  **Khai mở kho báu (Clone repository):**
    ```bash
    git clone <repository_url>
    cd se2525-13.2/mobile
    ```

2.  **Triệu hồi các linh kiện (Install dependencies):**
    ```bash
    yarn install
    # Dành cho các chiến binh iOS:
    cd ios && pod install && cd ..
    ```

3.  **Kích hoạt cổng không gian (Start Metro Bundler):**
    ```bash
    yarn start
    ```

4.  **Chạm vào thế giới số (Run App):**
    -   **Android**: `yarn android`
    -   **iOS**: `yarn ios`

    *Mẹo nhỏ: `yarn android` sẽ tự động rèn cho bạn một chiếc chìa khóa vạn năng `debug.keystore` nếu bạn chưa có.*
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
    
### Cấu trúc dự án - Bản đồ kho báu

Dự án được tổ chức khoa học, ngăn nắp như một thư viện tri thức:

```
mobile/
├── android/ & ios/     # Cánh cổng giao tiếp với phần cứng thiết bị
├── src/
│   ├── apis/           # "Sợi dây liên kết" với thế giới Backend
│   ├── assets/         # Kho tàng hình ảnh, phông chữ nghệ thuật
│   ├── components/     # Những viên gạch lego UI tinh xảo, tái sử dụng cao
│   ├── constants/      # Quy chuẩn của cái đẹp (màu sắc, kích thước)
│   ├── models/         # Định nghĩa ngôn ngữ chung (TypeScript Types)
│   ├── navigators/     # Bản đồ điều hướng, đưa người dùng đi muôn nơi
│   ├── redux/          # Bộ não trung tâm, ghi nhớ mọi trạng thái
│   ├── screens/        # Các sân khấu chính nơi vở kịch diễn ra
│   ├── styles/         # Phong cách thời trang toàn cục
│   └── utils/          # Bộ công cụ đa năng hỗ trợ mọi tình huống
├── App.tsx             # Điểm khởi đầu của mọi trải nghiệm
```

### Bản giao hưởng Tính năng

-   **Xác thực An toàn**: Hệ thống "người gác cổng" thông minh với Đăng nhập, Đăng ký, **Xác thực OTP 4 số** gửi qua email, và lối tắt qua Google/Facebook.
-   **Thiên đường Mua sắm**: Lướt qua hàng ngàn sản phẩm, xem chi tiết từng đường nét, thêm vào giỏ hàng và thanh toán trong nháy mắt.
-   **Cá nhân hóa Đỉnh cao**: Quản lý hồ sơ, sổ địa chỉ thông minh. Đặc biệt: **Bảng điều khiển Người bán** - nơi người dùng hóa thân thành thương nhân.
-   **Săn Deal Cực đã**: Khu vực Khuyến mãi riêng biệt, nơi những món hời đang chờ đón.
-   **Giao diện "Clean Light"**: Thiết kế tối giản, tinh tế, hiện đại, tôn vinh sản phẩm và trải nghiệm người dùng với các hiệu ứng chuyển động mượt mà.

### Hành trình Trải nghiệm (Screenshots)

#### 1. Lời chào đầu tiên (Onboarding)
Ấn tượng đầu tiên luôn quan trọng. Chúng tôi dẫn dắt người dùng qua 3 màn hình chào mừng đầy màu sắc, giới thiệu ngắn gọn nhưng súc tích về giá trị cốt lõi: Mua sắm đa dạng, Đặt hàng dễ dàng và Giao hàng thần tốc.

<p float="left">
  <img src="mobile/readme_file/onboarding-1.png" width="200" />
  <img src="mobile/readme_file/onboarding-2.png" width="200" />
  <img src="mobile/readme_file/onboarding-3.png" width="200" />
</p>

#### 2. Cánh cửa vào thế giới số (Authentication)
Bảo mật nhưng không đánh đổi sự tiện lợi. Giao diện đăng nhập/đăng ký được thiết kế thân thiện, rõ ràng.
-   **Đăng nhập**: Nhanh chóng, hỗ trợ "Ghi nhớ tôi".
-   **Đăng ký & Xác thực**: Quy trình chặt chẽ với bước xác thực OTP qua email, đảm bảo tính chính danh cho từng tài khoản.

<p float="left">
  <img src="mobile/readme_file/login_ui.png" width="200" />
  <img src="mobile/readme_file/signup_ui.png" width="200" />
  <img src="mobile/readme_file/verify_user.png" width="200" />
  <img src="mobile/readme_file/forgot_password_ui.png" width="200" />
</p>

#### 3. Trung tâm Mua sắm (Main Application)
Nơi phép màu thực sự diễn ra.
-   **Màn hình chính (Home)**: Một bữa tiệc thị giác với banner động, danh mục trực quan và gợi ý thông minh.
-   **Chi tiết sản phẩm**: Show diễn trọn vẹn vẻ đẹp sản phẩm. Tùy chọn màu sắc/kích thước trực quan, thao tác "Mua ngay" đầy kích thích.
-   **Giỏ hàng & Thanh toán**: Tối ưu hóa từng bước chạm để việc "rút ví" trở nên nhẹ nhàng và hài lòng nhất.

<p float="left">
  <img src="mobile/readme_file/home_ui.png" width="200" />
  <img src="mobile/readme_file/product_detail.png" width="200" />
  <img src="mobile/readme_file/cart.png" width="200" />
  <img src="mobile/readme_file/bill.png" width="200" />
</p>

#### 4. Không gian Cá nhân (Profile & Settings)
Ngôi nhà riêng của người dùng. Nơi lưu giữ lịch sử mua sắm, quản lý địa chỉ nhận hàng và tùy chỉnh ứng dụng theo sở thích (Ngôn ngữ Anh/Việt, Thông báo). Thiết kế dạng thẻ bo tròn hiện đại mang lại cảm giác ấm cúng, gọn gàng.

<p float="left">
  <img src="mobile/readme_file/profile_screen.png" width="200" />
  <img src="mobile/readme_file/tab_profile.png" width="200" />
  <img src="mobile/readme_file/address.png" width="200" />
  <img src="mobile/readme_file/address_create.png" width="200" />
</p>

#### 5. Góc Doanh nhân (Sale & Seller)
Nơi cơ hội kinh doanh bắt đầu.
-   **Sale Screen**: Săn tìm những ưu đãi "khủng" nhất.
-   **Seller Registration**: Cánh cửa để người mua chuyển mình thành đối tác bán hàng, mở rộng hệ sinh thái thương mại.

<p float="left">
  <img src="mobile/readme_file/sale_screen.png" width="200" />
  <img src="mobile/readme_file/seller_registration.png" width="200" />
</p>

### Khắc phục sự cố - Bác sĩ Công nghệ

Đôi khi, hành trình có thể gặp chút trắc trở, đây là bí kíp để bạn vượt qua:

*   **Lỗi `debug.keystore missing`**: Đừng lo, chỉ là thiếu chiếc chìa khóa ký tên thôi. Hãy rèn lại nó:
    ```bash
    keytool -genkey -v -keystore android/app/debug.keystore -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000
    ```
    *(Mật khẩu thần chú: `android`)*

*   **Lỗi `react-native-screens`**: Hãy giữ nguyên phiên bản **4.18.0**. Đó là phiên bản "định mệnh" để mọi thứ hoạt động hài hòa.

*   **Lỗi "No bundle URL present"**: Metro Bundler đang "ngủ quên"? Hãy đánh thức nó bằng lệnh `yarn start`.

*   **Lỗi Đầy bộ nhớ**: Hãy dọn dẹp "ngôi nhà" (emulator/thiết bị) của bạn để đón chào những điều mới mẻ.

