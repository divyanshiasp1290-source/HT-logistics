/**
 * HK Logistic Sp. z o.o - Main UX & Interactions Engine
 * 
 * Features:
 * - Dynamic config binding (email, phone, address from HK_CONFIG)
 * - Corporate sticky header & smooth mobile drawer
 * - Animated metrics counters
 * - Tabbed interfaces
 * - Production-ready enquiry form with direct email routing & confirmation modal
 */

document.addEventListener('DOMContentLoaded', () => {
  applyConfigBindings();
  initHeader();
  initMobileDrawer();
  initMetricsCounter();
  initTabs();
  initToast();
  initEnquiryForms();
});

/* ==========================================================================
   Apply Dynamic HK_CONFIG Values Across Elements
   ========================================================================== */
function applyConfigBindings() {
  if (typeof HK_CONFIG === 'undefined') return;

  // Bind public email
  document.querySelectorAll('[data-bind-email]').forEach(el => {
    const displayEmail = (typeof HK_CONFIG !== 'undefined' && HK_CONFIG.PUBLIC_EMAIL) 
      ? HK_CONFIG.PUBLIC_EMAIL 
      : 'info@hklogisticspolka.com';
    el.textContent = displayEmail;
    if (el.tagName === 'A') {
      el.setAttribute('href', `mailto:${displayEmail}`);
    }
  });

  // Bind address
  document.querySelectorAll('[data-bind-address]').forEach(el => {
    el.innerHTML = `${HK_CONFIG.ADDRESS_LINE_1}<br>${HK_CONFIG.ADDRESS_LINE_2}<br>${HK_CONFIG.ADDRESS_CITY}`;
  });
}

/* ==========================================================================
   Sticky Header on Scroll
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   Mobile Drawer Navigation
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  const closeBtn = document.querySelector('.drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   Animated Number Counters
   ========================================================================== */
function initMetricsCounter() {
  const metricElements = document.querySelectorAll('.metric-val-num');
  if (!metricElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target') || '0');
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        const duration = 1600;
        const startTime = performance.now();

        const updateCount = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = (target * easeProgress).toFixed(decimals);

          if (decimals === 0) {
            el.textContent = parseInt(currentVal, 10).toLocaleString();
          } else {
            el.textContent = currentVal;
          }

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            if (decimals === 0) {
              el.textContent = target.toLocaleString();
            } else {
              el.textContent = target.toFixed(decimals);
            }
          }
        };

        requestAnimationFrame(updateCount);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  metricElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   Tab Components
   ========================================================================== */
function initTabs() {
  const tabContainers = document.querySelectorAll('[data-tabs]');

  tabContainers.forEach(container => {
    const buttons = container.querySelectorAll('.tab-btn');
    const contents = container.querySelectorAll('.tab-content');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');

        buttons.forEach(b => b.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const targetContent = container.querySelector(targetId);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  });
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function initToast() {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  window.showToast = (message, title = 'HK Logistic Sp. z o.o') => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div style="color: var(--accent); font-size: 1.25rem;">
        <svg width="22" height="22" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
      </div>
      <div>
        <strong style="display:block; font-size:0.9rem; color:#fff;">${title}</strong>
        <span style="font-size:0.8125rem; color:#CBD5E1;">${message}</span>
      </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  };
}

/* ==========================================================================
   Production-Ready Enquiry Form with Client Email Routing
   ========================================================================== */
/* ==========================================================================
   Production-Ready Enquiry Form with Web3Forms Integration
   ========================================================================== */
function initEnquiryForms() {
  const forms = document.querySelectorAll('form[data-enquiry-form], form[data-b2b-form]');

  forms.forEach(form => {
    // Populate hidden access_key input from HK_CONFIG if present
    const keyInput = form.querySelector('#web3forms_access_key') || form.querySelector('[name="access_key"]');
    if (keyInput && typeof HK_CONFIG !== 'undefined' && HK_CONFIG.WEB3FORMS_ACCESS_KEY) {
      keyInput.value = HK_CONFIG.WEB3FORMS_ACCESS_KEY;
    }

    let isSubmitting = false;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Prevent duplicate submissions
      if (isSubmitting) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit Enquiry';
      const statusBox = form.querySelector('#formStatus') || form.querySelector('.form-status-msg');

      // Clear previous status
      if (statusBox) {
        statusBox.style.display = 'none';
        statusBox.innerHTML = '';
      }

      // Collect form values
      const fullNameInput = form.querySelector('[name="fullName"]');
      const emailInput = form.querySelector('[name="email"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const companyInput = form.querySelector('[name="company"]');
      const serviceInput = form.querySelector('[name="primaryService"]');
      const palletsInput = form.querySelector('[name="estimatedPallets"]');
      const detailsInput = form.querySelector('[name="projectDetails"]');

      const fullName = fullNameInput?.value?.trim() || '';
      const email = emailInput?.value?.trim() || '';
      const phone = phoneInput?.value?.trim() || '';
      const company = companyInput?.value?.trim() || '';
      const service = serviceInput?.value || 'General Logistics Enquiry';
      const pallets = palletsInput?.value || 'N/A';
      const details = detailsInput?.value?.trim() || 'No additional project scope provided.';

      // Validation 1: Full Name
      if (!fullName) {
        showFormError(form, fullNameInput, 'Please provide your Full Name.');
        return;
      }

      // Validation 2: Corporate Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailPattern.test(email)) {
        showFormError(form, emailInput, 'Please provide a valid corporate email address.');
        return;
      }

      // Validation 3: Phone Number
      if (!phone || phone.length < 6) {
        showFormError(form, phoneInput, 'Please provide a valid direct contact phone number.');
        return;
      }

      // Validation 4: Company / Brand Name
      if (!company) {
        showFormError(form, companyInput, 'Please specify your Company or Brand Name.');
        return;
      }

      // Validation 5: Primary Service Needed
      if (!service) {
        showFormError(form, serviceInput, 'Please select a primary service of interest.');
        return;
      }

      const clientEmail = (typeof HK_CONFIG !== 'undefined' && HK_CONFIG.CLIENT_EMAIL)
        ? HK_CONFIG.CLIENT_EMAIL
        : 'info@hklogisticspolka.com';

      const accessKey = (typeof HK_CONFIG !== 'undefined' && HK_CONFIG.WEB3FORMS_ACCESS_KEY)
        ? HK_CONFIG.WEB3FORMS_ACCESS_KEY
        : 'your_web3forms_access_key_here';

      const endpoint = (typeof HK_CONFIG !== 'undefined' && HK_CONFIG.WEB3FORMS_ENDPOINT)
        ? HK_CONFIG.WEB3FORMS_ENDPOINT
        : 'https://api.web3forms.com/submit';

      const refId = 'HK-RFQ-' + Math.floor(100000 + Math.random() * 900000);

      const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
      const isPlaceholderKey = !accessKey || 
        accessKey === 'your_web3forms_access_key_here' || 
        accessKey.includes('placeholder') ||
        !uuidRegex.test(accessKey.trim());

      // Prepare mailto fallback payload
      const emailSubject = encodeURIComponent(`HK Logistic Sp. z o.o Service Enquiry: ${service} - ${company}`);
      const emailBody = encodeURIComponent(
        `Dear HK Logistic Sp. z o.o Commercial Team,\n\n` +
        `A new corporate enquiry has been submitted:\n\n` +
        `-----------------------------------------\n` +
        `Full Name: ${fullName}\n` +
        `Company / Brand Name: ${company}\n` +
        `Corporate Email: ${email}\n` +
        `Direct Phone Number: ${phone}\n` +
        `Primary Service Needed: ${service}\n` +
        `Estimated Scale / Volume: ${pallets}\n` +
        `Project Scope & Special Requirements: ${details}\n` +
        `-----------------------------------------\n\n` +
        `Please issue a formal corporate quotation.\n`
      );
      const mailtoLink = `mailto:${clientEmail}?subject=${emailSubject}&body=${emailBody}`;

      // If Access Key is not a valid UUID, show helpful instructions & direct mailto option
      if (isPlaceholderKey) {
        if (statusBox) {
          statusBox.style.display = 'block';
          statusBox.style.background = '#FEF2F2';
          statusBox.style.color = '#991B1B';
          statusBox.style.border = '1px solid #FECACA';
          statusBox.style.padding = '14px 18px';
          statusBox.style.borderRadius = 'var(--radius-md)';
          statusBox.innerHTML = `
            <strong>Web3Forms Access Key Required:</strong><br>
            <span style="font-size:0.875rem; color:#7F1D1D; display:block; margin: 4px 0 8px 0;">
              A valid Web3Forms Access Key is needed in <code>js/env.js</code> to deliver enquiries directly to your inbox.
            </span>
            <ol style="margin: 0 0 12px 20px; padding:0; font-size:0.8125rem; color:#4B5563; line-height:1.5;">
              <li>Visit <a href="https://web3forms.com" target="_blank" style="color:#1D5FA8; text-decoration:underline; font-weight:600;">web3forms.com</a> to get your free Access Key.</li>
              <li>Paste it in <code>js/env.js</code>: <code>window.ENV.WEB3FORMS_ACCESS_KEY = "YOUR-ACCESS-KEY";</code></li>
            </ol>
            <a href="${mailtoLink}" class="btn btn-primary btn-sm" style="display:inline-flex; align-items:center; gap:6px;">
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              Send Enquiry via Email Client
            </a>
          `;
        }
        window.showToast('Please configure your Web3Forms Access Key in js/env.js', 'Configuration Required');
        return;
      }

      // Lock submission & show loading state
      isSubmitting = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite; display:inline-block; vertical-align:middle; margin-right:8px;" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="4" stroke-opacity="0.25"></circle><path stroke-width="4" d="M12 2a10 10 0 0110 10"></path></svg>
          Submitting Enquiry via Web3Forms...
        `;
      }

      // Prepare official Web3Forms FormData payload (clean, single entries)
      const payload = new FormData();
      payload.set('access_key', accessKey);
      payload.set('name', fullName);
      payload.set('email', email);
      payload.set('phone', phone);
      payload.set('company', company);
      payload.set('service', service);
      payload.set('scale', pallets);
      payload.set('message', details);
      payload.set('subject', `New Corporate RFQ Enquiry - HK Logistic Sp. z o.o: ${service} - ${company}`);
      payload.set('from_name', 'HK Logistic Sp. z o.o');

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: payload,
          headers: {
            'Accept': 'application/json'
          }
        });

        const result = await response.json();

        if (result.success) {
          // SUCCESS: Reset form, show clean professional confirmation
          form.reset();

          if (statusBox) {
            statusBox.style.display = 'block';
            statusBox.style.background = '#ECFDF5';
            statusBox.style.color = '#065F46';
            statusBox.style.border = '1px solid #A7F3D0';
            statusBox.style.padding = '14px 18px';
            statusBox.style.borderRadius = 'var(--radius-md)';
            statusBox.innerHTML = `
              <div style="display:flex; align-items:center; gap:10px;">
                <svg style="color:#059669; flex-shrink:0;" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                <div>
                  <strong style="font-size:0.95rem; color:#065F46; display:block; margin-bottom:2px;">Enquiry Successfully Sent!</strong>
                  <span style="font-size:0.875rem; color:#047857;">Thank you for contacting HK Logistic Sp. z o.o. Our team will review your requirements and get back to you shortly.</span>
                </div>
              </div>
            `;
          }

          window.showToast(
            'Enquiry submitted successfully!',
            'Enquiry Sent'
          );
        } else {
          // Web3Forms returned an error
          console.warn('Web3Forms response notice:', result);
          const errMsg = result.message || 'Web3Forms submission was not completed.';

          if (statusBox) {
            statusBox.style.display = 'block';
            statusBox.style.background = '#FEF2F2';
            statusBox.style.color = '#991B1B';
            statusBox.style.border = '1px solid #FECACA';
            statusBox.style.padding = '14px 18px';
            statusBox.style.borderRadius = 'var(--radius-md)';
            statusBox.innerHTML = `
              <strong>Submission Error:</strong> ${errMsg}<br>
              <div style="margin-top:10px;">
                <a href="${mailtoLink}" class="btn btn-primary btn-sm" style="display:inline-flex; align-items:center; gap:6px;">
                  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  Send via Email Client Instead
                </a>
              </div>
            `;
          }

          window.showToast(errMsg, 'Submission Error');
        }
      } catch (err) {
        console.error('Network / Fetch error:', err);
        const networkMsg = 'Network connection issue. Please check your internet or send via email client.';

        if (statusBox) {
          statusBox.style.display = 'block';
          statusBox.style.background = '#FEF2F2';
          statusBox.style.color = '#991B1B';
          statusBox.style.border = '1px solid #FECACA';
          statusBox.style.padding = '14px 18px';
          statusBox.style.borderRadius = 'var(--radius-md)';
          statusBox.innerHTML = `
            <strong>Network Notice:</strong> ${networkMsg}<br>
            <div style="margin-top:10px;">
              <a href="${mailtoLink}" class="btn btn-primary btn-sm" style="display:inline-flex; align-items:center; gap:6px;">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                Send via Email Client
              </a>
            </div>
          `;
        }

        window.showToast(networkMsg, 'Network Notice');
      } finally {
        // Unlock button and restore state
        isSubmitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  });
}

/* ==========================================================================
   Form Field Error Helper
   ========================================================================== */
function showFormError(form, inputEl, message) {
  if (inputEl) {
    inputEl.focus();
    inputEl.style.borderColor = '#DC2626';
    setTimeout(() => {
      inputEl.style.borderColor = '';
    }, 3000);
  }

  const statusBox = form.querySelector('#formStatus') || form.querySelector('.form-status-msg');
  if (statusBox) {
    statusBox.style.display = 'block';
    statusBox.style.background = '#FEF2F2';
    statusBox.style.color = '#991B1B';
    statusBox.style.border = '1px solid #FECACA';
    statusBox.style.padding = '12px 16px';
    statusBox.style.borderRadius = 'var(--radius-md)';
    statusBox.innerHTML = `<strong>Required Field:</strong> ${message}`;
  }

  if (typeof window.showToast === 'function') {
    window.showToast(message, 'Validation Required');
  }
}

/* ==========================================================================
   Professional Enquiry Confirmation Modal
   ========================================================================== */
function showEnquiryModal({ refId, formData, clientEmail, mailtoLink }) {
  let modal = document.getElementById('enquiryModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'enquiryModal';
    modal.className = 'enquiry-modal-backdrop';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="enquiry-modal-card">
      <div class="enquiry-modal-header">
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="modal-check-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <div>
            <h3 style="margin:0; font-size:1.25rem; color:var(--primary);">Enquiry Successfully Submitted</h3>
            <span style="font-size:0.8125rem; color:var(--text-muted);">Delivered via Web3Forms &bull; Reference: <strong>${refId}</strong></span>
          </div>
        </div>
        <button class="modal-close-btn" onclick="document.getElementById('enquiryModal').classList.remove('active')">&times;</button>
      </div>

      <div class="enquiry-modal-body">
        <p style="font-size:0.9375rem; color:var(--text-main); margin-bottom:16px;">
          Thank you, <strong>${formData.name}</strong> from <strong>${formData.company}</strong>. Your corporate enquiry for <strong>${formData.service}</strong> has been routed to our commercial desk.
        </p>

        <div class="enquiry-details-box">
          <div class="detail-row"><span>Routing To:</span> <strong>${clientEmail}</strong></div>
          <div class="detail-row"><span>Service Type:</span> <strong>${formData.service}</strong></div>
          <div class="detail-row"><span>Corporate Email:</span> <strong>${formData.email}</strong></div>
          <div class="detail-row"><span>Contact Phone:</span> <strong>${formData.phone}</strong></div>
          <div class="detail-row"><span>Estimated Volume:</span> <strong>${formData.pallets}</strong></div>
        </div>

        <p style="font-size:0.8125rem; color:var(--text-muted); margin: 16px 0;">
          Our logistics coordinators review all corporate requests within 2 business hours. You can also save a copy or open the thread directly in your email client:
        </p>

        <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:20px;">
          <a href="${mailtoLink}" class="btn btn-primary btn-sm" style="flex:1; text-align:center;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display:inline-block; vertical-align:middle; margin-right:6px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            Open in Email Client
          </a>
          <button class="btn btn-outline btn-sm" onclick="navigator.clipboard.writeText('Enquiry Reference: ${refId}\\nCompany: ${formData.company}\\nName: ${formData.name}\\nService: ${formData.service}\\nEmail: ${formData.email}\\nPhone: ${formData.phone}\\nScope: ${formData.details}'); showToast('Enquiry summary copied to clipboard!', 'Copied');" style="flex:1;">
            Copy Summary
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}
