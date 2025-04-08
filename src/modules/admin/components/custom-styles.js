// Inject critical styles to fix AdminJS visibility issues
const injectStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    /* Override theme color for all important elements */
    * {
      --theme-color: #FFFFFF !important;
      color: var(--theme-color) !important;
    }
    
    /* Fix all header styles directly */
    [class*="sc-"], [class*="sc-"] * {
      color: #FFFFFF !important;
    }
    
    /* Fix column headers specifically - these are the ones with the red text */
    thead, th, td, tr, 
    [class*="TableHeader"], [class*="TableCell"],
    [role="columnheader"], [role="cell"],
    [class*="sc-"][role="columnheader"],
    [class*="sc-"][role="cell"] {
      color: #FFFFFF !important;
      background-color: #1F3A60 !important;
      font-weight: 500 !important;
      border-color: #2D4A70 !important;
    }
    
    /* Fix table body cells */
    tbody td, 
    [role="cell"], 
    [class*="TableCell"],
    [class*="sc-"][role="cell"] {
      background-color: #112240 !important;
      color: #FFFFFF !important;
    }
    
    /* Fix table row hover */
    tr:hover, [role="row"]:hover {
      background-color: #1F3A60 !important;
    }
    
    /* Fix breadcrumbs */
    [class*="Breadcrumbs"], [class*="breadcrumbs"],
    [class*="ActionHeader"], 
    .breadcrumbs, .breadcrumb {
      color: #FFFFFF !important;
      visibility: visible !important;
      display: flex !important;
      background-color: transparent !important;
    }
    
    /* Fix list title */
    [class*="ListTitle"], [class*="Title"], h1, h2 {
      color: #FFFFFF !important;
      display: block !important;
      visibility: visible !important;
    }
    
    /* Fix all buttons */
    button, [role="button"] {
      color: #FFFFFF !important;
      border-color: #1F3A60 !important;
    }
    
    /* Fix all action buttons */
    button[class*="sc-"], a[class*="sc-"] {
      color: #FFFFFF !important;
    }
    
    /* Fix the column selector dropdown */
    [class*="Dropdown"], [class*="dropdown"] {
      background-color: #112240 !important;
      border-color: #1F3A60 !important;
      color: #FFFFFF !important;
    }
    
    /* Fix icons */
    svg, path, [class*="Icon"], [class*="icon"] {
      fill: currentColor !important;
      color: #FFFFFF !important;
    }
  `;
  document.head.appendChild(style);
  
  // Function to directly manipulate DOM elements for more precise control
  const fixElements = () => {
    // Fix the red text in table headers - directly target them
    document.querySelectorAll('th, [role="columnheader"], [class*="TableCell"]').forEach(elem => {
      elem.style.color = '#FFFFFF';
      elem.style.backgroundColor = '#1F3A60';
      elem.style.borderColor = '#2D4A70';
      
      // Fix any nested elements
      elem.querySelectorAll('*').forEach(child => {
        child.style.color = '#FFFFFF';
      });
    });
    
    // Fix table rows
    document.querySelectorAll('tr, [role="row"]').forEach(row => {
      row.style.backgroundColor = '#112240';
      row.style.borderBottom = '1px solid #1F3A60';
      
      // Fix cells in this row
      row.querySelectorAll('td, [role="cell"]').forEach(cell => {
        cell.style.color = '#FFFFFF';
        cell.style.backgroundColor = '#112240';
        
        // Fix any nested elements in the cell
        cell.querySelectorAll('*').forEach(child => {
          child.style.color = '#FFFFFF';
        });
      });
    });
    
    // Fix breadcrumbs and their nested elements
    document.querySelectorAll('[class*="Breadcrumbs"], [class*="breadcrumbs"], [class*="ActionHeader"]').forEach(elem => {
      elem.style.color = '#FFFFFF';
      elem.style.backgroundColor = 'transparent';
      elem.style.display = 'flex';
      elem.style.visibility = 'visible';
      
      // Fix nested elements
      elem.querySelectorAll('a, span, div').forEach(child => {
        child.style.color = '#FFFFFF';
        child.style.visibility = 'visible';
        child.style.display = 'inline-block';
      });
    });
    
    // Fix all button colors
    document.querySelectorAll('button, [role="button"]').forEach(button => {
      button.style.color = '#FFFFFF';
      
      // Fix nested elements
      button.querySelectorAll('*').forEach(child => {
        child.style.color = '#FFFFFF';
      });
    });
  };
  
  // Execute fixes immediately and after a delay to catch dynamically loaded content
  fixElements();
  setTimeout(fixElements, 300);
  setTimeout(fixElements, 1000);
};

// Run the script when the page loads
window.addEventListener('DOMContentLoaded', injectStyles);

// Also run it after a delay to catch dynamically loaded content
setTimeout(injectStyles, 300);
setTimeout(injectStyles, 800);
setTimeout(injectStyles, 1500);

// Observe DOM changes to apply styling to dynamically added elements
const observeDOM = () => {
  const observer = new MutationObserver((mutations) => {
    setTimeout(injectStyles, 100);
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};

// Start observing once DOM is loaded
document.addEventListener('DOMContentLoaded', observeDOM);

// Run it when route changes (for single-page apps)
const pushState = history.pushState;
history.pushState = function() {
  pushState.apply(history, arguments);
  setTimeout(injectStyles, 300);
};

// Run it when popstate occurs (browser back/forward)
window.addEventListener('popstate', function() {
  setTimeout(injectStyles, 300);
}); 