(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.sr-nav');
    if (!nav) {
      return;
    }

    const toggle = nav.querySelector('.sr-nav__toggle');
    const menu = nav.querySelector('.sr-nav__menu');
    const icon = toggle?.querySelector('.material-icons') || null;
    const searchToggle = nav.querySelector('.sr-nav__search-toggle');
    const searchModal = document.getElementById('sr-nav-search');
    const searchIcon = searchToggle?.querySelector('.material-icons') || null;
    const searchInput = searchModal?.querySelector('.sr-search__input') || null;
    const searchDismiss = searchModal ? searchModal.querySelectorAll('[data-search-dismiss]') : [];
    let lastFocused = null;

    if (!toggle || !menu) {
      return;
    }

    const media = window.matchMedia('(min-width: 768px)');

    const closeMenu = () => {
      nav.classList.remove('sr-nav--open');
      toggle.setAttribute('aria-expanded', 'false');
      if (icon) {
        icon.textContent = 'menu';
      }
    };

    const closeSearch = () => {
      if (!searchToggle || !searchModal) {
        return;
      }

      searchToggle.setAttribute('aria-expanded', 'false');
      searchModal.classList.remove('sr-search--open');
      searchModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('sr-search-open');

      if (searchIcon) {
        searchIcon.textContent = 'search';
      }

      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
      lastFocused = null;
    };

    const openSearch = () => {
      if (!searchToggle || !searchModal) {
        return;
      }

      closeMenu();

      lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;

      searchToggle.setAttribute('aria-expanded', 'true');
      searchModal.classList.add('sr-search--open');
      searchModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('sr-search-open');

      if (searchIcon) {
        searchIcon.textContent = 'close';
      }

      if (searchInput) {
        window.requestAnimationFrame(() => {
          searchInput.focus();
          searchInput.select();
        });
      }
    };

    const toggleSearch = () => {
      if (!searchToggle || !searchModal) {
        return;
      }

      const isOpen = searchModal.classList.contains('sr-search--open');
      if (isOpen) {
        closeSearch();
      } else {
        openSearch();
      }
    };

    const syncStateForDesktop = () => {
      if (media.matches) {
        closeMenu();
        closeSearch();
      }
    };

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', syncStateForDesktop);
    } else if (typeof media.addListener === 'function') {
      media.addListener(syncStateForDesktop);
    }

    syncStateForDesktop();

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      const nextExpanded = !expanded;
      toggle.setAttribute('aria-expanded', nextExpanded ? 'true' : 'false');
      nav.classList.toggle('sr-nav--open', nextExpanded);
      if (icon) {
        icon.textContent = nextExpanded ? 'close' : 'menu';
      }
    });

    if (searchToggle && searchModal) {
      searchToggle.addEventListener('click', toggleSearch);

      searchDismiss.forEach((element) => {
        element.addEventListener('click', closeSearch);
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && searchModal.classList.contains('sr-search--open')) {
          event.preventDefault();
          closeSearch();
        }
      });

      searchModal.addEventListener('click', (event) => {
        if (event.target === searchModal) {
          closeSearch();
        }
      });
    }
  });
})();
