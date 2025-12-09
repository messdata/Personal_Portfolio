import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { createClient } from '@supabase/supabase-js';
import Counter from './Counter';
import './CustomBentoCards.css';

const DEFAULT_GLOW_COLOR = '132, 0, 255';
const DEFAULT_SPOTLIGHT_RADIUS = 300;

interface ProjectView {
  project_name: string;
  view_count: number;
  last_viewed: string;
}

interface CustomBentoCardsProps {
  totalProjects: number;
  visibleProjects: number;
  totalMessages: number;
  unreadMessages: number;
  totalViews: number;
  totalMedia: number;
  pageLiveDays: number;
  profileVisits: number;
  recentProjectViews: ProjectView[];
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  glowColor?: string;
  spotlightRadius?: number;
}

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number
) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

// Helper function to format time ago
function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo ago`;
}

const CustomBentoCards: React.FC<CustomBentoCardsProps> = ({
  totalProjects: initialProjects,
  visibleProjects: initialVisibleProjects,
  totalMessages: initialMessages,
  unreadMessages: initialUnreadMessages,
  totalViews: initialViews,
  totalMedia: initialMedia,
  pageLiveDays: initialPageLiveDays,
  profileVisits: initialProfileVisits,
  recentProjectViews: initialRecentProjectViews,
  enableSpotlight = true,
  enableBorderGlow = true,
  glowColor = DEFAULT_GLOW_COLOR,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
}) => {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Realtime state
  const [totalProjects, setTotalProjects] = useState(initialProjects);
  const [visibleProjects, setVisibleProjects] = useState(initialVisibleProjects);
  const [totalMessages, setTotalMessages] = useState(initialMessages);
  const [unreadMessages, setUnreadMessages] = useState(initialUnreadMessages);
  const [totalViews, setTotalViews] = useState(initialViews);
  const [totalMedia, setTotalMedia] = useState(initialMedia);
  const [pageLiveDays, setPageLiveDays] = useState(initialPageLiveDays);
  const [profileVisits, setProfileVisits] = useState(initialProfileVisits);
  const [recentProjectViews, setRecentProjectViews] = useState<ProjectView[]>(initialRecentProjectViews);

  // Initialize Supabase client
  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!enableSpotlight || isMobile || !spotlightRef.current) return;

    const spotlight = spotlightRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      spotlight.style.left = `${e.clientX}px`;
      spotlight.style.top = `${e.clientY}px`;
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [enableSpotlight, isMobile]);

  // Realtime subscription for projects
  useEffect(() => {
    const projectsChannel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        async () => {
          const { data } = await supabase.from('projects').select('id, visible');
          if (data) {
            setTotalProjects(data.length);
            setVisibleProjects(data.filter((p) => p.visible).length);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(projectsChannel);
    };
  }, []);

  // Realtime subscription for messages
  useEffect(() => {
    const messagesChannel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        async () => {
          const { data } = await supabase.from('messages').select('id, is_read');
          if (data) {
            setTotalMessages(data.length);
            setUnreadMessages(data.filter((m) => !m.is_read).length);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, []);

  // Realtime subscription for analytics
  useEffect(() => {
    const analyticsChannel = supabase
      .channel('analytics-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'analytics' },
        async () => {
          // Update total views
          const { data: allAnalytics } = await supabase.from('analytics').select('id, visitor_id');
          if (allAnalytics) {
            setTotalViews(allAnalytics.length);
            setProfileVisits(new Set(allAnalytics.map(v => v.visitor_id)).size);
          }

          // Update recent project views
          const { data: projectAnalytics } = await supabase
            .from('analytics')
            .select('page_path, viewed_at, event_type')
            .ilike('page_path', '%/project%')
            .eq('event_type', 'page_view')
            .order('viewed_at', { ascending: false })
            .limit(50);

          if (projectAnalytics) {
            const projectViewsMap = new Map();

            projectAnalytics.forEach((entry) => {
              const pathParts = entry.page_path.split('/');
              const projectSlug = pathParts[pathParts.length - 1] || 'Unknown';
              
              const projectName = projectSlug
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

              if (projectViewsMap.has(projectName)) {
                const existing = projectViewsMap.get(projectName);
                existing.view_count += 1;
                if (new Date(entry.viewed_at) > new Date(existing.last_viewed_raw)) {
                  existing.last_viewed_raw = entry.viewed_at;
                  existing.last_viewed = formatTimeAgo(entry.viewed_at);
                }
              } else {
                projectViewsMap.set(projectName, {
                  project_name: projectName,
                  view_count: 1,
                  last_viewed: formatTimeAgo(entry.viewed_at),
                  last_viewed_raw: entry.viewed_at
                });
              }
            });

            const updatedViews = Array.from(projectViewsMap.values())
              .sort((a, b) => new Date(b.last_viewed_raw).getTime() - new Date(a.last_viewed_raw).getTime())
              .slice(0, 5)
              .map(({ last_viewed_raw, ...rest }) => rest);

            setRecentProjectViews(updatedViews);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(analyticsChannel);
    };
  }, []);

  // Realtime subscription for media
  useEffect(() => {
    const mediaChannel = supabase
      .channel('media-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'media' },
        async () => {
          const { data } = await supabase.from('media').select('id');
          if (data) {
            setTotalMedia(data.length);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(mediaChannel);
    };
  }, []);

  // Update page live days every hour
  useEffect(() => {
    const updatePageLiveDays = () => {
      const launchDate = new Date('2025-10-01');
      const today = new Date();
      const days = Math.floor((today.getTime() - launchDate.getTime()) / (1000 * 60 * 60 * 24));
      setPageLiveDays(days);
    };

    const interval = setInterval(updatePageLiveDays, 1000 * 60 * 60); // Update every hour
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="custom-bento-section">
      {enableSpotlight && !isMobile && (
        <div
          ref={spotlightRef}
          className="global-spotlight"
          style={{
            position: 'fixed',
            width: `${spotlightRadius * 2}px`,
            height: `${spotlightRadius * 2}px`,
            background: `radial-gradient(circle, rgba(${glowColor}, 0.15) 0%, transparent 70%)`,
            borderRadius: '50%',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            mixBlendMode: 'screen',
            zIndex: 200,
          }}
        />
      )}

      <div className="custom-card-grid">
        {/* Projects Card */}
        <a
          href="/panel/projects"
          className={`custom-bento-card ${enableBorderGlow ? 'custom-bento-card--border-glow' : ''}`}
          ref={(el: HTMLAnchorElement | null) => {
            if (!el || isMobile) return;
            const handleMouseMove = (e: MouseEvent) => {
              if (enableBorderGlow) {
                const rect = el.getBoundingClientRect();
                const x = e.clientX;
                const y = e.clientY;
                const distance = Math.hypot(
                  x - (rect.left + rect.width / 2),
                  y - (rect.top + rect.height / 2)
                );
                const glow = Math.max(0, 1 - distance / spotlightRadius);
                updateCardGlowProperties(el, x, y, glow, spotlightRadius);
              }
            };
            const handleMouseLeave = () => {
              if (enableBorderGlow) {
                updateCardGlowProperties(el, 0, 0, 0, spotlightRadius);
              }
            };
            el.addEventListener('mousemove', handleMouseMove);
            el.addEventListener('mouseleave', handleMouseLeave);
          }}
        >
          <div className="custom-card-header">
            <span className="custom-card-label">Portfolio</span>
            <div className="custom-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
              </svg>
            </div>
          </div>
          <div className="custom-card-content">
            <Counter value={totalProjects} places={[10, 1]} fontSize={60} textColor="white" fontWeight={700} />
            <h3 className="custom-card-title">Projects</h3>
            <p className="custom-card-description">{visibleProjects} visible</p>
          </div>
        </a>

        {/* Messages Card */}
        <a
          href="/panel/messages"
          className={`custom-bento-card ${enableBorderGlow ? 'custom-bento-card--border-glow' : ''}`}
          ref={(el: HTMLAnchorElement | null) => {
            if (!el || isMobile) return;
            const handleMouseMove = (e: MouseEvent) => {
              if (enableBorderGlow) {
                const rect = el.getBoundingClientRect();
                const x = e.clientX;
                const y = e.clientY;
                const distance = Math.hypot(
                  x - (rect.left + rect.width / 2),
                  y - (rect.top + rect.height / 2)
                );
                const glow = Math.max(0, 1 - distance / spotlightRadius);
                updateCardGlowProperties(el, x, y, glow, spotlightRadius);
              }
            };
            const handleMouseLeave = () => {
              if (enableBorderGlow) {
                updateCardGlowProperties(el, 0, 0, 0, spotlightRadius);
              }
            };
            el.addEventListener('mousemove', handleMouseMove);
            el.addEventListener('mouseleave', handleMouseLeave);
          }}
        >
          <div className="custom-card-header">
            <span className="custom-card-label">Inbox</span>
            <div className="custom-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
              </svg>
            </div>
          </div>
          <div className="custom-card-content">
            <Counter value={totalMessages} places={[10, 1]} fontSize={60} textColor="white" fontWeight={700} />
            <h3 className="custom-card-title">Messages</h3>
            <p className="custom-card-description">{unreadMessages} unread</p>
          </div>
        </a>

        {/* Timeline Card (Large) */}
        <div
          className={`custom-bento-card custom-bento-card--large ${enableBorderGlow ? 'custom-bento-card--border-glow' : ''}`}
          ref={(el: HTMLDivElement | null) => {
            if (!el || isMobile) return;
            const handleMouseMove = (e: MouseEvent) => {
              if (enableBorderGlow) {
                const rect = el.getBoundingClientRect();
                const x = e.clientX;
                const y = e.clientY;
                const distance = Math.hypot(
                  x - (rect.left + rect.width / 2),
                  y - (rect.top + rect.height / 2)
                );
                const glow = Math.max(0, 1 - distance / spotlightRadius);
                updateCardGlowProperties(el, x, y, glow, spotlightRadius);
              }
            };
            const handleMouseLeave = () => {
              if (enableBorderGlow) {
                updateCardGlowProperties(el, 0, 0, 0, spotlightRadius);
              }
            };
            el.addEventListener('mousemove', handleMouseMove);
            el.addEventListener('mouseleave', handleMouseLeave);
          }}
        >
          <div className="custom-card-header">
            <span className="custom-card-label">Timeline</span>
            <div className="custom-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
          </div>
          <div className="custom-card-content timeline-content">
            <h3 className="custom-card-title">Recent Activity</h3>
            <div className="timeline-list">
              {recentProjectViews.length > 0 ? (
                recentProjectViews.map((project, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-dot" style={{ background: '#8b5cf6' }}></div>
                    <div className="timeline-info">
                      <span className="timeline-project">{project.project_name}</span>
                      <span className="timeline-views">{project.view_count} views</span>
                    </div>
                    <span className="timeline-time">{project.last_viewed}</span>
                  </div>
                ))
              ) : (
                <p className="timeline-empty">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* Insights Card (Large) */}
        <div
          className={`custom-bento-card custom-bento-card--large ${enableBorderGlow ? 'custom-bento-card--border-glow' : ''}`}
          ref={(el: HTMLDivElement | null) => {
            if (!el || isMobile) return;
            const handleMouseMove = (e: MouseEvent) => {
              if (enableBorderGlow) {
                const rect = el.getBoundingClientRect();
                const x = e.clientX;
                const y = e.clientY;
                const distance = Math.hypot(
                  x - (rect.left + rect.width / 2),
                  y - (rect.top + rect.height / 2)
                );
                const glow = Math.max(0, 1 - distance / spotlightRadius);
                updateCardGlowProperties(el, x, y, glow, spotlightRadius);
              }
            };
            const handleMouseLeave = () => {
              if (enableBorderGlow) {
                updateCardGlowProperties(el, 0, 0, 0, spotlightRadius);
              }
            };
            el.addEventListener('mousemove', handleMouseMove);
            el.addEventListener('mouseleave', handleMouseLeave);
          }}
        >
          <div className="custom-card-header">
            <span className="custom-card-label">Insights</span>
            <div className="custom-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
          </div>
          <div className="custom-card-content insights-content">
            <div className="insight-item">
              <div className="insight-label">Page Live Since</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <Counter value={pageLiveDays} places={[100, 10, 1]} fontSize={50} textColor="#8b5cf6" fontWeight={700} />
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem' }}>days</span>
              </div>
            </div>
            <div className="insight-divider"></div>
            <div className="insight-item">
              <div className="insight-label">Profile Visits</div>
              <Counter value={profileVisits} places={[1000, 100, 10, 1]} fontSize={50} textColor="#06b6d4" fontWeight={700} />
            </div>
          </div>
        </div>

        {/* Analytics Card */}
        <a
          href="/panel/analytics"
          className={`custom-bento-card ${enableBorderGlow ? 'custom-bento-card--border-glow' : ''}`}
          ref={(el: HTMLAnchorElement | null) => {
            if (!el || isMobile) return;
            const handleMouseMove = (e: MouseEvent) => {
              if (enableBorderGlow) {
                const rect = el.getBoundingClientRect();
                const x = e.clientX;
                const y = e.clientY;
                const distance = Math.hypot(
                  x - (rect.left + rect.width / 2),
                  y - (rect.top + rect.height / 2)
                );
                const glow = Math.max(0, 1 - distance / spotlightRadius);
                updateCardGlowProperties(el, x, y, glow, spotlightRadius);
              }
            };
            const handleMouseLeave = () => {
              if (enableBorderGlow) {
                updateCardGlowProperties(el, 0, 0, 0, spotlightRadius);
              }
            };
            el.addEventListener('mousemove', handleMouseMove);
            el.addEventListener('mouseleave', handleMouseLeave);
          }}
        >
          <div className="custom-card-header">
            <span className="custom-card-label">Metrics</span>
            <div className="custom-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                <line x1="12" y1="20" x2="12" y2="10"></line>
                <line x1="18" y1="20" x2="18" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="16"></line>
              </svg>
            </div>
          </div>
          <div className="custom-card-content">
            <Counter value={totalViews} places={[1000, 100, 10, 1]} fontSize={50} textColor="white" fontWeight={700} />
            <h3 className="custom-card-title">Total Views</h3>
            <p className="custom-card-description">All time</p>
          </div>
        </a>

        {/* Media Card */}
        <a
          href="/panel/media"
          className={`custom-bento-card ${enableBorderGlow ? 'custom-bento-card--border-glow' : ''}`}
          ref={(el: HTMLAnchorElement | null) => {
            if (!el || isMobile) return;
            const handleMouseMove = (e: MouseEvent) => {
              if (enableBorderGlow) {
                const rect = el.getBoundingClientRect();
                const x = e.clientX;
                const y = e.clientY;
                const distance = Math.hypot(
                  x - (rect.left + rect.width / 2),
                  y - (rect.top + rect.height / 2)
                );
                const glow = Math.max(0, 1 - distance / spotlightRadius);
                updateCardGlowProperties(el, x, y, glow, spotlightRadius);
              }
            };
            const handleMouseLeave = () => {
              if (enableBorderGlow) {
                updateCardGlowProperties(el, 0, 0, 0, spotlightRadius);
              }
            };
            el.addEventListener('mousemove', handleMouseMove);
            el.addEventListener('mouseleave', handleMouseLeave);
          }}
        >
          <div className="custom-card-header">
            <span className="custom-card-label">Gallery</span>
            <div className="custom-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
            </div>
          </div>
          <div className="custom-card-content">
            <Counter value={totalMedia} places={[100, 10, 1]} fontSize={60} textColor="white" fontWeight={700} />
            <h3 className="custom-card-title">Media Files</h3>
            <p className="custom-card-description">Cloudinary</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default CustomBentoCards;