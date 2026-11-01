const cards = document.getElementById('practicalCards');
const searchInput = document.getElementById('searchInput');
const languageFilter = document.getElementById('languageFilter');
const codeTitle = document.getElementById('codeTitle');
const codeDescription = document.getElementById('codeDescription');
const codeOutput = document.getElementById('codeOutput');
const languagePill = document.getElementById('languagePill');
const lineCount = document.getElementById('lineCount');
const copyButton = document.getElementById('copyButton');
const copyStatus = document.getElementById('copyStatus');
let selectedId = null;

document.getElementById('count').textContent = practicals.length;
document.getElementById('resultCount').textContent = practicals.length + ' items';

function renderCards() {
  const query = searchInput.value.toLowerCase().trim();
  const language = languageFilter.value;
  const filtered = practicals.filter(item =>
    (language === 'all' || item.language === language) &&
    (item.title + ' ' + item.description + ' ' + item.language).toLowerCase().includes(query)
  );
  cards.innerHTML = '';
  document.getElementById('resultCount').textContent = filtered.length + ' items';
  if (!filtered.length) {
    cards.innerHTML = '<div class="empty">No practicals found. Try another search.</div>';
    return;
  }
  filtered.forEach(item => {
    const button = document.createElement('button');
    button.className = 'practical-card' + (item.id === selectedId ? ' selected' : '');
    button.type = 'button';
    const top = document.createElement('div');
    top.className = 'card-top';
    const title = document.createElement('span');
    title.className = 'card-title';
    title.textContent = item.title;
    const tag = document.createElement('span');
    tag.className = 'card-language';
    tag.textContent = item.language;
    const desc = document.createElement('div');
    desc.className = 'card-desc';
    desc.textContent = item.description;
    top.append(title, tag);
    button.append(top, desc);
    button.addEventListener('click', () => selectPractical(item.id));
    cards.appendChild(button);
  });
}

function selectPractical(id) {
  const item = practicals.find(p => p.id === id);
  if (!item) return;
  selectedId = id;
  codeTitle.textContent = item.title;
  codeDescription.textContent = item.description;
  codeOutput.textContent = item.code;
  languagePill.textContent = item.language;
  lineCount.textContent = item.code.split('\n').length + ' lines';
  copyButton.disabled = false;
  copyStatus.textContent = '';
  renderCards();
}

copyButton.addEventListener('click', async () => {
  const item = practicals.find(p => p.id === selectedId);
  if (!item) return;
  try {
    await navigator.clipboard.writeText(item.code);
    copyStatus.textContent = 'Code copied successfully!';
  } catch (error) {
    const temp = document.createElement('textarea');
    temp.value = item.code;
    document.body.appendChild(temp);
    temp.select();
    const copied = document.execCommand('copy');
    temp.remove();
    copyStatus.textContent = copied ? 'Code copied successfully!' : 'Copy failed. Select the code and copy manually.';
  }
});

searchInput.addEventListener('input', renderCards);
languageFilter.addEventListener('change', renderCards);
document.getElementById('allButton').addEventListener('click', () => {
  searchInput.value = '';
  languageFilter.value = 'all';
  renderCards();
});
renderCards();
if (practicals.length) selectPractical(practicals[0].id);
