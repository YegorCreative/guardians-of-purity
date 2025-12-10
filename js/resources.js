// Modal Functions
function openModal(modalId) {
  console.log('Opening modal:', modalId);
  const modal = document.getElementById(modalId);
  console.log('Modal element:', modal);
  
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    console.log('Modal active class added:', modalId);
    
    // Initialize specific modal content if needed
    if (modalId === 'progressTracker') {
      loadTrackerData();
    } else if (modalId === 'scriptureMemory') {
      initializeScriptureCards();
    }
  } else {
    console.error('Modal not found:', modalId);
  }
}

function closeModal(modalId) {
  console.log('Closing modal:', modalId);
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    console.log('Modal active class removed:', modalId);
  }
}

// Tool Card Toggle Function
function toggleToolCard(header) {
  const toolCard = header.parentElement;
  const isActive = toolCard.classList.contains('active');
  
  // Toggle active class
  if (isActive) {
    toolCard.classList.remove('active');
  } else {
    toolCard.classList.add('active');
    
    // Initialize specific tool content if needed
    const toolBody = toolCard.querySelector('.tool-body');
    if (toolBody.querySelector('#scriptureCards') && !toolBody.dataset.initialized) {
      initializeScriptureCards();
      toolBody.dataset.initialized = 'true';
    }
    if (toolBody.querySelector('#daysClean') && !toolBody.dataset.initialized) {
      loadTrackerData();
      toolBody.dataset.initialized = 'true';
    }
  }
}

// Close modal when clicking outside
window.onclick = function(event) {
  if (event.target.classList && event.target.classList.contains('modal')) {
    event.target.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// Close modal with ESC key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const activeModal = document.querySelector('.modal.active');
    if (activeModal) {
      activeModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }
});

// Freedom Roadmap - Accordion Functions
function toggleAccordion(header) {
  const content = header.nextElementSibling;
  const isActive = header.classList.contains('active');
  
  // Close all accordions
  document.querySelectorAll('.phase-header').forEach(h => {
    h.classList.remove('active');
    h.nextElementSibling.classList.remove('active');
  });
  
  // Open clicked accordion if it wasn't active
  if (!isActive) {
    header.classList.add('active');
    content.classList.add('active');
  }
}

// Prayer Journal - Tab Functions
function showPrayerTab(tabName) {
  // Hide all prayer contents
  document.querySelectorAll('.prayer-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Remove active class from all tabs
  document.querySelectorAll('.prayer-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected content
  const selectedContent = document.getElementById(tabName);
  if (selectedContent) {
    selectedContent.classList.add('active');
  }
  
  // Add active class to clicked tab
  event.target.classList.add('active');
}

function copyPrayer(tabName) {
  const textarea = document.querySelector(`#${tabName} .prayer-input`);
  if (textarea && textarea.value.trim()) {
    navigator.clipboard.writeText(textarea.value).then(() => {
      const button = event.target;
      const originalText = button.textContent;
      button.textContent = '✓ Copied!';
      button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
      }, 2000);
    });
  } else {
    alert('Please write your prayer first!');
  }
}

// Progress Tracker Functions
function loadTrackerData() {
  // Load days clean
  const daysClean = localStorage.getItem('daysClean') || 0;
  document.getElementById('daysClean').value = daysClean;
  updateDaysDisplay(daysClean);
  
  // Load triggers
  const triggers = JSON.parse(localStorage.getItem('triggers') || '[]');
  document.querySelectorAll('.trigger-check').forEach(checkbox => {
    if (triggers.includes(checkbox.dataset.trigger)) {
      checkbox.checked = true;
    }
  });
  updateTriggersCount();
  
  // Load victories
  loadVictories();
  
  // Update stats
  updateStats();
}

// Update days input
document.addEventListener('DOMContentLoaded', function() {
  const daysInput = document.getElementById('daysClean');
  if (daysInput) {
    daysInput.addEventListener('input', function() {
      localStorage.setItem('daysClean', this.value);
      updateDaysDisplay(this.value);
      updateStats();
    });
  }
  
  // Add trigger checkbox listeners
  document.querySelectorAll('.trigger-check').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      saveTriggers();
      updateTriggersCount();
      updateStats();
    });
  });
});

function updateDaysDisplay(days) {
  const badges = document.querySelectorAll('.badge');
  badges.forEach(badge => {
    const requiredDays = parseInt(badge.dataset.days);
    if (parseInt(days) >= requiredDays) {
      badge.classList.add('achieved');
    } else {
      badge.classList.remove('achieved');
    }
  });
}

function saveTriggers() {
  const triggers = [];
  document.querySelectorAll('.trigger-check:checked').forEach(checkbox => {
    triggers.push(checkbox.dataset.trigger);
  });
  localStorage.setItem('triggers', JSON.stringify(triggers));
}

function updateTriggersCount() {
  const count = document.querySelectorAll('.trigger-check:checked').length;
  const statElement = document.getElementById('statTriggers');
  if (statElement) {
    statElement.textContent = count;
  }
}

function saveVictory() {
  const textarea = document.getElementById('victoryLog');
  if (!textarea.value.trim()) {
    alert('Please write about your victory first!');
    return;
  }
  
  const victories = JSON.parse(localStorage.getItem('victories') || '[]');
  const newVictory = {
    id: Date.now(),
    text: textarea.value,
    date: new Date().toLocaleDateString()
  };
  
  victories.unshift(newVictory);
  localStorage.setItem('victories', JSON.stringify(victories));
  
  textarea.value = '';
  loadVictories();
  updateStats();
}

function loadVictories() {
  const victories = JSON.parse(localStorage.getItem('victories') || '[]');
  const container = document.getElementById('victoryList');
  
  if (!container) return;
  
  container.innerHTML = '';
  
  victories.forEach(victory => {
    const entry = document.createElement('div');
    entry.className = 'victory-entry';
    entry.innerHTML = `
      <div class="victory-entry-date">${victory.date}</div>
      <div class="victory-entry-text">${victory.text}</div>
      <button class="victory-entry-delete" onclick="deleteVictory(${victory.id})">&times;</button>
    `;
    container.appendChild(entry);
  });
}

function deleteVictory(id) {
  const victories = JSON.parse(localStorage.getItem('victories') || '[]');
  const filtered = victories.filter(v => v.id !== id);
  localStorage.setItem('victories', JSON.stringify(filtered));
  loadVictories();
  updateStats();
}

function updateStats() {
  const days = localStorage.getItem('daysClean') || 0;
  const victories = JSON.parse(localStorage.getItem('victories') || '[]');
  const triggers = JSON.parse(localStorage.getItem('triggers') || '[]');
  
  const statDays = document.getElementById('statDays');
  const statVictories = document.getElementById('statVictories');
  const statTriggers = document.getElementById('statTriggers');
  
  if (statDays) statDays.textContent = days;
  if (statVictories) statVictories.textContent = victories.length;
  if (statTriggers) statTriggers.textContent = triggers.length;
}

function resetTracker() {
  if (confirm('Are you sure you want to reset all tracker data? This cannot be undone.')) {
    localStorage.removeItem('daysClean');
    localStorage.removeItem('triggers');
    localStorage.removeItem('victories');
    loadTrackerData();
  }
}

// Scripture Memory Functions
const scriptureVerses = [
  {
    category: 'temptation',
    situation: 'When facing temptation',
    verse: 'No temptation has overtaken you except what is common to mankind. And God is faithful; he will not let you be tempted beyond what you can bear. But when you are tempted, he will also provide a way out so that you can endure it.',
    reference: '1 Corinthians 10:13'
  },
  {
    category: 'temptation',
    situation: 'In the moment of struggle',
    verse: 'Submit yourselves, then, to God. Resist the devil, and he will flee from you.',
    reference: 'James 4:7'
  },
  {
    category: 'temptation',
    situation: 'When desires feel overwhelming',
    verse: 'So I say, walk by the Spirit, and you will not gratify the desires of the flesh.',
    reference: 'Galatians 5:16'
  },
  {
    category: 'identity',
    situation: 'When feeling condemned',
    verse: 'Therefore, there is now no condemnation for those who are in Christ Jesus.',
    reference: 'Romans 8:1'
  },
  {
    category: 'identity',
    situation: 'When questioning your worth',
    verse: 'For you created my inmost being; you knit me together in my mother\'s womb. I praise you because I am fearfully and wonderfully made.',
    reference: 'Psalm 139:13-14'
  },
  {
    category: 'identity',
    situation: 'Remembering who you are',
    verse: 'But you are a chosen people, a royal priesthood, a holy nation, God\'s special possession.',
    reference: '1 Peter 2:9'
  },
  {
    category: 'renewal',
    situation: 'For a fresh start',
    verse: 'Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!',
    reference: '2 Corinthians 5:17'
  },
  {
    category: 'renewal',
    situation: 'Transforming your mind',
    verse: 'Do not conform to the pattern of this world, but be transformed by the renewing of your mind.',
    reference: 'Romans 12:2'
  },
  {
    category: 'renewal',
    situation: 'When you\'ve fallen',
    verse: 'If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.',
    reference: '1 John 1:9'
  },
  {
    category: 'renewal',
    situation: 'Seeking purity',
    verse: 'How can a young person stay on the path of purity? By living according to your word.',
    reference: 'Psalm 119:9'
  },
  {
    category: 'victory',
    situation: 'Claiming victory',
    verse: 'But thanks be to God! He gives us the victory through our Lord Jesus Christ.',
    reference: '1 Corinthians 15:57'
  },
  {
    category: 'victory',
    situation: 'In spiritual battle',
    verse: 'For though we live in the world, we do not wage war as the world does. The weapons we fight with are not the weapons of the world.',
    reference: '2 Corinthians 10:3-4'
  },
  {
    category: 'victory',
    situation: 'Standing firm',
    verse: 'Be alert and of sober mind. Your enemy the devil prowls around like a roaring lion looking for someone to devour. Resist him, standing firm in the faith.',
    reference: '1 Peter 5:8-9'
  },
  {
    category: 'temptation',
    situation: 'Guarding your eyes',
    verse: 'I made a covenant with my eyes not to look lustfully at a young woman.',
    reference: 'Job 31:1'
  },
  {
    category: 'temptation',
    situation: 'Taking thoughts captive',
    verse: 'We demolish arguments and every pretension that sets itself up against the knowledge of God, and we take captive every thought to make it obedient to Christ.',
    reference: '2 Corinthians 10:5'
  },
  {
    category: 'identity',
    situation: 'Your calling to holiness',
    verse: 'For God did not call us to be impure, but to live a holy life.',
    reference: '1 Thessalonians 4:7'
  },
  {
    category: 'renewal',
    situation: 'God\'s power in you',
    verse: 'His divine power has given us everything we need for a godly life through our knowledge of him who called us by his own glory and goodness.',
    reference: '2 Peter 1:3'
  },
  {
    category: 'victory',
    situation: 'Overcoming the world',
    verse: 'For everyone born of God overcomes the world. This is the victory that has overcome the world, even our faith.',
    reference: '1 John 5:4'
  },
  {
    category: 'temptation',
    situation: 'Fleeing from sin',
    verse: 'Flee from sexual immorality. All other sins a person commits are outside the body, but whoever sins sexually, sins against their own body.',
    reference: '1 Corinthians 6:18'
  },
  {
    category: 'renewal',
    situation: 'God\'s faithfulness',
    verse: 'Because of the Lord\'s great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.',
    reference: 'Lamentations 3:22-23'
  }
];

function initializeScriptureCards() {
  const container = document.getElementById('scriptureCards');
  if (!container || container.children.length > 0) return; // Already initialized
  
  container.innerHTML = '';
  
  scriptureVerses.forEach((verse, index) => {
    const card = document.createElement('div');
    card.className = 'scripture-card';
    card.dataset.category = verse.category;
    card.onclick = function() { this.classList.toggle('flipped'); };
    
    card.innerHTML = `
      <div class="scripture-card-inner">
        <div class="scripture-card-front">
          <div class="scripture-category">${verse.category.toUpperCase()}</div>
          <div class="scripture-situation">${verse.situation}</div>
        </div>
        <div class="scripture-card-back">
          <div class="scripture-text">"${verse.verse}"</div>
          <div class="scripture-reference">${verse.reference}</div>
        </div>
      </div>
    `;
    
    container.appendChild(card);
  });
}

function filterScriptures(category) {
  // Update active filter button
  document.querySelectorAll('.scripture-filter').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Filter cards
  const cards = document.querySelectorAll('.scripture-card');
  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

function randomVerse() {
  const visibleCards = Array.from(document.querySelectorAll('.scripture-card'))
    .filter(card => card.style.display !== 'none');
  
  if (visibleCards.length === 0) return;
  
  // Remove flipped class from all cards
  document.querySelectorAll('.scripture-card').forEach(card => {
    card.classList.remove('flipped');
  });
  
  // Pick random card and flip it
  const randomIndex = Math.floor(Math.random() * visibleCards.length);
  const randomCard = visibleCards[randomIndex];
  
  // Scroll to card
  randomCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // Flip after scroll
  setTimeout(() => {
    randomCard.classList.add('flipped');
  }, 500);
}

// Accountability Guide - Tab Functions
function showGuideTab(tabName) {
  // Hide all guide contents
  document.querySelectorAll('.guide-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Remove active class from all tabs
  document.querySelectorAll('.guide-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected content
  const selectedContent = document.getElementById(tabName);
  if (selectedContent) {
    selectedContent.classList.add('active');
  }
  
  // Add active class to clicked tab
  event.target.classList.add('active');
}

function copyQuestions() {
  const questions = `Weekly Accountability Questions:

Direct Questions:
1. Have you viewed pornography since we last talked?
2. Have you been completely honest with me just now?
3. Have you been spending daily time in God's Word and prayer?
4. What temptations have you faced this week?
5. Have you put yourself in compromising situations?

Deeper Questions:
1. What emotions have been triggering temptation? (HALT: Hungry, Angry, Lonely, Tired)
2. Have you been isolating yourself or withdrawing from community?
3. Are you using your accountability software consistently?
4. What victories can you celebrate from this week?
5. How can I pray for you specifically this week?`;
  
  navigator.clipboard.writeText(questions).then(() => {
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '✓ Copied!';
    button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
    }, 2000);
  });
}

function copyTemplate() {
  const template = `Weekly Accountability Check-In Template:

1. Opening Prayer
   Pray for honesty, grace, and God's presence

2. Direct Questions (5 min)
   Go through the core accountability questions

3. Victories & Struggles (10 min)
   • What went well this week?
   • What were the hardest moments?
   • What patterns are you noticing?

4. Action Steps (5 min)
   • What specific changes will you make this week?
   • Are there new safeguards needed?
   • What practical help do you need?

5. Prayer Requests (5 min)
   Pray specifically for upcoming temptations and situations

6. Closing Prayer
   Pray for strength and God's power for the week ahead`;
  
  navigator.clipboard.writeText(template).then(() => {
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '✓ Copied!';
    button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
    }, 2000);
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Page loaded, initializing modals...');
  
  // Add click handlers to download buttons
  document.querySelectorAll('.download-card').forEach(card => {
    card.style.cursor = 'pointer';
  });
  
  console.log('Found', document.querySelectorAll('.download-card').length, 'download cards');
  console.log('Found', document.querySelectorAll('.modal').length, 'modals');
});
