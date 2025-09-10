#!/bin/bash
# Simple verification script that doesn't require Node.js or Puppeteer

# Check if the Grid component has the required changes
echo "Checking Grid.tsx..."
if grep -q "clampToGrid" "/Users/leorami/Development/mxtk-site/components/home/Grid.tsx" && \
   grep -q "resolveCollisions" "/Users/leorami/Development/mxtk-site/components/home/Grid.tsx" && \
   grep -q "wframe" "/Users/leorami/Development/mxtk-site/components/home/Grid.tsx" && \
   grep -q "wframe-resize" "/Users/leorami/Development/mxtk-site/components/home/Grid.tsx"; then
  echo "✅ Grid.tsx has the required changes"
else
  echo "❌ Grid.tsx is missing some required changes"
  exit 1
fi

# Check if the CSS has the required changes
echo "Checking home-widgets.css..."
if grep -q "grid-rail" "/Users/leorami/Development/mxtk-site/app/styles/home-widgets.css" && \
   grep -q "wframe" "/Users/leorami/Development/mxtk-site/app/styles/home-widgets.css" && \
   grep -q "wframe-controls" "/Users/leorami/Development/mxtk-site/app/styles/home-widgets.css" && \
   grep -q "wframe-resize" "/Users/leorami/Development/mxtk-site/app/styles/home-widgets.css" && \
   grep -q "html.guide-open .wframe-controls" "/Users/leorami/Development/mxtk-site/app/styles/home-widgets.css"; then
  echo "✅ home-widgets.css has the required changes"
else
  echo "❌ home-widgets.css is missing some required changes"
  exit 1
fi

# Check if the WidgetFrame component has the required changes
echo "Checking WidgetFrame.tsx..."
if grep -q "wframe" "/Users/leorami/Development/mxtk-site/components/home/WidgetFrame.tsx" && \
   grep -q "wframe-controls" "/Users/leorami/Development/mxtk-site/components/home/WidgetFrame.tsx" && \
   grep -q "wframe-body" "/Users/leorami/Development/mxtk-site/components/home/WidgetFrame.tsx" && \
   grep -q "toTitleCase" "/Users/leorami/Development/mxtk-site/components/home/WidgetFrame.tsx"; then
  echo "✅ WidgetFrame.tsx has the required changes"
else
  echo "❌ WidgetFrame.tsx is missing some required changes"
  exit 1
fi

# Check if the migrate.ts has the required changes
echo "Checking migrate.ts..."
if grep -q "MIN_W = 3" "/Users/leorami/Development/mxtk-site/lib/home/migrate.ts" && \
   grep -q "MIN_H = 4" "/Users/leorami/Development/mxtk-site/lib/home/migrate.ts" && \
   grep -q "Math.max(w.size?.w ?? MIN_W, MIN_W)" "/Users/leorami/Development/mxtk-site/lib/home/migrate.ts"; then
  echo "✅ migrate.ts has the required changes"
else
  echo "❌ migrate.ts is missing some required changes"
  exit 1
fi

# Check if the seed route has the required changes
echo "Checking seed route..."
if grep -q "PRESETS_V2" "/Users/leorami/Development/mxtk-site/app/api/ai/home/seed/route.ts" && \
   grep -q "size:{w:4,h:10}" "/Users/leorami/Development/mxtk-site/app/api/ai/home/seed/route.ts"; then
  echo "✅ seed route has the required changes"
else
  echo "❌ seed route is missing some required changes"
  exit 1
fi

# Check if the DashboardContent component has the required changes
echo "Checking DashboardContent.tsx..."
if grep -q "useDebouncedCallback" "/Users/leorami/Development/mxtk-site/components/home/DashboardContent.tsx" && \
   grep -q "sectionId={sec.id}" "/Users/leorami/Development/mxtk-site/components/home/DashboardContent.tsx"; then
  echo "✅ DashboardContent.tsx has the required changes"
else
  echo "❌ DashboardContent.tsx is missing some required changes"
  exit 1
fi

# Check if the pureStore.ts has the required changes
echo "Checking pureStore.ts..."
if grep -q "clampToGrid" "/Users/leorami/Development/mxtk-site/lib/home/pureStore.ts" && \
   grep -q "resolveCollisions" "/Users/leorami/Development/mxtk-site/lib/home/pureStore.ts"; then
  echo "✅ pureStore.ts has the required changes"
else
  echo "❌ pureStore.ts is missing some required changes"
  exit 1
fi

echo "✅ All required changes have been verified"
exit 0
