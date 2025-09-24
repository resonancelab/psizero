/**
 * Accessibility Help Component
 * Provides comprehensive keyboard shortcuts and accessibility feature information
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAccessibility } from './AccessibilityProvider';
import { KeyboardShortcuts, AccessibilityConfig } from '../../lib/quantum-optimizer/accessibility-utils';

interface AccessibilityHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccessibilityHelp({ isOpen, onClose }: AccessibilityHelpProps) {
  const { config, announce } = useAccessibility();
  const [activeSection, setActiveSection] = useState<string>('shortcuts');
  const helpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && helpRef.current) {
      helpRef.current.focus();
      announce('Accessibility help opened. Use Tab to navigate sections and Escape to close.', 'polite');
    }
  }, [isOpen, announce]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case '1':
        setActiveSection('shortcuts');
        announce('Keyboard shortcuts section', 'polite');
        break;
      case '2':
        setActiveSection('navigation');
        announce('Navigation help section', 'polite');
        break;
      case '3':
        setActiveSection('features');
        announce('Accessibility features section', 'polite');
        break;
      case '4':
        setActiveSection('screen-reader');
        announce('Screen reader guide section', 'polite');
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="accessibility-help-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
    >
      <div
        ref={helpRef}
        className="accessibility-help-panel"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <div className="help-header">
          <h1 id="help-title">Accessibility Help</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close help dialog"
          >
            ✕
          </Button>
        </div>

        <div className="help-navigation">
          <Button
            variant={activeSection === 'shortcuts' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSection('shortcuts')}
            aria-pressed={activeSection === 'shortcuts'}
          >
            Keyboard Shortcuts (1)
          </Button>
          <Button
            variant={activeSection === 'navigation' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSection('navigation')}
            aria-pressed={activeSection === 'navigation'}
          >
            Navigation (2)
          </Button>
          <Button
            variant={activeSection === 'features' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSection('features')}
            aria-pressed={activeSection === 'features'}
          >
            Features (3)
          </Button>
          <Button
            variant={activeSection === 'screen-reader' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSection('screen-reader')}
            aria-pressed={activeSection === 'screen-reader'}
          >
            Screen Reader (4)
          </Button>
        </div>

        <div className="help-content">
          {activeSection === 'shortcuts' && <KeyboardShortcutsSection />}
          {activeSection === 'navigation' && <NavigationHelpSection />}
          {activeSection === 'features' && <AccessibilityFeaturesSection config={config} />}
          {activeSection === 'screen-reader' && <ScreenReaderGuideSection />}
        </div>

        <div className="help-footer">
          <p>
            <strong>Quick tip:</strong> Press <kbd>H</kbd> or <kbd>?</kbd> anytime to toggle this help dialog.
            Current accessibility mode: {config.enableScreenReaderSupport ? 'Enhanced' : 'Standard'}
          </p>
        </div>
      </div>
    </div>
  );
}

function KeyboardShortcutsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Keyboard Shortcuts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="shortcuts-grid">
          <div className="shortcut-category">
            <h3>Global Actions</h3>
            <div className="shortcut-list">
              <div className="shortcut-item">
                <div className="shortcut-keys">
                  <kbd>H</kbd> or <kbd>?</kbd>
                </div>
                <div className="shortcut-description">Show/hide this help</div>
              </div>
              <div className="shortcut-item">
                <div className="shortcut-keys">
                  <kbd>Escape</kbd>
                </div>
                <div className="shortcut-description">Close dialogs and panels</div>
              </div>
              <div className="shortcut-item">
                <div className="shortcut-keys">
                  <kbd>Tab</kbd>
                </div>
                <div className="shortcut-description">Navigate forward</div>
              </div>
              <div className="shortcut-item">
                <div className="shortcut-keys">
                  <kbd>Shift</kbd> + <kbd>Tab</kbd>
                </div>
                <div className="shortcut-description">Navigate backward</div>
              </div>
            </div>
          </div>

          <div className="shortcut-category">
            <h3>Algorithm Control</h3>
            <div className="shortcut-list">
              <div className="shortcut-item">
                <div className="shortcut-keys">
                  <kbd>R</kbd>
                </div>
                <div className="shortcut-description">Run/start algorithm</div>
              </div>
              <div className="shortcut-item">
                <div className="shortcut-keys">
                  <kbd>S</kbd>
                </div>
                <div className="shortcut-description">Stop algorithm</div>
              </div>
              <div className="shortcut-item">
                <div className="shortcut-keys">
                  <kbd>Ctrl</kbd> + <kbd>R</kbd>
                </div>
                <div className="shortcut-description">Reset problem</div>
              </div>
            </div>
          </div>

          <div className="shortcut-category">
            <h3>Visualization</h3>
            <div className="shortcut-list">
              <div className="shortcut-item">
                <div className="shortcut-keys">
                  <kbd>+</kbd> or <kbd>=</kbd>
                </div>
                <div className="shortcut-description">Zoom in</div>
              </div>
              <div className="shortcut-item">
                <div className="shortcut-keys">
                  <kbd>-</kbd>
                </div>
                <div className="shortcut-description">Zoom out</div>
              </div>
              <div className="shortcut-item">
                <div className="shortcut-keys">
                  <kbd>0</kbd>
                </div>
                <div className="shortcut-description">Reset zoom</div>
              </div>
              <div className="shortcut-item">
                <div className="shortcut-keys">
                  <kbd>Arrow Keys</kbd>
                </div>
                <div className="shortcut-description">Navigate within visualizations</div>
              </div>
            </div>
          </div>

          <div className="shortcut-category">
            <h3>Data & Views</h3>
            <div className="shortcut-list">
              <div className="shortcut-item">
                <div className="shortcut-keys">
                  <kbd>Ctrl</kbd> + <kbd>E</kbd>
                </div>
                <div className="shortcut-description">Export data</div>
              </div>
              <div className="shortcut-item">
                <div className="shortcut-keys">
                  <kbd>Q</kbd>
                </div>
                <div className="shortcut-description">Toggle quality view</div>
              </div>
              <div className="shortcut-item">
                <div className="shortcut-keys">
                  <kbd>P</kbd>
                </div>
                <div className="shortcut-description">Toggle performance view</div>
              </div>
              <div className="shortcut-item">
                <div className="shortcut-keys">
                  <kbd>N</kbd>
                </div>
                <div className="shortcut-description">Next problem</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NavigationHelpSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Navigation Guide</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="navigation-guide">
          <div className="guide-section">
            <h3>Basic Navigation</h3>
            <ul>
              <li><strong>Tab key:</strong> Move between interactive elements (buttons, inputs, links)</li>
              <li><strong>Shift + Tab:</strong> Move backward through interactive elements</li>
              <li><strong>Enter or Space:</strong> Activate buttons and controls</li>
              <li><strong>Arrow keys:</strong> Navigate within components like city selectors or charts</li>
            </ul>
          </div>

          <div className="guide-section">
            <h3>Component-Specific Navigation</h3>
            <ul>
              <li><strong>TSP Visualizer:</strong> Use arrow keys to move between cities, Enter to select</li>
              <li><strong>Problem Gallery:</strong> Arrow keys to browse problems, Enter to select</li>
              <li><strong>Performance Charts:</strong> Tab to focus, arrow keys to explore data points</li>
              <li><strong>Configuration Panels:</strong> Tab through options, arrow keys for sliders</li>
            </ul>
          </div>

          <div className="guide-section">
            <h3>Focus Indicators</h3>
            <ul>
              <li>All focusable elements show a <strong>blue outline</strong> when focused</li>
              <li>Interactive visualizations highlight the currently focused item</li>
              <li>Screen readers announce focus changes and context</li>
            </ul>
          </div>

          <div className="guide-section">
            <h3>Skip Navigation</h3>
            <ul>
              <li>Use <strong>"Skip to main content"</strong> links to bypass navigation</li>
              <li>Tab from the top of the page to access skip links</li>
              <li>Skip links become visible when focused</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AccessibilityFeaturesSection({ config }: { config: AccessibilityConfig }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accessibility Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-header">
              <h3>High Contrast Mode</h3>
              <Badge variant={config.enableHighContrast ? "default" : "secondary"}>
                {config.enableHighContrast ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <p>Increases visual contrast for better visibility. Automatically detects system preference.</p>
            <ul>
              <li>Enhanced border visibility</li>
              <li>High contrast color scheme</li>
              <li>Improved focus indicators</li>
            </ul>
          </div>

          <div className="feature-item">
            <div className="feature-header">
              <h3>Reduced Motion</h3>
              <Badge variant={config.enableReducedMotion ? "default" : "secondary"}>
                {config.enableReducedMotion ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <p>Reduces animations and motion effects for users with vestibular sensitivities.</p>
            <ul>
              <li>Minimized animation durations</li>
              <li>Reduced transition effects</li>
              <li>Respects system preference</li>
            </ul>
          </div>

          <div className="feature-item">
            <div className="feature-header">
              <h3>Screen Reader Support</h3>
              <Badge variant={config.enableScreenReaderSupport ? "default" : "secondary"}>
                {config.enableScreenReaderSupport ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <p>Enhanced descriptions and live announcements for screen reading software.</p>
            <ul>
              <li>ARIA labels and descriptions</li>
              <li>Live region announcements</li>
              <li>Semantic HTML structure</li>
            </ul>
          </div>

          <div className="feature-item">
            <div className="feature-header">
              <h3>Keyboard Navigation</h3>
              <Badge variant={config.enableKeyboardNavigation ? "default" : "secondary"}>
                {config.enableKeyboardNavigation ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <p>Full functionality accessible via keyboard without requiring a mouse.</p>
            <ul>
              <li>Tab-based navigation</li>
              <li>Arrow key support in visualizations</li>
              <li>Keyboard shortcuts for common actions</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ScreenReaderGuideSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Screen Reader Guide</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="screen-reader-guide">
          <div className="guide-section">
            <h3>Getting Started</h3>
            <p>This application is optimized for screen readers including NVDA, JAWS, and VoiceOver.</p>
            <ul>
              <li>Use your screen reader's navigation modes (browse/focus)</li>
              <li>Enable virtual cursor for reading content</li>
              <li>Use application mode for interactive elements</li>
            </ul>
          </div>

          <div className="guide-section">
            <h3>Content Structure</h3>
            <ul>
              <li><strong>Headings:</strong> Use heading navigation (H key in NVDA/JAWS) to jump between sections</li>
              <li><strong>Landmarks:</strong> Navigate by landmarks (D key) to find main content areas</li>
              <li><strong>Lists:</strong> Problem galleries and results are structured as lists</li>
              <li><strong>Tables:</strong> Data is presented in accessible table format where appropriate</li>
            </ul>
          </div>

          <div className="guide-section">
            <h3>Interactive Elements</h3>
            <ul>
              <li><strong>Buttons:</strong> All actions are available via properly labeled buttons</li>
              <li><strong>Forms:</strong> Input fields have descriptive labels and instructions</li>
              <li><strong>Visualizations:</strong> Alternative text descriptions provided for all charts and graphs</li>
              <li><strong>Progress:</strong> Algorithm progress announced in live regions</li>
            </ul>
          </div>

          <div className="guide-section">
            <h3>Live Announcements</h3>
            <p>The application provides real-time feedback through ARIA live regions:</p>
            <ul>
              <li>Algorithm start/stop notifications</li>
              <li>Solution quality updates</li>
              <li>Error messages and warnings</li>
              <li>Navigation and state changes</li>
            </ul>
          </div>

          <div className="guide-section">
            <h3>Visualization Descriptions</h3>
            <ul>
              <li><strong>TSP Maps:</strong> City locations and routes described textually</li>
              <li><strong>Performance Charts:</strong> Data trends and comparisons explained</li>
              <li><strong>Quality Gauges:</strong> Current values and ranges announced</li>
              <li><strong>Progress Indicators:</strong> Completion percentages provided</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// CSS Styles
export const accessibilityHelpStyles = `
.accessibility-help-overlay {
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
  padding: 20px;
}

.accessibility-help-panel {
  background: white;
  border-radius: 12px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
}

.help-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e1e5e9;
}

.help-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
}

.help-navigation {
  display: flex;
  gap: 8px;
  padding: 16px 24px;
  border-bottom: 1px solid #e1e5e9;
  flex-wrap: wrap;
}

.help-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.help-footer {
  padding: 16px 24px;
  border-top: 1px solid #e1e5e9;
  background: #f8f9fa;
  border-radius: 0 0 12px 12px;
}

.help-footer p {
  margin: 0;
  font-size: 14px;
  color: #6c757d;
}

.shortcuts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.shortcut-category h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e74c3c;
  padding-bottom: 8px;
}

.shortcut-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.shortcut-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.shortcut-keys {
  display: flex;
  gap: 4px;
  align-items: center;
  flex-shrink: 0;
}

.shortcut-keys kbd {
  background: #f4f4f4;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 2px 6px;
  font-family: monospace;
  font-size: 12px;
  font-weight: bold;
  color: #333;
}

.shortcut-description {
  font-size: 14px;
  color: #555;
  text-align: right;
}

.navigation-guide,
.screen-reader-guide {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.guide-section h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.guide-section ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.guide-section li {
  margin: 8px 0;
  line-height: 1.5;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.feature-item {
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 20px;
}

.feature-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.feature-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.feature-item p {
  margin: 0 0 12px 0;
  color: #555;
  line-height: 1.5;
}

.feature-item ul {
  margin: 0;
  padding-left: 20px;
}

.feature-item li {
  margin: 4px 0;
  font-size: 14px;
  color: #666;
}

/* High contrast adjustments */
.high-contrast .accessibility-help-panel {
  background: var(--hc-bg, #000) !important;
  border: 2px solid var(--hc-fg, #fff) !important;
}

.high-contrast .help-header,
.high-contrast .help-navigation,
.high-contrast .help-footer {
  border-color: var(--hc-fg, #fff) !important;
}

.high-contrast .feature-item {
  border-color: var(--hc-fg, #fff) !important;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .accessibility-help-overlay {
    padding: 10px;
  }
  
  .help-navigation {
    flex-direction: column;
  }
  
  .shortcuts-grid {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .shortcut-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .shortcut-description {
    text-align: left;
  }
}
`;