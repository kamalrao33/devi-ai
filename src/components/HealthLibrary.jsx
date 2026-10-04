import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ARTICLES_DATA, BOYS_ARTICLES_DATA } from './HealthLibraryData';

export default function HealthLibrary({ appMode = 'girls' }) {
  const isBoys = appMode === 'boys';
  const articlesList = isBoys ? BOYS_ARTICLES_DATA : ARTICLES_DATA;
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(isBoys ? 101 : 1);

  const categories = isBoys
    ? ['All', 'Vitality & Hormones', 'Mental Fortitude', 'Hair & Grooming', 'Safety & Legal']
    : ['All', 'Hormones & PCOS', 'Legal Aid & Safety', 'Reproductive Health', 'Mental Sanctuary'];

  const filteredArticles = articlesList.filter((art) => {
    const matchesCat = activeCategory === 'All' || art.category === activeCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          art.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header & Search in Glass */}
      <div 
        className="glass-panel"
        style={{
          padding: 26,
          background: isBoys 
            ? 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)' 
            : 'linear-gradient(135deg, #ffffff 0%, #fff0f4 100%)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span className="badge badge-emerald">MEDICALLY REVIEWED</span>
          <span className="badge badge-purple">{isBoys ? 'EVIDENCE & PEAK SCIENCE' : 'EVIDENCE BASED'}</span>
        </div>
        <h1 style={{ fontSize: '1.8rem', color: isBoys ? '#0f172a' : '#331427', marginBottom: 6 }}>
          {isBoys ? "Men's Health, Peak Performance & Safety Hub" : "Trusted Health, Wellness & Legal Rights Hub"}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: 700, marginBottom: 18 }}>
          {isBoys 
            ? "Curated science-backed guides on testosterone, hypertrophy, stoic mental resilience, hair restoration, and legal security for men." 
            : "Curated guides on reproductive biology, hormonal therapies, mental resilience, and legal protection for women."}
        </p>

        {/* Search & Category Filter */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div style={{
            flex: 1,
            minWidth: 'min(100%, 240px)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: '#ffffff',
            border: isBoys ? '1.5px solid rgba(14, 165, 233, 0.35)' : '1.5px solid rgba(244, 114, 182, 0.35)',
            boxShadow: isBoys ? '0 2px 10px rgba(14, 165, 233, 0.08)' : '0 2px 10px rgba(244, 114, 182, 0.08)',
            borderRadius: 'var(--radius-full)',
            padding: '8px 16px'
          }}>
            <Search size={17} color={isBoys ? "#0284c7" : "#db2777"} />
            <input
              type="text"
              placeholder={isBoys ? "Search men's topics (e.g. Testosterone, DHT, Hypertrophy, Safety)..." : "Search topics (e.g. PCOS, Rights, Cramps)..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                color: isBoys ? '#0f172a' : '#331427',
                fontSize: '0.88rem',
                fontWeight: 500,
                width: '100%'
              }}
            />
          </div>

          <div className="scroll-touch-x" style={{ display: 'flex', gap: 6, paddingBottom: 4, width: '100%' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={activeCategory === cat ? 'btn-primary' : 'glass-interactive'}
                style={{
                  padding: '7px 15px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap',
                  fontWeight: activeCategory === cat ? 700 : 600,
                  background: activeCategory === cat ? 'var(--gradient-devi)' : '#ffffff',
                  border: '1px solid rgba(244, 114, 182, 0.3)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredArticles.map((art) => {
          const isExpanded = expandedId === art.id;
          return (
            <div 
              key={art.id}
              className="glass-panel"
              style={{
                overflow: 'hidden',
                background: '#ffffff',
                border: isExpanded ? '1.5px solid #ec4899' : '1px solid rgba(244, 114, 182, 0.25)',
                transition: 'all 0.25s ease'
              }}
            >
              {art.image && isExpanded && (
                <div style={{ width: '100%', height: 220, overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={art.image} 
                    alt={art.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '16px 24px'
                  }}>
                    <span className="badge badge-pink" style={{ background: '#ec4899', color: '#fff', border: 'none' }}>
                      {art.category}
                    </span>
                  </div>
                </div>
              )}

              <div style={{ padding: 22 }}>
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : art.id)}
                  style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}
                >
                  {art.image && !isExpanded && (
                    <div style={{
                      width: 140,
                      height: 95,
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(244, 114, 182, 0.15)',
                      border: '1px solid rgba(244, 114, 182, 0.2)'
                    }}>
                      <img 
                        src={art.image} 
                        alt={art.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} 
                      />
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span className="badge badge-pink">{art.category}</span>
                      <span style={{ fontSize: '0.78rem', color: '#885070', fontWeight: 600 }}>⏱️ {art.readTime}</span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', color: '#331427', marginBottom: 6 }}>
                      {art.title}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      {art.summary}
                    </p>
                  </div>

                  <button 
                    className="btn-icon"
                    style={{ width: 38, height: 38, flexShrink: 0 }}
                  >
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>

                {/* Expanded Reading View */}
                {isExpanded && (
                  <div style={{
                    marginTop: 18,
                    paddingTop: 18,
                    borderTop: '1px solid rgba(244, 114, 182, 0.2)',
                    fontSize: '0.92rem',
                    lineHeight: 1.8,
                    color: '#4a1d36',
                    whiteSpace: 'pre-line',
                    fontWeight: 500
                  }}>
                    {art.details}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
