# Browser Extension Integration Guide

This dashboard works with a browser extension that captures your Instagram followers and following lists.

## How the Extension Should Work

Your browser extension needs to:

1. **Access Instagram** when user is logged in
2. **Extract** the followers and following lists
3. **Export** data in the required format

## Data Format

The extension should collect data and send it to the dashboard in this format:

### For Followers:
```
username1
username2
username3
...
```

### For Following:
```
username1
username2
username3
...
```

One username per line, plain text.

## Methods to Get Data

### Method 1: Text File Export
The extension exports `.txt` files with followers and following lists.

Users then upload these files to the dashboard:
1. Go to "📸 New Snapshot"
2. Click "Or upload file" to select the .txt file
3. Or paste the content manually

### Method 2: Direct Upload (Advanced)
For private accounts, the extension can:
1. Open Instagram in a hidden iframe/session
2. Use the user's authenticated session
3. Scrape the followers/following lists
4. Send data directly to the dashboard

### Method 3: Instagram API (if available)
Use Instagram Graph API (requires approval from Meta):
- Get access token
- Call `/me/ig_user_followers` endpoint
- Parse and display results

## Extension Development Tips

### Using Selenium/Puppeteer
```javascript
// Pseudo code for extension
const page = await browser.newPage();
await page.goto('https://instagram.com/username/followers');
const followers = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('[data-testid="follow_card"]'))
    .map(el => el.textContent.trim());
});
```

### Storage & Communication
- Store data temporarily in extension's storage
- Send to dashboard via:
  - User copy-paste
  - File download
  - LocalStorage sync
  - IndexedDB shared access

### Private Accounts
For private accounts (using Instagram session):
1. Extension injects into Instagram page
2. Uses the user's authenticated cookies
3. Scrapes the DOM for followers
4. Sends data to dashboard

## Dashboard Integration Points

### 1. Manual Data Entry
- Users paste followers/following lists
- Works for any account type
- No special extension needed

### 2. File Upload
- Extension exports .txt files
- User uploads via dashboard
- Simple and reliable

### 3. Local Storage Sync
- Extension stores data in localStorage
- Dashboard reads from same origin
- Fast and seamless

## Example Extension Code

```javascript
// Example: Simple followers extractor
function extractFollowers() {
  const followers = [];
  document.querySelectorAll('[data-testid="user_list"]').forEach(user => {
    const username = user.querySelector('a')?.textContent;
    if (username) followers.push(username.trim());
  });
  return followers;
}

// Send to dashboard
chrome.runtime.sendMessage({
  type: 'FOLLOWERS_CAPTURED',
  data: {
    username: 'your_account',
    followers: extractFollowers(),
    following: extractFollowing()
  }
});
```

## Testing the Dashboard

1. Manually create test data:
   - Username: testuser
   - Followers: alice, bob, charlie
   - Following: alice, david, eve

2. Create 2 snapshots at different times

3. Compare to see the analytics

## Privacy Considerations

✅ **Do:**
- Store data locally in IndexedDB
- Use user's own Instagram session
- Be transparent about data collection
- Allow users to delete snapshots

❌ **Don't:**
- Send data to external servers
- Store usernames without permission
- Violate Instagram's ToS
- Use API keys inappropriately

## Troubleshooting

**Q: Can't extract followers?**
A: Instagram's DOM changes. Try using:
- Selenium/Puppeteer for reliable scraping
- Instagram's Graph API (if approved)
- Manual export from Instagram settings

**Q: Data doesn't appear?**
A: Check:
- Format is correct (one per line)
- No extra spaces or special chars
- File is UTF-8 encoded

**Q: Private account issue?**
A: Extension must use authenticated session to access private account data. Requires Instagram login within extension.

## Resources

- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-graph-api)
- [Puppeteer Documentation](https://pptr.dev/)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Firefox WebExtensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)

---

**Need help?** Open an issue in the repository!
