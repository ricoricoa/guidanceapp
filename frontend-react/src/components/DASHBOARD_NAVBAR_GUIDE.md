# Dashboard Navbar Component Documentation

## Overview
The `DashboardNavbar` component is a professional, animated navbar designed for both **Counselors** and **Admins** with a modern UI/UX design, smooth animations, and complete functionality.

## Features

### 1. **Role-Based Navigation**
- **Counselor Role**: Dashboard, Messages, Announcements, Appointments, Requests, Students
- **Admin Role**: Dashboard, Messages, Announcements, Users, Reports, Settings

### 2. **Visual Elements**
- **Gradient Design**: Beautiful gradient backgrounds and text effects
- **Responsive Layout**: Desktop and mobile friendly
- **Dark Mode Support**: Full dark theme support
- **Smooth Animations**: Slide-down, fade-in, and pulse animations

### 3. **Core Functionality**

#### Notifications Panel
- Bell icon with unread notification badge
- Notification list with timestamps
- Unread status indicator
- Smooth dropdown animation

#### User Profile Dropdown
- User profile info display
- Navigation to Profile settings
- Navigation to Settings page
- Logout functionality

#### Theme Toggle
- Quick theme switcher (Dark/Light mode)
- Icon changes based on theme

#### Mobile Menu
- Hamburger menu for mobile devices
- Slide-in animation
- All navigation items accessible on mobile

## Component Props

```jsx
<DashboardNavbar 
  user={{
    name: "John Doe",
    email: "john@example.com"
  }}
  userRole="counselor" // or "admin"
/>
```

### Props Details
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `user` | Object | Yes | User object containing name and email |
| `userRole` | String | Yes | 'counselor' or 'admin' - determines navigation items |

## Usage Examples

### In Counselor Dashboard
```jsx
import DashboardNavbar from '../components/DashboardNavbar';

function CounselorDashboard() {
  const [user, setUser] = useState(null);
  
  return (
    <>
      <DashboardNavbar user={user} userRole="counselor" />
      {/* Rest of dashboard content */}
    </>
  );
}
```

### In Admin Dashboard
```jsx
<DashboardNavbar user={user} userRole="admin" />
```

## Animations

### Built-in CSS Animations

1. **slideDown** - Dropdown menus slide down smoothly
```css
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

2. **slideUp** - Upward slide animation
```css
@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

3. **slideInRight** - Mobile menu slides in from right
```css
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
```

4. **pulse** - Notification badge pulses
```css
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
```

## Hover Effects

- **Navigation Items**: Smooth color transition with underline animation
- **Buttons**: Scale and shadow effects on hover
- **Dropdowns**: Smooth background color changes

## Color Scheme

### Gradients
- **Primary**: Indigo to Purple (`from-indigo-600 to-purple-600`)
- **Secondary**: Blue to Cyan (`from-blue-600 to-cyan-600`)

### Text Colors
- **Active State**: White text on gradient background
- **Inactive State**: Gray text with hover effect
- **Dark Mode**: Adjusted gray tones for accessibility

## Responsive Design

### Desktop (lg screens)
- Full horizontal navigation
- All menu items visible
- Dropdown menus

### Tablet/Mobile
- Hamburger menu icon
- Slide-in mobile menu
- Compact layout
- Touch-friendly buttons

## State Management

The component uses React hooks for state management:
- `mobileMenuOpen` - Track mobile menu visibility
- `profileDropdownOpen` - Track profile dropdown
- `notificationDropdownOpen` - Track notification dropdown

## Integration

### Step 1: Import the component
```jsx
import DashboardNavbar from '../components/DashboardNavbar';
```

### Step 2: Use in your dashboard
```jsx
<DashboardNavbar user={user} userRole="counselor" />
```

### Step 3: Wrap content in Fragment
```jsx
return (
  <>
    <DashboardNavbar user={user} userRole="counselor" />
    {/* Your dashboard content */}
  </>
);
```

## Required Dependencies

- **React** - Core framework
- **React Router** - For navigation (`useNavigate`, `useLocation`)
- **Lucide React** - For icons
- **Tailwind CSS** - For styling
- **ThemeContext** - For dark mode support

```jsx
import { useTheme } from '../context/ThemeContext';
```

## Customization

### Change Color Scheme
Edit gradient colors in the component:
```jsx
className="bg-gradient-to-r from-indigo-600 to-purple-600"
// Change to your preferred colors
className="bg-gradient-to-r from-blue-600 to-green-600"
```

### Add More Navigation Items
Modify the `getNavItems()` function:
```jsx
const newItem = { 
  label: 'Analytics', 
  icon: BarChart3, 
  path: '/dashboard/analytics' 
};
```

### Customize Notification Count
Update the notifications state and mock data as needed.

## Dark Mode

The component fully supports dark mode using Tailwind's `dark:` prefix:
```jsx
className="bg-white dark:bg-gray-800"
className="text-gray-700 dark:text-gray-300"
```

Theme toggle is integrated via `useTheme()` hook.

## Accessibility

- **Semantic HTML**: Uses proper button and nav elements
- **ARIA Labels**: Can be added for screen readers
- **Keyboard Navigation**: Fully keyboard accessible
- **Color Contrast**: Follows WCAG guidelines

## Performance

- **Optimized Re-renders**: Uses state management efficiently
- **CSS Animations**: GPU-accelerated for smooth performance
- **No External Requests**: All data is local or context-based

## Future Enhancements

- Add notification action handlers
- Implement actual notification API calls
- Add user settings preferences
- Implement real-time notification updates
- Add keyboard shortcuts
- Enhanced accessibility features

## Troubleshooting

### Navbar not appearing
- Ensure `ThemeContext` is provided at app root
- Check that user data is being fetched correctly
- Verify imports are correct

### Animations not working
- Check Tailwind CSS is properly configured
- Ensure browser supports CSS animations
- Clear cache and rebuild

### Dark mode not working
- Verify `useTheme()` hook is implemented
- Check ThemeContext provider at root level
- Verify dark: prefix is enabled in Tailwind config

## Support

For issues or feature requests, please refer to the project documentation or contact the development team.
