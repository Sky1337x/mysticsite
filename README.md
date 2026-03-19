# Mysticsristi YouTube Channel Website

A modern, responsive multi-page website for your YouTube channel with animations and mobile-friendly design.

## 🌟 Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Eye-catching animations and transitions throughout
- **Multiple Pages**: 
  - Home - Welcome page with support options
  - About - Channel story and stats
  - Videos - Latest uploads showcase
  - Contact - Contact form and social links
- **Interactive Navigation**: Mobile-friendly hamburger menu
- **Support Integration**: UPI payment links and QR codes
- **Social Media Links**: Easy access to all your platforms

## 📁 File Structure

```
├── index.html          # Home page
├── about.html          # About page
├── videos.html         # Videos showcase
├── contact.html        # Contact page
├── index.css           # All styling
├── script.js           # JavaScript functionality
└── images/
    ├── Logo_v1.png     # Your channel logo
    ├── upi.jpeg        # UPI icon
    └── tree.jpg        # QR code
```

## 🎨 Customization Guide

### 1. Update Your Content

**Home Page (index.html)**
- Replace placeholder text with your actual content
- Update UPI payment link (line 44)
- Update YouTube membership link (line 75)

**About Page (about.html)**
- Edit stats (subscribers, videos, views) - lines 40-52
- Update "My Journey" section with your story - lines 59-77
- Customize "What I Create" cards - lines 85-102

**Videos Page (videos.html)**
- Videos are now fetched automatically from your YouTube channel
- Add your YouTube Data API key in script.js (YOUTUBE_API_KEY)
- Update channel id in script.js if you change channels (YOUTUBE_CHANNEL_ID)

### 1.1 Enable Automatic Video Loading

1. Open Google Cloud Console and create/select a project.
2. Enable YouTube Data API v3 for that project.
3. Create an API key.
4. Open script.js and update:

```js
const YOUTUBE_CHANNEL_ID = 'UCBTafI6VGfch543DRjGeC0w';
const YOUTUBE_API_KEY = 'PASTE_YOUR_API_KEY_HERE';
const YOUTUBE_MAX_RESULTS = 6;
```

The videos page will then automatically display your latest uploads.

**Contact Page (contact.html)**
- Update email address (mysticsristi@gmail.com)
- Customize FAQ section
- Add more contact methods if needed

### 2. Change Colors

Edit CSS variables in `index.css` (lines 2-11):

```css
:root {
    --primary-color: #ff6cf8;      /* Pink accent color */
    --secondary-color: #4a6cf7;    /* Blue button color */
    --text-dark: #222;             /* Dark text */
    --text-light: #555;            /* Light text */
}
```

### 3. Add Your Analytics

Add Google Analytics or other tracking codes in the `<head>` section of each HTML file.

### 4. Add More Pages

Copy the structure of any existing page and:
1. Update the navigation links
2. Add content
3. Update the `<title>` tag
4. Add link to navigation menu in all pages

## 📱 Mobile Responsiveness

- Hamburger menu activates at screen width < 768px
- Cards stack vertically on smaller screens
- Touch-friendly buttons and links
- Optimized images and spacing

## 🚀 Deployment

### GitHub Pages
1. Create a new repository
2. Upload all files
3. Go to Settings > Pages
4. Select main branch
5. Your site will be live at `https://yourusername.github.io/repository-name`

### Other Hosting
Upload all files to your web hosting service via FTP or control panel.

## 🎯 Tips for Best Results

1. **Optimize Images**: 
   - Logo: 200x200px PNG
   - QR Code: 300x300px
   - Video thumbnails: 1280x720px (16:9 ratio)

2. **Update Regularly**:
   - Add new videos to videos.html
   - Update stats on about.html
   - Keep contact information current

3. **SEO**:
   - Add meta descriptions to each page
   - Use descriptive page titles
   - Add alt text to all images (already included)

4. **Performance**:
   - Compress images before uploading
   - Consider using a CDN for images
   - Enable browser caching if possible

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📞 Support

For issues or questions about the website, contact:
- Email: mysticsristi@gmail.com
- Instagram: @mysticsristi

## 📝 License

Feel free to customize this website for your personal use.

---

Made with ❤️ for Mysticsristi YouTube Channel
