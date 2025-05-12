# React Native App

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

## 🛠️ Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) guide up to the "Creating a new application" step before proceeding.

---

## Step 1: Start the Metro Server

Metro is the JavaScript bundler for React Native. Start it from the root of your project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

Let this terminal window stay open.

---

## Step 2: Run the Application

In a **new terminal window**, run the following from the root of your project:

### ✅ For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### ✅ For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, your app should launch in an Android Emulator or iOS Simulator.

You can also run the app directly from **Android Studio** or **Xcode**.

---

## 🧹 Android Not Working? Run This

If the Android build fails (due to Gradle or permission issues), try the following commands:

```bash
cd android
./gradlew clean
cd ..
npm run android
```

### 🛑 Permission Error Fix

If you see an error like `permission denied` for `./gradlew`, run:

```bash
chmod +x android/gradlew
xattr -d com.apple.quarantine android/gradlew
```

Then retry:

```bash
cd android
./gradlew clean
cd ..
npm run android
```

---

## ✏️ Modify the App

Once the app is running:

1. Open `App.tsx` or `App.js` in your editor.
2. Make changes.
3. Reload the app:

   - **Android**: Press <kbd>R</kbd> twice or use <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS) / <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux)
   - **iOS**: Press <kbd>Cmd ⌘</kbd> + <kbd>R</kbd>

---

## 🎉 Congratulations

You’ve successfully set up and run your React Native app! :partying_face:

---

## 📚 Learn More

- [React Native Docs](https://reactnative.dev)
- [Environment Setup](https://reactnative.dev/docs/environment-setup)
- [Troubleshooting](https://reactnative.dev/docs/troubleshooting)
- [React Native GitHub](https://github.com/facebook/react-native)
