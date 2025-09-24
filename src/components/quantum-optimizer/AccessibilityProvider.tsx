/**
 * Accessibility Provider Component
 * Wraps the quantum optimizer with comprehensive accessibility features
 */

import React, { createContext, useContext, useRef, useEffect } from 'react';
import {
  useAccessibilityPreferences,
  useAnnouncements,
  useFocusManagement,
  HighContrastTheme,
  ReducedMotion,
  AccessibilityConfig
} from '../../lib/quantum-optimizer/accessibility-utils';

interface AccessibilityContextType {
  config: AccessibilityConfig;
  announce: (message: string, type?: 'polite' | 'assertive' | 'off') => void;
  trapFocus: (element: HTMLElement) => void;
  releaseFocus: () => void;
  moveFocus: (direction: 'next' | 'previous' | 'first' | 'last') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const config = useAccessibilityPreferences();
  const { announce } = useAnnouncements();
  const { trapFocus, releaseFocus, moveFocus } = useFocusManagement();
  const initRef = useRef(false);

  // Apply accessibility themes and settings
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    // Apply high contrast theme if preferred
    if (config.enableHighContrast) {
      HighContrastTheme.apply();
    } else {
      HighContrastTheme.remove();
    }

    // Apply reduced motion if preferred
    if (config.enableReducedMotion) {
      ReducedMotion.apply();
    } else {
      ReducedMotion.remove();
    }

    // Add accessibility CSS classes to root
    const root = document.documentElement;
    root.classList.toggle('accessibility-keyboard-nav', config.enableKeyboardNavigation);
    root.classList.toggle('accessibility-screen-reader', config.enableScreenReaderSupport);

    // Announce accessibility features on load
    if (config.enableScreenReaderSupport) {
      setTimeout(() => {
        announce('Quantum optimization demo loaded with accessibility features enabled. Press H for help with keyboard shortcuts.', 'polite');
      }, 1000);
    }
  }, [config, announce]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      HighContrastTheme.remove();
      ReducedMotion.remove();
      document.documentElement.classList.remove(
        'accessibility-keyboard-nav',
        'accessibility-screen-reader',
        'high-contrast',
        'reduced-motion'
      );
    };
  }, []);

  const contextValue: AccessibilityContextType = {
    config,
    announce,
    trapFocus,
    releaseFocus,
    moveFocus
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      <div 
        className="accessibility-wrapper"
        role="application"
        aria-label="Quantum Optimization Demo"
      >
        {children}
        <LiveRegion />
        <SkipNavigation />
      </div>
    </AccessibilityContext.Provider>
  );
}

/**
 * Live Region Component for Screen Reader Announcements
 */
function LiveRegion() {
  const { announce } = useAnnouncements();

  return (
    <>
      <div
        id="live-region-polite"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      <div
        id="live-region-assertive"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />
    </>
  );
}

/**
 * Skip Navigation Component
 */
function SkipNavigation() {
  const handleSkipToMain = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  };

  const handleSkipToNavigation = () => {
    const navigation = document.getElementById('main-navigation');
    if (navigation) {
      navigation.focus();
      navigation.scrollIntoView();
    }
  };

  return (
    <div className="skip-navigation">
      <button
        className="skip-link"
        onClick={handleSkipToMain}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSkipToMain();
          }
        }}
      >
        Skip to main content
      </button>
      <button
        className="skip-link"
        onClick={handleSkipToNavigation}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSkipToNavigation();
          }
        }}
      >
        Skip to navigation
      </button>
    </div>
  );
}

/**
 * Accessibility Options Panel Component
 */
interface AccessibilityOptionsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccessibilityOptionsPanel({ isOpen, onClose }: AccessibilityOptionsPanelProps) {
  const { config, announce } = useAccessibility();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && panelRef.current) {
      panelRef.current.focus();
      announce('Accessibility options panel opened', 'polite');
    }
  }, [isOpen, announce]);

  const handleToggleHighContrast = () => {
    if (config.enableHighContrast) {
      HighContrastTheme.remove();
      announce('High contrast mode disabled', 'polite');
    } else {
      HighContrastTheme.apply();
      announce('High contrast mode enabled', 'polite');
    }
  };

  const handleToggleReducedMotion = () => {
    if (config.enableReducedMotion) {
      ReducedMotion.remove();
      announce('Reduced motion disabled', 'polite');
    } else {
      ReducedMotion.apply();
      announce('Reduced motion enabled', 'polite');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="accessibility-panel-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-panel-title"
    >
      <div
        ref={panelRef}
        className="accessibility-panel"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <div className="accessibility-panel-header">
          <h2 id="accessibility-panel-title">Accessibility Options</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close accessibility options panel"
          >
            ✕
          </button>
        </div>

        <div className="accessibility-panel-content">
          <div className="accessibility-option">
            <label>
              <input
                type="checkbox"
                checked={config.enableHighContrast}
                onChange={handleToggleHighContrast}
                aria-describedby="high-contrast-desc"
              />
              <span>High Contrast Mode</span>
            </label>
            <div id="high-contrast-desc" className="option-description">
              Increases contrast for better visibility
            </div>
          </div>

          <div className="accessibility-option">
            <label>
              <input
                type="checkbox"
                checked={config.enableReducedMotion}
                onChange={handleToggleReducedMotion}
                aria-describedby="reduced-motion-desc"
              />
              <span>Reduced Motion</span>
            </label>
            <div id="reduced-motion-desc" className="option-description">
              Reduces animations and motion effects
            </div>
          </div>

          <div className="accessibility-option">
            <label>
              <input
                type="checkbox"
                checked={config.enableKeyboardNavigation}
                readOnly
                aria-describedby="keyboard-nav-desc"
              />
              <span>Keyboard Navigation</span>
            </label>
            <div id="keyboard-nav-desc" className="option-description">
              Navigate using arrow keys, Tab, and other keyboard shortcuts
            </div>
          </div>

          <div className="accessibility-option">
            <label>
              <input
                type="checkbox"
                checked={config.enableScreenReaderSupport}
                readOnly
                aria-describedby="screen-reader-desc"
              />
              <span>Screen Reader Support</span>
            </label>
            <div id="screen-reader-desc" className="option-description">
              Enhanced descriptions and live announcements for screen readers
            </div>
          </div>
        </div>

        <div className="accessibility-panel-footer">
          <div className="keyboard-shortcuts">
            <h3>Keyboard Shortcuts</h3>
            <ul>
              <li><kbd>H</kbd> - Show/hide help</li>
              <li><kbd>R</kbd> - Run algorithm</li>
              <li><kbd>S</kbd> - Stop algorithm</li>
              <li><kbd>Ctrl+E</kbd> - Export data</li>
              <li><kbd>Escape</kbd> - Close dialogs</li>
              <li><kbd>Tab</kbd> - Navigate forward</li>
              <li><kbd>Shift+Tab</kbd> - Navigate backward</li>
              <li><kbd>Arrow Keys</kbd> - Navigate within components</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// CSS Styles for accessibility components
export const accessibilityStyles = `
.accessibility-wrapper {
  position: relative;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.skip-navigation {
  position: absolute;
  top: -100px;
  left: 0;
  z-index: 1000;
}

.skip-link {
  position: absolute;
  top: 0;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px 16px;
  text-decoration: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 0;
}

.accessibility-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.accessibility-panel {
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.accessibility-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 12px;
}

.accessibility-panel-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.close-button:hover,
.close-button:focus {
  background: #f0f0f0;
  outline: 2px solid #007bff;
}

.accessibility-option {
  margin-bottom: 16px;
}

.accessibility-option label {
  display: flex;
  align-items: center;
  font-weight: 500;
  cursor: pointer;
}

.accessibility-option input[type="checkbox"] {
  margin-right: 8px;
  width: 16px;
  height: 16px;
}

.option-description {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
  margin-left: 24px;
}

.keyboard-shortcuts {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.keyboard-shortcuts h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
}

.keyboard-shortcuts ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.keyboard-shortcuts li {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 14px;
}

.keyboard-shortcuts kbd {
  background: #f4f4f4;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 2px 6px;
  font-family: monospace;
  font-size: 12px;
}

/* High Contrast Theme Styles */
.high-contrast {
  background: var(--hc-bg, #000) !important;
  color: var(--hc-fg, #fff) !important;
}

.high-contrast * {
  background-color: var(--hc-bg, #000) !important;
  color: var(--hc-fg, #fff) !important;
  border-color: var(--hc-fg, #fff) !important;
}

.high-contrast button,
.high-contrast input,
.high-contrast select,
.high-contrast textarea {
  background: var(--hc-bg, #000) !important;
  color: var(--hc-fg, #fff) !important;
  border: 2px solid var(--hc-fg, #fff) !important;
}

.high-contrast button:hover,
.high-contrast button:focus {
  background: var(--hc-primary, #ffff00) !important;
  color: var(--hc-bg, #000) !important;
}

.high-contrast :focus {
  outline: 3px solid var(--hc-focus, #ffff00) !important;
  outline-offset: 2px !important;
}

/* Focus indicators for keyboard navigation */
.accessibility-keyboard-nav :focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

.accessibility-keyboard-nav button:focus,
.accessibility-keyboard-nav input:focus,
.accessibility-keyboard-nav select:focus,
.accessibility-keyboard-nav textarea:focus {
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

/* Reduced motion styles */
.reduced-motion *,
.reduced-motion *:before,
.reduced-motion *:after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`;