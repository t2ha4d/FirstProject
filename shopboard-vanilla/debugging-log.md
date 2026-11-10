# Debugging Log

## Bug 1

- **What I saw:** Typing in the search box did nothing. The Console showed `ReferenceError: upadte is not defined`.
- **Type:** runtime
- **How I found it:** I opened the Console and clicked the file link next to the error. It took me to main.js line 29.
- **Cause:** debug-lab/src/main.js line 29. The search listener calls `upadte()`, but the real function is `update()`. It's a typo.
- **Fix:** I changed `upadte()` to `update()`.
- **Did I use AI? For what?** Yes. Claude Code ran the debug lab and confirmed the line number. I checked the fix in the browser.

## Bug 2

- **What I saw:** The cart count in the header stayed at "0 items · $0". The Console showed `TypeError: Cannot set properties of null (setting 'textContent')`.
- **Type:** runtime
- **How I found it:** The error pointed to ui.js line 22. I compared the selector there with the id in index.html.
- **Cause:** debug-lab/src/ui.js line 22. `renderCart` looks for `#cart-counter`, but the element in the HTML is `#cart-count`. So `querySelector` returns `null`.
- **Fix:** I changed the selector to `#cart-count`.
- **Did I use AI? For what?** Yes. Claude Code confirmed the line number and the wrong id.

## Bug 3

- **What I saw:** Searching "bag" showed "No products found", even though there are 3 bags. "Bag" and "BAG" didn't work either.
- **Type:** logic
- **How I found it:** There was no error in the Console. I tried different searches, then read the search function in logic.js.
- **Cause:** debug-lab/src/logic.js line 3. The search text is lowercased, but the product name is not. So "bag" never matches "Leather Tote Bag".
- **Fix:** I compare with `p.name.toLowerCase()` too.
- **Did I use AI? For what?** Yes. Claude Code helped me find the exact line.

## Bug 4

- **What I saw:** "Price: high to low" showed the same order as "low to high".
- **Type:** logic
- **How I found it:** I tried both sort options and the result was the same. Then I read the sort function in logic.js.
- **Cause:** debug-lab/src/logic.js line 14. The `price-desc` case uses `a.price - b.price`, which is the same as `price-asc`.
- **Fix:** I changed it to `b.price - a.price`.
- **Did I use AI? For what?** Yes. Claude Code confirmed the line number.

## Bug 5

- **What I saw:** After adding an item and refreshing, the product grid was empty. The Console showed `SyntaxError: "[object Object]" is not valid JSON`.
- **Type:** state
- **How I found it:** I opened Application, then Local Storage. The saved cart was the text `[object Object]`.
- **Cause:** debug-lab/src/state.js line 9. `saveCart` puts the array straight into `localStorage.setItem`, so it gets saved as `"[object Object]"`. That can't be read back on reload.
- **Fix:** I save `JSON.stringify(cart)`. I also put `loadCart` inside `try/catch`, so a bad saved value can't break the page.
- **Did I use AI? For what?** Yes. Claude Code confirmed the line and the error message.

## Bug 6

- **What I saw:** After I changed the search, category or sort a few times, one click on "Add to cart" added more than one item.
- **Type:** state
- **How I found it:** The quantity jumped by more than 1. I looked at where the click listener is added in main.js.
- **Cause:** debug-lab/src/main.js line 18. `onAddToCart(...)` is called inside `update()`. Every filter or sort change runs `update()` again and adds one more click listener.
- **Fix:** I moved `onAddToCart(...)` out of `update()`, so it runs only once at startup.
- **Did I use AI? For what?** Yes. Claude Code reproduced it and showed me where the listener was added.

## Bonus bug

- **What I saw:** Two Leather Tote Bags ($89 each) showed a total of $89 instead of $178. The count showed 2, which was correct.
- **Type:** logic
- **How I found it:** I added the same product twice and checked the total by hand.
- **Cause:** debug-lab/src/logic.js line 25. `cartTotal` adds `product.price` but doesn't multiply it by `item.qty`.
- **Fix:** I changed it to `product.price * item.qty`.
- **Did I use AI? For what?** Yes. Claude Code found this one while checking the debug lab.
