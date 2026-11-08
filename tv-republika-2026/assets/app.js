document.documentElement.classList.add('js');
const norm=s=>s.toLocaleLowerCase('pl').normalize('NFD').replace(/\p{Diacritic}/gu,'');
document.querySelectorAll('.data-table').forEach(table=>{
 const groups=[...table.querySelectorAll('tbody[data-entry]')];
 groups.forEach(group=>{const row=group.querySelector('.summary-row'),btn=group.querySelector('.toggle'),panel=group.querySelector('.detail-row'); panel.hidden=true;
  const toggle=()=>{const expanded=btn.getAttribute('aria-expanded')==='true';btn.setAttribute('aria-expanded',String(!expanded));btn.textContent=expanded?'+':'−';panel.hidden=expanded;};
  btn.addEventListener('click',toggle);row.addEventListener('click',e=>{if(!e.target.closest('button,a,input,select')){toggle();btn.focus({preventScroll:true});}});
 });
 const area=table.closest('[data-browser]');if(!area)return;
 const search=area.querySelector('[data-search]'),proof=area.querySelector('[data-proof]'),category=area.querySelector('[data-category]'),sort=area.querySelector('[data-sort]'),counter=area.querySelector('[data-count]'),empty=area.querySelector('[data-empty]');
 const update=()=>{let n=0;const q=norm(search?.value||'');
  for(const g of groups){const match=(!q||norm(g.textContent).includes(q))&&(!proof?.value||g.dataset.proof.split(' ').includes(proof.value))&&(!category?.value||g.dataset.category.split(' ').includes(category.value));g.hidden=!match;if(match)n++;}
  const mode=sort?.value||'brand';const ordered=[...groups].sort((a,b)=>mode==='latest'?(b.dataset.latest||'').localeCompare(a.dataset.latest||'')||a.dataset.brand.localeCompare(b.dataset.brand,'pl'):a.dataset[mode].localeCompare(b.dataset[mode],'pl'));
  for(const g of ordered)table.append(g);if(counter)counter.textContent=`Widoczne: ${n} z ${groups.length}.`;if(empty)empty.hidden=n!==0;
 };
 for(const el of [search,proof,category,sort].filter(Boolean))el.addEventListener(el===search?'input':'change',update);update();
});
const sourceSearch=document.querySelector('#source-search');if(sourceSearch)sourceSearch.addEventListener('input',()=>{const q=norm(sourceSearch.value);for(const el of document.querySelectorAll('.source-item'))el.hidden=!norm(el.textContent).includes(q);});
const revealHash=()=>{if(!location.hash)return;const el=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(!el)return;const g=el.closest('tbody[data-entry]');if(g){const b=g.querySelector('.toggle');if(b?.getAttribute('aria-expanded')==='false')b.click();}for(let p=el.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;};revealHash();window.addEventListener('hashchange',revealHash);
