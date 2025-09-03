# 🎯 MXTK Simultaneous Access Solutions

You asked: **"Can I access the site through proxy OR locally, but not both simultaneously?"**

## 🔧 **Current Status: YES, Both Work Simultaneously!**

With the new dynamic detection system, you can access:

✅ **Local**: `http://localhost:2000` (no `/mxtk` prefix)  
✅ **Proxy**: `https://ramileo.ngrok.app/mxtk` (with `/mxtk` prefix)

**Both access methods work at the same time from the same build!**

---

## 📋 **How It Works**

### 🔄 **Dynamic Detection System**

The app automatically detects how it's being accessed:

- **Server-side**: Checks `x-forwarded-prefix` header from nginx
- **Client-side**: Checks `window.location.pathname` for `/mxtk`
- **API calls**: Dynamically route to `/api` or `/mxtk/api`
- **Navigation links**: Automatically prefixed based on context

### 🏗️ **Key Components**

1. **`lib/basepath.ts`**: Dynamic detection logic
2. **`lib/api.ts`**: Context-aware API routing  
3. **Components**: Use `getRelativePath()` / `getPublicPath()` helpers with `usePathname()`
4. **Environment**: App stays basePath-agnostic; proxy provides `/mxtk`

---

## ⚡ **Alternative Approaches** 

If you prefer simpler solutions:

### **Option 1: Environment Switching** (Simpler)
```bash
# For proxy deployment
NEXT_PUBLIC_BASE_PATH=/mxtk
NEXT_PUBLIC_API_BASE=/mxtk/api

# For local development  
NEXT_PUBLIC_BASE_PATH=
NEXT_PUBLIC_API_BASE=/api
```

**Pros**: Simple, predictable  
**Cons**: Can't access both modes from same build

### **Option 2: Separate Build Configs** (Most Reliable)
- `npm run build:local` - for local development
- `npm run build:proxy` - for proxy deployment

**Pros**: Zero complexity, bulletproof  
**Cons**: Need separate builds

### **Option 3: Current Dynamic System** (Most Flexible)
**Pros**: Single build works for both access methods  
**Cons**: More complex, SSR/client hydration considerations

---

## 🎯 **Recommendation**

**For Development**: Use the current dynamic system - it gives you maximum flexibility.

**For Production**: Consider separate builds for different deployment targets to eliminate any runtime complexity.

---

## 🧪 **Testing Both Modes**

```bash
# Test local access (should show href="/owners")
curl http://localhost:2000 | grep 'href.*owners'

# Test proxy access (should show href="/mxtk/owners")  
curl https://ramileo.ngrok.app/mxtk | grep 'href.*owners'

# Test local API
curl http://localhost:2000/api/market

# Test proxy API  
curl https://ramileo.ngrok.app/mxtk/api/market
```

Both should work simultaneously! 🚀
