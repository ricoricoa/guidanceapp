# 💡 WELLNESS TIPS CHATBOT - TESTING GUIDE

## Testing Overview

Complete testing guide for the Wellness Tips Chatbot feature including unit tests, integration tests, and user acceptance tests.

---

## Pre-Testing Checklist

Before starting tests, verify:
- [x] TipsBot.jsx file exists in `src/components/`
- [x] StudentDashboard.jsx has TipsBot import
- [x] React dev server running without errors
- [x] No console errors or warnings
- [x] All dependencies installed

---

## Test Categories

### 1. Component Rendering Tests

#### Test 1.1: Component Mounts
**Purpose:** Verify TipsBot component renders correctly

**Steps:**
1. Open StudentDashboard
2. Verify "Wellness Tips" button exists in sidebar
3. Check button has Lightbulb icon
4. Check button label says "Wellness Tips"

**Expected Result:**
- Button visible in sidebar
- Icon displays correctly
- Text readable

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 1.2: Modal Opens
**Purpose:** Verify clicking button opens modal

**Steps:**
1. Click "Wellness Tips" button
2. Wait for animation
3. Check modal appears

**Expected Result:**
- Modal opens smoothly
- Black overlay appears
- Modal centered on screen
- Header shows "💡 Wellness Tips"

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 1.3: Modal Styling
**Purpose:** Verify modal has correct styling

**Steps:**
1. Open modal
2. Check header gradient (green to emerald)
3. Check message area has proper background
4. Check input area styling
5. Check close button visible

**Expected Result:**
- Green gradient header
- Light gray/white message area
- Dark input footer
- X button in top right corner
- Rounded corners throughout

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 1.4: Dark Mode Styling
**Purpose:** Verify dark mode colors work

**Steps:**
1. Toggle dark mode in app
2. Open chatbot modal
3. Verify all text readable
4. Check contrast ratios
5. Verify colors not inverted incorrectly

**Expected Result:**
- Dark background with light text
- Proper contrast
- Button colors visible
- Input field readable

**Status:** ✅ PASS / ❌ FAIL

---

### 2. User Interaction Tests

#### Test 2.1: Opening Chatbot
**Purpose:** Verify modal opens when button clicked

**Steps:**
1. Click "Wellness Tips" button
2. Observe modal transition
3. Verify initial greeting message

**Expected Result:**
- Modal opens after click
- Smooth animation
- Greeting message displays
- "Hello! I'm your wellness companion..." text visible

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 2.2: Closing Chatbot - X Button
**Purpose:** Verify modal closes with X button

**Steps:**
1. Open modal
2. Click X button (top right)
3. Verify modal closes

**Expected Result:**
- Modal closes smoothly
- Overlay disappears
- Can click button again to reopen

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 2.3: Closing Chatbot - Outside Click
**Purpose:** Verify modal closes when clicking outside

**Steps:**
1. Open modal
2. Click on black overlay (outside modal)
3. Verify modal closes

**Expected Result:**
- Modal closes
- Overlay clicked area is clickable
- Sidebar buttons still accessible

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 2.4: Closing Chatbot - Escape Key
**Purpose:** Verify Escape key closes modal

**Steps:**
1. Open modal
2. Make sure input is not focused
3. Press Escape key
4. Verify modal closes

**Expected Result:**
- Modal closes with Escape
- State updates properly
- Can reopen

**Status:** ✅ PASS / ❌ FAIL

---

### 3. Quick Button Tests

#### Test 3.1: Stress Management Button
**Purpose:** Verify stress button triggers stress tips

**Steps:**
1. Open modal
2. Click "Stress Management" button
3. Wait for bot response
4. Read response

**Expected Result:**
- Button is clickable
- Creates message in chat
- Bot responds with stress tip
- Loading animation shows during response
- Response contains stress-related advice

**Verify Tip Includes:**
- ✅ Grounding technique OR
- ✅ Breathing exercises OR
- ✅ Breaks/rest OR
- ✅ Exercise OR
- ✅ Meditation

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 3.2: Study Tips Button
**Purpose:** Verify study button triggers study tips

**Steps:**
1. Click "Study Tips" button
2. Wait for response
3. Read message

**Expected Result:**
- Message created
- Bot responds with study tip
- Tip relates to studying/academics
- Quick buttons disappear after first interaction

**Verify Tip Includes:**
- ✅ Pomodoro OR
- ✅ Active recall OR
- ✅ Spaced repetition OR
- ✅ Mind mapping OR
- ✅ Study technique

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 3.3: Sleep & Rest Button
**Purpose:** Verify sleep button triggers sleep tips

**Steps:**
1. Click "Sleep & Rest" button
2. Check response

**Expected Result:**
- Bot responds with sleep-related tip
- Tip is actionable advice

**Verify Tip Includes:**
- ✅ Sleep schedule OR
- ✅ Screen time OR
- ✅ Sleep routine OR
- ✅ Environment OR
- ✅ Caffeine

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 3.4: Focus Tips Button
**Purpose:** Verify focus button triggers focus tips

**Steps:**
1. Click "Focus Tips" button
2. Check response

**Expected Result:**
- Bot responds with focus-related tip
- Tip helps with concentration

**Verify Tip Includes:**
- ✅ Study space OR
- ✅ Disable notifications OR
- ✅ Blocking apps OR
- ✅ Different subjects OR
- ✅ Peak hours

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 3.5: Quick Buttons Disappear
**Purpose:** Verify quick buttons only show initially

**Steps:**
1. Open modal
2. Verify 4 buttons visible
3. Click any button
4. Send another message
5. Check buttons are gone

**Expected Result:**
- 4 buttons visible on first load
- Buttons disappear after first interaction
- Only input field and messages visible
- Can still type and send messages

**Status:** ✅ PASS / ❌ FAIL

---

### 4. Text Input Tests

#### Test 4.1: Type Message
**Purpose:** Verify can type in input field

**Steps:**
1. Open modal
2. Click input field
3. Type: "I'm stressed"
4. Verify text appears in field

**Expected Result:**
- Cursor appears in input
- Text displays as typed
- Characters don't repeat
- Field doesn't lag

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 4.2: Send Message - Button Click
**Purpose:** Verify clicking send button sends message

**Steps:**
1. Type "I'm stressed"
2. Click send button (arrow icon)
3. Check message appears in chat

**Expected Result:**
- Message appears as "user" message
- Right-aligned with green background
- Input field clears
- Message in chat history

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 4.3: Send Message - Enter Key
**Purpose:** Verify pressing Enter sends message

**Steps:**
1. Type "I can't sleep"
2. Press Enter key
3. Check message sent

**Expected Result:**
- Message sent on Enter press
- Same behavior as button click
- Input clears
- Message visible in chat

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 4.4: Empty Message
**Purpose:** Verify empty messages not sent

**Steps:**
1. Don't type anything
2. Click send button
3. Try pressing Enter
4. Check nothing happens

**Expected Result:**
- Empty message not added to chat
- No bot response for empty input
- Focus stays in input field

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 4.5: Special Characters
**Purpose:** Verify special characters handled

**Steps:**
1. Type: "I'm!@#$%^&*()"
2. Click send
3. Check message displays correctly

**Expected Result:**
- Message displays with all characters
- No console errors
- Bot can still process

**Status:** ✅ PASS / ❌ FAIL

---

### 5. Keyword Matching Tests

#### Test 5.1: Stress Keywords
**Purpose:** Verify stress-related keywords trigger stress tips

**Test Cases:**

| Message | Expected Category | Expected Topic |
|---------|------------------|-----------------|
| "I'm stressed" | mental_health | Stress Management |
| "I'm anxious" | mental_health | Stress Management |
| "I'm worried" | mental_health | Stress Management |
| "I feel overwhelmed" | mental_health | Stress Management |

**Steps for each:**
1. Type message
2. Send message
3. Wait for response
4. Verify stress-related tip

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 5.2: Sleep Keywords
**Purpose:** Verify sleep-related keywords trigger sleep tips

**Test Cases:**

| Message | Expected Category |
|---------|------------------|
| "I can't sleep" | Sleep & Rest |
| "I'm tired" | Sleep & Rest |
| "Insomnia" | Sleep & Rest |
| "I feel fatigued" | Sleep & Rest |

**Steps for each:**
1. Send message
2. Verify sleep-related response

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 5.3: Academic Keywords
**Purpose:** Verify study-related keywords trigger study tips

**Test Cases:**

| Message | Expected Topic |
|---------|-----------------|
| "How to study" | Study Techniques |
| "Need to focus" | Focus & Concentration |
| "Time management" | Time Management |
| "Exam prep" | Exam Preparation |

**Steps for each:**
1. Send message
2. Verify academic-related response

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 5.4: Wellness Keywords
**Purpose:** Verify wellness keywords trigger wellness tips

**Test Cases:**

| Message | Expected Topic |
|---------|-----------------|
| "Need exercise" | Physical Health |
| "What to eat" | Nutrition |
| "Make friends" | Social Connections |
| "I'm bored" | Hobbies & Fun |

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 5.5: No Matching Keywords
**Purpose:** Verify random tip given when no keywords match

**Test Cases:**
- "Hello"
- "Hi bot"
- "How are you?"
- "Random text"

**Steps:**
1. Send message with no keywords
2. Verify bot responds
3. Response should be from quick_tips

**Expected Result:**
- Bot still responds
- Provides helpful tip
- No error messages

**Status:** ✅ PASS / ❌ FAIL

---

### 6. Chat History Tests

#### Test 6.1: Messages Display
**Purpose:** Verify messages appear in chat history

**Steps:**
1. Send message: "I'm stressed"
2. Wait for response
3. Verify both messages visible
4. User message on right (green)
5. Bot message on left (white/light)

**Expected Result:**
- Both messages visible
- Proper alignment
- Proper colors
- Clear distinction between user/bot

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 6.2: Multiple Messages
**Purpose:** Verify conversation history maintained

**Steps:**
1. Send: "I'm stressed"
2. Get response
3. Send: "Any other tips?"
4. Get response
5. Send: "What about sleep?"
6. Check all messages visible

**Expected Result:**
- All 6 messages (3 user, 3 bot) visible
- Chronological order
- No messages missing
- Scrollable if overflow

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 6.3: Auto Scroll
**Purpose:** Verify chat scrolls to latest message

**Steps:**
1. Send many messages to fill area
2. Send final message
3. Check if scrolled to bottom
4. Can see latest message

**Expected Result:**
- Auto-scroll to latest message
- No need to manually scroll
- Latest message always visible

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 6.4: History Cleared on Close
**Purpose:** Verify conversation cleared when modal closed

**Steps:**
1. Send several messages
2. Close modal
3. Reopen modal
4. Check conversation history

**Expected Result:**
- Only greeting message visible
- Previous messages gone
- Fresh start each time
- No memory of previous chat

**Status:** ✅ PASS / ❌ FAIL

---

### 7. Loading State Tests

#### Test 7.1: Loading Animation
**Purpose:** Verify loading indicator shows

**Steps:**
1. Send message
2. Observe bot response area
3. Watch for animated dots

**Expected Result:**
- Animated three dots appear
- Animation smooth
- Shows for ~800ms
- Replaced by actual response

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 7.2: Input Disabled While Loading
**Purpose:** Verify input disabled during response

**Steps:**
1. Send message
2. Try to type during loading
3. Try to send another message

**Expected Result:**
- Input field disabled (gray/inactive)
- Can't type new message
- Send button disabled
- Re-enabled after response

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 7.3: Response Delay
**Purpose:** Verify 800ms delay before response

**Steps:**
1. Send message
2. Time until response appears
3. Should be ~800ms

**Expected Result:**
- Delay of approximately 800ms
- Loading animation shows during wait
- Response appears after delay
- Not too fast, not too slow

**Status:** ✅ PASS / ❌ FAIL

---

### 8. Responsive Design Tests

#### Test 8.1: Mobile Layout
**Purpose:** Verify chatbot works on mobile screen

**Steps:**
1. Resize browser to 375px width
2. Open modal
3. Try typing and sending
4. Check button sizes

**Expected Result:**
- Modal fits on screen
- Full width with padding
- Text readable
- Buttons touchable
- All features accessible

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 8.2: Tablet Layout
**Purpose:** Verify chatbot works on tablet

**Steps:**
1. Resize browser to 768px width
2. Open modal
3. Send messages
4. Check overall layout

**Expected Result:**
- Modal centered
- Comfortable spacing
- All features work
- Clean layout

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 8.3: Desktop Layout
**Purpose:** Verify chatbot works on desktop

**Steps:**
1. Resize to 1920px width
2. Open modal
3. Send messages

**Expected Result:**
- Modal max-width respected (28rem)
- Centered on screen
- Perfect viewing experience
- All interactive elements work

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 8.4: Landscape Mobile
**Purpose:** Verify works in landscape on mobile

**Steps:**
1. Open on mobile
2. Rotate to landscape
3. Try using chatbot

**Expected Result:**
- Adapts to landscape
- Still usable
- No content hidden
- Proper height management

**Status:** ✅ PASS / ❌ FAIL

---

### 9. Browser Compatibility Tests

#### Test 9.1: Chrome
**Purpose:** Test on Chrome browser

**Steps:**
1. Open app in Chrome
2. Use all features
3. Check console for errors

**Expected Result:**
- All features work
- No console errors
- Styling correct
- Animations smooth

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 9.2: Firefox
**Purpose:** Test on Firefox browser

**Steps:**
1. Open in Firefox
2. Use chatbot
3. Check console

**Expected Result:**
- All features work
- Styling correct
- No warnings

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 9.3: Safari
**Purpose:** Test on Safari browser

**Steps:**
1. Open on Safari
2. Test features
3. Check appearance

**Expected Result:**
- Works properly
- Styling correct
- Smooth animations

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 9.4: Edge
**Purpose:** Test on Edge browser

**Steps:**
1. Open in Edge
2. Test chatbot
3. Check console

**Expected Result:**
- Full functionality
- No errors
- Proper styling

**Status:** ✅ PASS / ❌ FAIL

---

### 10. Error Handling Tests

#### Test 10.1: Rapid Clicking
**Purpose:** Verify handles rapid clicks

**Steps:**
1. Rapidly click send button multiple times
2. Check messages not duplicated
3. Check bot not overloaded

**Expected Result:**
- Only one message sent
- No duplicate bot responses
- Handles gracefully
- No console errors

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 10.2: Very Long Message
**Purpose:** Verify handles long input

**Steps:**
1. Paste very long text (1000+ chars)
2. Try to send
3. Check wrapping

**Expected Result:**
- Message sends successfully
- Text wraps properly
- Display doesn't break
- Bot processes normally

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 10.3: No Errors in Console
**Purpose:** Verify no JavaScript errors

**Steps:**
1. Open DevTools console
2. Use chatbot thoroughly
3. Check for errors

**Expected Result:**
- No red error messages
- No warnings
- Clean console
- Only normal logs if any

**Status:** ✅ PASS / ❌ FAIL

---

### 11. User Experience Tests

#### Test 11.1: Response Relevance
**Purpose:** Verify responses are relevant

**Test Cases:**
- Send: "I'm so stressed about exams"
- Expected: Stress management tip
- Send: "I need to focus better"
- Expected: Focus/concentration tip
- Send: "I can't sleep"
- Expected: Sleep tip

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 11.2: Variety of Tips
**Purpose:** Verify different tips on repeat topics

**Steps:**
1. Send "I'm stressed"
2. Close modal, reopen
3. Send "I'm anxious"
4. Compare responses (should be different)

**Expected Result:**
- Different tips provided
- Not repetitive
- Multiple options from database

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 11.3: User Satisfaction
**Purpose:** Verify tips are helpful

**Evaluation:**
- Are tips actionable?
- Are they practical?
- Would a student use them?
- Are they relevant to topic?

**Expected Result:**
- Tips are helpful
- Easy to implement
- Relevant advice
- Student-friendly language

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 11.4: UI Clarity
**Purpose:** Verify UI is clear and intuitive

**Evaluation:**
- Is button easy to find?
- Is modal clear?
- Are messages understandable?
- Is it obvious how to use?

**Expected Result:**
- Intuitive interface
- Clear labeling
- Easy to understand
- No confusion

**Status:** ✅ PASS / ❌ FAIL

---

## Test Execution Checklist

### Pre-Test Setup
- [ ] React server running on localhost:3000
- [ ] Logged in as student
- [ ] Browser console open
- [ ] Clear browser cache
- [ ] Use incognito/private window if needed

### Full Test Suite
- [ ] Component Rendering Tests (4 tests)
- [ ] User Interaction Tests (4 tests)
- [ ] Quick Button Tests (5 tests)
- [ ] Text Input Tests (5 tests)
- [ ] Keyword Matching Tests (5 tests)
- [ ] Chat History Tests (4 tests)
- [ ] Loading State Tests (3 tests)
- [ ] Responsive Design Tests (4 tests)
- [ ] Browser Compatibility Tests (4 tests)
- [ ] Error Handling Tests (3 tests)
- [ ] User Experience Tests (4 tests)

**Total Tests:** 44

---

## Test Results Summary

| Category | Tests | Passed | Failed | Notes |
|----------|-------|--------|--------|-------|
| Rendering | 4 | ___ | ___ | |
| Interaction | 4 | ___ | ___ | |
| Buttons | 5 | ___ | ___ | |
| Input | 5 | ___ | ___ | |
| Keywords | 5 | ___ | ___ | |
| History | 4 | ___ | ___ | |
| Loading | 3 | ___ | ___ | |
| Responsive | 4 | ___ | ___ | |
| Browser | 4 | ___ | ___ | |
| Errors | 3 | ___ | ___ | |
| UX | 4 | ___ | ___ | |
| **TOTAL** | **44** | **___** | **___** | |

---

## Known Issues & Workarounds

### None Currently

All tests should pass. If any fail:
1. Check browser console for errors
2. Verify file paths are correct
3. Clear cache and reload
4. Restart dev server

---

## Sign-Off

**Tester Name:** _______________

**Date:** _______________

**Overall Result:** ✅ PASS / ❌ FAIL

**Comments:**

---

**Document Version:** 1.0
**Last Updated:** November 24, 2025
