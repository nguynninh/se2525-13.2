# SE2525 Mobile App

This is the mobile client for the SE2525 project, built with React Native. It features a complete e-commerce experience including authentication, product browsing, cart management, and user profiles.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Ensure you have the following installed on your development machine:
- **Node.js** (>= 18)
- **Yarn** (Preferred package manager)
- **Java Development Kit (JDK)** (version 17 is recommended for React Native 0.78)
- **Android Studio** (with Android SDK and Emulator)
- **Xcode** (for iOS development, Mac only)
- **CocoaPods** (for iOS dependencies)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd se2525-13.2/mobile
    ```

2.  **Install dependencies:**
    ```bash
    yarn install
    ```

3.  **iOS specific (Mac only):**
    ```bash
    cd ios
    pod install
    cd ..
    ```

## Running the App

### Android

To run the Android application:

1.  Start the Metro bundler:
    ```bash
    yarn start
    ```

2.  In a separate terminal, run the Android app:
    ```bash
    yarn android
    ```

   *Note: This will automatically generate a `debug.keystore` if one is missing in `android/app`.*

### iOS

To run the iOS application:

1.  Start the Metro bundler:
    ```bash
    yarn start
    ```

2.  Run the iOS app:
    ```bash
    yarn ios
    ```

## Project Structure

The project follows a standard React Native directory structure:

```
mobile/
├── android/            # Android native code
├── ios/                # iOS native code
├── src/
│   ├── apis/           # API integration
│   ├── assets/         # Images, fonts, and other static assets
│   ├── components/     # Reusable UI components
│   ├── constants/      # App constants (colors, fonts, sizes)
│   ├── models/         # TypeScript interfaces/types
│   ├── navigators/     # React Navigation setup (Stack, Tab, Drawer)
│   ├── redux/          # Redux state management (slices, store)
│   ├── screens/        # Screen components (Auth, Commerce, Profile, etc.)
│   ├── styles/         # Global styles
│   └── utils/          # Utility functions (validation, etc.)
├── App.tsx             # Root component
└── package.json        # Dependencies and scripts
```

## Key Features

-   **Authentication**: Login, Sign Up, Forgot Password, Social Login.
-   **Commerce**: Product listing, Product Details, Cart, Checkout.
-   **Profile**: User settings, Address management.
-   **Navigation**: Uses `@react-navigation/native` with Stack and Tab navigators.
-   **State Management**: Uses `@reduxjs/toolkit` for global state.
-   **Localization**: Multi-language support (English/Vietnamese) via `react-i18next`.

## Recent Updates (Light Theme & Redesign)

The application has undergone a significant UI overhaul to adopt a modern **Clean Light Theme**:
-   **Home Screen**: Bright, clean interface with product cards and banner carousels.
-   **Profile Screen**: Redesigned with a "System Settings" style layout, featuring grouped cards, colorful icons, and clear typography.
-   **Cart Screen**: Improved "Empty State" with visual illustrations and clean white background.
-   **Address Management**: Refined "Add/Edit Address" screens with proper spacing and clearer input forms.


## Screenshots

### Onboarding

The Onboarding flow introduces users to the app's core value proposition through a 3-step swipable guide:
1.  **Browse Products**: Discover a wide variety of items.
2.  **Easy Ordering**: Seamless checkout process.
3.  **Fast Delivery**: Get your items delivered quickly.

Users can navigate through the guide using "Next" or bypass it with "Skip" to jump directly to the Login screen.

<p float="left">
  <img src="readme_file/onboarding-1.png" width="200" />
  <img src="readme_file/onboarding-2.png" width="200" />
  <img src="readme_file/onboarding-3.png" width="200" />
</p>

### Authentication
<p float="left">
  <img src="readme_file/login_ui.png" width="200" />
  <img src="readme_file/signup_ui.png" width="200" />
  <img src="readme_file/forgot_password_ui.png" width="200" />
</p>

### Main Application
**Home & Products**
<p float="left">
  <img src="readme_file/home_ui.png" width="200" />
  <img src="readme_file/product_detail.png" width="200" />
</p>

**Shopping Cart**
<p float="left">
  <img src="readme_file/cart.png" width="200" />
</p>

**Bill**
<p float="left">
  <img src="readme_file/bill.png" width="200" />
</p>

### User Profile & Settings
**Profile & Address Management**
<p float="left">
  <img src="readme_file/profile_screen.png" width="200" />
  <img src="readme_file/address.png" width="200" />
  <img src="readme_file/address_create.png" width="200" />
</p>

## Troubleshooting

### Android Build Issues

*   **`debug.keystore` missing**: The app requires a debug keystore to sign the APK. If you see a keystore logging error, ensure `android/app/debug.keystore` exists. You can generate it using:
    ```bash
    keytool -genkey -v -keystore android/app/debug.keystore -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000
    ```
    *(Password: `android`)*

*   **`react-native-screens` errors**: This project requires `react-native-screens` version **4.18.0** to be compatible with other navigation libraries. Do not upgrade this package without verifying compatibility.

### Runtime Errors

*   **"No bundle URL present"**: Ensure the Metro bundler is running (`yarn start`).
*   **"INSTALL_FAILED_INSUFFICIENT_STORAGE"**: Free up space on your emulator or device by uninstalling unused apps.

## License

[Add License Here]
