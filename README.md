
# GA4 E‑commerce Starter

A simple, self-contained demo website showcasing an e‑commerce product grid, forms, embedded YouTube video, and a file attachment input. It includes Google Analytics 4 (GA4) event tagging with gtag.js and custom parameters ready to be registered as custom dimensions/metrics.

## Quick Start
1. **Unzip** this archive.
2. Open `index.html` in a browser.
3. Replace `G-XXXXXXXXXX` with your **GA4 Measurement ID** in the `<head>` script.
4. In GA4 **Admin → Data Streams → Web**, make sure **Enhanced measurement** is enabled (for video engagement and file downloads).

## Events Implemented
- `add_to_cart` *(recommended)* with `items[]`
- `begin_checkout` *(recommended)*
- `purchase` *(recommended)* — includes custom parameter `shipping_amount` (Currency)
- `sign_up` *(recommended)* — includes parameter `method` and `form_name`
- `generate_lead` *(recommended)* — includes `form_name`
- `select_item` *(recommended)* on product tile clicks
- `cta_click` *(custom)* — includes `cta_location` for header/footer attribution
- `file_upload` *(custom)* — includes `file_type` and `file_size_kb`

## Suggested Custom Definitions (create in GA4 Admin → Custom Definitions)
**Custom dimensions (event‑scoped):**
- `cta_location` — where the CTA button lives (header, footer)
- `form_name` — which form fired (signup, contact)
- `signup_method` — value from `sign_up` event (email, google)

**Custom metrics:**
- `shipping_amount` — Currency (sent with `purchase`)
- `video_seconds_watched` — Time (map to GA4 parameter `video_current_time` from enhanced measurement)

**Calculated metric (example):**
- `Shipping % of Purchase Revenue` = `{shipping_amount}` ÷ `{Purchase revenue}` × 100

## Notes
- Video engagement (`video_start`, `video_progress`, `video_complete`) will be tracked automatically for embedded YouTube videos when Enhanced measurement is enabled.
- Register any parameters you want to analyze as **custom definitions** to see them in standard reports.

