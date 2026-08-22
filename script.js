(function(){
  var menuBtn = document.getElementById('menu-btn');
  var closeBtn = document.getElementById('close-btn');
  var mobileNav = document.getElementById('mobile-nav');
  var mobileLinks = mobileNav.querySelectorAll('a');

  function openMenu(){
    mobileNav.classList.add('is-open');
    menuBtn.setAttribute('aria-expanded','true');
    document.body.style.overflow='hidden';
  }
  function closeMenu(){
    mobileNav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded','false');
    document.body.style.overflow='';
  }
  menuBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  mobileLinks.forEach(function(a){ a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeMenu(); });

  var header = document.getElementById('site-header');
  var backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', function(){
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 12);
    backToTop.classList.toggle('is-visible', y > 480);
  }, {passive:true});

  backToTop.addEventListener('click', function(){
    window.scrollTo({top:0, behavior:'smooth'});
  });

  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.15});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  var tabBtns = document.querySelectorAll('.tab-btn');
  var productCards = document.querySelectorAll('.product-card');
  tabBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      tabBtns.forEach(function(b){ b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var cat = btn.getAttribute('data-cat');
      productCards.forEach(function(card){
        card.style.display = (card.getAttribute('data-cat') === cat) ? '' : 'none';
      });
    });
  });

  /* ============ AUTO-SLIDING PRODUCT CAROUSEL ============ */
  function initCarousel(el){
    var track = el.querySelector('.carousel-track');
    var slides = el.querySelectorAll('.carousel-slide');
    var dots = el.querySelectorAll('.carousel-dot');
    var count = slides.length;
    if(!track || count <= 1) return;

    track.style.width = (count * 100) + '%';
    slides.forEach(function(s){ s.style.width = (100 / count) + '%'; });

    var index = 0;
    var timer = null;
    var AUTOPLAY_MS = 3200;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function goTo(i){
      index = (i + count) % count;
      track.style.transform = 'translateX(-' + (index * (100/count)) + '%)';
      dots.forEach(function(d, di){ d.classList.toggle('is-active', di === index); });
    }
    function next(){ goTo(index + 1); }
    function stopAutoplay(){ if(timer){ clearInterval(timer); timer = null; } }
    function startAutoplay(){
      stopAutoplay();
      if(reduceMotion) return;
      timer = setInterval(next, AUTOPLAY_MS);
    }
    function restartAutoplay(){ stopAutoplay(); startAutoplay(); }

    dots.forEach(function(dot, i){
      dot.addEventListener('click', function(e){
        e.stopPropagation();
        goTo(i);
        restartAutoplay();
      });
    });

    var startX = 0, deltaX = 0, dragging = false;
    function dragStart(x){ dragging = true; startX = x; deltaX = 0; stopAutoplay(); }
    function dragMove(x){ if(dragging) deltaX = x - startX; }
    function dragEnd(){
      if(!dragging) return;
      dragging = false;
      if(deltaX > 35){ goTo(index - 1); }
      else if(deltaX < -35){ goTo(index + 1); }
      deltaX = 0;
      restartAutoplay();
    }
    track.addEventListener('touchstart', function(e){ dragStart(e.touches[0].clientX); }, {passive:true});
    track.addEventListener('touchmove', function(e){ dragMove(e.touches[0].clientX); }, {passive:true});
    track.addEventListener('touchend', dragEnd);
    track.addEventListener('mousedown', function(e){ e.preventDefault(); dragStart(e.clientX); });
    window.addEventListener('mousemove', function(e){ dragMove(e.clientX); });
    window.addEventListener('mouseup', dragEnd);

    goTo(0);
    startAutoplay();
  }
  document.querySelectorAll('[data-carousel]').forEach(initCarousel);

  /* ============ PRODUCT DETAIL MODAL ============ */
  var PRODUCT_DETAILS = {
    'rice-1121': {
      title: '1121 Sella Basmati Rice',
      desc: 'Premium long-grain rice with a translucent, off-white appearance.',
      varietyHeading: '3 Varieties of 1121 Basmati Rice',
      varieties: [
        {name:'1121 Sella Basmati Rice', desc:'Premium long-grain rice with a translucent, off-white appearance. Perfect for fluffy and aromatic dishes like biryani and pilaf.', image:'images/rice-1121-sella.jpg'},
        {name:'1121 Steam Basmati Rice', desc:'Nutritious, long-grain rice with a natural aroma and soft texture, ideal for daily meals and international cuisines.', image:'images/rice-1121-steam.jpg'},
        {name:'1121 Golden Sella Basmati Rice', desc:'Distinct golden-coloured, parboiled rice with firm grains, known for its rich aroma and superior taste. Best for specialty dishes.', image:'images/rice-1121-golden-sella.jpg'}
      ],
      whatsapp: '1121 Basmati Rice'
    },
    'rice-1509': {
      title: '1509 Basmati Rice',
      desc: 'High-yielding, extra-long grain rice with a light aroma, excellent cooking quality, and fluffy texture.',
      features: [
        'Extra-long grains with exceptional elongation after cooking.',
        'Light aroma, suitable for mild and flavorful dishes.',
        'Soft and fluffy texture, perfect for both traditional and modern cuisines.',
        'Rich in nutrients with a low glycemic index.',
        'Available in various forms: Sella, Steam, and Golden Sella.'
      ],
      varietyHeading: 'Varieties',
      varieties: [
        {name:'1509 Sella Basmati Rice', desc:'Parboiled rice with a translucent, creamy-white appearance, ideal for biryanis and festive dishes.', image:'images/rice-1509-sella.jpg'},
        {name:'1509 Steam Basmati Rice', desc:'Naturally processed to retain its aroma and taste, perfect for daily meals and international dishes.', image:'images/rice-1509-steam.jpg'},
        {name:'1509 Golden Sella Basmati Rice', desc:'Parboiled rice with a golden hue, firm texture, and exceptional cooking quality, suitable for specialty dishes.', image:'images/rice-1509-golden-sella.jpg'}
      ],
      whatsapp: '1509 Basmati Rice'
    },
    'turmeric-powder': {
      title: 'Turmeric Powder',
      desc: 'India is one of the largest producers of turmeric in the world.',
      images: [
        {src:'images/turmeric-powder.jpg', caption:'Turmeric Powder'}
      ],
      specs: [
        {label:'Product Name', value:'Organic Turmeric Powder'},
        {label:'Supply Capacity', value:'30000 MT Yearly'},
        {label:'Packaging Size', value:'25 Kg'},
        {label:'Packaging Type', value:'Paper Bag'},
        {label:'Origin', value:'Gujarat, India'},
        {label:'Type', value:'Powder'},
        {label:'Brand', value:'Exportaholic Organic'},
        {label:'Is it Organic', value:'Yes (Certified)'}
      ],
      whatsapp: 'Turmeric Powder'
    },
    'cumin-seeds': {
      title: 'Cumin Seeds',
      desc: 'Sourced from top farms, our premium cumin seeds add strong flavor and earthy aroma to dishes.',
      images: [
        {src:'images/cumin-seeds.jpg', caption:'Cumin Seeds'}
      ],
      specs: [
        {label:'Minimum Order Quantity', value:'3'},
        {label:'Material', value:'Spices'}
      ],
      whatsapp: 'Cumin Seeds'
    },
    'black-pepper': {
      title: 'Black Pepper',
      desc: 'Bold, pungent peppercorns, cleaned and graded for export.',
      images: [
        {src:'images/black-pepper.jpg', caption:'Black Pepper'}
      ],
      whatsapp: 'Black Pepper'
    },
    'red-chili': {
      title: 'Red Chili',
      desc: 'Vibrant colour and heat, sun-dried and hand-cleaned.',
      images: [
        {src:'images/red-chili.jpg', caption:'Red Chili'}
      ],
      whatsapp: 'Red Chili'
    },
    'fresh-onion': {
      title: 'Fresh Onion',
      desc: 'Firm, well-formed bulbs, graded and packed for export.',
      images: [
        {src:'images/fresh-onion.jpg', caption:'Fresh Onion'}
      ],
      whatsapp: 'Fresh Onion'
    },
    'pink-marble': {
      title: 'Pink Marble',
      desc: 'Soft-veined natural marble, polished for flooring and facades.',
      specs: [
        {label:'Material', value:'Natural Marble'},
        {label:'Finish', value:'Polished'},
        {label:'Applications', value:'Flooring, Facades, Countertops'}
      ],
      sourcing: 'Direct From Indian Quarries',
      whatsapp: 'Pink Marble'
    },
    'grey-granite': {
      title: 'Steel Grey Granite',
      desc: 'Dense, durable granite with a fine speckled finish.',
      specs: [
        {label:'Material', value:'Natural Granite'},
        {label:'Finish', value:'Polished'},
        {label:'Applications', value:'Flooring, Countertops, Cladding'}
      ],
      sourcing: 'Direct From Indian Quarries',
      whatsapp: 'Steel Grey Granite'
    },
    'black-granite': {
      title: 'Black Granite',
      desc: 'Four striking black finishes, each with its own character and grain.',
      varietyHeading: 'Types of Granite',
      varieties: [
        {name:'Absolute Black', desc:'A deep, uniform black with a flawless finish and no visible grain. A favourite for modern countertops and monuments.', image:'images/granite-absolute-black.jpg'},
        {name:'Jet Black', desc:'Rich, solid black with a fine, tight grain that takes a brilliant polish. Versatile for flooring and countertops alike.', image:'images/granite-jet-black.jpg'},
        {name:'Black Pearl', desc:'Black granite flecked with fine silver-white crystals that catch the light like scattered pearls. Elegant for countertops and feature walls.', image:'images/granite-black-pearl.jpg'},
        {name:'Black Galaxy', desc:'The most iconic Indian black granite — a deep black field scattered with golden mineral flecks, like a night sky full of stars.', image:'images/granite-black-galaxy.jpg'}
      ],
      specs: [
        {label:'Material', value:'Natural Granite'},
        {label:'Finish', value:'Polished'},
        {label:'Applications', value:'Flooring, Countertops, Cladding, Monuments'}
      ],
      sourcing: 'Direct From Indian Quarries',
      whatsapp: 'Black Granite'
    },
    'black-marble': {
      title: 'Black Marble',
      desc: 'Rich, dramatic marble with natural gold-toned veining.',
      specs: [
        {label:'Material', value:'Natural Marble'},
        {label:'Finish', value:'Polished'},
        {label:'Applications', value:'Flooring, Facades, Countertops'}
      ],
      sourcing: 'Direct From Indian Quarries',
      whatsapp: 'Black Marble'
    }
  };

  var pmOverlay = document.getElementById('product-modal');
  var pmTitle = document.getElementById('pm-title');
  var pmDesc = document.getElementById('pm-desc');
  var pmGalleryWrap = document.getElementById('pm-gallery-wrap');
  var pmGallery = document.getElementById('pm-gallery');
  var pmSpecsWrap = document.getElementById('pm-specs-wrap');
  var pmSpecs = document.getElementById('pm-specs');
  var pmFeaturesWrap = document.getElementById('pm-features-wrap');
  var pmFeatures = document.getElementById('pm-features');
  var pmVarietiesWrap = document.getElementById('pm-varieties-wrap');
  var pmVarietyHeading = document.getElementById('pm-variety-heading');
  var pmVarieties = document.getElementById('pm-varieties');
  var pmEnquire = document.getElementById('pm-enquire');
  var pmSourcingText = document.getElementById('pm-sourcing-text');
  var pmClose = document.getElementById('pm-close');

  function openProductModal(id){
    var data = PRODUCT_DETAILS[id];
    if(!data){ return; }

    pmTitle.textContent = data.title;
    pmDesc.textContent = data.desc;
    pmSourcingText.textContent = data.sourcing || 'Direct From Indian Farmers';

    if(data.images && data.images.length){
      pmGallery.innerHTML = '';
      data.images.forEach(function(img){
        var item = document.createElement('div');
        item.className = 'pm-gallery-item';
        var im = document.createElement('img');
        im.src = img.src;
        im.alt = img.caption;
        im.loading = 'lazy';
        var cap = document.createElement('span');
        cap.textContent = img.caption;
        item.appendChild(im);
        item.appendChild(cap);
        pmGallery.appendChild(item);
      });
      pmGalleryWrap.hidden = false;
    } else {
      pmGalleryWrap.hidden = true;
      pmGallery.innerHTML = '';
    }

    if(data.specs && data.specs.length){
      pmSpecs.innerHTML = '';
      data.specs.forEach(function(s){
        var tr = document.createElement('tr');
        var tdLabel = document.createElement('td');
        tdLabel.textContent = s.label;
        var tdValue = document.createElement('td');
        tdValue.textContent = s.value;
        tr.appendChild(tdLabel);
        tr.appendChild(tdValue);
        pmSpecs.appendChild(tr);
      });
      pmSpecsWrap.hidden = false;
    } else {
      pmSpecsWrap.hidden = true;
      pmSpecs.innerHTML = '';
    }

    if(data.features && data.features.length){
      pmFeatures.innerHTML = '';
      data.features.forEach(function(f){
        var li = document.createElement('li');
        li.textContent = f;
        pmFeatures.appendChild(li);
      });
      pmFeaturesWrap.hidden = false;
    } else {
      pmFeaturesWrap.hidden = true;
      pmFeatures.innerHTML = '';
    }

    if(data.varieties && data.varieties.length){
      pmVarietyHeading.textContent = data.varietyHeading || 'Varieties';
      pmVarieties.innerHTML = '';
      data.varieties.forEach(function(v){
        var li = document.createElement('li');
        if(v.image){
          li.className = 'pm-variety-card';
          var im = document.createElement('img');
          im.src = v.image;
          im.alt = v.name;
          im.loading = 'lazy';
          var textWrap = document.createElement('div');
          textWrap.className = 'pm-vc-text';
          var strong = document.createElement('strong');
          strong.textContent = v.name;
          var span = document.createElement('span');
          span.textContent = v.desc;
          textWrap.appendChild(strong);
          textWrap.appendChild(span);
          li.appendChild(im);
          li.appendChild(textWrap);
        } else {
          var strong2 = document.createElement('strong');
          strong2.textContent = v.name + ': ';
          li.appendChild(strong2);
          li.appendChild(document.createTextNode(v.desc));
        }
        pmVarieties.appendChild(li);
      });
      pmVarietiesWrap.hidden = false;
    } else {
      pmVarietiesWrap.hidden = true;
      pmVarieties.innerHTML = '';
    }

    var waText = 'Hello, I\'d like to enquire about ' + data.whatsapp + '.';
    pmEnquire.href = 'https://wa.me/919351039806?text=' + encodeURIComponent(waText);

    pmOverlay.classList.add('is-open');
    pmOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('pm-lock');
  }

  function closeProductModal(){
    pmOverlay.classList.remove('is-open');
    pmOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('pm-lock');
  }

  document.querySelectorAll('.product-viewmore').forEach(function(btn){
    btn.addEventListener('click', function(){
      openProductModal(btn.getAttribute('data-product'));
    });
  });

  pmClose.addEventListener('click', closeProductModal);
  pmOverlay.addEventListener('click', function(e){
    if(e.target === pmOverlay){ closeProductModal(); }
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && pmOverlay.classList.contains('is-open')){ closeProductModal(); }
  });

  var form = document.getElementById('contact-form');
  var formNote = document.getElementById('form-note');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('cf-name').value.trim();
    var email = document.getElementById('cf-email').value.trim();
    var message = document.getElementById('cf-message').value.trim();
    var subject = 'New Enquiry from ' + (name || 'Website Visitor');
    var body = 'Name: ' + name + '\n' + 'Email: ' + email + '\n\n' + message;
    var mailto = 'mailto:jakharglobaltrade@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    window.location.href = mailto;
    if(formNote){ formNote.textContent = 'Opening your email app to send this message…'; }
  });
})();
