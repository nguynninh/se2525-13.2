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
