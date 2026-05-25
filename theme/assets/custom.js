/*
* Pipeline Theme
*
* Use this file to add custom Javascript to Pipeline.  Keeping your custom
* Javascript in this fill will make it easier to update Pipeline. In order
* to use this file you will need to open layout/theme.liquid and uncomment
* the custom.js script import line near the bottom of the file.
*
*/


(function() {

  // Below are example event listeners.  They listen for theme events that Pipeline
  // fires in order to make it easier for you to add customizations.

  // Keep your scripts inside this IIFE function call to avoid leaking your
  // variables into the global scope.


  document.addEventListener('theme:variant:change', function(event) {
    // You might use something like this to write a pre-order feature or a
    // custom swatch feature.
    var variant = event.detail.variant;
    var container = event.target;
    if (variant) {
      console.log('Container ———————— ↓');
      console.log(container);
      console.log('Variant —————————— ↓');
      console.log(variant);
      // ... update some element on the page
    }
  });

  document.addEventListener('theme:cart:change', function(event) {
    var cart = event.detail.cart;
    if (cart) {
      console.log('Cart ———————————— ↓');
      console.log(cart);
      // ... update an app or a custom shipping caluclator
    }
  });
  // Fired when page loads to update header values
  document.addEventListener('theme:cart:init', (e) => {
    console.log('theme:cart:init');
    console.log(e);
  });

  // Debounced scroll listeners.  Up and down only fire on direction changes
  // These events are useful for creating sticky elements and popups.
  document.addEventListener('theme:scroll', e => { console.log(e); });
  document.addEventListener('theme:scroll:up', e => { console.log(e); });
  document.addEventListener('theme:scroll:down', e => { console.log(e); });

  // Debounced resize listener to bundle changes that trigger document reflow
  document.addEventListener('theme:resize', e => { console.log(e); });

  // Locks and unlocks page scroll for modals and drawers
  // These are commented out because firing them will lock the page scroll
  // the lock event must set `detail` to the modal or drawer body so the
  // scroll locking code knows what element should maintain scoll.
  // document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true, detail: scrollableInnerElement}));
  // document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));


  // ^^ Keep your scripts inside this IIFE function call to avoid leaking your
  // variables into the global scope.



})();

<style>
  @media (max-width: 749px) {
    .hide-on-mobile { display: none !important; }
  }
  @media (min-width: 750px) {
    .hide-on-desktop { display: none !important; }
  }

  /* ===== TIRABOSCHI — Header Mobile Layout ===== */

  /* Mobile header outer flex container */
  .tira-header-mobile {
    display: flex !important;
    align-items: center;
    justify-content: space-between;
    padding: 0;
  }

  /* Left side: logo only */
  .tira-mobile-left {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  /* Right side: account + cart + burger */
  .tira-mobile-right {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  /* Generic header button / link reset */
  .tira-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 10px;
    margin: 0;
    cursor: pointer;
    color: inherit;
    text-decoration: none;
    line-height: 1;
    -webkit-tap-highlight-color: transparent;
    min-height: 44px; /* accessible tap target */
  }

  /* Icon sizing */
  .tira-btn .icon-theme,
  .tira-btn svg {
    width: 22px !important;
    height: 22px !important;
    display: block;
  }

  /* Hide cart total/price on mobile — icon only */
  .tira-btn .header__cart__status {
    display: none;
  }

  /* ===== TIRABOSCHI — Search Bar Below Header — Mobile (Miu Miu style) ===== */

  .tira-header-search {
    display: flex;
    align-items: center;
    padding: 0 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
  .tira-header-search .search-bar {
    width: 100%;
    background: transparent;
  }
  .tira-header-search form {
    width: 100%;
  }
  .tira-header-search .input-group {
    border: none !important;
    box-shadow: none !important;
    background: transparent;
    padding: 0;
    display: flex;
    align-items: center;
  }
  .tira-header-search .input-group-field {
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
    padding: 9px 0;
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: inherit;
    outline: none;
    flex: 1;
  }
  .tira-header-search .input-group-field::placeholder {
    color: inherit;
    opacity: 0.5;
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .tira-header-search .input-group-button {
    background: transparent;
    border: none;
    flex-shrink: 0;
  }
  .tira-header-search .btn,
  .tira-header-search button[type="submit"],
  .tira-header-search button[type="reset"] {
    background: transparent !important;
    border: none !important;
    color: inherit;
    padding: 6px 4px;
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .tira-header-search .search-reset {
    display: none;
  }

  /* Transparent header variant (homepage, collections) — white search bar */
  .header__wrapper[data-header-transparent="true"] .tira-header-search {
    border-top-color: rgba(254, 246, 236, 0.2);
  }
  .header__wrapper[data-header-transparent="true"] .tira-header-search .input-group-field,
  .header__wrapper[data-header-transparent="true"] .tira-header-search .btn,
  .header__wrapper[data-header-transparent="true"] .tira-header-search button {
    color: #fef6ec;
  }
  .header__wrapper[data-header-transparent="true"] .tira-header-search .input-group-field::placeholder {
    color: rgba(254, 246, 236, 0.5);
  }
</style>
