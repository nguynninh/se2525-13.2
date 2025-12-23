# Hiki Shop - Báo cáo dự án

## Giới thiệu
- Hệ sinh thái thương mại điện tử Hiki Shop gồm 3 thành phần: backend dịch vụ API, trang quản trị web cho người bán, và ứng dụng mobile cho khách hàng.
- Mục tiêu: cung cấp luồng mua sắm end-to-end (đăng ký, tìm kiếm sản phẩm, giỏ hàng, đặt hàng, thanh toán, vận chuyển) và công cụ vận hành cho người bán (quản lý sản phẩm, đơn hàng, tồn kho, vận chuyển, phản hồi khách hàng).

## Kiến trúc tổng quan
- Monorepo: `server` (Node.js + Express + TypeScript + Sequelize/PostgreSQL, Redis, MinIO, Mailhog), `admin` (React + Vite + Tailwind), `mobile` (React Native, Redux Toolkit, React Navigation).
- Hạ tầng theo `docker-compose.yaml`: backend (port 8888), PostgreSQL, Redis + Redis Commander, pgAdmin, MinIO (9000/9001), Mailhog (8025), Nginx (reverse proxy cho backend & admin), Certbot.
- API REST tại `/api/v1`, response đồng nhất qua `utils/response`; hỗ trợ i18n trong `server/src/locales`.

## Dự án dùng làm gì
- Nền tảng marketplace 2 phía (người bán / người mua) có quản trị riêng cho seller và trải nghiệm mua sắm trên mobile.
- Cho phép seller tự đăng ký, gửi hồ sơ xét duyệt, tạo shop, đăng sản phẩm, quản lý tồn kho, xử lý đơn và giao vận.
- Cho phép khách hàng duyệt sản phẩm, thêm giỏ hàng, đặt hàng, theo dõi vận chuyển, đánh giá và hỏi đáp sản phẩm.

## Chức năng chính
- Xác thực & bảo mật: OTP email, đăng nhập mật khẩu, Google/Facebook, refresh token trên Redis, logout, quên mật khẩu qua OTP, quản lý device token cho push notification.
- Người dùng & người bán: hồ sơ cá nhân, địa chỉ giao hàng (tỉnh/TP - phường/xã), nộp hồ sơ seller, xét duyệt seller, tạo shop riêng.
- Sản phẩm: danh mục, biến thể/option, tồn kho, ảnh lưu MinIO, Q&A sản phẩm, đánh giá, khởi tạo 100 loyalty points cho khách hàng mới.
- Giỏ hàng & đơn hàng: thêm/xóa/cập nhật giỏ, đặt đơn, theo dõi trạng thái, tính tổng tiền.
- Vận chuyển & thanh toán: tạo shipment, bảng giá vận chuyển, cập nhật trạng thái giao hàng; payment sẵn sàng tích hợp cổng thanh toán.
- Kênh quản trị seller (web admin): dashboard đơn hàng/doanh thu, quản lý sản phẩm & danh mục, thêm sản phẩm, Q&A/review, cấu hình phí vận chuyển, tạo shipment, cập nhật tồn kho, trang cài đặt.
- Ứng dụng mobile (khách hàng): đăng nhập/đăng ký, đa ngôn ngữ, duyệt sản phẩm, giỏ hàng, đặt hàng, live/flash sale, hồ sơ người dùng; dùng Redux + AsyncStorage cho phiên.

## Công nghệ chính
- Backend: Node.js, Express 5, TypeScript, Sequelize (PostgreSQL), Redis, MinIO (S3 compatible), JWT, Nodemailer/Mailhog, Joi/Zod cho validate, i18next cho đa ngôn ngữ.
- Frontend admin: React 19, Vite (Rolldown), Tailwind CSS, React Router, Axios, Chart.js/Recharts, Lucide icons.
- Mobile: React Native 0.78, React Navigation, Redux Toolkit, AsyncStorage, i18next, Axios, Image Picker, Google/Facebook SDK.
- DevOps: Docker Compose, PostgreSQL, Redis Commander, pgAdmin, Mailhog, Nginx reverse proxy, Certbot; scripts migrate/seed DB.

## Cấu trúc thư mục
- `server/`: dịch vụ API; `src/module` (auth, user, product, cart, order, shipment, payment, shop, location ...); `src/routers` khai báo route; `src/models` Sequelize; `src/seeders` dữ liệu mẫu.
- `admin/`: giao diện dashboard seller; `src/pages` (Dashboard, Product, AddProduct, AddCategory, QA, Shipping, ShippingRates, CreateShipment, UpdateStock, Settings); `src/api` client axios.
- `mobile/`: ứng dụng React Native; `src/screens` (auth, commerce, product, profile, sale, live, scanner), `src/redux` (store, slice), `src/navigators/AppRouters`.

## Hướng dẫn chạy nhanh bằng Docker
1) Chuẩn bị: Docker + Docker Compose, Node 18+ nếu muốn chạy cục bộ.
2) Backend env: copy `server/.env.example` thành `server/.env`, điền DB, Redis, AWS/MinIO, mail.
3) Khởi chạy: từ thư mục gốc chạy `docker compose up -d --build`.
4) Truy cập:
   - API backend: `http://localhost:8888` (hoặc qua Nginx: `http://localhost` nếu proxy).
   - Trang admin: `http://localhost` (Nginx triển khai).
   - Công cụ hỗ trợ: Mailhog `http://localhost:8025`, pgAdmin `http://localhost:5050`, Redis Commander `http://localhost:6380`.

## Chạy development thủ công
- Backend: `cd server && cp .env.example .env && npm install && npm run migrate && npm run seed && npm run dev` (port 8888).
- Admin: `cd admin && npm install && npm run dev` (Vite mặc định 5173).
- Mobile: `cd mobile && npm install` (hoặc `yarn`), `npm start` khởi Metro, `npm run android` / `npm run ios` để build; đặt biến API trong `.env` (sử dụng `react-native-dotenv`).

## Ghi chú & khuyến nghị
- Kiểm tra CORS, JWT secret, Redis secret trước khi deploy production.
- MinIO đang local; lên cloud cần cập nhật endpoint/bucket và policy public/TTL ảnh.
- Chưa có bộ test tự động; nên bổ sung test API (Postman/Newman hoặc Jest) cho các luồng auth, giỏ hàng, đặt hàng, shipment.
- Nếu dùng SSL thật, cập nhật mount cert và rule Nginx trước khi chạy Certbot.
