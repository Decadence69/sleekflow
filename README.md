# AI Usage & My Contributions

## Parts I Wrote/Designed Personally

### Design & UX Decisions
- **Table header design**: The AI initially placed labels inside each item row, so I instead redesigned it to use a single table header row, improving the visuals and reducing redundant text.
- **Layout choices**: Changed the header to full-width design to match the wireframe and then adjusted the color scheme to be a bit softer on the eyes, rather than full white which could be overwhelming for those that view in a dark environment.
- **UI Consistency**: The gender, species and status has an "unknown" option, which is not in Title Case as opposed to the other options, so I had it all changed to use Title Case to maintain consistency.

### Performance Optimizations
- **API efficiency**: The AI's initial approach would have made a separate fetch request for each character's details. I recognized this was wasteful and restructured to use the API's pagination endpoint, reducing requests from potentially 800+ to just 1 per page.
- **Direct API filtering**: Instead of fetching all data and filtering client-side, I modified the code to pass filters directly to the API, significantly improving performance.

## Parts That Were Heavily AI-Generated Then Edited

### Initial Boilerplate
- AI generated the basic Next.js 14 project structure and TypeScript types 
- I edited each of the pages to match the wireframes

### Styling Framework
- AI provided Tailwind CSS setup and initial styling
- I customized colors, spacing and layout to match the wireframe

### Pagination Logic
- AI provided the basic pagination structure
- I added the page number to URL parameters so users can bookmark or share specific pages
- I added `setCurrentPage(1)` to all filter handlers so filtering doesn't leave you on a non-existent page
- I added scroll-to-top behavior when changing pages for better UX

### Dynamic vs. Predefined Filters
- AI opted to generate all filter options dynamically
- I edited it such that the Gender and Statuses were in a predefined list instead of a dynamic list
- This helps avoid wasting resources on recalculating a small unchanging dropdown list each time

## What I Rejected or Heavily Rewrote

### Contact Card vs. List Design
**AI Suggestion**: Individual contact cards with images, extensive character details (origin, location, episode count), and complex grid layouts.

**Why I Rejected It**: 
- Overly complex for a contact list use case
- Images would slow down the page and weren't necessary for the core functionality
- The task asked for a list with specific fields, so I felt that using cards would be over-engineering

**My Rewrite**: Simple table-based list layout focusing on the four required fields with clean, scannable rows.

### Client-Side vs. API-Side Filtering
**AI Suggestion**: Fetch all characters once, then filter them client-side using JavaScript array methods.

**Why I Rejected It**: 
- Doesn't scale as well if there were much more characters?
- Wastes bandwidth fetching data the user doesn't need
- According to the documentation, Rick and Morty API already supports filtering, so I opted to use it instead

**My Rewrite**: Pass filter parameters directly to the API, letting the server handle the heavy lifting.

### Dynamic vs. Predefined Filters
**AI Suggestion**: Generate all filter dropdown options dynamically from fetched data.

**Why I Rejected It**: 
- I
- Required fetching all data first to build the filters
- Less user-friendly with too many options

**My Rewrite**: Curated, practical filter lists that cover the main use cases.