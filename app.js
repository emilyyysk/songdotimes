/* ============================================================
   SONGDO TIMES — app (router + rendering)
   ============================================================ */
(function(){
  const A = window.ARTICLES, I = window.ISSUES, L = window.LOCATIONS, F = window.FOUNDER;
  const root = document.getElementById('app');

  const issueById = id => I.find(x => x.id === id);
  const artById = id => A.find(x => x.id === id);
  const locById = id => L.find(x => x.id === id);
  const artsOf = issueId => A.filter(a => a.issue === issueId);
  const artsAtLoc = locId => A.filter(a => a.loc === locId);
  const featuredOf = issueId => artsOf(issueId).find(a => a.featured) || artsOf(issueId)[0];
  const latest = I[0];
  const pad = n => String(n).padStart(2,'0');

  /* ---------- small components ---------- */
  function ph(cap, cls, img){
    if(img){
      const lazy = (cls||'').includes('ph--dark') ? 'eager' : 'lazy';
      return `<div class="ph ph--photo ${cls||''}"><img class="ph__img" src="${img}" alt="${cap}" loading="${lazy}"></div>`;
    }
    return `<div class="ph ${cls||''}"><span class="ph__tag">Image</span><span class="ph__cap">${cap}</span></div>`;
  }
  function card(a){
    return `<article class="card" data-art="${a.id}">
      <div class="card__media">${ph(a.photo, '', a.img)}</div>
      <span class="cat">${a.cat}</span>
      <h3>${a.title}</h3>
      <p class="card__dek">${a.dek}</p>
      <div class="card__foot">
        <div class="byline">${a.author}${a.org?` &middot; ${a.org}`:''}</div>
        <div class="card__meta">${a.date} &middot; ${a.read} min</div>
      </div>
    </article>`;
  }

  /* article body blocks */
  function block(b){
    if(typeof b === 'string') return `<p>${b}</p>`;
    if(b.h) return `<h2 class="a-h">${b.h}</h2>`;
    if(b.p) return `<p>${b.p}</p>`;
    if(b.note) return `<p class="a-note">${b.note}</p>`;
    if(b.steps) return `<ol class="a-steps">${b.steps.map(s=>`<li>${s}</li>`).join('')}</ol>`;
    if(b.qa) return `<div class="a-qa">${b.qa.map(x=>`<div class="qa"><p class="qa-q">${x.q}</p><p class="qa-a">${x.a}</p></div>`).join('')}</div>`;
    if(b.places) return `<div class="a-places">${b.places.map(p=>`<div class="place">${p.img?`<div class="place__img"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>`:''}<h3>${p.name}</h3><div class="place-row"><span class="place-k">Where</span><span>${p.addr}</span></div><div class="place-row"><span class="place-k">Hours</span><span>${p.hours}</span></div>${p.note?`<p class="place-note">${p.note}</p>`:''}</div>`).join('')}</div>`;
    if(b.review) return `<div class="review${b.review.img?'':' review--noimg'}">
        ${b.review.img?`<div class="review__img"><img src="${b.review.img}" alt="${b.review.name}" loading="lazy"></div>`:''}
        <div class="review__body">
          <h3 class="review__name">${b.review.name}</h3>
          <p class="review__text">${b.review.text}</p>
        </div>
      </div>`;
    if(b.gallery) return `<div class="a-gallery">${b.gallery.map(g=>`<figure class="a-gal"><div class="a-gal__img"><img src="${g.img}" alt="${g.cap||''}" loading="lazy"></div>${g.cap?`<figcaption>${g.cap}</figcaption>`:''}</figure>`).join('')}</div>`;
    if(b.fig) return `<figure class="a-fig"><div class="a-fig__img"><img src="${b.fig.img}" alt="${b.fig.cap||''}" loading="lazy"></div>${b.fig.cap?`<figcaption>${b.fig.cap}</figcaption>`:''}</figure>`;
    return '';
  }

  /* ---------- HOME ---------- */
  function renderHome(){
    const iss = latest;
    const feats = artsOf(iss.id);            // all articles in the latest issue
    const others = A.filter(a => a.issue !== iss.id);  // older issues
    const slide = (a) => `<div class="feature__slide">
        <div class="feature__in">
          <div class="feature__text">
            <span class="cat cat--on-dark">${a.cat} &middot; ${iss.month} Cover</span>
            <h1 class="feature__title">${a.title}</h1>
            <p class="feature__dek">${a.dek}</p>
            <div class="feature__foot">
              <span class="byline byline--on-dark">${a.author}${a.org?` &middot; ${a.org}`:''}<span class="sep">/</span>${a.date}<span class="sep">/</span>${a.read} min read</span>
              <a class="btn-read" data-art="${a.id}">Read the story <span class="arr">&rarr;</span></a>
            </div>
          </div>
          <div class="feature__media" data-art="${a.id}">${ph(a.photo, 'ph--dark', a.img)}</div>
        </div>
      </div>`;
    const multi = feats.length > 1;
    return `<div class="view view--flush">
      <div class="issue-bar">
        <div class="issue-bar__id">
          <span class="issue-bar__no">Issue No. ${pad(iss.no)}</span>
          <span class="issue-bar__date">${iss.month} ${iss.year}</span>
        </div>
        <span class="issue-bar__theme">&ldquo;${iss.theme}&rdquo;</span>
        <p class="issue-bar__note">${iss.note}</p>
      </div>
    </div>

    <section class="feature"${multi?' data-carousel':''}>
      <div class="feature__viewport">
        <div class="feature__track" id="featTrack">${feats.map(slide).join('')}</div>
      </div>
      ${multi ? `<div class="feature__nav">
        <button class="feat-arrow" data-feat="prev" aria-label="Previous">&larr;</button>
        <div class="feat-dots">${feats.map((a,i)=>`<button class="feat-dot${i===0?' active':''}" data-feat="${i}" aria-label="${a.title}"></button>`).join('')}</div>
        <button class="feat-arrow" data-feat="next" aria-label="Next">&rarr;</button>
        <span class="feat-count"><b id="featNum">1</b> / ${feats.length} &middot; This Issue</span>
      </div>` : ''}
    </section>

    <div class="view">
      <div class="section-head"><h2>More Stories</h2><span class="label" data-route="archive" style="cursor:pointer">All issues &rarr;</span></div>
      <div class="grid">${others.map(card).join('')}</div>
    </div>`;
  }

  /* ---------- ARCHIVE ---------- */
  function renderArchive(){
    return `<div class="view">
      <header class="page-head">
        <span class="label">The Archive</span>
        <h1 class="page-title">Every Issue, by Month</h1>
        <p class="page-lead">Songdo Times publishes once a month. Browse the full run below — newest first.</p>
      </header>
      <div class="month-rail">
        ${I.map(iss => {
          const arts = artsOf(iss.id);
          return `<section class="month-block">
            <div class="month-block__head">
              <span class="month-block__no">No.${pad(iss.no)}</span>
              <span class="month-block__num">${iss.month}</span>
              <span class="month-block__en">${iss.year}</span>
              <span class="month-block__theme">&ldquo;${iss.theme}&rdquo;</span>
              <span class="label month-block__count">${arts.length} stories</span>
            </div>
            <div class="rows">
              ${arts.map(a => `<div class="row" data-art="${a.id}">
                <div class="row__thumb">${ph(a.photo, '', a.img)}</div>
                <div class="row__body">
                  <h4>${a.title}</h4>
                  <div class="row__meta">${a.author}${a.org?` <span class="sep">/</span> ${a.org}`:''} <span class="sep">/</span> ${a.date}</div>
                </div>
                <div class="row__cat"><span class="cat">${a.cat}</span></div>
              </div>`).join('')}
            </div>
          </section>`;
        }).join('')}
      </div>
    </div>`;
  }

  /* ---------- ARTICLE ---------- */
  function renderArticle(id){
    const a = artById(id); if(!a) return renderHome();
    const iss = issueById(a.issue);
    const loc = a.loc ? locById(a.loc) : null;
    const related = A.filter(x => x.id !== a.id && (x.issue === a.issue || x.cat === a.cat)).slice(0,3);
    return `<div class="view view--narrow">
      <a class="backlink" data-route="archive">&larr; Issue No. ${pad(iss.no)} &middot; ${iss.theme}</a>
      <header class="article-hd">
        <span class="cat">${a.cat}</span>
        <h1>${a.title}</h1>
        <div class="byline">By ${a.author}${a.org?` &middot; ${a.org}`:''}<span class="sep">/</span>${a.date}<span class="sep">/</span>${a.read} min read</div>
      </header>
    </div>
    <div class="view" style="padding-top:0">
      <div class="article__hero">${ph(a.photo, '', a.img)}</div>
    </div>
    <div class="view view--narrow" style="padding-top:0">
      <div class="article__body">
        <p class="dek">${a.dek}</p>
        <div class="article__prose">${a.body.map(block).join('')}</div>
      </div>
      <div class="article__foot">
        <div class="byline">&copy; ${iss.year} Songdo Times &mdash; ${a.author}</div>
      </div>
    </div>
    <div class="view readnext">
      <div class="section-head"><h2>Read Next</h2><span class="label">More stories</span></div>
      <div class="grid">${related.map(card).join('')}</div>
    </div>`;
  }

  /* ---------- MAP ---------- */
  function renderMap(){
    const roads = [25,42,58,75].map(t=>`<span class="geo geo-road road-h" style="top:${t}%"></span>`).join('')
                + [28,46,64].map(l=>`<span class="geo geo-road road-v" style="left:${l}%"></span>`).join('');
    return `<div class="view">
      <header class="page-head">
        <span class="label">The Map</span>
        <h1 class="page-title">Songdo, Story by Story</h1>
        <p class="page-lead">Every place that has appeared in our pages, in one view. Tap a pin or a name to jump to the story it belongs to.</p>
      </header>
      <div class="map-wrap">
        <div class="map-canvas" id="mapCanvas">
          <span class="geo geo-water"></span>
          <span class="geo geo-land"></span>
          ${roads}
          <span class="geo geo-park"></span>
          <span class="geo geo-canal"></span>
          ${L.map((l,i)=>`<div class="pin" data-loc="${l.id}" style="left:${l.x}%;top:${l.y}%">
              <div class="pin__dot"><span>${i+1}</span></div>
              <div class="pin__label">${l.name}</div>
            </div>`).join('')}
        </div>
        <div class="loc-list">
          <h3>Places</h3>
          ${L.map((l,i)=>{
            const c = artsAtLoc(l.id).length;
            return `<div class="loc" data-loc="${l.id}">
              <span class="loc__n">${pad(i+1)}</span>
              <div><div class="loc__name">${l.name}</div><div class="loc__type">${l.type}</div></div>
              <span class="loc__cnt">${c} ${c===1?'story':'stories'}</span>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>`;
  }

  /* ---------- FOUNDER ---------- */
  function renderFounder(){
    const bio = F.bio.map(p => (typeof p === 'string')
      ? `<p>${p}</p>`
      : `<div class="bio-pair"><p class="bio-en">${p.en}</p><p class="bio-ko">${p.ko}</p></div>`
    ).join('');
    const team = F.team ? `<div class="team">
        <span class="label">The Reporters</span>
        <ul class="team__list">${F.team.map(m=>`<li><span class="team__name">${m.name}</span><span class="team__role">${m.role}</span></li>`).join('')}</ul>
      </div>` : '';
    return `<div class="view">
      <div class="founder">
        <div class="founder__media">${ph(F.photo)}</div>
        <div class="founder__text">
          <span class="cat founder__role">${F.role}</span>
          <h1>${F.name}${F.nameKo?` <span class="founder__name-ko">${F.nameKo}</span>`:''}</h1>
          <div class="founder__bio">${bio}</div>
          ${team}
          <div class="founder__sign">${F.sign}</div>
        </div>
      </div>
    </div>`;
  }

  /* ---------- CONTACT ---------- */
  function renderContact(){
    return `<div class="view">
      <div class="contact">
        <div>
          <header class="page-head" style="margin-bottom:30px">
            <span class="label">Get in Touch</span>
            <h1 class="page-title">Contact</h1>
            <p class="page-lead">Tips, contributions, and advertising inquiries are always welcome. Songdo Times publishes one issue a month.</p>
          </header>
          <div class="cfield"><span class="label">Email</span><a href="mailto:songdotimes@gmail.com">songdotimes@gmail.com</a></div>
          <div class="cfield"><span class="label">Phone</span><a href="tel:+8203228326506">032 832 6506</a></div>
          <div class="cfield"><span class="label">Where</span><p>Songdo-dong, Yeonsu-gu, Incheon</p></div>
        </div>
        <div class="subscribe">
          <h3>Every month, to your inbox.</h3>
          <p>Be the first to read each new issue. We never send ads.</p>
          <form class="sub-form" onsubmit="return false">
            <input type="email" placeholder="Your email address" aria-label="Email address">
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
    </div>`;
  }

  /* ---------- router ---------- */
  const routes = {
    home: renderHome, archive: renderArchive,
    founder: renderFounder, contact: renderContact,
  };

  function parse(){
    const h = (location.hash || '#home').slice(1);
    const [name, arg] = h.split('/');
    return { name, arg };
  }

  function navActive(name){
    document.querySelectorAll('.nav a').forEach(el=>{
      el.classList.toggle('active', el.dataset.route === name);
    });
  }

  function render(){
    const { name, arg } = parse();
    let html, navKey = name;
    if(name === 'article'){ html = renderArticle(arg); navKey = 'home'; }
    else if(routes[name]){ html = routes[name](); }
    else { html = renderHome(); navKey = 'home'; }
    root.innerHTML = html;
    navActive(navKey);
    window.scrollTo(0,0);
    wireFeature();
  }

  /* feature carousel */
  function wireFeature(){
    const track = document.getElementById('featTrack');
    if(!track || !track.parentElement.parentElement.hasAttribute('data-carousel')) return;
    const slides = [...track.children];
    const n = slides.length;
    const dots = [...document.querySelectorAll('.feat-dot')];
    const numEl = document.getElementById('featNum');
    let idx = 0, timer = null;
    function go(i){
      idx = (i + n) % n;
      track.style.transform = 'translateX(-' + (idx*100) + '%)';
      dots.forEach((d,k)=>d.classList.toggle('active', k===idx));
      if(numEl) numEl.textContent = idx+1;
    }
    function start(){ stop(); timer = setInterval(()=>go(idx+1), 6000); }
    function stop(){ if(timer){ clearInterval(timer); timer = null; } }
    document.querySelectorAll('[data-feat]').forEach(b=>{
      b.addEventListener('click', e=>{
        e.stopPropagation();
        const v = b.dataset.feat;
        if(v==='next') go(idx+1);
        else if(v==='prev') go(idx-1);
        else go(+v);
        start();
      });
    });
    const feat = document.querySelector('.feature');
    feat.addEventListener('mouseenter', stop);
    feat.addEventListener('mouseleave', start);
    start();
  }

  /* map interactivity */
  function wireMap(){
    function focus(id){
      document.querySelectorAll('.pin,.loc').forEach(e=>e.classList.toggle('active', e.dataset.loc===id));
    }
    document.querySelectorAll('.loc, .pin').forEach(el=>{
      el.addEventListener('mouseenter', ()=>focus(el.dataset.loc));
      el.addEventListener('click', ()=>{
        const arts = artsAtLoc(el.dataset.loc);
        if(arts.length) location.hash = '#article/'+arts[0].id;
      });
    });
  }

  /* global click delegation */
  document.addEventListener('click', e=>{
    const r = e.target.closest('[data-route]');
    if(r){ location.hash = '#'+r.dataset.route; return; }
    const a = e.target.closest('[data-art]');
    if(a){ location.hash = '#article/'+a.dataset.art; return; }
    const w = e.target.closest('[data-home]');
    if(w){ location.hash = '#home'; }
  });

  window.addEventListener('hashchange', render);
  render();
})();
