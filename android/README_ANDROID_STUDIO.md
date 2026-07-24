# 📱 Adnan Super Store - Android Studio Native Project

A complete native Gradle Android project ready to open, view, edit, and compile inside **Android Studio**.

---

## 📁 Folder Structure inside `android/`

```
android/
├── build.gradle                              # Top-level Gradle script
├── settings.gradle                           # Project settings
├── gradle.properties                         # Android properties
└── app/
    ├── build.gradle                          # Module config (Package: com.adnansuperstore.shveada)
    └── src/
        └── main/
            ├── AndroidManifest.xml           # App Manifest & Permissions
            ├── java/
            │   └── com/
            │       └── adnansuperstore/
            │           └── shveada/
            │               └── MainActivity.java  # Native Java Android Activity
            └── res/
                ├── layout/
                │   └── activity_main.xml     # Native Android XML layout with WebView & ProgressBar
                └── values/
                    ├── strings.xml           # Strings & Store URLs
                    ├── colors.xml            # Bazaar Emerald Theme Colors
                    └── styles.xml            # Android Theme
```

---

## 🛠️ How to Open & Build in Android Studio

1. Open **Android Studio**.
2. Click **Open** (or `File > Open`).
3. Select the folder: `c:\Users\ZC\Desktop\Adnan\android`.
4. Android Studio will automatically sync the Gradle files and show the full Android project tree under `app > src > main > java` and `app > src > main > res`.
5. You can view, edit, and customize any code file (`MainActivity.java`, `activity_main.xml`, `strings.xml`).
6. To generate the APK:
   - Go to top menu: `Build > Build Bundle(s) / APK(s) > Build APK(s)`.
   - Android Studio will output the compiled `.apk` file directly in `app/build/outputs/apk/debug/app-debug.apk`.
