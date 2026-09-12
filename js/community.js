// Community & Body Doubling Space for Mellow
// STRICTLY ZERO EMOJIS - Safe, low-pressure, supportive neurodivergent connection.

const Community = {
  activeCategory: 'all', // 'all', 'wins', 'tips', 'talk', 'share'
  posts: [],

  defaultPosts: [
    {
      id: 'post-1',
      author: 'Maya',
      avatarKey: 'avatar1',
      category: 'wins',
      categoryLabel: 'Tiny Win',
      timeAgo: '15m ago',
      content: 'Finally opened the document I have been avoiding for four days. Wrote two sentences and stopped. Feeling okay with that.',
      reactions: {
        hug: { count: 12, userReacted: false },
        star: { count: 8, userReacted: true },
        relate: { count: 19, userReacted: false },
        tea: { count: 5, userReacted: false }
      },
      comments: [
        { author: 'Elena', avatarKey: 'avatar4', text: 'Two sentences is a real start. Proud of you.' }
      ]
    },
    {
      id: 'post-2',
      author: 'Jordan',
      avatarKey: 'avatar3',
      category: 'tips',
      categoryLabel: 'Gentle Tip',
      timeAgo: '1h ago',
      content: 'Putting my phone in another room during the 15-minute timer completely removed the itch to check notifications. The Brown noise helped too.',
      reactions: {
        hug: { count: 7, userReacted: false },
        star: { count: 14, userReacted: false },
        relate: { count: 22, userReacted: true },
        tea: { count: 9, userReacted: false }
      },
      comments: []
    },
    {
      id: 'post-3',
      author: 'Sam',
      avatarKey: 'avatar2',
      category: 'talk',
      categoryLabel: 'Talk',
      timeAgo: '3h ago',
      content: 'Low-energy day today. Brain feels foggy like wet wool. Reminding myself that resting is productive maintenance, not giving up.',
      reactions: {
        hug: { count: 31, userReacted: true },
        star: { count: 6, userReacted: false },
        relate: { count: 28, userReacted: false },
        tea: { count: 24, userReacted: true }
      },
      comments: [
        { author: 'Liam', avatarKey: 'avatar5', text: 'Soft blankets and hot tea. Tomorrow is a brand new morning.' }
      ]
    }
  ],

  // Quiet Body Doubling participants
  bodyDoublers: [
    { name: 'Maya', activity: 'Reading chapter 2', avatarKey: 'avatar1' },
    { name: 'Alex', activity: 'Organizing desk corner', avatarKey: 'avatar3' },
    { name: 'Kai', activity: 'Drafting email', avatarKey: 'avatar2' },
    { name: 'Sam', activity: 'Tea break & resting', avatarKey: 'avatar5' }
  ],

  init() {
    try {
      const saved = localStorage.getItem('mellow_community_posts');
      this.posts = saved ? JSON.parse(saved) : this.defaultPosts;
    } catch (e) {
      this.posts = this.defaultPosts;
    }
    this.render();
  },

  save() {
    try {
      localStorage.setItem('mellow_community_posts', JSON.stringify(this.posts));
    } catch (e) {}
  },

  setCategory(category) {
    this.activeCategory = category;
    document.querySelectorAll('.comm-filter-pill').forEach(btn => {
      if (btn.getAttribute('data-cat') === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    this.renderFeed();
  },

  toggleReaction(postId, reactionType) {
    const post = this.posts.find(p => p.id === postId);
    if (!post || !post.reactions[reactionType]) return;

    const r = post.reactions[reactionType];
    if (r.userReacted) {
      r.count = Math.max(0, r.count - 1);
      r.userReacted = false;
    } else {
      r.count++;
      r.userReacted = true;
    }
    this.save();
    this.renderFeed();
  },

  addComment(postId, commentText) {
    if (!commentText || !commentText.trim()) return;
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;
    if (!post.comments) post.comments = [];

    const userProfile = App.getUserProfile();
    post.comments.push({
      author: userProfile.name,
      avatarKey: userProfile.avatarKey,
      photoUrl: userProfile.photoUrl || null,
      text: commentText.trim()
    });

    this.save();
    this.renderFeed();
  },

  openComposer(defaultCategory = 'wins') {
    const modal = document.getElementById('composer-modal');
    if (!modal) return;
    const categorySelect = document.getElementById('composer-category');
    if (categorySelect) categorySelect.value = defaultCategory;

    const userProfile = App.getUserProfile();
    const authorPreview = document.getElementById('composer-user-preview');
    if (authorPreview) {
      const avatarHtml = userProfile.photoUrl
        ? `<img src="${userProfile.photoUrl}" alt="${userProfile.name}" class="avatar-photo-circle">`
        : (Icons[userProfile.avatarKey] || Icons.avatar1);
      authorPreview.innerHTML = `
        <div class="composer-avatar">${avatarHtml}</div>
        <div class="composer-author-info">
          <span class="composer-name">${userProfile.name}</span>
          <span class="composer-badge">Sharing with community</span>
        </div>
      `;
    }

    const textarea = document.getElementById('composer-text');
    if (textarea) {
      textarea.value = '';
      setTimeout(() => textarea.focus(), 150);
    }
    modal.classList.add('active');
  },

  closeComposer() {
    const modal = document.getElementById('composer-modal');
    if (modal) modal.classList.remove('active');
  },

  submitPost() {
    const textarea = document.getElementById('composer-text');
    const categorySelect = document.getElementById('composer-category');
    if (!textarea || !textarea.value.trim()) return;

    const userProfile = App.getUserProfile();
    const cat = categorySelect ? categorySelect.value : 'wins';
    const labelMap = {
      wins: 'Tiny Win',
      tips: 'Gentle Tip',
      talk: 'Talk',
      share: 'Quiet Share'
    };

    const newPost = {
      id: 'post-' + Date.now(),
      author: userProfile.name,
      avatarKey: userProfile.avatarKey,
      photoUrl: userProfile.photoUrl || null,
      category: cat,
      categoryLabel: labelMap[cat] || 'Share',
      timeAgo: 'Just now',
      content: textarea.value.trim(),
      reactions: {
        hug: { count: 1, userReacted: true },
        star: { count: 0, userReacted: false },
        relate: { count: 0, userReacted: false },
        tea: { count: 0, userReacted: false }
      },
      comments: []
    };

    this.posts.unshift(newPost);
    this.save();
    this.closeComposer();
    this.renderFeed();
    App.setNotificationMessage("Your note was shared warmly.");
  },

  render() {
    this.renderBodyDoubling();
    this.renderFeed();
  },

  renderBodyDoubling() {
    const container = document.getElementById('body-doubling-scroll');
    if (!container) return;

    const userProfile = App.getUserProfile();
    const allDoublers = [
      { name: `${userProfile.name} (You)`, activity: 'Focusing quietly', avatarKey: userProfile.avatarKey, photoUrl: userProfile.photoUrl, isSelf: true },
      ...this.bodyDoublers
    ];

    container.innerHTML = allDoublers.map(d => {
      const avatarHtml = (d.isSelf && d.photoUrl)
        ? `<img src="${d.photoUrl}" alt="${d.name}" class="avatar-photo-circle">`
        : (Icons[d.avatarKey] || Icons.avatar1);
      return `
        <div class="doubler-card ${d.isSelf ? 'is-self' : ''}">
          <div class="doubler-avatar-wrap">
            <div class="doubler-avatar">${avatarHtml}</div>
            <span class="focus-pulse-dot"></span>
          </div>
          <span class="doubler-name">${d.name}</span>
          <span class="doubler-activity">${d.activity}</span>
        </div>
      `;
    }).join('');
  },

  renderFeed() {
    const container = document.getElementById('community-feed-container');
    if (!container) return;

    const filtered = this.activeCategory === 'all'
      ? this.posts
      : this.posts.filter(p => p.category === this.activeCategory);

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-feed-state">
          <p class="subtle-note">No posts in this category yet. Be the first to share a tiny thought.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(post => {
      const avatarHtml = post.photoUrl
        ? `<img src="${post.photoUrl}" alt="${post.author}" class="avatar-photo-circle">`
        : (Icons[post.avatarKey] || Icons.avatar1);
      return `
        <div class="community-post-card">
          <div class="post-header">
            <div class="post-author-wrap">
              <div class="post-avatar">${avatarHtml}</div>
              <div class="post-author-meta">
                <span class="post-author-name">${post.author}</span>
                <span class="post-time">${post.timeAgo}</span>
              </div>
            </div>
            <span class="post-cat-tag ${post.category}">${post.categoryLabel}</span>
          </div>

          <p class="post-text-body">${post.content}</p>

          <div class="post-reactions-bar">
            <button class="reaction-pill ${post.reactions.hug.userReacted ? 'active' : ''}" onclick="Community.toggleReaction('${post.id}', 'hug')" title="Warm hug">
              <span class="reaction-icon">${Icons.hug}</span>
              <span class="reaction-count">${post.reactions.hug.count}</span>
            </button>
            <button class="reaction-pill ${post.reactions.star.userReacted ? 'active' : ''}" onclick="Community.toggleReaction('${post.id}', 'star')" title="Proud of you">
              <span class="reaction-icon">${Icons.star}</span>
              <span class="reaction-count">${post.reactions.star.count}</span>
            </button>
            <button class="reaction-pill ${post.reactions.relate.userReacted ? 'active' : ''}" onclick="Community.toggleReaction('${post.id}', 'relate')" title="So relatable">
              <span class="reaction-icon">${Icons.relate}</span>
              <span class="reaction-count">${post.reactions.relate.count}</span>
            </button>
            <button class="reaction-pill ${post.reactions.tea.userReacted ? 'active' : ''}" onclick="Community.toggleReaction('${post.id}', 'tea')" title="Sending tea">
              <span class="reaction-icon">${Icons.tea}</span>
              <span class="reaction-count">${post.reactions.tea.count}</span>
            </button>
          </div>

          ${post.comments && post.comments.length > 0 ? `
            <div class="post-comments-wrap">
              ${post.comments.map(c => {
                const commentAvatar = c.photoUrl
                  ? `<img src="${c.photoUrl}" alt="${c.author}" class="avatar-photo-circle">`
                  : (Icons[c.avatarKey] || Icons.avatar4);
                return `
                  <div class="comment-item">
                    <span class="comment-avatar">${commentAvatar}</span>
                    <div class="comment-bubble">
                      <span class="comment-author">${c.author}</span>
                      <span class="comment-text">${c.text}</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : ''}

          <div class="post-reply-box">
            <input type="text" placeholder="Write a supportive reply..." class="mellow-input-small" onkeydown="if(event.key==='Enter') { Community.addComment('${post.id}', this.value); this.value=''; }">
          </div>
        </div>
      `;
    }).join('');
  }
};
