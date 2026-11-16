import React, { useEffect, useMemo, useState } from 'react';
import { Search, ShoppingBag, Menu, ArrowRight, CalendarDays, MapPin, Star, X, Clock3, ShieldCheck, Headphones, PackageCheck, ChevronDown } from 'lucide-react';
import { supabase } from './supabase';

function money(n){return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n)}
function App(){
  const [category,setCategory]=useState('All items');

const [products, setProducts] = useState([]);
const [dbCategories, setDbCategories] = useState([]);
const [loading, setLoading] = useState(true);
const [loadError, setLoadError] = useState('');

const categories = useMemo(
  () => ['All items', ...dbCategories.map(c => c.name)],
  [dbCategories]
);

useEffect(() => {
  async function loadRentals() {
    setLoading(true);
    setLoadError('');

    try {
      const [categoryResult, productResult] = await Promise.all([
        supabase
          .from('categories')
          .select('id, name')
          .eq('is_active', true)
          .order('name'),

        supabase
          .from('products')
          .select(`
            id,
            name,
            description,
            daily_rate,
            stock_quantity,
            image_url,
            categories(name)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
      ]);

      if (categoryResult.error) throw categoryResult.error;
      if (productResult.error) throw productResult.error;

      setDbCategories(categoryResult.data || []);

      const formattedProducts = (productResult.data || []).map(p => ({
        id: p.id,
        name: p.name,
        category: p.categories?.name || 'Other Items',
        price: Number(p.daily_rate),
        unit: 'day',
        rating: 'New',
        reviews: 0,
        tag: '',
        image: p.image_url || 'https://placehold.co/600x400?text=RentEasy',
        description: p.description || 'Available for rental.',
        stock: p.stock_quantity
      }));

      setProducts(formattedProducts);

    } catch (error) {
      console.error('RentEasy loading error:', error);
      setLoadError(error.message || 'Unable to load products.');
    } finally {
      setLoading(false);
    }
  }

  loadRentals();
}, []);

  const [query,setQuery]=useState('');
  const [selected,setSelected]=useState(null);
  const [start,setStart]=useState('');
  const [end,setEnd]=useState('');
  const [menu,setMenu]=useState(false);
  const [notice,setNotice]=useState('');
  const [bookings,setBookings]=useState([]);
  const filtered=useMemo(()=>products.filter(p=>(category==='All items'||p.category===category)&&(`${p.name} ${p.category}`).toLowerCase().includes(query.toLowerCase())),[category,query]);
  const days=start&&end&&new Date(end)>=new Date(start)?Math.max(1,Math.ceil((new Date(end)-new Date(start))/86400000)):0;
  const total=selected&&days?selected.price*days:0;
  function book(){
    if(!start||!end){setNotice('Please select your rental start and return dates.');return;}
    if(new Date(end)<new Date(start)){setNotice('Return date must be on or after the start date.');return;}
    setBookings([...bookings,{id:Date.now(),product:selected.name,start,end,days,total}]);
    setNotice('Demo booking saved on this device. Online booking will be enabled after database setup.');
    setSelected(null);setStart('');setEnd('');
  }
  return <div className="app">
    <div className="announcement">Make room for more possibilities. Rent it with RentEasy. <span>Explore rentals <ArrowRight size={13}/></span></div>
    <header className="header">
      <a className="brand" href="#"><span className="brand-icon">R</span><span>rent<span className="brand-light">easy</span><small>RENT MORE. OWN LESS.</small></span></a>
      <nav className={menu?'nav open':'nav'}>
        <a href="#explore" onClick={()=>setMenu(false)}>Explore</a><a href="#how" onClick={()=>setMenu(false)}>How it works</a><a href="#why" onClick={()=>setMenu(false)}>Why RentEasy</a>
      </nav>
      <div className="header-actions"><button className="text-button" onClick={()=>setNotice('Customer accounts will be enabled in Phase 2.')}>Sign in</button><button className="my-rentals" onClick={()=>setNotice(bookings.length?`You have ${bookings.length} demo booking(s) saved in this session.`:'Your rental list is empty for now.')}> <ShoppingBag size={17}/> My rentals {bookings.length>0&&<b>{bookings.length}</b>}</button><button className="mobile-menu" onClick={()=>setMenu(!menu)}><Menu/></button></div>
    </header>
    <main>
      <section className="hero">
        <div className="hero-copy"><div className="eyebrow"><span></span> THE SMARTER WAY TO GET WHAT YOU NEED</div><h1>Need it for a while?<br/><em>Just rent it.</em></h1><p>From everyday essentials to the extraordinary, find the things you need without the commitment of owning them.</p>
          <div className="hero-search"><Search size={19}/><input value={query} onChange={e=>{setQuery(e.target.value);document.getElementById('explore')?.scrollIntoView({behavior:'smooth'});}} placeholder="What are you looking to rent?"/><button onClick={()=>document.getElementById('explore').scrollIntoView({behavior:'smooth'})}>Find items <ArrowRight size={16}/></button></div>
          <div className="hero-trust"><span><ShieldCheck size={16}/> Quality checked</span><span><CalendarDays size={16}/> Flexible dates</span><span><Headphones size={16}/> Friendly support</span></div>
        </div>
        <div className="hero-visual"><img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1400&q=90" alt="Beautifully styled home with useful everyday items"/><div className="floating-card"><div className="float-icon"><PackageCheck size={20}/></div><div><b>More access, less ownership</b><small>Only pay for the time you need.</small></div></div><div className="hero-stamp">USE<br/> & REUSE<br/><span>♻</span></div></div>
      </section>
      <section className="stats"><div><b>One simple place</b><span>for all your rental needs</span></div><div><b>Flexible rentals</b><span>Choose the days you need</span></div><div><b>Easy returns</b><span>Return when your time is up</span></div></section>
      <section className="products-section" id="explore">
        <div className="section-top"><div><div className="eyebrow">FIND YOUR NEXT RENTAL</div><h2>Good things, <em>on demand.</em></h2><p>Explore useful finds for work, home, events and everything in between.</p></div><a className="view-all" href="#explore">Browse collection <ArrowRight size={16}/></a></div>
        <div className="filters"><div className="category-list">{categories.map(c=><button key={c} className={category===c?'active':''} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="sort-label">Showing {filtered.length} items <ChevronDown size={14}/></div></div>
        <div className="product-grid">{!loading && filtered.map(p=><article className="product-card" key={p.id}><button className="product-image" onClick={()=>{setSelected(p);setNotice('')}}><img src={p.image} alt={p.name}/>{p.tag&&<span className="tag">{p.tag}</span>}<span className="quick-view">View details <ArrowRight size={14}/></span></button><div className="product-info"><div className="product-category">{p.category}</div><h3>{p.name}</h3><div className="rating"><Star size={13} fill="currentColor"/> {p.rating} <span>({p.reviews} reviews)</span></div><div className="product-bottom"><div><b>{money(p.price)}</b><span> / day</span></div><button onClick={()=>{setSelected(p);setNotice('')}}>Rent now <ArrowRight size={15}/></button></div></div></article>)}</div>
        {loading && (
  <div className="empty">Loading rental products...</div>
)}

{loadError && (
  <div className="empty">Error: {loadError}</div>
)}

{!loading && !loadError && filtered.length === 0 && (
  <div className="empty">
    No rental products available yet.
  </div>
)}
      </section>
      <section className="how" id="how"><div className="how-heading"><div className="eyebrow">RENTING MADE SIMPLE</div><h2>Three steps. <em>That's it.</em></h2><p>Getting what you need should be the easy part.</p></div><div className="steps"><div><span>01</span><CalendarDays/><h3>Choose your item</h3><p>Find what you need and pick your rental dates.</p></div><div><span>02</span><ShoppingBag/><h3>Book with ease</h3><p>See your rental total upfront and confirm your request.</p></div><div><span>03</span><PackageCheck/><h3>Enjoy & return</h3><p>Use your item and return it when your rental ends.</p></div></div></section>
      <section className="bottom-cta" id="why"><div><div className="eyebrow">A BETTER WAY TO GET MORE</div><h2>Get what you need.<br/><em>Keep life simple.</em></h2><p>Useful things, when you need them. That's the RentEasy way.</p></div><a href="#explore">Explore the collection <ArrowRight size={17}/></a></section>
    </main>
    <footer><a className="brand footer-brand" href="#"><span className="brand-icon">R</span><span>rent<span className="brand-light">easy</span><small>RENT MORE. OWN LESS.</small></span></a><span>© 2026 RentEasy. All rights reserved.</span><span>Made for a more flexible way to live.</span></footer>
    {notice&&<div className="toast" role="status">{notice}<button onClick={()=>setNotice('')}><X size={16}/></button></div>}
    {selected&&<div className="modal-backdrop" onClick={()=>setSelected(null)}><div className="booking-modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)}><X/></button><div className="modal-image"><img src={selected.image} alt={selected.name}/></div><div className="modal-content"><div className="eyebrow">{selected.category}</div><h2>{selected.name}</h2><div className="rating"><Star size={13} fill="currentColor"/> {selected.rating} <span>({selected.reviews} reviews)</span></div><p>{selected.description}</p><div className="price-line"><b>{money(selected.price)}</b><span>per day</span></div><label>Rental start date<input type="date" min={new Date().toISOString().slice(0,10)} value={start} onChange={e=>setStart(e.target.value)}/></label><label>Return date<input type="date" min={start||new Date().toISOString().slice(0,10)} value={end} onChange={e=>setEnd(e.target.value)}/></label>{days>0&&<div className="total-box"><span>{money(selected.price)} × {days} day(s)</span><b>{money(total)}</b></div>}<button className="confirm" onClick={book}>Request booking <ArrowRight size={17}/></button><small className="demo-note">Demo only: payment and live availability are not connected yet.</small></div></div></div>}
  </div>
}
export default App;
