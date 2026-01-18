/**
 * Poem Feed - Social Media Style Feed for Poetry
 * Similar to Facebook/LinkedIn feed with infinite scroll
 */

(function() {
  'use strict';

  const PoemFeed = {
    currentPage: 0,
    itemsPerPage: 10,
    loading: false,
    hasMore: true,
    currentFilter: {
      language: '',
      sort: 'newest' // newest, popular, trending
    },

    /**
     * Initialize poem feed
     */
    init() {
      console.log('Poem Feed initialized');
    },

    /**
     * Show poem feed page
     */
    async showFeed() {
      const app = document.getElementById('app');
      if (!app) return;

      // Reset scroll position to top
      window.scrollTo(0, 0);

      // Reset state
      this.currentPage = 0;
      this.hasMore = true;
      this.loading = false;

      app.innerHTML = `
        <div class="max-w-5xl mx-auto animate-fadeInUp">
          <!-- Feed Header -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">
              <i class="fas fa-stream mr-2 text-blue-600"></i>
              Poetry Feed
            </h1>
            <p class="text-gray-600 mb-6">
              Discover amazing poems from our talented community
            </p>

            <!-- Filters -->
            <div class="flex flex-wrap gap-4">
              <!-- Sort Options -->
              <div class="flex items-center space-x-2">
                <label class="text-sm font-semibold text-gray-700">Sort by:</label>
                <select id="sortFilter" class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" onchange="PoemFeed.changeSort(this.value)">
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="trending">Trending</option>
                </select>
              </div>

              <!-- Language Filter -->
              <div class="flex items-center space-x-2">
                <label class="text-sm font-semibold text-gray-700">Language:</label>
                <div class="flex space-x-2">
                  <button onclick="PoemFeed.changeLanguage('')" class="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover-lift" id="lang-all">All</button>
                  <button onclick="PoemFeed.changeLanguage('en')" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300" id="lang-en">English</button>
                  <button onclick="PoemFeed.changeLanguage('hi')" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300" id="lang-hi">हिंदी</button>
                  <button onclick="PoemFeed.changeLanguage('mr')" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300" id="lang-mr">मराठी</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Create Poem Card (if logged in) -->
          <div id="createPoemCard" class="hidden bg-white rounded-lg shadow-sm p-6 mb-6">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                <i class="fas fa-pen-fancy"></i>
              </div>
              <button onclick="showDashboard()" class="flex-1 text-left px-4 py-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition">
                What's on your mind? Share a poem...
              </button>
            </div>
          </div>

          <!-- Feed Container -->
          <div id="feedContainer" class="space-y-6">
            <!-- Poems will be loaded here -->
          </div>

          <!-- Loading Indicator -->
          <div id="loadingIndicator" class="text-center py-8 hidden">
            <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
            <p class="text-gray-600 mt-2">Loading poems...</p>
          </div>

          <!-- No More Posts -->
          <div id="endOfFeed" class="text-center py-8 hidden">
            <i class="fas fa-check-circle text-4xl text-green-500 mb-3"></i>
            <p class="text-gray-600">You've reached the end of the feed</p>
          </div>
        </div>
      `;

      // Load initial poems
      await this.loadMorePoems();

      // Setup infinite scroll
      this.setupInfiniteScroll();

      // Check if user is logged in
      this.checkAuthAndShowCreateCard();
    },

    /**
     * Load more poems
     */
    async loadMorePoems() {
      if (this.loading || !this.hasMore) return;

      this.loading = true;
      this.showLoading(true);

      try {
        const response = await axios.get(API_BASE + '/poems', {
          params: {
            language: this.currentFilter.language || undefined,
            sort: this.currentFilter.sort,
            limit: this.itemsPerPage,
            offset: this.currentPage * this.itemsPerPage
          }
        });

        const poems = response.data.poems;

        if (poems.length === 0) {
          this.hasMore = false;
          if (this.currentPage === 0) {
            // No poems at all
            document.getElementById('feedContainer').innerHTML = `
              <div class="bg-white rounded-lg shadow-sm p-12 text-center">
                <i class="fas fa-book-open text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-xl font-bold text-gray-900 mb-2">No Poems Yet</h3>
                <p class="text-gray-600 mb-4">Be the first to share your poetry!</p>
                <button onclick="showDashboard()" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
                  <i class="fas fa-pen-fancy mr-2"></i>Write a Poem
                </button>
              </div>
            `;
          } else {
            document.getElementById('endOfFeed').classList.remove('hidden');
          }
        } else {
          this.renderPoems(poems);
          this.currentPage++;
          if (poems.length < this.itemsPerPage) {
            this.hasMore = false;
            document.getElementById('endOfFeed').classList.remove('hidden');
          }
        }
      } catch (error) {
        console.error('Failed to load poems:', error);
        this.showError();
      } finally {
        this.loading = false;
        this.showLoading(false);
      }
    },

    /**
     * Render poems to feed
     */
    renderPoems(poems) {
      const container = document.getElementById('feedContainer');

      poems.forEach(poem => {
        const poemCard = this.createPoemCard(poem);
        container.insertAdjacentHTML('beforeend', poemCard);
      });
    },

    /**
     * Create poem card HTML
     */
    createPoemCard(poem) {
      const publishedDate = new Date(poem.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      return `
        <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 animate-fadeInUp">
          <!-- Author Info -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                ${(poem.author_display_name || poem.author_name || 'U')[0].toUpperCase()}
              </div>
              <div>
                <h4 class="font-bold text-gray-900">${poem.author_display_name || poem.author_name || 'Anonymous'}</h4>
                <p class="text-sm text-gray-500">
                  <i class="far fa-clock mr-1"></i>${publishedDate}
                  <span class="ml-2 language-badge lang-${poem.language}">${poem.language.toUpperCase()}</span>
                </p>
              </div>
            </div>
            <button class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-ellipsis-h"></i>
            </button>
          </div>

          <!-- Poem Content -->
          <div class="mb-4 cursor-pointer" onclick="viewPoem(${poem.id})">
            <h3 class="text-2xl font-bold text-gray-900 mb-3">${poem.title}</h3>
            <div class="poem-content text-gray-700 whitespace-pre-line ${poem.content.length > 300 ? 'line-clamp-6' : ''}">
              ${poem.content}
            </div>
            ${poem.content.length > 300 ? '<button onclick="viewPoem(' + poem.id + ')" class="text-blue-600 font-semibold mt-2 hover:underline">Read more...</button>' : ''}
          </div>

          <!-- Engagement Stats -->
          <div class="flex items-center justify-between py-3 border-t border-gray-200">
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <span>
                <i class="fas fa-eye mr-1"></i>
                ${poem.view_count || 0} views
              </span>
              <span>
                <i class="fas fa-heart mr-1 text-red-500"></i>
                ${poem.like_count || 0} likes
              </span>
              <span>
                <i class="fas fa-star mr-1 text-yellow-500"></i>
                ${poem.average_rating ? poem.average_rating.toFixed(1) : '0.0'}
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-between pt-3 border-t border-gray-200">
            <button onclick="PoemFeed.likePoem(${poem.id})" class="flex-1 flex items-center justify-center space-x-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">
              <i class="far fa-heart"></i>
              <span class="font-semibold">Like</span>
            </button>
            <button onclick="viewPoem(${poem.id})" class="flex-1 flex items-center justify-center space-x-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">
              <i class="far fa-comment"></i>
              <span class="font-semibold">Comment</span>
            </button>
            <button onclick="PoemFeed.sharePoem(${poem.id})" class="flex-1 flex items-center justify-center space-x-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">
              <i class="far fa-share-square"></i>
              <span class="font-semibold">Share</span>
            </button>
          </div>
        </div>
      `;
    },

    /**
     * Setup infinite scroll
     */
    setupInfiniteScroll() {
      window.addEventListener('scroll', () => {
        if (this.loading || !this.hasMore) return;

        const scrollPosition = window.innerHeight + window.scrollY;
        const threshold = document.documentElement.scrollHeight - 500;

        if (scrollPosition >= threshold) {
          this.loadMorePoems();
        }
      });
    },

    /**
     * Change sort filter
     */
    changeSort(sort) {
      this.currentFilter.sort = sort;
      this.currentPage = 0;
      this.hasMore = true;
      document.getElementById('feedContainer').innerHTML = '';
      document.getElementById('endOfFeed').classList.add('hidden');
      this.loadMorePoems();
    },

    /**
     * Change language filter
     */
    changeLanguage(lang) {
      this.currentFilter.language = lang;
      this.currentPage = 0;
      this.hasMore = true;
      document.getElementById('feedContainer').innerHTML = '';
      document.getElementById('endOfFeed').classList.add('hidden');

      // Update button styles
      ['all', 'en', 'hi', 'mr'].forEach(l => {
        const btn = document.getElementById('lang-' + l);
        if (btn) {
          if ((l === 'all' && lang === '') || (l === lang)) {
            btn.className = 'px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover-lift';
          } else {
            btn.className = 'px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300';
          }
        }
      });

      this.loadMorePoems();
    },

    /**
     * Show/hide loading indicator
     */
    showLoading(show) {
      const indicator = document.getElementById('loadingIndicator');
      if (indicator) {
        indicator.classList.toggle('hidden', !show);
      }
    },

    /**
     * Show error message
     */
    showError() {
      const container = document.getElementById('feedContainer');
      if (this.currentPage === 0 && container) {
        container.innerHTML = `
          <div class="bg-white rounded-lg shadow-sm p-12 text-center">
            <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Failed to Load Poems</h3>
            <p class="text-gray-600 mb-4">Please try again later</p>
            <button onclick="location.reload()" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
              <i class="fas fa-redo mr-2"></i>Retry
            </button>
          </div>
        `;
      }
    },

    /**
     * Like a poem
     */
    async likePoem(poemId) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to like poems');
        showLogin();
        return;
      }

      try {
        await axios.post(API_BASE + '/poems/' + poemId + '/like', {}, {
          headers: { Authorization: 'Bearer ' + token }
        });
        alert('Poem liked!');
        // Reload feed to update like count
        this.currentPage = 0;
        this.hasMore = true;
        document.getElementById('feedContainer').innerHTML = '';
        this.loadMorePoems();
      } catch (error) {
        console.error('Failed to like poem:', error);
        alert('Failed to like poem');
      }
    },

    /**
     * Share a poem
     */
    sharePoem(poemId) {
      const url = window.location.origin + '?poem=' + poemId;
      if (navigator.share) {
        navigator.share({
          title: 'Check out this poem!',
          url: url
        });
      } else {
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      }
    },

    /**
     * Check auth and show create card
     */
    checkAuthAndShowCreateCard() {
      const token = localStorage.getItem('token');
      if (token) {
        document.getElementById('createPoemCard').classList.remove('hidden');
      }
    }
  };

  // Initialize
  PoemFeed.init();

  // Expose to global scope
  window.PoemFeed = PoemFeed;

})();
