// src/lib/analytics.ts
// MindTree Analytics Tracker - Privacy-friendly, Supabase-powered

import { supabase } from './supabase';

interface AnalyticsEvent {
  page_path: string;
  visitor_id: string;
  session_id: string;
  event_type: 'page_view' | 'project_click' | 'project_open' | 'contact_submit';
  event_data?: Record<string, any>;
  referrer: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
  user_agent: string;
  viewport_width: number;
  viewport_height: number;
}

class Analytics {
  private visitorId: string;
  private sessionId: string;
  private isEnabled: boolean;

  constructor() {
    this.visitorId = this.getOrCreateVisitorId();
    this.sessionId = this.getOrCreateSessionId();
    this.isEnabled = this.checkIfEnabled();
  }

  // Generate or retrieve visitor ID from localStorage
  private getOrCreateVisitorId(): string {
    const storageKey = 'mindtree_visitor_id';
    let visitorId = localStorage.getItem(storageKey);
    
    if (!visitorId) {
      visitorId = `visitor_${this.generateId()}`;
      localStorage.setItem(storageKey, visitorId);
    }
    
    return visitorId;
  }

  // Generate or retrieve session ID from sessionStorage
  private getOrCreateSessionId(): string {
    const storageKey = 'mindtree_session_id';
    let sessionId = sessionStorage.getItem(storageKey);
    
    if (!sessionId) {
      sessionId = `session_${this.generateId()}`;
      sessionStorage.setItem(storageKey, sessionId);
    }
    
    return sessionId;
  }

  // Generate random ID
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Check if tracking is enabled (respect Do Not Track)
  private checkIfEnabled(): boolean {
    // Respect browser's Do Not Track setting
    if (navigator.doNotTrack === '1' || (window as any).doNotTrack === '1') {
      console.log('🔒 Analytics: Tracking disabled (Do Not Track)');
      return false;
    }
    return true;
  }

  // Detect device type
  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  // Track event
  async track(
    eventType: AnalyticsEvent['event_type'],
    eventData?: Record<string, any>
  ): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const event: AnalyticsEvent = {
        page_path: window.location.pathname,
        visitor_id: this.visitorId,
        session_id: this.sessionId,
        event_type: eventType,
        event_data: eventData || null,
        referrer: document.referrer || 'direct',
        device_type: this.getDeviceType(),
        user_agent: navigator.userAgent,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
      };

      const { error } = await supabase
        .from('analytics')
        .insert([event]);

      if (error) {
        console.error('Analytics error:', error);
      } else {
        console.log(`📊 Tracked: ${eventType}`, eventData);
      }
    } catch (err) {
      console.error('Analytics error:', err);
    }
  }

  // Track page view (automatically called)
  async trackPageView(): Promise<void> {
    await this.track('page_view');
  }

  // Track project click
  async trackProjectClick(projectId: string, projectTitle: string): Promise<void> {
    await this.track('project_click', { project_id: projectId, project_title: projectTitle });
  }

  // Track project modal open
  async trackProjectOpen(projectId: string, projectTitle: string): Promise<void> {
    await this.track('project_open', { project_id: projectId, project_title: projectTitle });
  }

  // Track contact form submission
  async trackContactSubmit(): Promise<void> {
    await this.track('contact_submit');
  }
}

// Create global analytics instance
const analytics = new Analytics();

// Auto-track page view on load
if (typeof window !== 'undefined') {
  // Track initial page view
  window.addEventListener('load', () => {
    analytics.trackPageView();
  });

  // Track navigation in SPAs (if you add client-side routing later)
  let lastPath = window.location.pathname;
  setInterval(() => {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      analytics.trackPageView();
    }
  }, 500);
}

// Export for manual tracking
export default analytics;
export { analytics };