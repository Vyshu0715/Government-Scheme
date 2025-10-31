  import { useState, useEffect } from 'react';
// MODIFIED: Corrected import paths
import { useAuth } from '../contexts/AuthContext.jsx';
import { api } from '../lib/api.js';
// MODIFIED: Added all icons for sidebar, cards, and modal
import { 
  User, 
  LogOut, 
  FileText, 
  AlertCircle, 
  LayoutDashboard, 
  BookOpen, 
  CheckCircle, 
  Phone, 
  X,
  List,
  Award
} from 'lucide-react';

// --- STYLES OBJECT (CONSISTENT REDESIGN, USER-THEME) ---
const colors = {
  primary: '#2563EB',        // Blue-600 (Brand)
  primaryDark: '#1D4ED8',     // Blue-700 (Brand Hover)
  primaryLight: '#EFF6FF',    // Blue-50 (Brand Light BG)
  
  textPrimary: '#1F2937',     // Gray-800 (Titles)
  textSecondary: '#4B5563',   // Gray-600 (Body)
  textMuted: '#6B7280',       // Gray-500 (Subtitles)
  
  background: '#F9FAFB',      // Gray-50 (Page BG)
  card: '#FFFFFF',          // White (Card BG)
  border: '#E5E7EB',        // Gray-200 (Borders)
  
  success: '#059669',        // Green-700
  successLight: '#ECFDF5',    // Green-50
  successText: '#065F46',     // Green-800

  danger: '#DC2626',         // Red-700
  dangerLight: '#FEF2F2',     // Red-50
  dangerText: '#991B1B',      // Red-800

  warning: '#D97706',        // Yellow-700
  warningLight: '#FFFBEB',    // Yellow-50
  warningText: '#B45309',     // Yellow-800
};

const styles = {
  // --- Layout ---
  layout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: colors.background,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  sidebar: {
    width: '240px',
    backgroundColor: colors.card,
    borderRight: `1px solid ${colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem',
    boxSizing: 'border-box',
    flexShrink: 0,
  },
  mainContent: {
    flex: 1,
    padding: '2.5rem',
    maxHeight: '100vh',
    overflowY: 'auto',
    boxSizing: 'border-box',
  },
  
  // --- Sidebar ---
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    paddingBottom: '1.5rem',
    marginBottom: '1.5rem',
    borderBottom: `1px solid ${colors.border}`,
  },
  sidebarLogoIcon: {
    width: 28,
    height: 28,
    color: colors.primary,
  },
  sidebarLogoText: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: colors.primary,
  },
  sidebarNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  sidebarLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    color: colors.textSecondary,
    fontWeight: '500',
    transition: 'background-color 0.15s, color 0.15s',
  },
  sidebarLinkIcon: {
    width: 20,
    height: 20,
  },
  sidebarLinkActive: {
    backgroundColor: colors.primaryLight,
    color: colors.primary,
  },
  sidebarFooter: {
    marginTop: 'auto',
    borderTop: `1px solid ${colors.border}`,
    paddingTop: '1.5rem',
  },
  sidebarUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  sidebarUserIcon: {
    width: 24,
    height: 24,
    color: colors.textMuted,
  },
  sidebarUserName: {
    color: colors.textSecondary,
    fontWeight: '500',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.5rem',
    borderRadius: '0.375rem',
    color: colors.danger,
    background: 'none',
    border: '1px solid transparent',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.15s, border-color 0.15s',
  },
  logoutButtonHover: {
    backgroundColor: colors.dangerLight,
    borderColor: colors.danger,
  },
  
  // --- Main Content ---
  header: {
    marginBottom: '2rem',
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: '1.5rem',
  },
  headerTitle: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: '0.5rem',
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: '1rem',
  },
  
  // --- Scheme Grid ---
  schemeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem',
  },
  schemeCard: {
    backgroundColor: colors.card,
    borderRadius: '0.5rem',
    border: `1px solid ${colors.border}`,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column', // To push button to bottom
  },
  schemeCardContent: {
    padding: '1.5rem',
  },
  schemeCardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '1.25rem',
  },
  schemeCardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  schemeCardBadge: {
    backgroundColor: colors.primaryLight,
    color: colors.primaryDark,
    fontSize: '0.75rem',
    fontWeight: '500',
    padding: '0.25rem 0.625rem',
    borderRadius: '0.25rem',
    flexShrink: 0,
    marginLeft: '1rem',
  },
  schemeCardDescription: {
    color: colors.textSecondary,
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  schemeCardSection: {
    marginBottom: '1rem',
  },
  schemeCardSectionTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
  },
  schemeCardList: {
    listStyleType: 'disc',
    listStylePosition: 'inside',
    fontSize: '0.875rem',
    color: colors.textSecondary,
    paddingLeft: '0.25rem',
  },
  schemeCardText: {
    fontSize: '0.875rem',
    color: colors.textSecondary,
  },
  schemeCardNotes: {
    backgroundColor: colors.warningLight,
    borderLeft: `4px solid ${colors.warning}`,
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
    fontSize: '0.875rem',
    color: colors.warningText,
  },
  schemeCardFooter: {
    marginTop: 'auto', // Pushes to bottom
    padding: '1.5rem',
    borderTop: `1px solid ${colors.border}`,
    backgroundColor: colors.background, // Light gray footer
  },
  
  // --- Buttons ---
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    borderRadius: '0.375rem',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.15s, opacity 0.15s',
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    color: 'white',
  },
  buttonPrimaryHover: {
    backgroundColor: colors.primaryDark,
  },
  buttonSecondary: {
    backgroundColor: colors.card,
    color: colors.textSecondary,
    border: `1px solid ${colors.border}`,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  buttonSecondaryHover: {
    backgroundColor: '#F3F4F6', // Gray-100
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  // --- Modal ---
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: '1rem',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: '0.5rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: '0', // No padding, header/footer will have it
    maxWidth: '42rem',
    width: '100%',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    padding: '1.5rem',
    borderBottom: `1px solid ${colors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: colors.textPrimary,
  },
  modalCloseButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: colors.textMuted,
  },
  modalBody: {
    padding: '1.5rem',
    overflowY: 'auto',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  modalFormField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  modalFormLabel: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: colors.textSecondary,
  },
  modalFormInput: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '0.375rem',
    backgroundColor: colors.card,
    color: colors.textSecondary,
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    fontSize: '0.875rem',
  },
  modalFooter: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    padding: '1.5rem',
    borderTop: `1px solid ${colors.border}`,
    backgroundColor: colors.background,
  },

  // --- Notification ---
  notification: {
    position: 'fixed',
    top: '1.5rem',
    right: '1.5rem',
    zIndex: 100,
    maxWidth: '400px',
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: '0.5rem',
    border: `1px solid ${colors.border}`,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    padding: '1rem',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    flexShrink: 0,
    width: 24,
    height: 24,
    marginRight: '0.75rem',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  notificationMessage: {
    marginTop: '0.25rem',
    color: colors.textSecondary,
    fontSize: '0.875rem',
  },
  notificationClose: {
    marginLeft: '1rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: colors.textMuted,
  }
};
// --- END OF STYLES ---

// --- Helper Function: Notification ---
const getNotification = (notification, setNotification) => {
  if (!notification.message) return null;

  const isError = notification.type === 'error';
  const style = {
    ...styles.notification,
    borderLeft: `4px solid ${isError ? colors.danger : colors.success}`
  };
  
  return (
    <div style={style}>
      {isError ? (
        <AlertCircle style={{ ...styles.notificationIcon, color: colors.danger }} />
      ) : (
        <CheckCircle style={{ ...styles.notificationIcon, color: colors.success }} />
      )}
      <div style={styles.notificationContent}>
        <p style={styles.notificationTitle}>{isError ? 'Error' : 'Success'}</p>
        <p style={styles.notificationMessage}>{notification.message}</p>
      </div>
      <button 
        style={styles.notificationClose}
        onClick={() => setNotification({ type: '', message: '' })}
      >
        <X style={{ width: 16, height: 16 }} />
      </button>
    </div>
  );
};

// --- Sidebar Component ---
// (Extracted for cleanliness)
const Sidebar = ({ userProfile, handleLogout, activeLink, hover, setHover }) => {
  const getSidebarLinkStyle = (linkName) => ({
    ...styles.sidebarLink,
    ...(linkName === activeLink && styles.sidebarLinkActive),
    ...(hover.type === 'link' && hover.id === linkName && linkName !== activeLink && { backgroundColor: colors.background })
  });

  const getLogoutStyle = () => ({
    ...styles.logoutButton,
    ...(hover.type === 'button' && hover.id === 'logout' && styles.logoutButtonHover)
  });

  return (
    <div style={styles.sidebar}>
      <div style={styles.sidebarLogo}>
        <svg style={styles.sidebarLogoIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m6-4h1m-1 4h1m-1-8h1m-1 4h1m-1 4h1" />
        </svg>
        <h1 style={{ ...styles.sidebarLogoText, color: colors.primary }}>AP Scheme Portal</h1>
      </div>
      <nav style={styles.sidebarNav}>
        <a 
          href="/user/home" 
          style={getSidebarLinkStyle('Home')}
          onMouseEnter={() => setHover({ type: 'link', id: 'Home' })}
          onMouseLeave={() => setHover({ type: null, id: null })}
        >
          <LayoutDashboard style={styles.sidebarLinkIcon} />
          <span>Home</span>
        </a>
        <a 
          href="/user/schemes" 
          style={getSidebarLinkStyle('Schemes')}
          onMouseEnter={() => setHover({ type: 'link', id: 'Schemes' })}
          onMouseLeave={() => setHover({ type: null, id: null })}
        >
          <BookOpen style={styles.sidebarLinkIcon} />
          <span>Schemes</span>
        </a>
        <a 
          href="/user/eligibility" 
          style={getSidebarLinkStyle('Eligibility')}
          onMouseEnter={() => setHover({ type: 'link', id: 'Eligibility' })}
          onMouseLeave={() => setHover({ type: null, id: null })}
        >
          <CheckCircle style={styles.sidebarLinkIcon} />
          <span>Check Eligibility</span>
        </a>
        <a 
          href="/user/contact" 
          style={getSidebarLinkStyle('Contact')}
          onMouseEnter={() => setHover({ type: 'link', id: 'Contact' })}
          onMouseLeave={() => setHover({ type: null, id: null })}
        >
          <Phone style={styles.sidebarLinkIcon} />
          <span>Contact</span>
        </a>
      </nav>
      
      <div style={styles.sidebarFooter}>
        <div style={styles.sidebarUser}>
          <User style={styles.sidebarUserIcon} />
          <span style={styles.sidebarUserName}>{userProfile?.username}</span>
        </div>
        <button
          onClick={handleLogout}
          style={getLogoutStyle()}
          onMouseEnter={() => setHover({ type: 'button', id: 'logout' })}
          onMouseLeave={() => setHover({ type: null, id: null })}
        >
          <LogOut style={{ width: 16, height: 16 }} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};


// --- Main Component ---
export default function Schemes() {
  const { userProfile, signOut } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  
  // MODIFIED: Replaced showApplicationForm with showModal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  
  // MODIFIED: Replaced message with notification state
  const [notification, setNotification] = useState({ type: '', message: '' });
  
  // State for hover effects
  const [hover, setHover] = useState({ type: null, id: null });

  useEffect(() => {
    loadSchemes();
  }, []);
  
  // Effect to clear notifications
  useEffect(() => {
    if(notification.message) {
      const timer = setTimeout(() => {
        setNotification({ type: '', message: '' });
      }, 3000); // Clear after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadSchemes = async () => {
    try {
      // MODIFIED: Removed ?is_active=true to match server.js
      const data = await api.get('/api/schemes');
      setSchemes(data || []);
    } catch (_) {
      setSchemes([]);
      setNotification({ type: 'error', message: 'Failed to load schemes.' });
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleApplyClick = (scheme) => {
    setSelectedScheme(scheme);
    setShowModal(true);
    setFormData({});
    setNotification({ type: '', message: '' });
  };
  
  const closeModal = () => {
    if (loading) return; // Don't close if loading
    setShowModal(false);
    setSelectedScheme(null);
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ type: '', message: '' });

    try {
      await api.post('/api/applications', {
        schemeId: selectedScheme._id,
        application_data: formData,
      });

      setNotification({ type: 'success', message: 'Application submitted successfully! You can track status in your profile.' });
      setTimeout(() => {
        closeModal();
      }, 1500); // Close modal after success
    } catch (err) {
      setNotification({ type: 'error', message: err?.message || 'Failed to submit application. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const formatFieldName = (field) => {
    const result = field.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  };
  
  // --- Dynamic Styles for Hover ---
  const getButtonStyle = (id, type = 'primary') => {
    const baseStyle = type === 'primary' ? styles.buttonPrimary : styles.buttonSecondary;
    const hoverStyle = type === 'primary' ? styles.buttonPrimaryHover : styles.buttonSecondaryHover;
    
    let style = { ...styles.button, ...baseStyle };
    if (hover.type === 'button' && hover.id === id) style = { ...style, ...hoverStyle };
    if (loading) style = { ...style, ...styles.buttonDisabled };
    return style;
  };

  return (
    <div style={styles.layout}>
      {/* --- Notification Toast --- */}
      {getNotification(notification, setNotification)}
      
      {/* --- Sidebar --- */}
      <Sidebar 
        userProfile={userProfile}
        handleLogout={handleLogout}
        activeLink="Schemes"
        hover={hover}
        setHover={setHover}
      />

      {/* --- Main Content --- */}
      <div style={styles.mainContent}>
        <header style={styles.header}>
          <h2 style={styles.headerTitle}>Government Welfare Schemes</h2>
          <p style={styles.headerSubtitle}>Browse all available schemes and apply online</p>
        </header>

        {/* --- Scheme List --- */}
        <div style={styles.schemeGrid}>
          {schemes.map((scheme) => (
            <div key={scheme._id} style={styles.schemeCard}>
              <div style={styles.schemeCardContent}>
                <div style={styles.schemeCardHeader}>
                  <h3 style={styles.schemeCardTitle}>{scheme.name}</h3>
                  <span style={styles.schemeCardBadge}>
                    {scheme.category}
                  </span>
                </div>

                <p style={styles.schemeCardDescription}>{scheme.description}</p>

                <div style={styles.schemeCardSection}>
                  <h4 style={styles.schemeCardSectionTitle}>
                    <Award style={{ width: 16, height: 16 }} />
                    Benefits:
                  </h4>
                  <p style={styles.schemeCardText}>{scheme.benefits}</p>
                </div>
                
                <div style={{ ...styles.schemeCardSection, marginTop: '1rem' }}>
                  <h4 style={styles.schemeCardSectionTitle}>
                    <List style={{ width: 16, height: 16 }} />
                    Required Documents:
                  </h4>
                  <ul style={styles.schemeCardList}>
                    {scheme.required_documents.map((doc, idx) => (
                      <li key={idx}>{doc}</li>
                    ))}
                    {scheme.required_documents.length === 0 && <li>No documents specified.</li>}
                  </ul>
                </div>

                {scheme.important_notes && (
                  <div style={{ ...styles.schemeCardSection, marginTop: '1rem' }}>
                    <div style={styles.schemeCardNotes}>
                      <strong style={{ fontWeight: '700' }}>Important:</strong> {scheme.important_notes}
                    </div>
                  </div>
                )}
              </div>
              
              <div style={styles.schemeCardFooter}>
                <button
                  onClick={() => handleApplyClick(scheme)}
                  style={{ ...getButtonStyle(`apply-${scheme._id}`, 'primary'), width: '100%' }}
                  onMouseEnter={() => setHover({ type: 'button', id: `apply-${scheme._id}` })}
                  onMouseLeave={() => setHover({ type: null, id: null })}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {schemes.length === 0 && (
           <div style={{ ...styles.card, ...styles.cardContent, marginTop: '2rem', textAlign: 'center' }}>
            <FileText style={{ width: 64, height: 64, color: colors.border, margin: '0 auto 1rem' }} />
            <p style={styles.headerSubtitle}>No active schemes are available at this time. Please check back later.</p>
          </div>
        )}
      </div>
      
      {/* --- Application Modal --- */}
      {showModal && selectedScheme && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                Apply for: {selectedScheme.name}
              </h3>
              <button onClick={closeModal} style={styles.modalCloseButton} disabled={loading}>
                <X style={{ width: 24, height: 24 }} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitApplication}>
              <div style={styles.modalBody}>
                <div style={styles.modalForm}>
                  <p style={styles.textSecondary}>Please fill out the form below. All fields are required.</p>
                  {selectedScheme.application_fields.map((field, idx) => (
                    <div key={idx} style={styles.modalFormField}>
                      <label htmlFor={field} style={styles.modalFormLabel}>
                        {formatFieldName(field)}
                      </label>
                      <input
                        id={field}
                        type="text"
                        required
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        style={styles.modalFormInput}
                        placeholder={`Enter ${formatFieldName(field).toLowerCase()}`}
                      />
                    </div>
                  ))}
                  {selectedScheme.application_fields.length === 0 && (
                    <p style={styles.textMuted}>This scheme does not require any additional information.</p>
                  )}
                </div>
              </div>
              
              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  style={getButtonStyle('cancel', 'secondary')}
                  onMouseEnter={() => setHover({ type: 'button', id: 'cancel' })}
                  onMouseLeave={() => setHover({ type: null, id: null })}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={getButtonStyle('submit', 'primary')}
                  onMouseEnter={() => setHover({ type: 'button', id: 'submit' })}
                  onMouseLeave={() => setHover({ type: null, id: null })}
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}